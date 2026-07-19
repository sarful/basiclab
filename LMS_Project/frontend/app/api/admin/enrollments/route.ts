import { NextRequest, NextResponse } from "next/server";

import {
  errorResponse,
  listAdminEnrollments,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const courseId = request.nextUrl.searchParams.get("courseId") ?? undefined;
    const enrollments = await listAdminEnrollments(courseId);
    return NextResponse.json(successResponse("Admin enrollments fetched successfully", enrollments));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch enrollments";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
