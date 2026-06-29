import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { listAdminSupportTickets } from "@/services/communication/communication-service";

export async function GET(request: NextRequest) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = await listAdminSupportTickets(query);
  return NextResponse.json(result.body, { status: result.status });
}
