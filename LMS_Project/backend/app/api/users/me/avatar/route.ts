import { NextRequest, NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/services/auth/auth-guards";
import { uploadFile } from "@/services/upload/upload-service";
import { updateUser } from "@/services/user/user-service";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(errorResponse("file is required"), { status: 400 });
  }

  const uploadResult = await uploadFile(file, {
    kind: "AVATAR",
    uploadedBy: auth.user.id,
    entityType: "User",
    entityId: auth.user.id,
  });
  if (!uploadResult.success || !("data" in uploadResult)) {
    return NextResponse.json(uploadResult, { status: 400 });
  }

  const result = await updateUser(
    auth.user.id,
    { avatarUrl: uploadResult.data.url },
    auth.user.id,
  );

  return NextResponse.json(result.body, { status: result.status });
}
