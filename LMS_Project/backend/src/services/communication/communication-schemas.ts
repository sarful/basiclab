import { z } from "zod";

export const announcementAudienceSchema = z.enum(["ALL", "ADMIN", "LEARNER_EN", "LEARNER_BN"]);

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(160),
  content: z.string().trim().min(10).max(4000),
  audience: announcementAudienceSchema.default("ALL"),
  courseId: z.string().trim().optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(3).max(160),
  category: z.enum(["GENERAL", "TECHNICAL", "ENROLLMENT", "COURSE", "CERTIFICATE", "PAYMENT"]).default("GENERAL"),
  message: z.string().trim().min(10).max(4000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const listSupportTicketsSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.enum(["GENERAL", "TECHNICAL", "ENROLLMENT", "COURSE", "CERTIFICATE", "PAYMENT"]).optional(),
  userId: z.string().trim().optional(),
});

export const supportReplySchema = z.object({
  message: z.string().trim().min(2).max(4000),
});

export const supportStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});
