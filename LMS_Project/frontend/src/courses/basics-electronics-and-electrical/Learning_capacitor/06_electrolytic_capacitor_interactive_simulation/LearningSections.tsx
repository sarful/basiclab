import { ElectrolyticDefinitionCard } from "./ElectrolyticDefinitionCard";
import { ElectrolyticInsightCard } from "./ElectrolyticInsightCard";
import { PerformanceIndicatorsCard } from "./PerformanceIndicatorsCard";

type LearningSectionsProps = {
  smoothingLevel: number;
  safetyMargin: number;
  leakageRisk: number;
  heatLoss: number;
};

export function LearningSections({
  smoothingLevel,
  safetyMargin,
  leakageRisk,
  heatLoss,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PerformanceIndicatorsCard
        smoothingLevel={smoothingLevel}
        safetyMargin={safetyMargin}
        leakageRisk={leakageRisk}
        heatLoss={heatLoss}
      />
      <ElectrolyticDefinitionCard />
      <ElectrolyticInsightCard />
    </div>
  );
}
