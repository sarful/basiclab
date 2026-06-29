import { model, models, Schema } from "mongoose";

const learningHistoryEntrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["LESSON_VIEWED", "LESSON_COMPLETED", "COURSE_COMPLETED", "ACHIEVEMENT_UNLOCKED"],
      required: true,
    },
    lessonId: String,
    title: String,
    occurredAt: {
      type: Date,
      default: Date.now,
    },
    metadata: Schema.Types.Mixed,
  },
  { _id: false },
);

const achievementSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const learningProgressSchema = new Schema(
  {
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
    completedLessonIds: {
      type: [String],
      default: [],
    },
    viewedLessonIds: {
      type: [String],
      default: [],
    },
    lastViewedLessonId: String,
    completionPercentage: {
      type: Number,
      default: 0,
    },
    startedAt: Date,
    completedAt: Date,
    history: {
      type: [learningHistoryEntrySchema],
      default: [],
    },
    achievements: {
      type: [achievementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

learningProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const LearningProgressModel =
  models.LearningProgress || model("LearningProgress", learningProgressSchema);
