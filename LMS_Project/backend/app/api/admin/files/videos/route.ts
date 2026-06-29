import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { uploadFile } from "@/services/upload/upload-service";

export async function POST(request: NextRequest) {
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

  const uploaded = await uploadFile(file, { kind: "VIDEO", uploadedBy: auth.user.id });
  return NextResponse.json(uploaded, { status: uploaded.success ? 201 : 400 });
}
