import { NextRequest, NextResponse } from "next/server";

import { changePassword } from "@/features/auth/password-flows";
import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireAuth } from "@/services/auth/auth-guards";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();

  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await changePassword(auth.user.id, payload);

  return NextResponse.json(result.body, { status: result.status });
}
