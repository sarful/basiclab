"use client";

export function ZenerWorkingPrincipleSection() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Working Principle</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
        Reverse bias-à¦ Cathode positive à¦à¦¬à¦‚ Anode negative à¦¥à¦¾à¦•à§‡à¥¤ Applied voltage à¦¯à¦–à¦¨ Zener voltage (Vz) à¦…à¦¤à¦¿à¦•à§à¦°à¦® à¦•à¦°à§‡, à¦¤à¦–à¦¨ diode breakdown region-à¦ à¦¯à¦¾à§Ÿ à¦à¦¬à¦‚ load-à¦à¦° voltage à¦ªà§à¦°à¦¾à§Ÿ constant à¦°à¦¾à¦–à§‡à¥¤
      </p>
      <div className="mt-4 rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-800">
        Current limiting resistor à¦›à¦¾à§œà¦¾ reverse breakdown safe à¦¨à§Ÿà¥¤
      </div>
    </section>
  );
}
