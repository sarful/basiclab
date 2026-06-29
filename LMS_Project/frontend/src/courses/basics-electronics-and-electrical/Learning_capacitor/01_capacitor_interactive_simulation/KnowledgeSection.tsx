"use client";

import { CapacitorDefinitionCard } from "./CapacitorDefinitionCard";
import { CapacitorInsightCard } from "./CapacitorInsightCard";
import { ChargeDistributionCard } from "./ChargeDistributionCard";
import type { CapacitorSnapshot } from "./types";

export function KnowledgeSection({
  supplyVoltage,
  computed,
}: {
  supplyVoltage: number;
  computed: CapacitorSnapshot;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChargeDistributionCard
        chargeLevel={computed.chargeLevel}
        capacitorVoltage={computed.capacitorVoltage}
        supplyVoltage={supplyVoltage}
        current={computed.current}
        maxCurrent={Math.abs(computed.current) > 0 ? Math.abs(computed.current) : 0.001}
      />
      <CapacitorDefinitionCard />
      <CapacitorInsightCard />
    </div>
  );
}
