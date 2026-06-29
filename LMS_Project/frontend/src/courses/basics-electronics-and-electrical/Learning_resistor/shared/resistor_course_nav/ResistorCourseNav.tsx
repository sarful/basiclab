"use client";

import UniversalLessonCourseNav from "../../../shared/UniversalLessonCourseNav";

export default function ResistorCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  return <UniversalLessonCourseNav track="resistor" currentLessonId={currentLessonId} />;
}
