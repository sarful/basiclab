import { NextRequest, NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth-constants";
import { errorResponse, successResponse } from "@/lib/api-response";
import { setAuthCookies } from "@/lib/cookies";
import { rotateSession } from "@/services/auth/session-service";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json(errorResponse("Refresh token is required"), {
      status: 401,
    });
  }

  const tokens = await rotateSession(refreshToken);

  if (!tokens) {
    return NextResponse.json(errorResponse("Refresh token is invalid"), {
      status: 401,
    });
  }

  const response = NextResponse.json(
    successResponse("Token refreshed successfully", { tokens }),
  );
  setAuthCookies(response, tokens);
  return response;
}
