import { model, models, Schema } from "mongoose";

const quizQuestionSchema = new Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: String,
    points: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

const quizSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    quizType: {
      type: String,
      enum: ["MCQ", "PRACTICE", "FINAL"],
      default: "MCQ",
    },
    assigned: {
      type: Boolean,
      default: false,
    },
    passingScore: {
      type: Number,
      default: 70,
    },
    questions: {
      type: [quizQuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const QuizModel = models.Quiz || model("Quiz", quizSchema);
