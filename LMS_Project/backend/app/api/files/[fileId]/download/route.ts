import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getDownloadResource } from "@/services/file/file-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { fileId } = await params;
  const result = await getDownloadResource(fileId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
