import { z } from "zod";

export const uploadKindSchema = z.enum(["PDF", "VIDEO", "IMAGE", "RESOURCE", "AVATAR", "OTHER"]);

export const listFilesQuerySchema = z.object({
  kind: uploadKindSchema.optional(),
  entityType: z.string().trim().optional(),
  entityId: z.string().trim().optional(),
  q: z.string().trim().optional(),
});
