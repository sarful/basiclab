import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { updateSupportTicketStatus } from "@/services/communication/communication-service";

export async function PATCH(
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
  const result = await updateSupportTicketStatus(ticketId, auth.user.id, payload);
  return NextResponse.json(result.body, { status: result.status });
}
