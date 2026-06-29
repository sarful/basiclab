import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { markNotificationRead } from "@/services/communication/communication-service";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { notificationId } = await params;
  const result = await markNotificationRead(auth.user.id, notificationId);
  return NextResponse.json(result.body, { status: result.status });
}
