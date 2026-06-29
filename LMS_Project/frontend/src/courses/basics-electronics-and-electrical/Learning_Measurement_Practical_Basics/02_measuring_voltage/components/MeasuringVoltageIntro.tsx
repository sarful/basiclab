"use client";

const OMEGA = "\u03a9";

export default function MeasuringVoltageIntro() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
        <span className="h-2 w-2 rounded-full bg-sky-500" />
        Measuring Voltage Simulation
      </div>
      <h2 className="mt-4 text-[1.8rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2rem]">
        Practice Safe Voltage Measurement
      </h2>
      <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 md:text-base">
        Use the digital multimeter trainer to practice selecting voltage
        ranges, keeping the black lead in COM, and using the red lead in the
        correct voltage jack before measuring across two test points.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">
            Voltage Rule
          </p>
          <p className="mt-2 text-[15px] leading-6 text-sky-950">
            Measure voltage across two points, not in series.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Black Lead
          </p>
          <p className="mt-2 text-[15px] leading-6 text-emerald-950">
            Keep the black lead in COM for voltage practice.
          </p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-700">
            Red Lead
          </p>
          <p className="mt-2 text-[15px] leading-6 text-orange-950">
            Use V{OMEGA}mA for DCV and ACV ranges. Do not use the 10A jack.
          </p>
        </div>
      </div>
    </>
  );
}
