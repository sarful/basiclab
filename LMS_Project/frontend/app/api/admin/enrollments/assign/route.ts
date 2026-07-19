import { NextResponse } from "next/server";

import {
  assignEnrollment,
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(request: Request) {
  try {
    const adminUser = await requireAdminUser();
    const payload = (await request.json()) as {
      userId?: string;
      courseId?: string;
      notes?: string;
    };

    if (!payload.userId || !payload.courseId) {
      return NextResponse.json(errorResponse("userId and courseId are required"), { status: 400 });
    }

    const enrollment = await assignEnrollment(payload.userId, payload.courseId, payload.notes);
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "COURSE_ACCESS_ASSIGNED",
      entityType: "Enrollment",
      entityId: enrollment.id,
      metadata: {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        notes: payload.notes,
      },
    });
    return NextResponse.json(successResponse("Enrollment assigned successfully", enrollment));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to assign enrollment";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
