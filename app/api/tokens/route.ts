import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accessTokens } from "@/lib/db/schema";
import { tokenSchema } from "@/lib/validations";
import { generateToken } from "@/lib/crypto";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select({
      id: accessTokens.id,
      name: accessTokens.name,
      machineId: accessTokens.machineId,
      expiresAt: accessTokens.expiresAt,
      isRevoked: accessTokens.isRevoked,
      createdAt: accessTokens.createdAt,
    })
    .from(accessTokens)
    .where(eq(accessTokens.userId, session.user.id))
    .orderBy(accessTokens.createdAt);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = tokenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const rawToken = generateToken();
    const tokenHash = await hash(rawToken, 10);

    let expiresAt: Date | undefined;
    if (parsed.data.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parsed.data.expiresInDays);
    }

    const [token] = await db
      .insert(accessTokens)
      .values({
        userId: session.user.id,
        machineId: parsed.data.machineId,
        name: parsed.data.name,
        tokenHash,
        expiresAt,
      })
      .returning({
        id: accessTokens.id,
        name: accessTokens.name,
        expiresAt: accessTokens.expiresAt,
        createdAt: accessTokens.createdAt,
      });

    // Return the raw token only once
    return NextResponse.json(
      { ...token, token: rawToken },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
