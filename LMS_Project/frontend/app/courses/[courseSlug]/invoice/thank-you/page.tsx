"use client";

import { useParams } from "next/navigation";

import UniversalCourseInvoiceThankYouPage from "../../../../../src/courses/shared/UniversalCourseInvoiceThankYouPage";

export default function DynamicCourseInvoiceThankYouPage() {
  const params = useParams<{ courseSlug: string }>();

  return <UniversalCourseInvoiceThankYouPage courseSlug={params.courseSlug} />;
}
