"use client";

import UniversalLessonCourseNav from "../../../shared/UniversalLessonCourseNav";

export default function DiodeCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  return <UniversalLessonCourseNav track="diode" currentLessonId={currentLessonId} />;
}
