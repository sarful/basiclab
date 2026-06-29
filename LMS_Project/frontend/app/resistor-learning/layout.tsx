import type { ReactNode } from "react";

import CourseAccessGate from "../../src/auth/CourseAccessGate";

export default function ResistorLearningLayout({ children }: { children: ReactNode }) {
  return <CourseAccessGate>{children}</CourseAccessGate>;
}
