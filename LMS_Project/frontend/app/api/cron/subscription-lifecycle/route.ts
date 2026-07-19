import { NextRequest, NextResponse } from "next/server";

import {
  downgradeExpiredTrialUsers,
  errorResponse,
  successResponse,
} from "@/src/lib/supabase/lms-server";

function isAuthorizedCron(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return true;
  }

  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return bearerToken === configuredSecret;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorizedCron(request)) {
      return NextResponse.json(errorResponse("Unauthorized cron request"), { status: 401 });
    }

    const result = await downgradeExpiredTrialUsers();
    return NextResponse.json(
      successResponse("Subscription lifecycle job completed successfully", result),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run lifecycle job";
    return NextResponse.json(errorResponse(message), { status: 400 });
  }
}
