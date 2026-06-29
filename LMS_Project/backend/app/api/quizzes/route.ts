import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { listLearnerQuizzes } from "@/services/quiz/quiz-service";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = await listLearnerQuizzes(auth.user.id, query);
  return NextResponse.json(result.body, { status: result.status });
}
