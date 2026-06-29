import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { publishAnnouncement } from "@/services/communication/communication-service";

export async function POST(
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
  const result = await publishAnnouncement(announcementId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
