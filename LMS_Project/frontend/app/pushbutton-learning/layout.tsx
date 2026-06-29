import type { ReactNode } from "react";

import CourseAccessGate from "../../src/auth/CourseAccessGate";

export default function PushbuttonLearningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CourseAccessGate>{children}</CourseAccessGate>;
}
