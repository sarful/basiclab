import { model, models, Schema } from "mongoose";

const answerSchema = new Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const quizAttemptSchema = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
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
    answers: {
      type: [answerSchema],
      default: [],
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    attemptType: {
      type: String,
      enum: ["MCQ", "PRACTICE", "FINAL"],
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const QuizAttemptModel =
  models.QuizAttempt || model("QuizAttempt", quizAttemptSchema);
