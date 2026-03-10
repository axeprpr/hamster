import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills, credentials, machines, accessLogs } from "@/lib/db/schema";
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

  // --- Rate limiting: check recent failures from this IP ---
  try {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(accessLogs)
      .where(
        and(
          eq(accessLogs.ipAddress, ipAddress),
          eq(accessLogs.action, "install"),
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
    // If rate limit check fails, continue (fail open for availability)
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

    // Find the skill by id
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.id, id), eq(skills.isPublished, true)))
      .limit(1);

    if (!skill) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Hash the incoming machine code for comparison
    const hashedCode = hashMachineCode(machineCode);

    // Try matching by hash first (new entries)
    let [machine] = await db
      .select()
      .from(machines)
      .where(
        and(
          eq(machines.userId, skill.userId),
          eq(machines.machineCode, hashedCode),
          eq(machines.isActive, true)
        )
      )
      .limit(1);

    // Backward compat: try plaintext match for legacy entries
    if (!machine) {
      [machine] = await db
        .select()
        .from(machines)
        .where(
          and(
            eq(machines.userId, skill.userId),
            eq(machines.machineCode, machineCode),
            eq(machines.isActive, true)
          )
        )
        .limit(1);

      // Auto-migrate: update legacy plaintext to hash
      if (machine) {
        await db
          .update(machines)
          .set({ machineCode: hashedCode })
          .where(eq(machines.id, machine.id));
      }
    }

    if (!machine) {
      await logAccess(skill.userId, skill.id, null, ipAddress, "install", false, "Denied");
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Collect all credential IDs (from main skill + linked skills)
    const allCredentialIds = new Set<string>();
    const mainCredIds = (skill.credentialIds as string[]) || [];
    for (const cid of mainCredIds) allCredentialIds.add(cid);

    // Fetch linked skills
    const linkedSkillIds = (skill.linkedSkillIds as string[]) || [];
    let linkedSkills: (typeof skill)[] = [];
    if (linkedSkillIds.length > 0) {
      linkedSkills = await db
        .select()
        .from(skills)
        .where(
          and(
            inArray(skills.id, linkedSkillIds),
            eq(skills.userId, skill.userId)
          )
        );

      // Collect credential IDs from linked skills
      for (const ls of linkedSkills) {
        const lsCredIds = (ls.credentialIds as string[]) || [];
        for (const cid of lsCredIds) allCredentialIds.add(cid);
      }
    }

    // Decrypt all needed credentials
    const credentialMap: Record<string, string> = {};
    if (allCredentialIds.size > 0) {
      const userCreds = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, skill.userId));

      for (const cred of userCreds) {
        if (allCredentialIds.has(cred.id)) {
          const value = decrypt(cred.encryptedValue, cred.iv, cred.authTag);
          credentialMap[cred.name] = value;
        }
      }
    }

    // Render main template
    let rendered = renderTemplate(skill.instructionTemplate, credentialMap);

    // Append linked skill templates
    if (linkedSkills.length > 0) {
      for (const ls of linkedSkills) {
        const lsRendered = renderTemplate(ls.instructionTemplate, credentialMap);
        rendered += `\n\n---\n\n${lsRendered}`;
      }
    }

    // Update machine lastUsedAt
    await db
      .update(machines)
      .set({ lastUsedAt: new Date() })
      .where(eq(machines.id, machine.id));

    await logAccess(skill.userId, skill.id, machine.id, ipAddress, "install", true, null);

    return NextResponse.json({
      skill: skill.name,
      instruction: rendered,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function renderTemplate(template: string, credentialMap: Record<string, string>): string {
  let rendered = template;
  for (const [name, value] of Object.entries(credentialMap)) {
    const placeholder = `{{${name}}}`;
    while (rendered.includes(placeholder)) {
      rendered = rendered.replace(placeholder, value);
    }
  }
  return rendered;
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
