import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required").default("basicslearn"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  TOKEN_ISSUER: z.string().min(1, "TOKEN_ISSUER is required"),
  STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(25),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  BACKUP_DIR: z.string().default("./backups"),
  ENABLE_SECURITY_HEADERS: z.coerce.boolean().default(true),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  TOKEN_ISSUER: process.env.TOKEN_ISSUER,
  STORAGE_DRIVER: process.env.STORAGE_DRIVER,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  MAX_FILE_SIZE_MB: process.env.MAX_FILE_SIZE_MB,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  BACKUP_DIR: process.env.BACKUP_DIR,
  ENABLE_SECURITY_HEADERS: process.env.ENABLE_SECURITY_HEADERS,
});

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration. ${details}`);
}

export const env = parsedEnv.data;
