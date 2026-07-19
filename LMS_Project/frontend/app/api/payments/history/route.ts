import { NextResponse } from "next/server";

import {
  errorResponse,
  listUserPaymentRequests,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const payments = await listUserPaymentRequests(user.id);
    return NextResponse.json(successResponse("Payment history fetched successfully", payments));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch payment history";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
