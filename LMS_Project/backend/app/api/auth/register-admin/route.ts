import { NextRequest, NextResponse } from "next/server";

import { registerUser } from "@/features/auth/register-user";
import { setAuthCookies } from "@/lib/cookies";
import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { getRequestMeta } from "@/lib/request-context";
import { getServerErrorMessage } from "@/lib/server-error";

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseSafeJsonRequest(request);
    if (!parsed.ok) {
      return NextResponse.json(parsed.body, { status: parsed.status });
    }

    const payload = parsed.data as Parameters<typeof registerUser>[0];
    const result = await registerUser(payload, "ADMIN", getRequestMeta(request));
    const response = NextResponse.json(result.body, { status: result.status });

    if (result.status === 201 && "data" in result.body && result.body.data?.tokens) {
      setAuthCookies(response, result.body.data.tokens);
    }

    return response;
  } catch (error) {
    return NextResponse.json(errorResponse(getServerErrorMessage(error)), { status: 500 });
  }
}
