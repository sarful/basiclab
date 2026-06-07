import { ConstructionBar } from "./ConstructionBar";
import type { DielectricOption } from "./types";

type LearningSectionsProps = {
  plateArea: number;
  plateDistance: number;
  dielectric: DielectricOption;
  relativeEffect: number;
};

export function LearningSections({
  plateArea,
  plateDistance,
  dielectric,
  relativeEffect,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Construction Effect</h2>
        <div className="space-y-4">
          <ConstructionBar
            label="Plate Area Effect"
            value={plateArea}
            maxValue={90}
            color="#2563eb"
            note="More area increases capacitance."
          />
          <ConstructionBar
            label="Dielectric Effect"
            value={dielectric.k}
            maxValue={10}
            color="#8b5cf6"
            note="A higher dielectric constant increases capacitance."
          />
          <ConstructionBar
            label="Distance Penalty"
            value={20 - plateDistance}
            maxValue={18}
            color="#16a34a"
            note="Smaller spacing gives higher capacitance."
          />
          <ConstructionBar
            label="Overall Capacitance Effect"
            value={relativeEffect}
            maxValue={1}
            color="#f97316"
            note="Combined effect from area, spacing, and dielectric."
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Main Parts of a Capacitor</h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">1. Conductive Plates</p>
          <p className="mt-1">
            Two metal plates connect to the terminals. One gathers negative charge and the other becomes positive.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">2. Dielectric Material</p>
          <p className="mt-1">
            The insulating layer between the plates prevents a short and increases capacitance.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">Area increases capacitance</p>
            <p className="mt-1">
              Bigger plates provide more effective field surface, so capacitance rises.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">Distance reduces capacitance</p>
            <p className="mt-1">
              When the plates are farther apart, field coupling weakens and capacitance falls.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Dielectric prevents short</p>
            <p className="mt-1">
              Because the dielectric is an insulator, direct current cannot pass straight between the plates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
