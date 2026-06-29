import type { ReactNode } from "react";

import CourseAccessGate from "../../src/auth/CourseAccessGate";

export default function MeasurementPracticalBasicsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CourseAccessGate>{children}</CourseAccessGate>;
}
