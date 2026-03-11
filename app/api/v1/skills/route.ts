import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { skillSchema } from "@/lib/validations";
import { authenticateBearer } from "@/lib/auth/bearer";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const auth = await authenticateBearer(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: skills.id })
      .from(skills)
      .where(
        and(eq(skills.slug, parsed.data.slug), eq(skills.userId, auth.userId))
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const [skill] = await db
      .insert(skills)
      .values({
        ...parsed.data,
        userId: auth.userId,
        isPublished: false,
      })
      .returning();

    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
