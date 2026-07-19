import { NextResponse } from "next/server";

import {
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  setAdminUserSuspended,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { userId } = await context.params;
    const user = await setAdminUserSuspended(userId, false);
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "USER_ACTIVATED",
      entityType: "Profile",
      entityId: user.id,
      metadata: {
        blockedAt: null,
      },
    });
    return NextResponse.json(successResponse("User activated successfully", user));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to activate user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
