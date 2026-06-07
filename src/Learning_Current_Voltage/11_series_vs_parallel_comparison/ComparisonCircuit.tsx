"use client";

import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import type { FlowLevel } from "./types";

type ComparisonCircuitProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  seriesCurrent: number;
  seriesDropOne: number;
  seriesDropTwo: number;
  parallelCurrentOne: number;
  parallelCurrentTwo: number;
  parallelTotalCurrent: number;
  seriesFlowPercent: number;
  parallelFlowPercent: number;
  seriesFlowLevel: FlowLevel;
  parallelFlowLevel: FlowLevel;
};

export function ComparisonCircuit({
  voltage,
  resistanceOne,
  resistanceTwo,
  seriesCurrent,
  seriesDropOne,
  seriesDropTwo,
  parallelCurrentOne,
  parallelCurrentTwo,
  parallelTotalCurrent,
  seriesFlowPercent,
  parallelFlowPercent,
  seriesFlowLevel,
  parallelFlowLevel,
}: ComparisonCircuitProps) {
  const resistorWidth = 140;
  const resistorHeight = 78;

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-semibold text-slate-950">Series circuit</h3>
          <p className="mt-1 text-sm text-slate-600">One path, same current everywhere.</p>
        </div>

        <svg viewBox="0 0 560 250" className="h-[300px] w-full bg-white">
          <path d="M90 86H450" stroke="#dc2626" strokeWidth="2.2" fill="none" />
          <path d="M450 86V188H90V188" stroke="#334155" strokeWidth="2.2" fill="none" />
          <path d="M90 86V188" stroke="#dc2626" strokeWidth="2.2" fill="none" />

          <svg x="46" y="110" width="88" height="96" viewBox="0 0 88 96" overflow="visible">
            <BatterySymbol width={88} height={96} label="Series battery" />
          </svg>

          <svg x="180" y="48" width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
            <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Series R1" />
          </svg>
          <svg x="330" y="48" width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
            <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Series R2" />
          </svg>

          <text x="73" y="153" fontSize="13" fontWeight="700" fill="#dc2626">{voltage.toFixed(1)}V</text>
          <text x="250" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">R1 = {resistanceOne.toFixed(1)} Ohm</text>
          <text x="400" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">R2 = {resistanceTwo.toFixed(1)} Ohm</text>
          <text x="250" y="144" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">Drop = {seriesDropOne.toFixed(1)}V</text>
          <text x="400" y="144" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">Drop = {seriesDropTwo.toFixed(1)}V</text>
          <text x="330" y="214" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2563eb">I = {seriesCurrent.toFixed(2)} A</text>
          <text x="86" y="228" fontSize="12" fontWeight="700" fill="#2563eb">Flow: {Math.round(seriesFlowPercent)}%</text>
          <text x="204" y="228" fontSize="12" fontWeight="700" fill="#0f766e">Level: {seriesFlowLevel}</text>
        </svg>
      </article>

      <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-semibold text-slate-950">Parallel circuit</h3>
          <p className="mt-1 text-sm text-slate-600">Same voltage across both branches, current splits.</p>
        </div>

        <svg viewBox="0 0 560 250" className="h-[300px] w-full bg-white">
          <path d="M90 70H450" stroke="#dc2626" strokeWidth="2.2" fill="none" />
          <path d="M90 196H450" stroke="#334155" strokeWidth="2.2" fill="none" />
          <path d="M90 70V196" stroke="#dc2626" strokeWidth="2.2" fill="none" />
          <path d="M450 70V196" stroke="#334155" strokeWidth="2.2" fill="none" />

          <svg x="46" y="110" width="88" height="96" viewBox="0 0 88 96" overflow="visible">
            <BatterySymbol width={88} height={96} label="Parallel battery" />
          </svg>

          <path d="M220 70V102" stroke="#dc2626" strokeWidth="2.2" fill="none" />
          <path d="M220 148V196" stroke="#334155" strokeWidth="2.2" fill="none" />
          <path d="M360 70V102" stroke="#dc2626" strokeWidth="2.2" fill="none" />
          <path d="M360 148V196" stroke="#334155" strokeWidth="2.2" fill="none" />

          <svg x="150" y="86" width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
            <g transform={`translate(${resistorWidth / 2} ${resistorHeight / 2}) rotate(90) translate(${-resistorWidth / 2} ${-resistorHeight / 2})`}>
              <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Parallel R1" />
            </g>
          </svg>
          <svg x="290" y="86" width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
            <g transform={`translate(${resistorWidth / 2} ${resistorHeight / 2}) rotate(90) translate(${-resistorWidth / 2} ${-resistorHeight / 2})`}>
              <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Parallel R2" />
            </g>
          </svg>

          <text x="74" y="154" fontSize="13" fontWeight="700" fill="#dc2626">{voltage.toFixed(1)}V</text>
          <text x="238" y="84" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">R1 = {resistanceOne.toFixed(1)} Ohm</text>
          <text x="378" y="84" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">R2 = {resistanceTwo.toFixed(1)} Ohm</text>
          <text x="238" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">I1 = {parallelCurrentOne.toFixed(2)} A</text>
          <text x="378" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">I2 = {parallelCurrentTwo.toFixed(2)} A</text>
          <text x="350" y="214" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2563eb">Itotal = {parallelTotalCurrent.toFixed(2)} A</text>
          <text x="86" y="228" fontSize="12" fontWeight="700" fill="#2563eb">Flow: {Math.round(parallelFlowPercent)}%</text>
          <text x="204" y="228" fontSize="12" fontWeight="700" fill="#0f766e">Level: {parallelFlowLevel}</text>
        </svg>
      </article>
    </section>
  );
}
