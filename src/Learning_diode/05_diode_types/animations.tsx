"use client";

import { motion } from "framer-motion";

export function PnJunctionAnimation() {
  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-blue-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900">Forward Bias Visual Animation</h3>
          <p className="text-sm font-semibold text-slate-600">0.7V পার হলে current Anode থেকে Cathode দিকে flow করে।</p>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">Forward Voltage: ≈0.7V</span>
      </div>
      <svg viewBox="0 0 760 210" className="h-[190px] min-w-[660px] sm:h-[210px] sm:min-w-0 sm:w-full" role="img" aria-label="PN junction diode forward current animation">
        <rect x="35" y="35" width="690" height="135" rx="24" fill="#f8fafc" stroke="#dbeafe" strokeWidth="2" />
        <line x1="90" y1="105" x2="670" y2="105" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="90" cy="105" r="28" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <text x="90" y="112" textAnchor="middle" fontSize="25" fontWeight="900" fill="#dc2626">+</text>
        <text x="90" y="150" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>
        <circle cx="670" cy="105" r="28" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
        <text x="670" y="112" textAnchor="middle" fontSize="25" fontWeight="900" fill="#0284c7">−</text>
        <text x="670" y="150" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>
        <polygon points="345,65 345,145 425,105" fill="#2563eb" opacity="0.9" />
        <line x1="425" y1="65" x2="425" y2="145" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        <text x="385" y="178" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b">PN Junction Diode</text>
        <line x1="310" y1="50" x2="450" y2="50" stroke="#f97316" strokeWidth="3" strokeDasharray="7 7" />
        <text x="380" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ea580c">Depletion layer কমে যায়</text>
        {[0, 0.7, 1.4, 2.1].map((delay) => (
          <motion.circle
            key={delay}
            r="8"
            fill="#22c55e"
            stroke="white"
            strokeWidth="3"
            initial={{ cx: 125, cy: 105, opacity: 0 }}
            animate={{ cx: [125, 250, 345, 425, 545, 635], opacity: [0, 1, 1, 1, 1, 0] }}
            transition={{ duration: 2.8, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export function ZenerAnimation() {
  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-purple-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900">Reverse Breakdown Visual Animation</h3>
          <p className="text-sm font-semibold text-slate-600">Reverse bias-এ Cathode positive এবং Anode negative থাকে। Vz পার হলে reverse current Cathode থেকে Anode দিকে flow করে।</p>
        </div>
        <span className="rounded-full bg-purple-50 px-4 py-2 text-sm font-black text-purple-700">Voltage Regulation: Vout ≈ Vz</span>
      </div>
      <svg viewBox="0 0 760 260" className="h-[220px] min-w-[660px] sm:h-[260px] sm:min-w-0 sm:w-full" role="img" aria-label="Zener diode reverse breakdown voltage regulation animation">
        <circle cx="90" cy="125" r="28" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
        <text x="90" y="132" textAnchor="middle" fontSize="25" fontWeight="900" fill="#0284c7">−</text>
        <circle cx="670" cy="125" r="28" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <text x="670" y="132" textAnchor="middle" fontSize="25" fontWeight="900" fill="#dc2626">+</text>
        <text x="380" y="30" textAnchor="middle" fontSize="14" fontWeight="900" fill="#6d28d9">Reverse Bias Condition: Cathode (+), Anode (−)</text>
        <polygon points="345,85 345,165 420,125" fill="#7c3aed" opacity="0.95" />
        <path d="M425 85 L425 105 L447 116 L425 127 L425 165" fill="none" stroke="#1e293b" strokeWidth="8" />
        {[0, 0.8, 1.6, 2.4].map((delay) => (
          <motion.circle
            key={delay}
            r="8"
            fill="#a855f7"
            stroke="white"
            strokeWidth="3"
            initial={{ cx: 635, cy: 125, opacity: 0 }}
            animate={{ cx: [635, 545, 445, 425, 345, 250, 125], opacity: [0, 1, 1, 1, 1, 1, 0] }}
            transition={{ duration: 3, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export function LedAnimation() {
  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-yellow-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900">LED Light Emission Animation</h3>
          <p className="text-sm font-semibold text-slate-600">Forward bias দিলে conventional current Anode (+) থেকে Cathode (−) দিকে flow করে এবং LED আলো দেয়।</p>
        </div>
        <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-black text-yellow-700">LED Glowing</span>
      </div>
      <svg viewBox="0 0 760 260" className="h-[220px] min-w-[660px] sm:h-[260px] sm:min-w-0 sm:w-full" role="img" aria-label="LED forward current flow and light emission animation">
        <motion.circle
          cx="390"
          cy="128"
          r="58"
          fill="#facc15"
          opacity="0.2"
          animate={{ r: [48, 66, 48], opacity: [0.15, 0.38, 0.15] }}
          transition={{ duration: 1.25, repeat: Infinity }}
        />
        <polygon points="345,88 345,168 420,128" fill="#0b74b8" />
        <line x1="425" y1="88" x2="425" y2="168" stroke="#0b74b8" strokeWidth="8" />
        {[0, 0.55, 1.1, 1.65].map((delay) => (
          <motion.circle
            key={`led-current-${delay}`}
            r="7"
            fill="#22c55e"
            stroke="white"
            strokeWidth="3"
            initial={{ cx: 125, cy: 128, opacity: 0 }}
            animate={{ cx: [125, 250, 345, 420, 535, 635], opacity: [0, 1, 1, 1, 1, 0] }}
            transition={{ duration: 2.4, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export function PhotodiodeAnimation() {
  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-green-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900">Photodiode Light Detection Animation</h3>
          <p className="text-sm font-semibold text-slate-600">আলো diode junction-এর দিকে পড়লে reverse photocurrent তৈরি হয়।</p>
        </div>
        <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">Light Sensor</span>
      </div>
      <svg viewBox="0 0 760 260" className="h-[220px] min-w-[660px] sm:h-[260px] sm:min-w-0 sm:w-full" role="img" aria-label="Photodiode incoming light and photocurrent animation">
        <polygon points="345,88 345,168 420,128" fill="#0b74b8" />
        <line x1="425" y1="88" x2="425" y2="168" stroke="#0b74b8" strokeWidth="8" />
        {[0, 0.7, 1.4, 2.1].map((delay) => (
          <motion.circle
            key={`photo-current-${delay}`}
            r="7"
            fill="#22c55e"
            stroke="white"
            strokeWidth="3"
            initial={{ cx: 635, cy: 128, opacity: 0 }}
            animate={{ cx: [635, 540, 425, 345, 240, 125], opacity: [0, 1, 1, 1, 1, 0] }}
            transition={{ duration: 2.7, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}
