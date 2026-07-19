"use client";

import { useParams } from "next/navigation";

import UniversalCourseInvoicePage from "../../../../src/courses/shared/UniversalCourseInvoicePage";

export default function DynamicCourseInvoicePage() {
  const params = useParams<{ courseSlug: string }>();

  return <UniversalCourseInvoicePage courseSlug={params.courseSlug} />;
}
