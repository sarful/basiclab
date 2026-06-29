import { NextRequest, NextResponse } from "next/server";

import { getPublicCourseStats } from "@/services/enrollment/enrollment-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const result = await getPublicCourseStats(slug);
  return NextResponse.json(result.body, { status: result.status });
}
