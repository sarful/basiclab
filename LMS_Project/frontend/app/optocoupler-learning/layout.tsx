import type { ReactNode } from "react";

import CourseAccessGate from "../../src/auth/CourseAccessGate";

export default function OptocouplerLearningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CourseAccessGate>{children}</CourseAccessGate>;
}
