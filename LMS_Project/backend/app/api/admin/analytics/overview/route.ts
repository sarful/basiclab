import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { getOverviewAnalytics } from "@/services/reporting/reporting-service";

export async function GET() {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const result = await getOverviewAnalytics();
  return NextResponse.json(result.body, { status: result.status });
}
