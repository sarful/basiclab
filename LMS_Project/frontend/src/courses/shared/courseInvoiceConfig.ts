import {
  BASICS_COURSE_SLUG,
  INDUSTRIAL_SENSOR_COURSE_SLUG,
} from "../../auth/course-access";

export type CourseInvoiceConfig = {
  courseSlug: string;
  courseHref: string;
  firstLessonHref: string;
  fallbackTitle: string;
  fallbackAmountBdt: number;
  referencePrefix: string;
};

const courseInvoiceConfigs: Record<string, CourseInvoiceConfig> = {
  [BASICS_COURSE_SLUG]: {
    courseSlug: BASICS_COURSE_SLUG,
    courseHref: "/courses/basics-electronics-and-electrical",
    firstLessonHref: "/current-voltage-learning/1",
    fallbackTitle: "Basics Electronics and Electrical",
    fallbackAmountBdt: 120,
    referencePrefix: "BEE",
  },
  [INDUSTRIAL_SENSOR_COURSE_SLUG]: {
    courseSlug: INDUSTRIAL_SENSOR_COURSE_SLUG,
    courseHref: "/courses/industrial-sensor",
    firstLessonHref: "/industrial-sensor/proximity-sensor",
    fallbackTitle: "Industrial Sensor",
    fallbackAmountBdt: 120,
    referencePrefix: "IS",
  },
};

function titleFromSlug(courseSlug: string) {
  return courseSlug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function getCourseInvoiceConfig(courseSlug: string): CourseInvoiceConfig {
  return courseInvoiceConfigs[courseSlug] ?? {
    courseSlug,
    courseHref: `/courses/${courseSlug}`,
    firstLessonHref: `/courses/${courseSlug}`,
    fallbackTitle: titleFromSlug(courseSlug),
    fallbackAmountBdt: 120,
    referencePrefix: courseSlug.slice(0, 3).toUpperCase() || "ET",
  };
}
