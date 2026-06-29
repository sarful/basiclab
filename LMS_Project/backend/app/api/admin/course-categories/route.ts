import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { parseSafeJsonRequest } from "@/lib/request-security";
import { requireRole } from "@/services/auth/auth-guards";
import { createCourseCategory, listCourseCategories } from "@/services/course/course-service";

export async function GET() {
  const result = await listCourseCategories();
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

  const parsed = await parseSafeJsonRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const payload = parsed.data;
  const result = await createCourseCategory(payload, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
