import { z } from "zod";

export const reportFilterSchema = z.object({
  userId: z.string().trim().optional(),
  courseId: z.string().trim().optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
});
