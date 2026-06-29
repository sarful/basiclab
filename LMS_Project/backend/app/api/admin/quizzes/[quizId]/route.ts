import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { deleteQuiz, updateQuiz } from "@/services/quiz/quiz-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const payload = await request.json();
  const { quizId } = await params;
  const result = await updateQuiz(quizId, payload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const { quizId } = await params;
  const result = await deleteQuiz(quizId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
