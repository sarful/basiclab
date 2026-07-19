import { NextRequest, NextResponse } from "next/server";

import {
  errorResponse,
  listPaymentRequests,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const status =
      (request.nextUrl.searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null) ?? undefined;
    const paymentRequests = await listPaymentRequests(status);
    return NextResponse.json(
      successResponse("Admin payment requests fetched successfully", paymentRequests),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch payment requests";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
