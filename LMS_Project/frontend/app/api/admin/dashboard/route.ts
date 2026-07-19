import { NextResponse } from "next/server";

import {
  errorResponse,
  getAdminDashboardData,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET() {
  try {
    await requireAdminUser();
    const dashboard = await getAdminDashboardData();
    return NextResponse.json(successResponse("Admin dashboard fetched successfully", dashboard));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load admin dashboard";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
