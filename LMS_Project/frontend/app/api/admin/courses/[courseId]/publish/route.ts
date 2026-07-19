import { NextResponse } from "next/server";

import {
  errorResponse,
  requireAdminUser,
  successResponse,
  updateCourseStatus,
} from "@/src/lib/supabase/lms-server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    await requireAdminUser();
    const { courseId } = await context.params;
    const course = await updateCourseStatus(courseId, "PUBLISHED");
    return NextResponse.json(successResponse("Course published successfully", course));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to publish course";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
