import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getMyLearning } from "@/services/learning/learning-service";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const result = await getMyLearning(auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
