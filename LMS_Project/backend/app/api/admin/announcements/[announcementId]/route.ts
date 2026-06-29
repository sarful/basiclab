import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireRole } from "@/services/auth/auth-guards";
import {
  deleteAnnouncement,
  updateAnnouncement,
} from "@/services/communication/communication-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ announcementId: string }> },
) {
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

  const payload = parsed.data;
  const { announcementId } = await params;
  const result = await updateAnnouncement(announcementId, payload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ announcementId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const { announcementId } = await params;
  const result = await deleteAnnouncement(announcementId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
