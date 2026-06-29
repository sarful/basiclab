"use client";

export function GuideSection() {
  return (
    <section className="rounded-2xl border border-gray-500 bg-white/80 p-4 shadow-inner sm:p-5">
      <h2 className="mb-2 text-lg font-bold">Multimeter Setup Guide</h2>
      <div className="space-y-3 text-xs leading-relaxed text-gray-800 sm:text-sm">
        <div>
          <p className="font-semibold text-gray-900">Digital Multimeter Setup:</p>
          <ul className="ml-5 list-disc">
            <li>Rotate selector to <b>DIODE</b> mode</li>
            <li>Snap <b>Red probe -&gt; Anode</b></li>
            <li>Snap <b>Black probe -&gt; Cathode</b></li>
            <li>Read voltage drop or OL on display</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Analog Multimeter Setup:</p>
          <ul className="ml-5 list-disc">
            <li>Rotate selector to <b>OHM</b></li>
            <li>Snap probes across diode terminals</li>
            <li>Forward -&gt; needle moves</li>
            <li>Reverse -&gt; needle stays near OL</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Diagnosis Reference:</p>
          <ul className="ml-5 list-disc">
            <li>Forward bias -&gt; ~0.7V</li>
            <li>Reverse bias -&gt; OL</li>
            <li>Short diode -&gt; 0V / full needle</li>
            <li>Open diode -&gt; OL / no needle movement</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
