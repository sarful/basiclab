"use client";

export function LedSymbolSection() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-xl font-black">Symbol</h2>
      <svg viewBox="0 0 320 130" className="h-[90px] w-full sm:h-[110px]" role="img" aria-label="LED symbol">
        <line x1="18" y1="68" x2="118" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <polygon points="118,35 118,101 190,68" fill="#0b74b8" />
        <line x1="194" y1="33" x2="194" y2="103" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <line x1="198" y1="68" x2="302" y2="68" stroke="#0b74b8" strokeWidth="8" strokeLinecap="square" />
        <line x1="142" y1="26" x2="177" y2="1" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
        <polygon points="177,1 166,6 172,-9" fill="#0b74b8" />
        <line x1="164" y1="36" x2="199" y2="11" stroke="#0b74b8" strokeWidth="6" strokeLinecap="round" />
        <polygon points="199,11 188,16 194,1" fill="#0b74b8" />
        <text x="75" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>
        <text x="250" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>
      </svg>
      <p className="mt-2 text-sm text-slate-600">
        The LED symbol is like a normal diode symbol, but the outward arrows show light emission.
      </p>
    </section>
  );
}
