import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireAuth } from "@/services/auth/auth-guards";
import { getUserById, updateUser } from "@/services/user/user-service";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const result = await getUserById(auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data as Record<string, unknown>;
  const safePayload = {
    fullName: payload.fullName,
    preferredLanguage: payload.preferredLanguage,
  };
  const result = await updateUser(auth.user.id, safePayload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
