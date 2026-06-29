import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getQuizResults } from "@/services/quiz/quiz-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { quizId } = await params;
  const result = await getQuizResults(auth.user.id, quizId);
  return NextResponse.json(result.body, { status: result.status });
}
