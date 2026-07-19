"use client";

import {
  findIndustrialSensorCourse,
  INDUSTRIAL_SENSOR_COURSE_SLUG,
} from "./course-access";
import { useCourseAccess } from "./useBasicsCourseAccess";

export function useIndustrialSensorCourseAccess() {
  return useCourseAccess(INDUSTRIAL_SENSOR_COURSE_SLUG, findIndustrialSensorCourse);
}
