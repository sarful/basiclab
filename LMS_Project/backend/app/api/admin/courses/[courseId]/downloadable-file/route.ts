import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { attachCourseAsset } from "@/services/course/course-service";
import { uploadFile } from "@/services/upload/upload-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(errorResponse("file is required"), { status: 400 });
  }

  const { courseId } = await params;
  const uploaded = await uploadFile(file, {
    kind: "RESOURCE",
    uploadedBy: auth.user.id,
    entityType: "Course",
    entityId: courseId,
  });
  if (!uploaded.success || !("data" in uploaded)) {
    return NextResponse.json(uploaded, { status: 400 });
  }

  const result = await attachCourseAsset(courseId, "downloadableUrl", uploaded.data.url, auth.user.id);
  return NextResponse.json(result.body, { status: result.status });
}
