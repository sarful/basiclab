import { NextResponse } from "next/server";

import {
  errorResponse,
  getLearnerPerformanceDashboard,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const dashboard = await getLearnerPerformanceDashboard(user.id, user.accountState);
    return NextResponse.json(successResponse("Learner dashboard fetched successfully", dashboard));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load learner dashboard";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
