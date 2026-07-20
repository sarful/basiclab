"use client";

export default function BreadboardInfoCard({
  compact = false,
  text,
  title,
}: {
  compact?: boolean;
  text: string;
  title: string;
}) {
  return (
    <div className={`rounded-xl border bg-slate-50 ${compact ? "p-3" : "p-4"}`}>
      <h3 className={`${compact ? "text-base" : "text-lg"} font-bold`}>{title}</h3>
      <p className={`${compact ? "mt-1 line-clamp-3 text-xs" : "text-sm"} text-slate-600`}>{text}</p>
    </div>
  );
}
