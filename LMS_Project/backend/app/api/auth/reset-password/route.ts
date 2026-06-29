import { NextRequest, NextResponse } from "next/server";

import { resetPassword } from "@/features/auth/password-flows";
import { parseSafeJsonRequest } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await resetPassword(payload);

  return NextResponse.json(result.body, { status: result.status });
}
