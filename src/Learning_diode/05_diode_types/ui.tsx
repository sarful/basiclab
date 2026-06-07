"use client";

import type { DiodeType } from "./types";

export function IconBubble({
  icon,
  size = "normal",
}: {
  icon: string;
  size?: "normal" | "large";
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 ${
        size === "large"
          ? "h-12 w-12 text-2xl sm:h-14 sm:w-14 sm:text-3xl"
          : "h-10 w-10 text-xl sm:h-11 sm:w-11 sm:text-2xl"
      }`}
      aria-hidden="true"
    >
      {icon}
    </div>
  );
}

export function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function ExactDiodeSymbol({ diode }: { diode: DiodeType }) {
  const isPn = diode.id === "pn";
  const isZener = diode.id === "zener";
  const isLed = diode.id === "led";
  const isPhotodiode = diode.id === "photodiode";

  if (isPn || isZener || isLed || isPhotodiode) {
    return (
      <div className="w-full rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-slate-200 sm:px-4">
        <svg viewBox="0 0 320 130" className="h-[88px] w-full max-w-[320px] sm:h-[112px] sm:max-w-[360px]" role="img" aria-label={`${diode.name} symbol`}>
          <line x1="18" y1="68" x2="118" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
          <polygon points="118,35 118,101 190,68" fill="#0b74b8" />

          {(isPn || isLed || isPhotodiode) && (
            <line x1="194" y1="33" x2="194" y2="103" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
          )}

          {isZener && (
            <path
              d="M194 35 L194 53 L213 63 L194 73 L194 101"
              fill="none"
              stroke="#0b74b8"
              strokeWidth="8"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          )}

          <line x1="198" y1="68" x2="302" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />

          {isLed && (
            <>
              <line x1="142" y1="26" x2="177" y2="1" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
              <polygon points="177,1 166,6 172,-9" fill="#0b74b8" />
              <line x1="164" y1="36" x2="199" y2="11" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
              <polygon points="199,11 188,16 194,1" fill="#0b74b8" />
            </>
          )}

          {isPhotodiode && (
            <>
              <line x1="177" y1="1" x2="142" y2="26" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
              <polygon points="142,26 153,21 147,36" fill="#0b74b8" />
              <line x1="199" y1="11" x2="164" y2="36" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
              <polygon points="164,36 175,31 169,46" fill="#0b74b8" />
            </>
          )}

          <text x="72" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
            Anode
          </text>
          <text x="250" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
            Cathode
          </text>
        </svg>
        {diode.symbolNote && (
          <p className="mt-2 max-w-md text-xs font-semibold leading-5 text-slate-500">
            {diode.symbolNote}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
      <div className="font-mono text-base font-bold text-slate-800 sm:text-lg">{diode.symbol}</div>
      {diode.symbolNote && (
        <p className="mt-2 max-w-md text-xs font-semibold leading-5 text-slate-500">
          {diode.symbolNote}
        </p>
      )}
    </div>
  );
}
