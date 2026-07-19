"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { basicsCourseProjects } from "../courses/basics-electronics-and-electrical/courseCatalog";
import CourseAccessGate from "./CourseAccessGate";

const legacyBasicsProtectedPrefixes = [
  "/transistor-learning",
  ...basicsCourseProjects.flatMap((project) => project.href ? [project.href] : []),
];

function matchesProtectedRoute(pathname: string, routePrefix: string) {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

export default function CoursePublishingBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const needsBasicsCourseGate = legacyBasicsProtectedPrefixes.some((routePrefix) =>
    matchesProtectedRoute(pathname, routePrefix),
  );

  if (needsBasicsCourseGate) {
    return <CourseAccessGate>{children}</CourseAccessGate>;
  }

  return <>{children}</>;
}
