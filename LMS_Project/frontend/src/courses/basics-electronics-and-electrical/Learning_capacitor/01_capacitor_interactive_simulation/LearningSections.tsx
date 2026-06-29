"use client";

import { KnowledgeSection } from "./KnowledgeSection";
import type { CapacitorSnapshot } from "./types";

type LearningSectionsProps = {
  supplyVoltage: number;
  computed: CapacitorSnapshot;
};

export function LearningSections({
  supplyVoltage,
  computed,
}: LearningSectionsProps) {
  return <KnowledgeSection supplyVoltage={supplyVoltage} computed={computed} />;
}
