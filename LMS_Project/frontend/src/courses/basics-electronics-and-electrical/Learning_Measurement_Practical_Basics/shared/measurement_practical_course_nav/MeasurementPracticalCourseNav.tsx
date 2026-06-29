"use client";

import UniversalLessonCourseNav from "../../../shared/UniversalLessonCourseNav";

export default function MeasurementPracticalCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  return (
    <UniversalLessonCourseNav
      track="measurement-practical"
      currentLessonId={currentLessonId}
    />
  );
}
