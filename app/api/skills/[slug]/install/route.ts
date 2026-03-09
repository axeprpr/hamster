import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills, credentials, machines, accessLogs } from "@/lib/db/schema";
import { installSchema } from "@/lib/validations";
import { decrypt } from "@/lib/crypto";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

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

    // Find the skill
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.slug, slug), eq(skills.isPublished, true)))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Find the machine
    const [machine] = await db
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

    if (!machine) {
      await logAccess(skill.userId, skill.id, null, ipAddress, "install", false, "Machine not found or inactive");
      return NextResponse.json(
        { error: "Machine not authorized" },
        { status: 403 }
      );
    }

    // Decrypt credentials and render template
    const credentialIds = (skill.credentialIds as string[]) || [];
    const credentialMap: Record<string, string> = {};

    if (credentialIds.length > 0) {
      const userCreds = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, skill.userId));

      for (const cred of userCreds) {
        if (credentialIds.includes(cred.id)) {
          const value = decrypt(cred.encryptedValue, cred.iv, cred.authTag);
          credentialMap[cred.name] = value;
        }
      }
    }

    // Render template with credential values
    let rendered = skill.instructionTemplate;
    for (const [name, value] of Object.entries(credentialMap)) {
      rendered = rendered.replace(new RegExp(`\\{\\{${name}\\}\\}`, "g"), value);
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
