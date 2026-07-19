import { NextResponse } from "next/server";

import {
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  restoreAdminUserProfile,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { userId } = await context.params;
    const user = await restoreAdminUserProfile(userId);
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "USER_RESTORED",
      entityType: "Profile",
      entityId: user.id,
      metadata: {
        removedAt: null,
      },
    });
    return NextResponse.json(successResponse("User restored successfully", user));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to restore user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
