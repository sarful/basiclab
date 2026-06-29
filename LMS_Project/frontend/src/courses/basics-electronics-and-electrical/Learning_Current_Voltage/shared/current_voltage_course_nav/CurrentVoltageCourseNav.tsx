"use client";

import UniversalLessonCourseNav from "../../../shared/UniversalLessonCourseNav";

export default function CurrentVoltageCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  return <UniversalLessonCourseNav track="current-voltage" currentLessonId={currentLessonId} />;
}
