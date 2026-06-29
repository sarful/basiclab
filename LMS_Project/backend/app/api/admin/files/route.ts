import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { listFiles } from "@/services/file/file-service";
import { uploadFile } from "@/services/upload/upload-service";

export async function GET(request: NextRequest) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = await listFiles(query);
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

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");
  const entityType = formData.get("entityType");
  const entityId = formData.get("entityId");

  if (!(file instanceof File)) {
    return NextResponse.json(errorResponse("file is required"), { status: 400 });
  }

  const uploaded = await uploadFile(file, {
    kind:
      kind === "PDF" || kind === "VIDEO" || kind === "IMAGE" || kind === "RESOURCE" || kind === "AVATAR" || kind === "OTHER"
        ? kind
        : "OTHER",
    uploadedBy: auth.user.id,
    entityType: typeof entityType === "string" ? entityType : undefined,
    entityId: typeof entityId === "string" ? entityId : undefined,
  });

  return NextResponse.json(uploaded, { status: uploaded.success ? 201 : 400 });
}
