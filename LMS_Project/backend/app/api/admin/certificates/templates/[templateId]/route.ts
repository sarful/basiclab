import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { updateCertificateTemplate } from "@/services/certificate/certificate-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const payload = await request.json();
  const { templateId } = await params;
  const result = await updateCertificateTemplate(templateId, payload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
