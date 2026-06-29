"use client";

import { ThermistorApplicationsCard } from "./ThermistorApplicationsCard";
import { ThermistorDefinitionCard } from "./ThermistorDefinitionCard";
import { ThermistorLiveLogicCard } from "./ThermistorLiveLogicCard";
import type { ThermistorMode } from "./types";

export function KnowledgeSection({
  mode,
  resistance,
  voltage,
  current,
}: {
  mode: ThermistorMode;
  resistance: number;
  voltage: number;
  current: number;
}) {
  return (
    <>
      <div className="grid gap-6">
        <ThermistorDefinitionCard />

        <div className="grid gap-6 lg:grid-cols-2">
          <ThermistorApplicationsCard />

          <ThermistorLiveLogicCard
            mode={mode}
            resistance={resistance}
            voltage={voltage}
            current={current}
          />
        </div>
      </div>
    </>
  );
}
