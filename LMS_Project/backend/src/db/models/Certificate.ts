import { model, models, Schema } from "mongoose";

const certificateSchema = new Schema(
  {
    certificateCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "CertificateTemplate",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    printableContent: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const CertificateModel =
  models.Certificate || model("Certificate", certificateSchema);
