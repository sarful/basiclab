import { model, models, Schema } from "mongoose";

const otpCodeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    consumedAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const OtpCodeModel = models.OtpCode || model("OtpCode", otpCodeSchema);
