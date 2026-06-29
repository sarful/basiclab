import { NextResponse } from "next/server";

import { CSRF_TOKEN_COOKIE } from "@/lib/auth-constants";
import { createCsrfToken } from "@/lib/request-security";

export async function GET() {
  const token = createCsrfToken();
  const response = NextResponse.json({
    success: true,
    message: "CSRF token generated successfully",
    data: { csrfToken: token },
  });

  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
