import { env } from "@/config/env";
import { errorResponse, successResponse } from "@/lib/api-response";
import { storeUploadedFile } from "@/services/file/file-service";

export async function uploadFile(
  file: File,
  options?: {
    kind?: "PDF" | "VIDEO" | "IMAGE" | "RESOURCE" | "AVATAR" | "OTHER";
    uploadedBy?: string;
    entityType?: string;
    entityId?: string;
  },
) {
  const maxSizeBytes = env.MAX_FILE_SIZE_MB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return errorResponse(
      `File exceeds ${env.MAX_FILE_SIZE_MB}MB limit`,
      { fileName: file.name, fileSize: file.size },
    );
  }

  const result = await storeUploadedFile(file, options);
  if (!result.success || !("data" in result)) {
    return result;
  }

  return successResponse("File uploaded", {
    ...result.data,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    maxAllowedSizeMb: env.MAX_FILE_SIZE_MB,
  });
}
