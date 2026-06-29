import type { NextRequest } from "next/server";

export function getRequestMeta(request: NextRequest) {
  return {
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown",
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}
