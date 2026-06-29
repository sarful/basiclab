import { NextResponse } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { requireRole } from "@/services/auth/auth-guards";
import { listFiles } from "@/services/file/file-service";
import { getStorageStats } from "@/services/storage/storage-service";

export async function GET() {
  const auth = await requireRole(["ADMIN"]);
  if (!auth) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  if ("forbidden" in auth) {
    return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
  }

  const [stats, files] = await Promise.all([getStorageStats(), listFiles({})]);
  const fileRows = files.status === 200 && "data" in files.body ? files.body.data : [];
  const largestFiles = [...fileRows]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  return NextResponse.json(
    successResponse("Storage summary fetched successfully", {
      ...stats,
      largestFiles,
    }),
    { status: 200 },
  );
}
