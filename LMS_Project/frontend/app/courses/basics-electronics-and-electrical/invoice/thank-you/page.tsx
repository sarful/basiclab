import { BASICS_COURSE_SLUG } from "../../../../../src/auth/course-access";
import UniversalCourseInvoiceThankYouPage from "../../../../../src/courses/shared/UniversalCourseInvoiceThankYouPage";

export default function InvoiceThankYouPage() {
  return <UniversalCourseInvoiceThankYouPage courseSlug={BASICS_COURSE_SLUG} />;
}
