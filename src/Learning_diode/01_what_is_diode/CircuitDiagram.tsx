"use client";

import { getLedState } from "./logic";
import { ElectronDot } from "./ElectronDot";
import { BatterySymbol, DiodeSymbol, JunctionDot, LedSymbol } from "./CircuitPieces";
import type { BiasMode } from "./types";

export function CircuitDiagram({ bias, voltage }: { bias: BiasMode; voltage: number }) {
  const led = getLedState(bias, voltage);
  const isActive = led.isConducting;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 330" className="h-[330px] w-full" role="img" aria-label="Diode LED circuit schematic">
        <path
          d="M90 119 V70 H300 M350 70 H640 V118"
          fill="none"
          stroke="#dc2626"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        <path
          d="M640 168 V255 H90 V191"
          fill="none"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        <BatterySymbol bias={bias} voltage={voltage} />
        <DiodeSymbol />
        <LedSymbol active={isActive} brightness={led.currentLevel} />

        <JunctionDot x={90} y={119} />
        <JunctionDot x={90} y={191} />
        <JunctionDot x={300} y={70} />
        <JunctionDot x={350} y={70} />
        <JunctionDot x={640} y={70} />
        <JunctionDot x={640} y={118} />
        <JunctionDot x={640} y={168} />
        <JunctionDot x={640} y={255} />
        <JunctionDot x={90} y={255} />

        {isActive &&
          [0, 1.2, 2.4, 3.6].map((delay) => (
            <ElectronDot key={delay} delay={delay} active={isActive} speed={led.currentLevel} />
          ))}

        {!isActive && (
          <g>
            <line x1="308" y1="39" x2="350" y2="101" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <line x1="350" y1="39" x2="308" y2="101" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
            <text x="375" y="132" fill="#dc2626" fontSize="18" fontWeight="800">
              BLOCKED
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
