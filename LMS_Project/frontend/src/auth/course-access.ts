import type { CourseRecord, EnrollmentRecord, EnrollmentStatus } from "./types";

export const BASICS_COURSE_SLUG = "basics-electronics-and-electrical";
export const INDUSTRIAL_SENSOR_COURSE_SLUG = "industrial-sensor";

export const ACTIVE_ENROLLMENT_STATUSES: EnrollmentStatus[] = ["PENDING", "APPROVED"];

export function findBasicsCourse(courses: CourseRecord[]) {
  return courses.find((course) => course.slug === BASICS_COURSE_SLUG) ?? null;
}

export function findIndustrialSensorCourse(courses: CourseRecord[]) {
  return courses.find((course) => course.slug === INDUSTRIAL_SENSOR_COURSE_SLUG) ?? null;
}

export function findCourseBySlug(courses: CourseRecord[], courseSlug: string) {
  return courses.find((course) => course.slug === courseSlug) ?? null;
}

export function findActiveEnrollment(
  enrollments: EnrollmentRecord[],
  courseId?: string,
) {
  if (!courseId) {
    return null;
  }

  const courseEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.courseId === courseId &&
      ACTIVE_ENROLLMENT_STATUSES.includes(enrollment.status),
  );

  return (
    courseEnrollments.find((enrollment) => enrollment.status === "APPROVED") ??
    courseEnrollments.find((enrollment) => enrollment.status === "PENDING") ??
    null
  );
}
