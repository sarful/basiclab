import { z } from "zod";

export const createCertificateTemplateSchema = z.object({
  name: z.string().min(2).max(120),
  title: z.string().min(2).max(180),
  subtitle: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
  signatureName: z.string().max(120).optional(),
  signatureTitle: z.string().max(120).optional(),
  isDefault: z.boolean().optional(),
});

export const updateCertificateTemplateSchema =
  createCertificateTemplateSchema.partial();

export const generateCertificateSchema = z.object({
  courseId: z.string().min(1),
  templateId: z.string().optional(),
});
