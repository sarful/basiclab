"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { useAuthorizedLessonTabs } from "@/src/auth/lesson-variant-access";

import UniversalLessonCourseNav from "./UniversalLessonCourseNav";
import UniversalLessonHeader from "./UniversalLessonHeader";
import {
  getLessonTrackFromPathname,
  type LessonTrackId,
} from "./lessonRegistry";

const simulationHeaderTabs = [
  { id: "logic", label: "Logic & Theory" },
  { id: "logic_bn", label: "Logic & Theory (Bangla)" },
  { id: "english", label: "Udemy English Script" },
  { id: "bangla", label: "Udemy Script Bangla" },
  { id: "lesson", label: "Simulation" },
] as const;

export default function UniversalSimulationLessonShell({
  children,
  lessonLabel,
  currentLessonId,
  track,
}: {
  children: ReactNode;
  lessonLabel: string;
  currentLessonId?: number;
  track?: LessonTrackId;
}) {
  const { tabs } = useAuthorizedLessonTabs(simulationHeaderTabs, "lesson");
  const pathname = usePathname();

  const resolvedTrack = useMemo(() => {
    if (track) {
      return track;
    }

    return getLessonTrackFromPathname(pathname);
  }, [pathname, track]);

  const resolvedLessonId = useMemo(() => {
    if (typeof currentLessonId === "number") {
      return currentLessonId;
    }

    const match = pathname.match(/\/(\d+)$/);
    return match ? Number(match[1]) : null;
  }, [currentLessonId, pathname]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "24px 16px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <UniversalLessonHeader
          lessonLabel={lessonLabel}
          tabs={tabs}
          activeTab="lesson"
        />

        {resolvedTrack && resolvedLessonId ? (
          <UniversalLessonCourseNav
            track={resolvedTrack}
            currentLessonId={resolvedLessonId}
          />
        ) : null}

        <section
          style={{
            borderRadius: 32,
            border: "3px solid #2ea84a",
            background: "#ffffff",
            minHeight: 680,
            padding: 18,
            boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              border: "1px solid #dbe3ee",
              background: "#f8fafc",
              padding: 16,
              overflow: "hidden",
              minHeight: 640,
            }}
          >
            <div
              style={{
                marginBottom: 10,
                color: "#2ea84a",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Simulation
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
