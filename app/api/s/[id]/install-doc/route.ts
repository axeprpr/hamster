import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [skill] = await db
      .select({
        id: skills.id,
        name: skills.name,
        description: skills.description,
        isPublished: skills.isPublished,
        linkedSkillIds: skills.linkedSkillIds,
        userId: skills.userId,
      })
      .from(skills)
      .where(and(eq(skills.id, id), eq(skills.isPublished, true)))
      .limit(1);

    if (!skill) {
      return new NextResponse("# Skill not found\n\nThis skill does not exist or is not published.", {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    // Fetch linked skills info
    const linkedIds = (skill.linkedSkillIds as string[]) || [];
    let linkedSkillsList = "";
    if (linkedIds.length > 0) {
      const linked = await db
        .select({ name: skills.name, description: skills.description })
        .from(skills)
        .where(
          and(
            inArray(skills.id, linkedIds),
            eq(skills.userId, skill.userId)
          )
        );

      if (linked.length > 0) {
        linkedSkillsList = `\n## Included Skills\n\n${linked.map((s, i) => `${i + 1}. **${s.name}**${s.description ? ` — ${s.description}` : ""}`).join("\n")}\n`;
      }
    }

    // Build the origin from the request URL
    const url = new URL(request.url);
    const origin = url.origin;

    const installDoc = `# ${skill.name} — Installation Guide

${skill.description ? `> ${skill.description}\n` : ""}${linkedSkillsList}
## Step 1: Get Machine Code

First, detect the user's operating system and run the appropriate command to get the machine code:

**Linux:**
\`\`\`bash
cat /etc/machine-id
\`\`\`

**macOS:**
\`\`\`bash
ioreg -d2 -c IOPlatformExpertDevice | awk -F\\\\" '/IOPlatformUUID/{print $(NF-1)}'
\`\`\`

**Windows (PowerShell):**
\`\`\`powershell
(Get-CimInstance -Class Win32_ComputerSystemProduct).UUID
\`\`\`

Save the output as \`machineCode\`.

## Step 2: Fetch Installation Instructions

Send the machine code to the install endpoint to receive the complete instruction with all configuration values:

\`\`\`bash
curl -X POST ${origin}/api/s/${skill.id}/install \\
  -H "Content-Type: application/json" \\
  -d '{"machineCode": "<machineCode from Step 1>"}'
\`\`\`

The response JSON will look like:
\`\`\`json
{
  "skill": "${skill.name}",
  "instruction": "... complete installation instruction ..."
}
\`\`\`

## Step 3: Follow the Instruction

Parse the \`instruction\` field from the response and follow the steps inside it to complete the installation and configuration.
`;

    return new NextResponse(installDoc, {
      status: 200,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch {
    return new NextResponse("# Error\n\nInternal server error.", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
}
