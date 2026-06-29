"use client";

import { PowerRatingComparison } from "./PowerRatingComparison";

export function KnowledgeSection({
  power,
  rating,
  onRatingChange,
}: {
  power: number;
  rating: number;
  onRatingChange: (value: number) => void;
}) {
  return (
    <PowerRatingComparison
      power={power}
      rating={rating}
      onRatingChange={onRatingChange}
    />
  );
}
