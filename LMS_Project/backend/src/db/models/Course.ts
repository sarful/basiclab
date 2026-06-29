import { model, models, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "CourseCategory",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    logicTheoryEn: String,
    logicTheoryBn: String,
    udemyScriptEn: String,
    udemyScriptBn: String,
    simulationUrl: String,
    resourcePdfUrl: String,
    videoUrl: String,
    downloadableUrl: String,
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  },
);

export const CourseModel = models.Course || model("Course", courseSchema);
