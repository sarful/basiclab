"use client";

import { useMemo, useState } from "react";

import { resistorTypes } from "./resistorTypeDefinitions";
import type {
  Category,
  ResistorLessonFourSimulationProps,
  ResistorTypeKey,
} from "./types";

export function useResistorTypesSimulation() {
  const [selectedKey, setSelectedKey] = useState<ResistorTypeKey>("metalFilm");
  const [controlValue, setControlValue] = useState(45);
  const [environmentValue, setEnvironmentValue] = useState(60);
  const [filter, setFilter] = useState<Category>("All");

  const selected =
    resistorTypes.find((item) => item.key === selectedKey) || resistorTypes[1];

  const filteredTypes = useMemo(() => {
    if (filter === "All") return resistorTypes;
    return resistorTypes.filter((item) => item.category === filter);
  }, [filter]);

  return {
    selectedKey,
    controlValue,
    environmentValue,
    filter,
    selected,
    filteredTypes,
    setSelectedKey,
    setControlValue,
    setEnvironmentValue,
    setFilter,
  };
}
