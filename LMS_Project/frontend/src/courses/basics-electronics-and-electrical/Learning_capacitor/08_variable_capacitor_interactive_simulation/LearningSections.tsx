import { TuningIndicatorsCard } from "./TuningIndicatorsCard";
import { VariableCapacitorDefinitionCard } from "./VariableCapacitorDefinitionCard";
import { VariableCapacitorInsightCard } from "./VariableCapacitorInsightCard";

type LearningSectionsProps = {
  overlapRatio: number;
  capacitance: number;
  minCapacitance: number;
  maxCapacitance: number;
  tuningPercent: number;
};

export function LearningSections({
  overlapRatio,
  capacitance,
  minCapacitance,
  maxCapacitance,
  tuningPercent,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <TuningIndicatorsCard
        overlapRatio={overlapRatio}
        capacitance={capacitance}
        minCapacitance={minCapacitance}
        maxCapacitance={maxCapacitance}
        tuningPercent={tuningPercent}
      />
      <VariableCapacitorDefinitionCard />
      <VariableCapacitorInsightCard />
    </div>
  );
}
