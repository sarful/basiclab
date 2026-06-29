"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import { ResistorSvg } from "./ResistorSvg";
import type { BandMode } from "./types";

export function ResistorColorCodeVisualStack({
  mode,
  bands,
  formulaText,
  minResistance,
  maxResistance,
  tempPpm,
  firstDigitValue,
}: {
  mode: BandMode;
  bands: Array<{ label: string; color: string; name: string; value: string }>;
  formulaText: string;
  minResistance: number;
  maxResistance: number;
  tempPpm: number;
  firstDigitValue: number;
}) {
  return (
    <>
      <ResistorSvg mode={mode} bands={bands} />
      <KnowledgeSection
        mode={mode}
        formulaText={formulaText}
        minResistance={minResistance}
        maxResistance={maxResistance}
        tempPpm={tempPpm}
        firstDigitValue={firstDigitValue}
      />
    </>
  );
}
