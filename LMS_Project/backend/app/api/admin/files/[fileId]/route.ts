import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { deactivateFile, getFileById } from "@/services/file/file-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const { fileId } = await params;
  const result = await getFileById(fileId);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const { fileId } = await params;
  const result = await deactivateFile(fileId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
