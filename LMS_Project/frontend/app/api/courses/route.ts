import { NextRequest, NextResponse } from "next/server";

import { errorResponse, listPublishedCourses, successResponse } from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") ?? undefined;
    const courses = await listPublishedCourses(query);
    return NextResponse.json(successResponse("Courses fetched successfully", courses));
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Unable to fetch courses"),
      { status: 400 },
    );
  }
}
