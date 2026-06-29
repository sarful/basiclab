import EffectBar from "./EffectBar";

type LearningSectionsProps = {
  fluxLevel: number;
  turnsRatio: number;
  efficiency: number;
};

export default function LearningSections({
  fluxLevel,
  turnsRatio,
  efficiency,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">
          Transformer Indicators
        </h2>
        <div className="space-y-4">
          <EffectBar
            label="Magnetic Flux"
            value={fluxLevel}
            maxValue={1}
            color="#8b5cf6"
            note="AC magnetic field creates flux through the core."
          />
          <EffectBar
            label="Voltage Transfer"
            value={turnsRatio}
            maxValue={3}
            color="#2563eb"
            note="Voltage changes according to the turns ratio."
          />
          <EffectBar
            label="Efficiency"
            value={efficiency}
            maxValue={1}
            color="#16a34a"
            note="An ideal transformer is close to 100% efficient."
          />
          <EffectBar
            label="Energy Coupling"
            value={0.85 + fluxLevel * 0.1}
            maxValue={1}
            color="#f97316"
            note="Magnetic coupling transfers energy from primary to secondary."
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">What is Transformer?</h2>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Definition</p>
          <p className="mt-1">
            A transformer is a static electrical device that uses electromagnetic
            induction to increase or decrease AC voltage.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Working Principle</p>
          <p className="mt-1">
            AC current in the primary coil creates a changing magnetic field.
            That changing field induces voltage in the secondary coil.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Step-Up Transformer</p>
            <p className="mt-1">
              If the secondary has more turns, the output voltage becomes higher
              than the input voltage.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-semibold text-orange-700">Step-Down Transformer</p>
            <p className="mt-1">
              If the secondary has fewer turns, the output voltage decreases.
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Works Only with AC</p>
            <p className="mt-1">
              A transformer does not work with DC because it needs a changing
              magnetic field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
