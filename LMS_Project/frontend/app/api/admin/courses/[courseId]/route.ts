import { NextResponse } from "next/server";

import {
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  safeDeleteCourse,
  successResponse,
  updateCourse,
} from "@/src/lib/supabase/lms-server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { courseId } = await context.params;
    const payload = (await request.json()) as {
      title?: string;
      slug?: string;
      description?: string;
      categoryId?: string;
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      accessType?: "FREE" | "TRIAL_PREVIEW" | "PAID";
      priceBdt?: number;
      previewLessonLimit?: number;
      trialVisible?: boolean;
      trialDays?: number;
    };

    const course = await updateCourse(courseId, payload);
    try {
      await logAdminActivity({
        adminUserId: adminUser.id,
        action: "COURSE_UPDATED",
        entityType: "Course",
        entityId: course.id,
        metadata: {
          categoryId: course.categoryId ?? null,
          accessType: course.accessType,
          priceBdt: course.priceBdt,
          previewLessonLimit: course.previewLessonLimit ?? null,
          trialVisible: course.trialVisible,
          trialDays: course.trialDays,
          status: course.status,
        },
      });
    } catch (activityError) {
      console.error("Admin course update activity log failed:", activityError);
    }

    return NextResponse.json(successResponse("Course updated successfully", course));
  } catch (error) {
    console.error("Admin course update failed:", error);
    const message = error instanceof Error ? error.message : "Unable to update course";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { courseId } = await context.params;
    const course = await safeDeleteCourse(courseId);

    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "COURSE_DELETED",
      entityType: "Course",
      entityId: course.id,
      metadata: {
        slug: course.slug,
        status: course.status,
      },
    });

    return NextResponse.json(successResponse("Course deleted successfully", course));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete course";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
