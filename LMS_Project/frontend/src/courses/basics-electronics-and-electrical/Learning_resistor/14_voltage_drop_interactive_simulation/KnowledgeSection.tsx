"use client";

import { VoltageDropDefinitionCard } from "./VoltageDropDefinitionCard";
import { VoltageDropFormulaCard } from "./VoltageDropFormulaCard";

export function KnowledgeSection({
  supplyVoltage,
  totalResistance,
  current,
  showR3,
  sumDrop,
}: {
  supplyVoltage: number;
  totalResistance: number;
  current: number;
  showR3: boolean;
  sumDrop: number;
}) {
  return (
    <>
      <VoltageDropDefinitionCard />
      <VoltageDropFormulaCard
        supplyVoltage={supplyVoltage}
        totalResistance={totalResistance}
        current={current}
        showR3={showR3}
        sumDrop={sumDrop}
      />
      {/* <VoltageDropInsightCard /> */}
    </>
  );
}
