import { NextRequest, NextResponse } from "next/server";

import { listCourseCatalog } from "@/services/enrollment/enrollment-service";

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = await listCourseCatalog(query);
  return NextResponse.json(result.body, { status: result.status });
}
