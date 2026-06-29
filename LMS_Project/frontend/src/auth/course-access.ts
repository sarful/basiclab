import type { CourseRecord, EnrollmentRecord, EnrollmentStatus } from "./types";

export const BASICS_COURSE_SLUG = "basics-electronics-and-electrical";

export const ACTIVE_ENROLLMENT_STATUSES: EnrollmentStatus[] = ["PENDING", "APPROVED"];

export function findBasicsCourse(courses: CourseRecord[]) {
  return courses.find((course) => course.slug === BASICS_COURSE_SLUG) ?? null;
}

export function findActiveEnrollment(
  enrollments: EnrollmentRecord[],
  courseId?: string,
) {
  if (!courseId) {
    return null;
  }

  return (
    enrollments.find(
      (enrollment) =>
        enrollment.courseId === courseId &&
        ACTIVE_ENROLLMENT_STATUSES.includes(enrollment.status),
    ) ?? null
  );
}
