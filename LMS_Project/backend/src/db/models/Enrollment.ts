import { model, models, Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "REMOVED"],
      default: "PENDING",
    },
    source: {
      type: String,
      enum: ["REQUEST", "MANUAL"],
      default: "REQUEST",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const EnrollmentModel =
  models.Enrollment || model("Enrollment", enrollmentSchema);
