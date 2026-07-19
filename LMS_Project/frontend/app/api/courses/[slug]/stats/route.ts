import { NextResponse } from "next/server";

import { errorResponse, getPublicCourseStats, successResponse } from "@/src/lib/supabase/lms-server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const stats = await getPublicCourseStats(slug);
    return NextResponse.json(successResponse("Course stats fetched successfully", stats));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Unable to fetch course stats"),
      { status: 400 },
    );
  }
}
