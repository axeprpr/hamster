import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Legacy slug-based route — proxies to id-based route
export async function POST(
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
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Forward the request body to the id-based endpoint
    const url = new URL(request.url);
    const origin = url.origin;
    const body = await request.text();

    const res = await fetch(`${origin}/api/s/${skill.id}/install`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
        "x-real-ip": request.headers.get("x-real-ip") || "",
      },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
