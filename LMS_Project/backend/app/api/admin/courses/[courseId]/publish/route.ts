import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { setCourseStatus } from "@/services/course/course-service";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const { courseId } = await params;
  const result = await setCourseStatus(courseId, "PUBLISHED", auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
