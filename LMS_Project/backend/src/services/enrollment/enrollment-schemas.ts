import { z } from "zod";

export const createEnrollmentRequestSchema = z.object({
  courseId: z.string().min(1),
});

export const manualAssignSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  notes: z.string().max(300).optional(),
});

export const enrollmentDecisionSchema = z.object({
  notes: z.string().max(300).optional(),
});

export const removeAccessSchema = z.object({
  enrollmentId: z.string().min(1),
  notes: z.string().max(300).optional(),
});
