import crypto from "node:crypto";
import path from "node:path";
import { Types } from "mongoose";

import { UploadedFileModel } from "@/db/models/UploadedFile";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { listFilesQuerySchema } from "@/services/file/file-schemas";
import { persistBuffer } from "@/services/storage/storage-service";

type FileKind = "PDF" | "VIDEO" | "IMAGE" | "RESOURCE" | "AVATAR" | "OTHER";

const MIME_RULES: Record<FileKind, string[]> = {
  PDF: ["application/pdf"],
  VIDEO: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  IMAGE: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
  RESOURCE: [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ],
  AVATAR: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  OTHER: [],
};

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function sanitizeBaseName(fileName: string) {
  const parsed = path.parse(fileName);
  return parsed.name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").slice(0, 80) || "file";
}

function sanitizeUploadedFile(file: {
  _id: { toString(): string };
  uploadedBy?: { toString(): string } | string;
  fileName: string;
  originalName: string;
  mimeType: string;
  extension?: string;
  size: number;
  kind: FileKind;
  storageKey: string;
  url: string;
  checksum: string;
  entityType?: string;
  entityId?: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: file._id.toString(),
    uploadedBy:
      typeof file.uploadedBy === "string" ? file.uploadedBy : file.uploadedBy?.toString(),
    fileName: file.fileName,
    originalName: file.originalName,
    mimeType: file.mimeType,
    extension: file.extension,
    size: file.size,
    kind: file.kind,
    storageKey: file.storageKey,
    url: file.url,
    checksum: file.checksum,
    entityType: file.entityType,
    entityId: file.entityId,
    downloadCount: file.downloadCount,
    isActive: file.isActive,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

export async function storeUploadedFile(
  file: File,
  options?: {
    kind?: FileKind;
    uploadedBy?: string;
    entityType?: string;
    entityId?: string;
  },
) {
  const kind = options?.kind ?? "OTHER";
  const allowedMimeTypes = MIME_RULES[kind];

  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
    return errorResponse("Unsupported file type", {
      fileName: file.name,
      mimeType: file.type,
      allowedMimeTypes,
      kind,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");
  const extension = path.extname(file.name).toLowerCase();
  const safeName = `${sanitizeBaseName(file.name)}${extension}`;
  const stored = await persistBuffer(buffer, safeName);

  await connectToDatabase();
  const uploadedFile = await UploadedFileModel.create({
    uploadedBy: options?.uploadedBy,
    fileName: safeName,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    extension,
    size: file.size,
    kind,
    storageKey: stored.storageKey,
    url: stored.url,
    checksum,
    entityType: options?.entityType,
    entityId: options?.entityId,
  });

  if (options?.uploadedBy) {
    await logActivity({
      userId: options.uploadedBy,
      action: "FILE_UPLOADED",
      entityType: "UploadedFile",
      entityId: uploadedFile._id.toString(),
      metadata: {
        kind,
        mimeType: uploadedFile.mimeType,
        entityType: options.entityType,
        entityId: options.entityId,
      },
    });
  }

  return successResponse("File uploaded", sanitizeUploadedFile(uploadedFile));
}

export async function listFiles(query: Record<string, string | undefined>) {
  const parsed = listFilesQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid file query", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = { isActive: true };
  if (parsed.data.kind) filter.kind = parsed.data.kind;
  if (parsed.data.entityType) filter.entityType = parsed.data.entityType;
  if (parsed.data.entityId) filter.entityId = parsed.data.entityId;
  if (parsed.data.q) {
    filter.$or = [
      { fileName: { $regex: parsed.data.q, $options: "i" } },
      { originalName: { $regex: parsed.data.q, $options: "i" } },
      { mimeType: { $regex: parsed.data.q, $options: "i" } },
    ];
  }

  const files = await UploadedFileModel.find(filter).sort({ createdAt: -1 }).limit(200);
  return {
    status: 200,
    body: successResponse("Files fetched successfully", files.map((file) => sanitizeUploadedFile(file))),
  };
}

export async function getFileById(fileId: string) {
  if (!isValidObjectId(fileId)) {
    return { status: 400, body: errorResponse("Invalid file id") };
  }

  await connectToDatabase();
  const file = await UploadedFileModel.findOne({ _id: fileId, isActive: true });
  if (!file) {
    return { status: 404, body: errorResponse("File not found") };
  }

  return {
    status: 200,
    body: successResponse("File fetched successfully", sanitizeUploadedFile(file)),
  };
}

export async function getDownloadResource(fileId: string, actorId?: string) {
  if (!isValidObjectId(fileId)) {
    return { status: 400, body: errorResponse("Invalid file id") };
  }

  await connectToDatabase();
  const file = await UploadedFileModel.findOne({ _id: fileId, isActive: true });
  if (!file) {
    return { status: 404, body: errorResponse("File not found") };
  }

  file.downloadCount += 1;
  await file.save();

  if (actorId) {
    await logActivity({
      userId: actorId,
      action: "FILE_DOWNLOADED",
      entityType: "UploadedFile",
      entityId: fileId,
      metadata: { storageKey: file.storageKey, kind: file.kind },
    });
  }

  return {
    status: 200,
    body: successResponse("Download resource fetched successfully", {
      ...sanitizeUploadedFile(file),
      downloadUrl: file.url,
    }),
  };
}

export async function deactivateFile(fileId: string, actorId: string) {
  if (!isValidObjectId(fileId)) {
    return { status: 400, body: errorResponse("Invalid file id") };
  }

  await connectToDatabase();
  const file = await UploadedFileModel.findById(fileId);
  if (!file) {
    return { status: 404, body: errorResponse("File not found") };
  }

  file.isActive = false;
  await file.save();

  await logActivity({
    userId: actorId,
    action: "FILE_DEACTIVATED",
    entityType: "UploadedFile",
    entityId: fileId,
  });

  return {
    status: 200,
    body: successResponse("File deactivated successfully", sanitizeUploadedFile(file)),
  };
}
