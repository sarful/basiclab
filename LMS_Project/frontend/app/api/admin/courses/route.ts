import { NextRequest, NextResponse } from "next/server";

import {
  createCourse,
  errorResponse,
  listAdminCourses,
  requireAdminUser,
  successResponse,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const query = request.nextUrl.searchParams.get("q") ?? undefined;
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const courses = await listAdminCourses(query, status);
    return NextResponse.json(successResponse("Admin courses fetched successfully", courses));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch admin courses";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const payload = (await request.json()) as {
      title?: string;
      slug?: string;
      description?: string;
      categoryId?: string;
      accessType?: "FREE" | "TRIAL_PREVIEW" | "PAID";
      priceBdt?: number;
      previewLessonLimit?: number;
      trialVisible?: boolean;
      trialDays?: number;
    };

    if (!payload.title || !payload.slug) {
      return NextResponse.json(errorResponse("title and slug are required"), { status: 400 });
    }

    const course = await createCourse({
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      categoryId: payload.categoryId,
      accessType: payload.accessType,
      priceBdt: payload.priceBdt,
      previewLessonLimit: payload.previewLessonLimit,
      trialVisible: payload.trialVisible,
      trialDays: payload.trialDays,
    });

    return NextResponse.json(successResponse("Course created successfully", course), {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create course";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
