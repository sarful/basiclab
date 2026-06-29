"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { ResistorVisual } from "./ResistorVisual";
import type { ResistorType } from "./types";

export function ResistorTypesVisualStack({
  selected,
  controlValue,
  environmentValue,
}: {
  selected: ResistorType;
  controlValue: number;
  environmentValue: number;
}) {
  return (
    <div className="space-y-6">
      <ResistorVisual
        selected={selected}
        controlValue={controlValue}
        environmentValue={environmentValue}
      />
      <KnowledgeSection selected={selected} />
    </div>
  );
}
