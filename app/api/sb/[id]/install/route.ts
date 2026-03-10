import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skillBundles, skills, credentials, machines, accessLogs } from "@/lib/db/schema";
import { installSchema } from "@/lib/validations";
import { decrypt, hashMachineCode } from "@/lib/crypto";
import { eq, and, gt, sql, inArray } from "drizzle-orm";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_FAILURES = 10;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting
  try {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(accessLogs)
      .where(
        and(
          eq(accessLogs.ipAddress, ipAddress),
          eq(accessLogs.action, "bundle_install"),
          eq(accessLogs.success, false),
          gt(accessLogs.createdAt, windowStart)
        )
      );

    if (count >= RATE_LIMIT_MAX_FAILURES) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  } catch {
    // fail open
  }

  try {
    const body = await request.json();
    const parsed = installSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { machineCode } = parsed.data;

    // Find the bundle
    const [bundle] = await db
      .select()
      .from(skillBundles)
      .where(and(eq(skillBundles.id, id), eq(skillBundles.isPublished, true)))
      .limit(1);

    if (!bundle) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify machine code
    const hashedCode = hashMachineCode(machineCode);

    let [machine] = await db
      .select()
      .from(machines)
      .where(
        and(
          eq(machines.userId, bundle.userId),
          eq(machines.machineCode, hashedCode),
          eq(machines.isActive, true)
        )
      )
      .limit(1);

    // Backward compat: try plaintext match
    if (!machine) {
      [machine] = await db
        .select()
        .from(machines)
        .where(
          and(
            eq(machines.userId, bundle.userId),
            eq(machines.machineCode, machineCode),
            eq(machines.isActive, true)
          )
        )
        .limit(1);

      if (machine) {
        await db
          .update(machines)
          .set({ machineCode: hashedCode })
          .where(eq(machines.id, machine.id));
      }
    }

    if (!machine) {
      await logAccess(bundle.userId, null, null, ipAddress, "bundle_install", false, "Denied");
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch all child skills
    const bundleSkillIds = (bundle.skillIds as string[]) || [];
    if (bundleSkillIds.length === 0) {
      return NextResponse.json({
        bundle: bundle.name,
        skills: [],
      });
    }

    const childSkills = await db
      .select()
      .from(skills)
      .where(
        and(
          inArray(skills.id, bundleSkillIds),
          eq(skills.isPublished, true),
          eq(skills.userId, bundle.userId)
        )
      );

    // Get all credential IDs needed
    const allCredentialIds = new Set<string>();
    for (const skill of childSkills) {
      const ids = (skill.credentialIds as string[]) || [];
      for (const cid of ids) allCredentialIds.add(cid);
    }

    // Decrypt credentials
    const credentialMap: Record<string, string> = {};
    if (allCredentialIds.size > 0) {
      const userCreds = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, bundle.userId));

      for (const cred of userCreds) {
        if (allCredentialIds.has(cred.id)) {
          credentialMap[cred.name] = decrypt(cred.encryptedValue, cred.iv, cred.authTag);
        }
      }
    }

    // Render each skill's template
    const result = childSkills.map((skill) => {
      let rendered = skill.instructionTemplate;
      for (const [name, value] of Object.entries(credentialMap)) {
        const placeholder = `{{${name}}}`;
        while (rendered.includes(placeholder)) {
          rendered = rendered.replace(placeholder, value);
        }
      }
      return { skill: skill.name, instruction: rendered };
    });

    // Update machine lastUsedAt
    await db
      .update(machines)
      .set({ lastUsedAt: new Date() })
      .where(eq(machines.id, machine.id));

    await logAccess(bundle.userId, null, machine.id, ipAddress, "bundle_install", true, null);

    return NextResponse.json({
      bundle: bundle.name,
      skills: result,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function logAccess(
  userId: string,
  skillId: string | null,
  machineId: string | null,
  ipAddress: string,
  action: string,
  success: boolean,
  details: string | null
) {
  try {
    await db.insert(accessLogs).values({
      userId,
      skillId,
      machineId,
      ipAddress,
      action,
      success,
      details,
    });
  } catch {
    // Don't fail the request if logging fails
  }
}
