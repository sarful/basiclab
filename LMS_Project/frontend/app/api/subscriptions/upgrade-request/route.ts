import { NextResponse } from "next/server";

import {
  createPaymentRequest,
  errorResponse,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();

    if (user.accountState !== "FREE") {
      return NextResponse.json(errorResponse("Invoices are only required for free accounts. Use course enrollment instead."), {
        status: 403,
      });
    }

    const payload = (await request.json()) as {
      planName?: string;
      transactionId?: string;
      paymentMethod?: string;
      amount?: number;
      currency?: string;
      invoiceNumber?: string;
      courseId?: string;
      paymentReference?: string;
      buyerName?: string;
      buyerEmail?: string;
      buyerPhone?: string;
      additionalMessage?: string;
    };

    if (!payload.planName || !payload.transactionId) {
      return NextResponse.json(errorResponse("planName and transactionId are required"), {
        status: 400,
      });
    }

    const paymentRequest = await createPaymentRequest({
      userId: user.id,
      planName: payload.planName,
      transactionId: payload.transactionId,
      paymentMethod: payload.paymentMethod,
      amount: payload.amount,
      currency: payload.currency,
      invoiceNumber: payload.invoiceNumber,
      courseId: payload.courseId,
      paymentReference: payload.paymentReference,
      buyerName: payload.buyerName,
      buyerEmail: payload.buyerEmail,
      buyerPhone: payload.buyerPhone,
      additionalMessage: payload.additionalMessage,
    });

    return NextResponse.json(
      successResponse("Upgrade request submitted successfully", paymentRequest),
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit upgrade request";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
