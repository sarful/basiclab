import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireRole } from "@/services/auth/auth-guards";
import { createBackup, listBackups } from "@/services/security/backup-service";

export async function GET() {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const result = await listBackups();
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const type =
    parsed.data && typeof parsed.data === "object" && "type" in parsed.data
      ? parsed.data.type
      : undefined;

  if (type !== "FULL" && type !== "DATABASE" && type !== "FILES") {
    return NextResponse.json(errorResponse("Backup type must be FULL, DATABASE, or FILES"), {
      status: 400,
    });
  }

  const result = await createBackup(type, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
