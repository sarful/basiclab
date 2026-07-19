import type { ReactNode } from "react";

import CourseAccessGate from "../../src/auth/CourseAccessGate";

export default function IndustrialSensorLayout({ children }: { children: ReactNode }) {
  return (
    <CourseAccessGate
      courseSlug="industrial-sensor"
      courseHref="/courses/industrial-sensor"
    >
      {children}
    </CourseAccessGate>
  );
}
