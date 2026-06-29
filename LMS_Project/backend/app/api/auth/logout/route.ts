import { NextRequest, NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth-constants";
import { clearAuthCookies } from "@/lib/cookies";
import { revokeSession } from "@/services/auth/session-service";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await revokeSession(refreshToken);
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
  clearAuthCookies(response);
  return response;
}
