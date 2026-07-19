import { NextResponse } from "next/server";

import {
  deleteAdminUserProfile,
  errorResponse,
  logAdminActivity,
  requireAdminUser,
  successResponse,
  updateAdminUserProfile,
} from "@/src/lib/supabase/lms-server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { userId } = await context.params;
    const payload = (await request.json()) as {
      fullName?: string;
      preferredLanguage?: "en" | "bn";
      role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
      accountState?: "FREE" | "TRIAL" | "PAID";
      isEmailVerified?: boolean;
    };

    const user = await updateAdminUserProfile(userId, {
      fullName: payload.fullName,
      preferredLanguage: payload.preferredLanguage,
      role: payload.role,
      accountState: payload.accountState,
      isEmailVerified: payload.isEmailVerified,
    });

    try {
      await logAdminActivity({
        adminUserId: adminUser.id,
        action: "USER_UPDATED",
        entityType: "Profile",
        entityId: user.id,
        metadata: {
          role: payload.role,
          accountState: payload.accountState,
          preferredLanguage: payload.preferredLanguage,
        },
      });
    } catch (activityError) {
      console.error("Admin user update activity log failed:", activityError);
    }

    return NextResponse.json(successResponse("User updated successfully", user));
  } catch (error) {
    console.error("Admin user update failed:", error);
    const message = error instanceof Error ? error.message : "Unable to update user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const adminUser = await requireAdminUser();
    const { userId } = await context.params;
    const user = await deleteAdminUserProfile(userId);
    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "USER_REMOVED",
      entityType: "Profile",
      entityId: user.id,
      metadata: {
        removedAt: user.removedAt,
      },
    });
    return NextResponse.json(successResponse("User removed successfully", user));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
