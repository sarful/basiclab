import { NextRequest, NextResponse } from "next/server";

import { resendOtp } from "@/features/auth/otp-flows";
import { parseSafeJsonRequest } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await resendOtp(payload);

  return NextResponse.json(result.body, { status: result.status });
}
