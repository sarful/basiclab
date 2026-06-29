import { NextResponse } from "next/server";

import { listCourseCategories } from "@/services/course/course-service";

export async function GET() {
  const result = await listCourseCategories();
  return NextResponse.json(result.body, { status: result.status });
}
