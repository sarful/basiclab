import { BASICS_COURSE_SLUG } from "../../../../src/auth/course-access";
import UniversalCourseInvoicePage from "../../../../src/courses/shared/UniversalCourseInvoicePage";

export default function CourseInvoicePage() {
  return <UniversalCourseInvoicePage courseSlug={BASICS_COURSE_SLUG} />;
}
