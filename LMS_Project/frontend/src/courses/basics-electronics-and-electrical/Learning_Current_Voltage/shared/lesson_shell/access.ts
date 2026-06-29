"use client";

import type { UserRole } from "@/src/auth/types";
import {
  filterLessonTabsByRole,
  useAuthorizedLessonTabs,
  type LessonTabOption,
} from "@/src/auth/lesson-variant-access";

import type { LessonShellTab } from "./types";

export function filterLessonTabs<T extends string>(
  tabs: LessonShellTab<T>[],
  role: UserRole | null,
) {
  return filterLessonTabsByRole(
    tabs as LessonTabOption<T>[],
    role,
  ) as LessonShellTab<T>[];
}

export { useAuthorizedLessonTabs };
