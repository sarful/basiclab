"use client";

import { comparisonRows } from "./data";

export function ComparisonTable() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
        ডায়োডের প্রকারভেদ: তুলনামূলক ছক
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="rounded-l-xl p-3">ডায়োড</th>
              <th className="p-3">প্রধান কাজ</th>
              <th className="p-3">সাধারণ অপারেশন</th>
              <th className="rounded-r-xl p-3">ব্যবহার</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row[0]} className="border-b border-slate-100 odd:bg-slate-50">
                {row.map((cell) => (
                  <td key={cell} className="p-3 font-semibold text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
