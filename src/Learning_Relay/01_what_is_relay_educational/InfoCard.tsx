import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  children: ReactNode;
  active?: boolean;
};

export default function InfoCard({
  title,
  children,
  active,
}: InfoCardProps) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${
        active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="text-xl font-black text-slate-900">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}
