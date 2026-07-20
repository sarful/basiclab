"use client";

import React from "react";

import type { ValidationFeedback } from "../simulatorOneChallenges";

function StatusCard({
  action,
  detail,
  title,
  tone,
}: {
  action?: React.ReactNode;
  detail: string;
  title: string;
  tone: "error" | "info" | "success" | "warning";
}) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  } as const;

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <h3 className="text-sm font-bold uppercase tracking-[0.16em]">{title}</h3>
      <p className="mt-2 text-sm leading-6">{detail}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export default function BreadboardTaskPanel({
  allTasksComplete,
  autoAdvanceLabel,
  canContinue,
  feedback,
  mobileOpen,
  onContinue,
  onToggleMobile,
  scoreLabel,
  taskTitle,
}: {
  allTasksComplete: boolean;
  autoAdvanceLabel: string | null;
  canContinue: boolean;
  feedback: ValidationFeedback;
  mobileOpen: boolean;
  onContinue: () => void;
  onToggleMobile: () => void;
  scoreLabel: string;
  taskTitle: string;
}) {
  const continueButton = canContinue ? (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onContinue}
        className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
      >
        {allTasksComplete ? "View summary" : "Continue"}
      </button>
      {autoAdvanceLabel ? <span className="text-xs font-semibold">{autoAdvanceLabel}</span> : null}
    </div>
  ) : null;

  if (feedback.title === "Ready to practice" && feedback.tone === "info" && !canContinue) {
    return null;
  }

  const panelContent = (
    <aside className="grid gap-4">
      <StatusCard title={feedback.title} detail={feedback.detail} tone={feedback.tone} action={continueButton} />
    </aside>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={onToggleMobile}
          className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left shadow-sm"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Task panel</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {allTasksComplete ? "All tasks complete" : taskTitle}
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {scoreLabel}
          </div>
        </button>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/30" onClick={onToggleMobile}>
            <div
              className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-auto rounded-t-[28px] border border-slate-200 bg-slate-100 p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300" />
              {panelContent}
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block">{panelContent}</div>
    </>
  );
}
