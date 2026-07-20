"use client";

import type { ReactNode } from "react";

import { useAuthorizedLessonTabs } from "@/src/auth/lesson-variant-access";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import UniversalLessonHeader from "../../shared/UniversalLessonHeader";
import { DiodeCourseNav } from "./diode_course_nav";

const diodeHeaderTabs = [
  { id: "logic", label: "Logic & Theory" },
  { id: "logic_bn", label: "Logic & Theory (Bangla)" },
  { id: "english", label: "Udemy English Script" },
  { id: "bangla", label: "Udemy Script Bangla" },
  { id: "lesson", label: "Simulation" },
] as const;

type DiodeLessonTab = (typeof diodeHeaderTabs)[number]["id"];

export default function DiodeLessonEmbeddedShell({
  children,
  lessonContent,
  lessonId,
  lessonTitle,
}: {
  children: ReactNode;
  lessonContent?: Partial<Record<(typeof diodeHeaderTabs)[number]["id"], ReactNode>>;
  lessonId: number;
  lessonTitle: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { tabs } = useAuthorizedLessonTabs(diodeHeaderTabs, "lesson");
  const requestedTab = searchParams.get("tab");
  const visibleTabIds = tabs.map((tab) => tab.id);
  const defaultTab = visibleTabIds.includes("lesson") ? "lesson" : (visibleTabIds[0] ?? "lesson");
  const activeTab =
    requestedTab && visibleTabIds.includes(requestedTab as DiodeLessonTab)
      ? (requestedTab as DiodeLessonTab)
      : defaultTab;
  const renderedContent =
    lessonContent?.[activeTab] ?? (activeTab === "lesson" ? children : null);

  function handleTabChange(tabId: DiodeLessonTab) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (tabId === "lesson") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tabId);
    }

    const queryString = nextParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

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
          lessonLabel={`Lesson ${String(lessonId).padStart(2, "0")}`}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <DiodeCourseNav currentLessonId={lessonId} />
        {renderedContent}
      </div>
    </main>
  );
}
