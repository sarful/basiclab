import { z } from "zod";

export const createCourseCategorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
});

export const updateCourseCategorySchema = createCourseCategorySchema.partial();

export const createCourseSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().max(1000).optional(),
  logicTheoryEn: z.string().optional(),
  logicTheoryBn: z.string().optional(),
  udemyScriptEn: z.string().optional(),
  udemyScriptBn: z.string().optional(),
  simulationUrl: z.string().url().optional(),
  resourcePdfUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  downloadableUrl: z.string().url().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const searchCoursesSchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().optional(),
});
