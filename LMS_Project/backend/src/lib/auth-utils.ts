import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import type { SanitizedUser } from "@/types/auth";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function generateTokenValue(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateOtpCode() {
  return crypto.randomInt(100000, 999999).toString();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function sanitizeUser(user: {
  _id: { toString(): string };
  fullName: string;
  email: string;
  role: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  preferredLanguage: "en" | "bn";
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}): SanitizedUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    isEmailVerified: user.isEmailVerified,
    isSuspended: user.isSuspended,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  };
}
