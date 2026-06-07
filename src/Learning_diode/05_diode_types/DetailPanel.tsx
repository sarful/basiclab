"use client";

import { motion } from "framer-motion";

import { LedAnimation, PhotodiodeAnimation, PnJunctionAnimation, ZenerAnimation } from "./animations";
import { ExactDiodeSymbol, IconBubble } from "./ui";
import type { DiodeType } from "./types";

export function TypeCard({
  diode,
  selected,
  onClick,
}: {
  diode: DiodeType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition sm:p-4 hover:-translate-y-1 hover:shadow-md ${diode.color} ${
        selected ? "ring-2 ring-slate-900 shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <IconBubble icon={diode.icon} />
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
          {diode.chip}
        </span>
      </div>
      <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">{diode.bangla}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">{diode.name}</p>
    </button>
  );
}

export function DetailPanel({ diode }: { diode: DiodeType }) {
  return (
    <motion.section
      key={diode.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-3xl border p-4 shadow-sm sm:p-6 ${diode.color}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <IconBubble icon={diode.icon} size="large" />
          <div>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{diode.bangla}</h2>
            <p className="font-semibold text-slate-600">{diode.name}</p>
          </div>
        </div>
        <ExactDiodeSymbol diode={diode} />
      </div>

      <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
          <h4 className="font-black text-slate-900">কাজ</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">{diode.working}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
          <h4 className="font-black text-slate-900">Forward Voltage</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {diode.forwardVoltage ?? "Type অনুযায়ী forward voltage আলাদা হতে পারে।"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
          <h4 className="font-black text-slate-900">ব্যবহার</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">{diode.use}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4 md:col-span-3">
          <h4 className="font-black text-slate-900">উদাহরণ</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">{diode.example}</p>
        </div>
      </div>

      {diode.id === "pn" && <PnJunctionAnimation />}
      {diode.id === "zener" && <ZenerAnimation />}
      {diode.id === "led" && <LedAnimation />}
      {diode.id === "photodiode" && <PhotodiodeAnimation />}
    </motion.section>
  );
}
