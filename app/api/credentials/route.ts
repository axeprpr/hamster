import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { credentials } from "@/lib/db/schema";
import { credentialSchema } from "@/lib/validations";
import { encrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select({
      id: credentials.id,
      name: credentials.name,
      category: credentials.category,
      description: credentials.description,
      metadata: credentials.metadata,
      createdAt: credentials.createdAt,
      updatedAt: credentials.updatedAt,
    })
    .from(credentials)
    .where(eq(credentials.userId, session.user.id))
    .orderBy(credentials.createdAt);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = credentialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, category, value, description, metadata } = parsed.data;
    const { encryptedValue, iv, authTag } = encrypt(value);

    const [credential] = await db
      .insert(credentials)
      .values({
        userId: session.user.id,
        name,
        category,
        encryptedValue,
        iv,
        authTag,
        description,
        metadata,
      })
      .returning({
        id: credentials.id,
        name: credentials.name,
        category: credentials.category,
        description: credentials.description,
        createdAt: credentials.createdAt,
      });

    return NextResponse.json(credential, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
