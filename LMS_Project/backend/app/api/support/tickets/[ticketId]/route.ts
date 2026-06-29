import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireAuth } from "@/services/auth/auth-guards";
import {
  getSupportTicket,
  replyToSupportTicket,
} from "@/services/communication/communication-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { ticketId } = await params;
  const result = await getSupportTicket(ticketId, {
    userId: auth.user.id,
    role: auth.user.role,
  });
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
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
