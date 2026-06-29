import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { getCertificate } from "@/services/certificate/certificate-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> },
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const { certificateId } = await params;
  const result = await getCertificate(certificateId, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
