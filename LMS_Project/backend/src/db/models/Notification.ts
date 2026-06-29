import { model, models, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["EMAIL", "OTP", "ENROLLMENT", "COURSE_UPDATE", "COMPLETION", "ANNOUNCEMENT", "SUPPORT"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["IN_APP", "EMAIL", "BOTH"],
      default: "BOTH",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

export const NotificationModel =
  models.Notification || model("Notification", notificationSchema);
