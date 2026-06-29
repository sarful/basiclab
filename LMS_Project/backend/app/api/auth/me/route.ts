import { NextResponse } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";

export async function GET() {
  const auth = await requireAuth();

  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  return NextResponse.json(successResponse("Authenticated user", auth.user));
}
