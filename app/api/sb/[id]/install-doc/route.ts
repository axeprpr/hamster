import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skillBundles, skills } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [bundle] = await db
      .select()
      .from(skillBundles)
      .where(and(eq(skillBundles.id, id), eq(skillBundles.isPublished, true)))
      .limit(1);

    if (!bundle) {
      return new NextResponse("# Bundle not found\n\nThis bundle does not exist or is not published.", {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    const bundleSkillIds = (bundle.skillIds as string[]) || [];
    let childSkills: { id: string; name: string; description: string | null }[] = [];
    if (bundleSkillIds.length > 0) {
      childSkills = await db
        .select({
          id: skills.id,
          name: skills.name,
          description: skills.description,
        })
        .from(skills)
        .where(
          and(
            inArray(skills.id, bundleSkillIds),
            eq(skills.isPublished, true)
          )
        );
    }

    const url = new URL(request.url);
    const origin = url.origin;

    const skillList = childSkills
      .map((s, i) => `${i + 1}. **${s.name}**${s.description ? ` — ${s.description}` : ""}`)
      .join("\n");

    const installDoc = `# ${bundle.name} — Bundle Installation Guide

${bundle.description ? `> ${bundle.description}\n` : ""}
## Included Skills

${skillList || "No published skills in this bundle."}

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

## Step 2: Fetch All Installation Instructions

Send the machine code to the bundle install endpoint to receive all skills' instructions at once:

\`\`\`bash
curl -X POST ${origin}/api/sb/${bundle.id}/install \\
  -H "Content-Type: application/json" \\
  -d '{"machineCode": "<machineCode from Step 1>"}'
\`\`\`

The response JSON will look like:
\`\`\`json
{
  "bundle": "${bundle.name}",
  "skills": [
    { "skill": "Skill Name", "instruction": "... complete installation instruction ..." }
  ]
}
\`\`\`

## Step 3: Follow the Instructions

Parse each entry in the \`skills\` array and follow the instructions inside each \`instruction\` field to complete the installation and configuration.
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
