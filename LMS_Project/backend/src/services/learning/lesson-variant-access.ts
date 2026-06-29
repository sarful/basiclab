import type { UserRole } from "@/types/auth";

import type { DerivedLesson } from "@/services/learning/learning-types";

const ALLOWED_LESSON_KEYS: Record<UserRole, string[]> = {
  ADMIN: [
    "logic-theory:en",
    "logic-theory:bn",
    "udemy-script:en",
    "udemy-script:bn",
    "simulation",
    "pdf",
    "video",
    "download",
  ],
  LEARNER_EN: ["logic-theory:en", "simulation"],
  LEARNER_BN: ["logic-theory:bn", "simulation"],
};

function getLessonPermissionKey(lesson: DerivedLesson) {
  if (lesson.type === "logic-theory" || lesson.type === "udemy-script") {
    return `${lesson.type}:${lesson.language ?? "unknown"}`;
  }

  return lesson.type;
}

export function canAccessDerivedLesson(role: UserRole, lesson: DerivedLesson) {
  return ALLOWED_LESSON_KEYS[role].includes(getLessonPermissionKey(lesson));
}

export function filterDerivedLessonsForRole(lessons: DerivedLesson[], role: UserRole) {
  return lessons.filter((lesson) => canAccessDerivedLesson(role, lesson));
}
