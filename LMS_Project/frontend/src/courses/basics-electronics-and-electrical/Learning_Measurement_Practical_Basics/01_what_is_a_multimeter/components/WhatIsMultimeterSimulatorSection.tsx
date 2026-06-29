"use client";

import { DigitalMultimeterSimulator } from "../image_to_component_workspace";

export default function WhatIsMultimeterSimulatorSection() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
      <DigitalMultimeterSimulator />
    </section>
  );
}
