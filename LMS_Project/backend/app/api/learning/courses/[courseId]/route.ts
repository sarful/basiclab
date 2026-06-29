import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getCourseViewer } from "@/services/learning/learning-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { courseId } = await params;
  const result = await getCourseViewer(auth.user, courseId);
  return NextResponse.json(result.body, { status: result.status });
}
