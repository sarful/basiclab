"use client";

import { ColorMappingTable } from "./ColorMappingTable";
import type { BandMode } from "./types";

export function KnowledgeSection({
  mode,
  formulaText,
  minResistance,
  maxResistance,
  tempPpm,
  firstDigitValue,
}: {
  mode: BandMode;
  formulaText: string;
  minResistance: number;
  maxResistance: number;
  tempPpm: number;
  firstDigitValue: number;
}) {
  return (
    <>
      {/* <div className="grid gap-6 lg:grid-cols-3">
        <LiveFormulaCard
          mode={mode}
          formulaText={formulaText}
          minResistance={minResistance}
          maxResistance={maxResistance}
          tempPpm={tempPpm}
        />
        <HowToReadCard />
        <CommonMistakeCard firstDigitValue={firstDigitValue} />
      </div> */}

      <ColorMappingTable />
    </>
  );
}
