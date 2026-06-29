import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getLessonViewer } from "@/services/learning/learning-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { courseId, lessonId } = await params;
  const result = await getLessonViewer(auth.user, courseId, lessonId);
  return NextResponse.json(result.body, { status: result.status });
}
