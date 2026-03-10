import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Legacy slug-based route — redirects to id-based route
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const [skill] = await db
      .select({ id: skills.id })
      .from(skills)
      .where(and(eq(skills.slug, slug), eq(skills.isPublished, true)))
      .limit(1);

    if (!skill) {
      return new NextResponse("# Skill not found\n\nThis skill does not exist or is not published.", {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    const url = new URL(request.url);
    const origin = url.origin;
    return NextResponse.redirect(`${origin}/api/s/${skill.id}/install-doc`);
  } catch {
    return new NextResponse("# Error\n\nInternal server error.", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
}
