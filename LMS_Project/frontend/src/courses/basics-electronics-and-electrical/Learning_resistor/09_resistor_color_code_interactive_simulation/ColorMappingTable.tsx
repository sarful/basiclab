"use client";

import { digitColors, multiplierColors } from "./logic";

export function ColorMappingTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Color to Number Mapping Table</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-700">
              <th className="p-3">Color</th>
              <th className="p-3">Digit</th>
              <th className="p-3">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {digitColors.map((color) => {
              const multItem = multiplierColors.find((item) => item.name === color.name);
              return (
                <tr key={color.name} className="border-t transition hover:bg-blue-50">
                  <td className="p-3 font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-5 w-5 rounded-full border border-slate-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </span>
                  </td>
                  <td className="p-3">{color.value}</td>
                  <td className="p-3">{multItem ? `x${multItem.multiplier}` : "-"}</td>
                </tr>
              );
            })}
            <tr className="border-t transition hover:bg-blue-50">
              <td className="p-3 font-semibold">
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full border border-slate-300 bg-[#d4af37]" />
                  Gold
                </span>
              </td>
              <td className="p-3">-</td>
              <td className="p-3">x0.1</td>
            </tr>
            <tr className="border-t transition hover:bg-blue-50">
              <td className="p-3 font-semibold">
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full border border-slate-300 bg-[#c0c0c0]" />
                  Silver
                </span>
              </td>
              <td className="p-3">-</td>
              <td className="p-3">x0.01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
