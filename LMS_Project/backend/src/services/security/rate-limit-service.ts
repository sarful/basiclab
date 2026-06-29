import { env } from "@/config/env";

type Bucket = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitBuckets?: Map<string, Bucket>;
};

function getBuckets() {
  if (!globalForRateLimit.rateLimitBuckets) {
    globalForRateLimit.rateLimitBuckets = new Map();
  }

  return globalForRateLimit.rateLimitBuckets;
}

export function applyRateLimit(key: string) {
  const now = Date.now();
  const buckets = getBuckets();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const next = {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS,
    };
    buckets.set(key, next);
    return {
      allowed: true,
      remaining: Math.max(env.RATE_LIMIT_MAX - 1, 0),
      limit: env.RATE_LIMIT_MAX,
      resetAt: next.resetAt,
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    allowed: existing.count <= env.RATE_LIMIT_MAX,
    remaining: Math.max(env.RATE_LIMIT_MAX - existing.count, 0),
    limit: env.RATE_LIMIT_MAX,
    resetAt: existing.resetAt,
  };
}
