import { NextResponse } from "next/server";

import {
  errorResponse,
  issueLearnerCertificate,
  requireAuthenticatedUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST() {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role === "ADMIN") {
      return NextResponse.json(errorResponse("Admins cannot issue learner certificates."), {
        status: 403,
      });
    }

    const certificate = await issueLearnerCertificate({
      userId: user.id,
      accountState: user.accountState,
    });

    return NextResponse.json(successResponse("Certificate issued successfully", certificate), {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to issue certificate";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
