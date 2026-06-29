import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireAuth } from "@/services/auth/auth-guards";
import { generateCertificate } from "@/services/certificate/certificate-service";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await generateCertificate(auth.user.id, payload);
  return NextResponse.json(result.body, { status: result.status });
}
