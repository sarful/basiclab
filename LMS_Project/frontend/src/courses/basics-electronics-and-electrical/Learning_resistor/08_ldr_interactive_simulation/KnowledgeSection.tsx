"use client";

import { LdrApplicationsCard } from "./LdrApplicationsCard";
import { LdrDefinitionCard } from "./LdrDefinitionCard";
import { LdrLiveLogicCard } from "./LdrLiveLogicCard";

export function KnowledgeSection({
  resistance,
  outputVoltage,
  current,
  voltage,
}: {
  resistance: number;
  outputVoltage: number;
  current: number;
  voltage: number;
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <LdrDefinitionCard />
        <LdrApplicationsCard />
      </div>

      <LdrLiveLogicCard
        resistance={resistance}
        outputVoltage={outputVoltage}
        current={current}
      />
    </>
  );
}
