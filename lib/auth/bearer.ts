import { db } from "@/lib/db";
import { accessTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { compare } from "bcryptjs";

interface BearerAuthResult {
  userId: string;
  tokenId: string;
}

export async function authenticateBearer(
  request: Request
): Promise<BearerAuthResult | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const rawToken = header.slice(7);
  if (!rawToken) return null;

  const tokens = await db
    .select({
      id: accessTokens.id,
      userId: accessTokens.userId,
      tokenHash: accessTokens.tokenHash,
      expiresAt: accessTokens.expiresAt,
      isRevoked: accessTokens.isRevoked,
    })
    .from(accessTokens)
    .where(and(eq(accessTokens.isRevoked, false)));

  for (const token of tokens) {
    if (token.expiresAt && new Date(token.expiresAt) < new Date()) continue;

    const match = await compare(rawToken, token.tokenHash);
    if (match) {
      return { userId: token.userId, tokenId: token.id };
    }
  }

  return null;
}
