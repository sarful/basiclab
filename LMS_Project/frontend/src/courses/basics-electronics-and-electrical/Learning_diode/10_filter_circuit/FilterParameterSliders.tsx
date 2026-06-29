"use client";

import { Slider } from "./Slider";

export function FilterParameterSliders({
  acVoltage,
  loadOhm,
  onAcVoltageChange,
  onLoadOhmChange,
}: {
  acVoltage: number;
  loadOhm: number;
  onAcVoltageChange: (value: number) => void;
  onLoadOhmChange: (value: number) => void;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Slider
        label="AC Voltage (RMS)"
        value={acVoltage}
        min={1}
        max={50}
        step={1}
        suffix=" V"
        onChange={onAcVoltageChange}
      />
      <Slider
        label="LED Load Equivalent"
        value={loadOhm}
        min={50}
        max={5000}
        step={50}
        suffix=" OHM"
        onChange={onLoadOhmChange}
      />
    </section>
  );
}
