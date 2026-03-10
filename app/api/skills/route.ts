import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { skillSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(skills)
    .where(eq(skills.userId, session.user.id))
    .orderBy(skills.createdAt);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
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
      .where(and(eq(skills.slug, parsed.data.slug), eq(skills.userId, session.user.id)))
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
        userId: session.user.id,
        ...parsed.data,
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
