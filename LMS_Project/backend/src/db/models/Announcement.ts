import { model, models, Schema } from "mongoose";

const announcementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["ALL", "ADMIN", "LEARNER_EN", "LEARNER_BN"],
      default: "ALL",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    publishedAt: Date,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AnnouncementModel =
  models.Announcement || model("Announcement", announcementSchema);
