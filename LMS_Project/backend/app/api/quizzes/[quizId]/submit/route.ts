import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireAuth } from "@/services/auth/auth-guards";
import { submitQuiz } from "@/services/quiz/quiz-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const { quizId } = await params;
  const result = await submitQuiz(auth.user.id, quizId, payload);
  return NextResponse.json(result.body, { status: result.status });
}
