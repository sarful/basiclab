"use client";

import { FilterControl } from "./FilterControl";
import { Slider } from "./Slider";

export function FilterSettingsSection({
  filterEnabled,
  capacitorUf,
  onFilterEnabledChange,
  onCapacitorUfChange,
}: {
  filterEnabled: boolean;
  capacitorUf: number;
  onFilterEnabledChange: (value: boolean) => void;
  onCapacitorUfChange: (value: number) => void;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <FilterControl
        filterEnabled={filterEnabled}
        setFilterEnabled={onFilterEnabledChange}
      />
      <Slider
        label="Filter Capacitor"
        value={capacitorUf}
        min={10}
        max={4700}
        step={10}
        suffix=" uF"
        onChange={onCapacitorUfChange}
      />
    </section>
  );
}
