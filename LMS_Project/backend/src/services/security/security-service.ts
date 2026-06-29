import { env } from "@/config/env";
import { successResponse } from "@/lib/api-response";

export function appendSecurityHeaders(headers: Headers, isHttps: boolean) {
  if (!env.ENABLE_SECURITY_HEADERS) {
    return headers;
  }

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "same-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none';");

  if (isHttps) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return headers;
}

export function getSecurityStatus() {
  return {
    status: 200,
    body: successResponse("Security status fetched successfully", {
      httpsHeadersEnabled: env.ENABLE_SECURITY_HEADERS,
      rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
      rateLimitMax: env.RATE_LIMIT_MAX,
      csrfProtection: "double-submit-cookie",
      inputValidation: "safe-json-parser",
      sqlInjectionProtection: "mongo-operator-key-blocking",
      xssProtection: "string-sanitization-and-csp",
    }),
  };
}
