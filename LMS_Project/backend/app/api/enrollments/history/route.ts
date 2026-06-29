import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { listEnrollmentHistory } from "@/services/enrollment/enrollment-service";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const result = await listEnrollmentHistory(auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
