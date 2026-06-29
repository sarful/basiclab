import { NextRequest, NextResponse } from "next/server";

import { verifyCertificateByCode } from "@/services/certificate/certificate-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ certificateCode: string }> },
) {
  const { certificateCode } = await params;
  const result = await verifyCertificateByCode(certificateCode);
  return NextResponse.json(result.body, { status: result.status });
}
