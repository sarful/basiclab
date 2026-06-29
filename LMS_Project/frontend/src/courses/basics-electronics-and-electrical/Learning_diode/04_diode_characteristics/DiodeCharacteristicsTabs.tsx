"use client";

import { TabButton } from "./TabButton";
import type { Section } from "./types";

export function DiodeCharacteristicsTabs({
  section,
  onSectionChange,
}: {
  section: Section;
  onSectionChange: (section: Section) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <TabButton active={section === "working"} onClick={() => onSectionChange("working")}>
        Working
      </TabButton>
      <TabButton
        active={section === "characteristics"}
        onClick={() => onSectionChange("characteristics")}
      >
        Characteristics
      </TabButton>
    </div>
  );
}
