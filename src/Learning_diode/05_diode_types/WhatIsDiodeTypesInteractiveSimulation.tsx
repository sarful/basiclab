"use client";

import { useMemo, useState } from "react";

import { ComparisonTable } from "./ComparisonTable";
import { DetailPanel, TypeCard } from "./DetailPanel";
import { getSelectedDiode, searchDiodes } from "./logic";
import { SearchIcon } from "./ui";

export default function WhatIsDiodeTypesInteractiveSimulation() {
  const [selectedId, setSelectedId] = useState("pn");
  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);

  const filteredTypes = useMemo(() => searchDiodes(query), [query]);
  const selectedDiode = getSelectedDiode(selectedId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 p-3 text-slate-900 sm:p-5">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-blue-600">
                Electronics Learning
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                ডায়োডের প্রকারভেদ
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                বিভিন্ন ধরনের diode, তাদের symbol, কাজ, ব্যবহার এবং উদাহরণ সহজভাবে শেখার জন্য interactive app।
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm sm:p-5">
              <p className="text-sm font-bold text-slate-300">মনে রাখুন</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">
                Diode মূলত একদিকে current flow করতে সাহায্য করে।
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: LED, Zener, sensor..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-semibold outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowTable((value) => !value)}
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-slate-700 md:w-auto"
          >
            {showTable ? "Hide Comparison" : "Show Comparison"}
          </button>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {filteredTypes.map((diode) => (
            <TypeCard
              key={diode.id}
              diode={diode}
              selected={selectedDiode.id === diode.id}
              onClick={() => setSelectedId(diode.id)}
            />
          ))}
        </section>

        {filteredTypes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center font-bold text-slate-500">
            কোনো diode পাওয়া যায়নি। অন্য keyword দিয়ে search করুন।
          </div>
        )}

        <DetailPanel diode={selectedDiode} />

        {showTable && <ComparisonTable />}
      </div>
    </main>
  );
}
