"use client";

import UniversalLessonCourseNav from "../../../shared/UniversalLessonCourseNav";

export default function CapacitorCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  return <UniversalLessonCourseNav track="capacitor" currentLessonId={currentLessonId} />;
}
