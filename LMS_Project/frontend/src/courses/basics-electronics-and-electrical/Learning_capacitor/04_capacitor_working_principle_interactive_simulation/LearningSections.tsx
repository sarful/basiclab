import { CoreWorkingPrincipleCard } from "./CoreWorkingPrincipleCard";
import { WorkingBehaviorCard } from "./WorkingBehaviorCard";
import { WorkingPrincipleInsightCard } from "./WorkingPrincipleInsightCard";

type LearningSectionsProps = {
  capacitorVoltage: number;
  supplyVoltage: number;
  current: number;
  maxCurrent: number;
  storedEnergy: number;
  maxEnergy: number;
  capacitanceFarad: number;
};

export function LearningSections({
  capacitorVoltage,
  supplyVoltage,
  current,
  maxCurrent,
  storedEnergy,
  maxEnergy,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <WorkingBehaviorCard
        capacitorVoltage={capacitorVoltage}
        supplyVoltage={supplyVoltage}
        current={current}
        maxCurrent={maxCurrent}
        storedEnergy={storedEnergy}
        maxEnergy={maxEnergy}
      />
      <CoreWorkingPrincipleCard />
      <WorkingPrincipleInsightCard />
    </div>
  );
}
