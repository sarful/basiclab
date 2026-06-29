import { model, models, Schema } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
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

export const PasswordResetTokenModel =
  models.PasswordResetToken || model("PasswordResetToken", passwordResetTokenSchema);
