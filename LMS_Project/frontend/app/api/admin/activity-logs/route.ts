import { NextRequest, NextResponse } from "next/server";

import {
  errorResponse,
  listAdminActivityLogs,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const logs = await listAdminActivityLogs({
      action: request.nextUrl.searchParams.get("action") ?? undefined,
      entityType: request.nextUrl.searchParams.get("entityType") ?? undefined,
      q: request.nextUrl.searchParams.get("q") ?? undefined,
    });
    return NextResponse.json(successResponse("Admin activity logs fetched successfully", logs));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch admin activity logs";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
