import type { ReactNode } from "react";

type TerminalCardProps = {
  title: string;
  subtitle: string;
  active: boolean;
  children: ReactNode;
};

export default function TerminalCard({
  title,
  subtitle,
  active,
  children,
}: TerminalCardProps) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition ${
        active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.22em] ${
          active ? "text-blue-700" : "text-slate-500"
        }`}
      >
        {subtitle}
      </p>
      <h3 className="mt-2 text-xl font-black text-slate-900">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}
