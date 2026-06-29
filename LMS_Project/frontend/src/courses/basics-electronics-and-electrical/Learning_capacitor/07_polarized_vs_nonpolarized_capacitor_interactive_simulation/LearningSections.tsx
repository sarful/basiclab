import { CapacitorComparisonCard } from "./CapacitorComparisonCard";
import { CapacitorComparisonInsightCard } from "./CapacitorComparisonInsightCard";
import { CapacitorUseCasesCard } from "./CapacitorUseCasesCard";

export function LearningSections() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <CapacitorComparisonCard />
      <CapacitorUseCasesCard />
      <CapacitorComparisonInsightCard />
    </div>
  );
}
