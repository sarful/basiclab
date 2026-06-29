"use client";

export function ZenerSymbolSection() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-xl font-black">Symbol</h2>
      <svg
        viewBox="0 0 320 130"
        className="h-[90px] w-full sm:h-[110px]"
        role="img"
        aria-label="Zener diode symbol"
      >
        <line x1="18" y1="68" x2="118" y2="68" stroke="#7c3aed" strokeWidth="8" />
        <polygon points="118,35 118,101 190,68" fill="#7c3aed" />
        <path
          d="M194 35 L194 53 L213 63 L194 73 L194 101"
          stroke="#7c3aed"
          strokeWidth="8"
          fill="none"
        />
        <line x1="198" y1="68" x2="302" y2="68" stroke="#7c3aed" strokeWidth="8" />
        <text
          x="75"
          y="122"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          Anode
        </text>
        <text
          x="250"
          y="122"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#475569"
        >
          Cathode
        </text>
      </svg>
      <p className="mt-2 text-sm text-slate-600">
        Zener diode-à¦à¦° cathode side-à¦ à¦¬à¦¾à¦à¦•à¦¾à¦¨à§‹/angled line à¦¥à¦¾à¦•à§‡à¥¤
      </p>
    </section>
  );
}
