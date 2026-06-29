import { Types } from "mongoose";

import { CourseCategoryModel } from "@/db/models/CourseCategory";
import { CourseModel } from "@/db/models/Course";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/lib/slug";
import { logActivity } from "@/services/auth/activity-log-service";
import { notifyCourseUpdate } from "@/services/communication/communication-service";
import {
  createCourseCategorySchema,
  createCourseSchema,
  searchCoursesSchema,
  updateCourseCategorySchema,
  updateCourseSchema,
} from "@/services/course/course-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function sanitizeCategory(category: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function sanitizeCourse(course: {
  _id: { toString(): string };
  categoryId?: { toString(): string } | string;
  title: string;
  slug: string;
  description?: string;
  logicTheoryEn?: string;
  logicTheoryBn?: string;
  udemyScriptEn?: string;
  udemyScriptBn?: string;
  simulationUrl?: string;
  resourcePdfUrl?: string;
  videoUrl?: string;
  downloadableUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: course._id.toString(),
    categoryId:
      typeof course.categoryId === "string"
        ? course.categoryId
        : course.categoryId?.toString(),
    title: course.title,
    slug: course.slug,
    description: course.description,
    logicTheoryEn: course.logicTheoryEn,
    logicTheoryBn: course.logicTheoryBn,
    udemyScriptEn: course.udemyScriptEn,
    udemyScriptBn: course.udemyScriptBn,
    simulationUrl: course.simulationUrl,
    resourcePdfUrl: course.resourcePdfUrl,
    videoUrl: course.videoUrl,
    downloadableUrl: course.downloadableUrl,
    status: course.status,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

export async function createCourseCategory(input: unknown, actorId: string) {
  const parsed = createCourseCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course category payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const existing = await CourseCategoryModel.findOne({ $or: [{ name: parsed.data.name }, { slug }] });
  if (existing) {
    return { status: 409, body: errorResponse("Course category already exists") };
  }

  const category = await CourseCategoryModel.create({
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
  });

  await logActivity({
    userId: actorId,
    action: "COURSE_CATEGORY_CREATED",
    entityType: "CourseCategory",
    entityId: category._id.toString(),
  });

  return { status: 201, body: successResponse("Course category created successfully", sanitizeCategory(category)) };
}

export async function updateCourseCategory(categoryId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(categoryId)) {
    return { status: 400, body: errorResponse("Invalid category id") };
  }

  const parsed = updateCourseCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course category payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const category = await CourseCategoryModel.findById(categoryId);
  if (!category) {
    return { status: 404, body: errorResponse("Course category not found") };
  }

  if (parsed.data.name) {
    category.name = parsed.data.name;
  }
  if (parsed.data.slug) {
    category.slug = slugify(parsed.data.slug);
  }
  if (parsed.data.description !== undefined) {
    category.description = parsed.data.description;
  }

  await category.save();

  await logActivity({
    userId: actorId,
    action: "COURSE_CATEGORY_UPDATED",
    entityType: "CourseCategory",
    entityId: categoryId,
  });

  return { status: 200, body: successResponse("Course category updated successfully", sanitizeCategory(category)) };
}

export async function deleteCourseCategory(categoryId: string, actorId: string) {
  if (!isValidObjectId(categoryId)) {
    return { status: 400, body: errorResponse("Invalid category id") };
  }

  await connectToDatabase();
  const category = await CourseCategoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return { status: 404, body: errorResponse("Course category not found") };
  }

  await CourseModel.updateMany({ categoryId }, { $unset: { categoryId: "" } });

  await logActivity({
    userId: actorId,
    action: "COURSE_CATEGORY_DELETED",
    entityType: "CourseCategory",
    entityId: categoryId,
  });

  return { status: 200, body: successResponse("Course category deleted successfully", null) };
}

export async function listCourseCategories() {
  await connectToDatabase();
  const categories = await CourseCategoryModel.find().sort({ name: 1 });
  return {
    status: 200,
    body: successResponse("Course categories fetched successfully", categories.map((category) => sanitizeCategory(category))),
  };
}

export async function createCourse(input: unknown, actorId: string) {
  const parsed = createCourseSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course payload", parsed.error.flatten()) };
  }

  await connectToDatabase();

  if (parsed.data.categoryId && !isValidObjectId(parsed.data.categoryId)) {
    return { status: 400, body: errorResponse("Invalid category id") };
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  const existing = await CourseModel.findOne({ slug });
  if (existing) {
    return { status: 409, body: errorResponse("Course already exists") };
  }

  const course = await CourseModel.create({
    ...parsed.data,
    slug,
    categoryId: parsed.data.categoryId || undefined,
  });

  await logActivity({
    userId: actorId,
    action: "COURSE_CREATED",
    entityType: "Course",
    entityId: course._id.toString(),
  });

  return { status: 201, body: successResponse("Course created successfully", sanitizeCourse(course)) };
}

export async function updateCourse(courseId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  const parsed = updateCourseSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  if (parsed.data.categoryId !== undefined) {
    if (parsed.data.categoryId && !isValidObjectId(parsed.data.categoryId)) {
      return { status: 400, body: errorResponse("Invalid category id") };
    }
    course.categoryId = parsed.data.categoryId || undefined;
  }

  if (parsed.data.slug) {
    course.slug = slugify(parsed.data.slug);
  }

  Object.assign(course, {
    ...parsed.data,
    slug: parsed.data.slug ? slugify(parsed.data.slug) : course.slug,
  });
  await course.save();

  await logActivity({
    userId: actorId,
    action: "COURSE_UPDATED",
    entityType: "Course",
    entityId: courseId,
  });

  await notifyCourseUpdate({
    actorId,
    courseId,
    title: course.title,
    updateType: "UPDATED",
  });

  return { status: 200, body: successResponse("Course updated successfully", sanitizeCourse(course)) };
}

export async function deleteCourse(courseId: string, actorId: string) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const course = await CourseModel.findByIdAndDelete(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  await logActivity({
    userId: actorId,
    action: "COURSE_DELETED",
    entityType: "Course",
    entityId: courseId,
  });

  return { status: 200, body: successResponse("Course deleted successfully", null) };
}

export async function listCourses(query: Record<string, string | undefined>) {
  const parsed = searchCoursesSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid course search query", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {};

  if (parsed.data.q) {
    filter.$or = [
      { title: { $regex: parsed.data.q, $options: "i" } },
      { description: { $regex: parsed.data.q, $options: "i" } },
      { slug: { $regex: parsed.data.q, $options: "i" } },
    ];
  }

  if (parsed.data.status) {
    filter.status = parsed.data.status;
  }

  if (parsed.data.categoryId) {
    if (!isValidObjectId(parsed.data.categoryId)) {
      return { status: 400, body: errorResponse("Invalid category id") };
    }
    filter.categoryId = parsed.data.categoryId;
  }

  const courses = await CourseModel.find(filter).sort({ createdAt: -1 }).limit(100);

  return {
    status: 200,
    body: successResponse("Courses fetched successfully", courses.map((course) => sanitizeCourse(course))),
  };
}

export async function getCourse(courseId: string) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  return { status: 200, body: successResponse("Course fetched successfully", sanitizeCourse(course)) };
}

export async function setCourseStatus(
  courseId: string,
  status: "PUBLISHED" | "ARCHIVED",
  actorId: string,
) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  course.status = status;
  await course.save();

  await logActivity({
    userId: actorId,
    action: status === "PUBLISHED" ? "COURSE_PUBLISHED" : "COURSE_ARCHIVED",
    entityType: "Course",
    entityId: courseId,
  });

  await notifyCourseUpdate({
    actorId,
    courseId,
    title: course.title,
    updateType: status === "PUBLISHED" ? "PUBLISHED" : "UPDATED",
  });

  return {
    status: 200,
    body: successResponse(
      status === "PUBLISHED" ? "Course published successfully" : "Course archived successfully",
      sanitizeCourse(course),
    ),
  };
}

export async function attachCourseAsset(
  courseId: string,
  field: "resourcePdfUrl" | "videoUrl" | "downloadableUrl",
  url: string,
  actorId: string,
) {
  if (!isValidObjectId(courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  course[field] = url;
  await course.save();

  await logActivity({
    userId: actorId,
    action: "COURSE_ASSET_ATTACHED",
    entityType: "Course",
    entityId: courseId,
    metadata: { field, url },
  });

  return { status: 200, body: successResponse("Course asset attached successfully", sanitizeCourse(course)) };
}
