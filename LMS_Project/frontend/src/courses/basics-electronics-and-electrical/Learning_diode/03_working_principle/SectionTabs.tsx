"use client";

import { TabButton } from "./TabButton";
import type { Section } from "./types";

export function SectionTabs({
  section,
  onSectionChange,
}: {
  section: Section;
  onSectionChange: (section: Section) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <TabButton
        active={section === "construction"}
        onClick={() => onSectionChange("construction")}
      >
        1. Construction
      </TabButton>
      <TabButton
        active={section === "formation"}
        onClick={() => onSectionChange("formation")}
      >
        2. Formation
      </TabButton>
      <TabButton
        active={section === "working"}
        onClick={() => onSectionChange("working")}
      >
        3. Working Principle
      </TabButton>
    </div>
  );
}
