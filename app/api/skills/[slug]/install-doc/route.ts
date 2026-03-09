import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const [skill] = await db
      .select()
      .from(skills)
      .where(and(eq(skills.slug, slug), eq(skills.isPublished, true)))
      .limit(1);

    if (!skill) {
      return new NextResponse("# Skill not found\n\nThis skill does not exist or is not published.", {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    return new NextResponse(skill.instructionTemplate, {
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
