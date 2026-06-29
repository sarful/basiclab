"use client";

export function RecommendationCard({
  statusMessage,
  recommendedLabel,
}: {
  statusMessage: string;
  recommendedLabel: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 text-sm">
      <p className="font-bold text-slate-800">{statusMessage}</p>
      <p className="mt-2 text-slate-700">
        Recommended: <b>{recommendedLabel}</b> or higher
      </p>
    </div>
  );
}
