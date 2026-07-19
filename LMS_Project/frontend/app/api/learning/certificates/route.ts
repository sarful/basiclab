import { NextResponse } from "next/server";

import {
  errorResponse,
  getLearnerCertificateOverview,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role === "ADMIN") {
      return NextResponse.json(
        successResponse("Admin certificate history is skipped", {
          eligibility: null,
          history: [],
        }),
      );
    }

    const overview = await getLearnerCertificateOverview({
      userId: user.id,
      accountState: user.accountState,
    });

    return NextResponse.json(successResponse("Learner certificate history fetched successfully", overview));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load learner certificates";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
