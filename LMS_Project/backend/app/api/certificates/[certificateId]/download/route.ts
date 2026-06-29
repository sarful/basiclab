import { NextRequest, NextResponse } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
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
  if (result.status !== 200 || !("data" in result.body)) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    successResponse("Certificate download payload ready", {
      certificate: result.body.data,
      printableContent: result.body.data.printableContent,
    }),
  );
}
