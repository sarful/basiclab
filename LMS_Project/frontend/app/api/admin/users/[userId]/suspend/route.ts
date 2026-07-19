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
    const user = await setAdminUserSuspended(userId, true);
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "USER_SUSPENDED",
      entityType: "Profile",
      entityId: user.id,
      metadata: {
        blockedAt: user.blockedAt,
      },
    });
    return NextResponse.json(successResponse("User suspended successfully", user));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to suspend user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
