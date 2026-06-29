import { NextRequest, NextResponse } from "next/server";

import { forgotPassword } from "@/features/auth/password-flows";
import { parseSafeJsonRequest } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await forgotPassword(payload);

  return NextResponse.json(result.body, { status: result.status });
}
