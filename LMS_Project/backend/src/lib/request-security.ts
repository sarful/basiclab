import crypto from "node:crypto";
import type { NextRequest } from "next/server";

import { errorResponse } from "@/lib/api-response";

function sanitizeString(value: string) {
  return value
    .replace(/<\s*script/gi, "&lt;script")
    .replace(/<\s*\/\s*script/gi, "&lt;/script")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hasDangerousKey(key: string) {
  return key.startsWith("$") || key.includes(".");
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const next: Record<string, unknown> = {};

    for (const [key, nestedValue] of entries) {
      if (hasDangerousKey(key)) {
        throw new Error(`Dangerous key detected: ${key}`);
      }
      next[key] = sanitizeValue(nestedValue);
    }

    return next;
  }

  return value;
}

export async function parseSafeJsonRequest(request: NextRequest, options?: { allowEmpty?: boolean }) {
  try {
    const payload = await request.json();
    return {
      ok: true as const,
      data: sanitizeValue(payload),
    };
  } catch (error) {
    if (options?.allowEmpty) {
      return {
        ok: true as const,
        data: {},
      };
    }

    return {
      ok: false as const,
      status: 400,
      body: errorResponse("Invalid request payload", {
        reason: error instanceof Error ? error.message : "Unable to parse JSON",
      }),
    };
  }
}

export function containsUnsafeQuery(request: NextRequest) {
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    if (hasDangerousKey(key)) {
      return true;
    }
    if (/[<>]/.test(value)) {
      return true;
    }
  }

  return false;
}

export function createCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}
