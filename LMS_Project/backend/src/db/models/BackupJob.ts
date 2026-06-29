import { model, models, Schema } from "mongoose";

const backupJobSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["FULL", "DATABASE", "FILES"],
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "FAILED", "RESTORED"],
      default: "COMPLETED",
    },
    backupPath: {
      type: String,
      required: true,
      trim: true,
    },
    summary: Schema.Types.Mixed,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restoredAt: Date,
    restoredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const BackupJobModel = models.BackupJob || model("BackupJob", backupJobSchema);
