import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { listAdminEnrollments } from "@/services/enrollment/enrollment-service";

export async function GET(request: NextRequest) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = await listAdminEnrollments(query);
  return NextResponse.json(result.body, { status: result.status });
}
