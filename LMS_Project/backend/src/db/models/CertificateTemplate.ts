import { model, models, Schema } from "mongoose";

const certificateTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: String,
    body: String,
    signatureName: String,
    signatureTitle: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const CertificateTemplateModel =
  models.CertificateTemplate ||
  model("CertificateTemplate", certificateTemplateSchema);
