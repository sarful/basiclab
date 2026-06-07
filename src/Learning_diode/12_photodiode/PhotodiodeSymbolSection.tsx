"use client";

export function PhotodiodeSymbolSection() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-xl font-black">Symbol</h2>
      <svg viewBox="0 0 320 130" className="h-[90px] w-full sm:h-[110px]" role="img" aria-label="Photodiode symbol">
        <line x1="18" y1="68" x2="118" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <polygon points="118,35 118,101 190,68" fill="#0b74b8" />
        <line x1="194" y1="33" x2="194" y2="103" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <line x1="198" y1="68" x2="302" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <line x1="177" y1="1" x2="142" y2="26" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
        <polygon points="142,26 153,21 147,36" fill="#0b74b8" />
        <line x1="199" y1="11" x2="164" y2="36" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
        <polygon points="164,36 175,31 169,46" fill="#0b74b8" />
        <text x="75" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>
        <text x="250" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>
      </svg>
      <p className="mt-2 text-sm text-slate-600">
        In the photodiode symbol, arrows point toward the diode because incoming light is being detected.
      </p>
    </section>
  );
}
