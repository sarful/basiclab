import { NextResponse } from "next/server";

import {
  createEnrollment,
  errorResponse,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();

    if (user.accountState === "FREE") {
      return NextResponse.json(
        errorResponse("Payment invoice required. Open the invoice page to submit payment information."),
        { status: 402 },
      );
    }

    const payload = (await request.json()) as { courseId?: string };

    if (!payload.courseId) {
      return NextResponse.json(errorResponse("courseId is required"), { status: 400 });
    }

    const enrollment = await createEnrollment(user.id, payload.courseId, user.accountState);
    return NextResponse.json(successResponse("Enrollment created successfully", enrollment), {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create enrollment";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
