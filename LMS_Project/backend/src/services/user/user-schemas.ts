import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  preferredLanguage: z.enum(["en", "bn"]).optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["ADMIN", "LEARNER_EN", "LEARNER_BN"]).optional(),
  isEmailVerified: z.boolean().optional(),
});

export const searchUsersSchema = z.object({
  q: z.string().trim().optional(),
  role: z.enum(["ADMIN", "LEARNER_EN", "LEARNER_BN"]).optional(),
  suspended: z.enum(["true", "false"]).optional(),
});
