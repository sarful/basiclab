import { NextRequest, NextResponse } from "next/server";

import {
  createAdminManagedUser,
  errorResponse,
  listAdminUsers,
  logAdminActivity,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const users = await listAdminUsers({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      role: (request.nextUrl.searchParams.get("role") as "ADMIN" | "LEARNER_EN" | "LEARNER_BN" | null) ?? undefined,
      accountState: (request.nextUrl.searchParams.get("accountState") as "FREE" | "TRIAL" | "PAID" | null) ?? undefined,
      suspended: (request.nextUrl.searchParams.get("suspended") as "true" | "false" | null) ?? undefined,
    });
    return NextResponse.json(successResponse("Admin users fetched successfully", users));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch admin users";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await requireAdminUser();
    const payload = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
      accountState?: "FREE" | "TRIAL" | "PAID";
      preferredLanguage?: "en" | "bn";
      isEmailVerified?: boolean;
    };

    if (!payload.fullName || !payload.email || !payload.password || !payload.role) {
      return NextResponse.json(
        errorResponse("fullName, email, password, and role are required"),
        { status: 400 },
      );
    }

    if (payload.password.length < 8) {
      return NextResponse.json(
        errorResponse("Password must be at least 8 characters long"),
        { status: 400 },
      );
    }

    const user = await createAdminManagedUser({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      accountState: payload.accountState,
      preferredLanguage: payload.preferredLanguage,
      isEmailVerified: payload.isEmailVerified,
    });

    await logAdminActivity({
      adminUserId: adminUser.id,
      action: "USER_CREATED",
      entityType: "Profile",
      entityId: user.id,
      metadata: {
        role: user.role,
        accountState: user.accountState,
        preferredLanguage: user.preferredLanguage,
      },
    });

    return NextResponse.json(successResponse("User created successfully", user), {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create user";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
