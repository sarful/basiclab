import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE, CSRF_TOKEN_HEADER } from "@/lib/auth-constants";
import { containsUnsafeQuery } from "@/lib/request-security";
import { applyRateLimit } from "@/services/security/rate-limit-service";
import { appendSecurityHeaders } from "@/services/security/security-service";
import { verifyAuthToken } from "@/lib/tokens";

const protectedPrefixes = [
  "/api/admin",
  "/api/auth/change-password",
  "/api/auth/me",
  "/api/users/me",
  "/api/enrollments",
  "/api/learning",
  "/api/quizzes",
  "/api/certificates",
  "/api/notifications",
  "/api/support",
  "/api/files",
  "/api/uploads",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isHttps =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";

  const rateLimitKey = `${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"}:${pathname}`;
  const rateLimit = applyRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { success: false, message: "Too many requests" },
      { status: 429 },
    );
    response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  }

  if (containsUnsafeQuery(request)) {
    const response = NextResponse.json(
      { success: false, message: "Unsafe query parameters detected" },
      { status: 400 },
    );
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  }

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    const response = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  }

  try {
    const payload = verifyAuthToken(accessToken, "access");

    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const csrfCookie = request.cookies.get(CSRF_TOKEN_COOKIE)?.value;
      const csrfHeader = request.headers.get(CSRF_TOKEN_HEADER);
      if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        const response = NextResponse.json(
          { success: false, message: "Invalid CSRF token" },
          { status: 403 },
        );
        appendSecurityHeaders(response.headers, isHttps);
        return response;
      }
    }

    if (pathname.startsWith("/api/admin") && payload.role !== "ADMIN") {
      const response = NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
      appendSecurityHeaders(response.headers, isHttps);
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  } catch {
    const response = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
    appendSecurityHeaders(response.headers, isHttps);
    return response;
  }
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
