import { model, models, Schema } from "mongoose";

const courseCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
  },
  {
    timestamps: true,
  },
);

export const CourseCategoryModel =
  models.CourseCategory || model("CourseCategory", courseCategorySchema);
