import { NextResponse } from "next/server";

import {
  errorResponse,
  listUserEnrollments,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const enrollments = await listUserEnrollments(user.id);
    return NextResponse.json(successResponse("Enrollments fetched successfully", enrollments));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch enrollments";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
