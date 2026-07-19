import { NextRequest, NextResponse } from "next/server";

import {
  errorResponse,
  listLessonProgress,
  requireAuthenticatedUser,
  successResponse,
  upsertLessonProgress,
} from "@/src/lib/supabase/lms-server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role === "ADMIN") {
      return NextResponse.json(successResponse("Admin progress tracking is skipped", []));
    }

    const lessonPath = request.nextUrl.searchParams.get("lessonPath")?.trim();
    const progress = await listLessonProgress(user.id);
    const data = lessonPath
      ? progress.find((item) => item.lessonPath === lessonPath) ?? null
      : progress;

    return NextResponse.json(successResponse("Lesson progress fetched successfully", data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load lesson progress";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role === "ADMIN") {
      return NextResponse.json(successResponse("Admin progress tracking is skipped", null));
    }

    const payload = (await request.json()) as {
      lessonPath?: string;
      status?: "STARTED" | "COMPLETED";
      progressPercent?: number;
    };

    if (!payload.lessonPath) {
      return NextResponse.json(errorResponse("lessonPath is required"), { status: 400 });
    }

    const progress = await upsertLessonProgress({
      userId: user.id,
      lessonPath: payload.lessonPath,
      status: payload.status,
      progressPercent: payload.progressPercent,
    });

    return NextResponse.json(successResponse("Lesson progress saved successfully", progress), {
      status: 201,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save lesson progress";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json(errorResponse(message), { status });
  }
}
