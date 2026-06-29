import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { replyToSupportTicket } from "@/services/communication/communication-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const payload = await request.json();
  const { ticketId } = await params;
  const result = await replyToSupportTicket(
    ticketId,
    {
      userId: auth.user.id,
      role: auth.user.role,
    },
    payload,
  );
  return NextResponse.json(result.body, { status: result.status });
}
