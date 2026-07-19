import { NextResponse } from "next/server";

import {
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  reviewPaymentRequest,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(
  request: Request,
  context: { params: Promise<{ paymentRequestId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { paymentRequestId } = await context.params;
    const payload = (await request.json()) as { reviewNotes?: string };
    const paymentRequest = await reviewPaymentRequest(paymentRequestId, {
      status: "REJECTED",
      reviewedBy: adminUser.id,
      reviewNotes: payload.reviewNotes,
    });
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "PAYMENT_REJECTED",
      entityType: "PaymentRequest",
      entityId: paymentRequest.id,
      metadata: {
        userId: paymentRequest.userId,
        amount: paymentRequest.amount,
        planName: paymentRequest.planName,
        reviewNotes: payload.reviewNotes ?? null,
      },
    });
    return NextResponse.json(successResponse("Payment request rejected successfully", paymentRequest));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reject payment request";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
