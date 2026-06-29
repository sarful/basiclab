import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import {
  createCertificateTemplate,
  listCertificateTemplates,
} from "@/services/certificate/certificate-service";

export async function GET() {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const result = await listCertificateTemplates();
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const payload = await request.json();
  const result = await createCertificateTemplate(payload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
