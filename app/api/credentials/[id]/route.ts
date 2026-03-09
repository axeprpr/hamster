import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { credentials } from "@/lib/db/schema";
import { credentialUpdateSchema } from "@/lib/validations";
import { encrypt, decrypt } from "@/lib/crypto";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [credential] = await db
    .select()
    .from(credentials)
    .where(
      and(eq(credentials.id, id), eq(credentials.userId, session.user.id))
    )
    .limit(1);

  if (!credential) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const value = decrypt(
    credential.encryptedValue,
    credential.iv,
    credential.authTag
  );

  return NextResponse.json({
    id: credential.id,
    name: credential.name,
    category: credential.category,
    value,
    description: credential.description,
    metadata: credential.metadata,
    createdAt: credential.createdAt,
    updatedAt: credential.updatedAt,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = credentialUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name) updates.name = parsed.data.name;
    if (parsed.data.category) updates.category = parsed.data.category;
    if (parsed.data.description !== undefined)
      updates.description = parsed.data.description;
    if (parsed.data.metadata !== undefined)
      updates.metadata = parsed.data.metadata;
    if (parsed.data.value) {
      const { encryptedValue, iv, authTag } = encrypt(parsed.data.value);
      updates.encryptedValue = encryptedValue;
      updates.iv = iv;
      updates.authTag = authTag;
    }

    const [updated] = await db
      .update(credentials)
      .set(updates)
      .where(
        and(eq(credentials.id, id), eq(credentials.userId, session.user.id))
      )
      .returning({
        id: credentials.id,
        name: credentials.name,
        category: credentials.category,
        description: credentials.description,
        updatedAt: credentials.updatedAt,
      });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [deleted] = await db
    .delete(credentials)
    .where(
      and(eq(credentials.id, id), eq(credentials.userId, session.user.id))
    )
    .returning({ id: credentials.id });

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
