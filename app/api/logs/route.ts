import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accessLogs, skills, machines } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");

  const logs = await db
    .select({
      id: accessLogs.id,
      skillId: accessLogs.skillId,
      machineId: accessLogs.machineId,
      ipAddress: accessLogs.ipAddress,
      action: accessLogs.action,
      success: accessLogs.success,
      details: accessLogs.details,
      createdAt: accessLogs.createdAt,
    })
    .from(accessLogs)
    .where(eq(accessLogs.userId, session.user.id))
    .orderBy(desc(accessLogs.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(logs);
}
