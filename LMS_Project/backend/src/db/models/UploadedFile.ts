import { model, models, Schema } from "mongoose";

const uploadedFileSchema = new Schema(
  {
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    kind: {
      type: String,
      enum: ["PDF", "VIDEO", "IMAGE", "RESOURCE", "AVATAR", "OTHER"],
      default: "OTHER",
      index: true,
    },
    storageKey: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    checksum: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      trim: true,
    },
    entityId: {
      type: String,
      trim: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UploadedFileModel =
  models.UploadedFile || model("UploadedFile", uploadedFileSchema);
