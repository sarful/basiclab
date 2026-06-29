"use client";

export default function BreadboardInfoCard({
  text,
  title,
}: {
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}
