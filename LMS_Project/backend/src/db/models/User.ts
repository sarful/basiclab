import { model, models, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "LEARNER_EN", "LEARNER_BN"],
      required: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "bn"],
      default: "en",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    avatarUrl: String,
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel = models.User || model("User", userSchema);
