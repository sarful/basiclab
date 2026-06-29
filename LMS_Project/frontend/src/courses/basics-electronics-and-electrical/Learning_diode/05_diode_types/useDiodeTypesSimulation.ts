"use client";

import { useMemo, useState } from "react";

import { getDiodeCategories, getSelectedDiode, searchDiodes } from "./logic";

export function useDiodeTypesSimulation() {
  const [selectedId, setSelectedId] = useState("generic-diode");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => getDiodeCategories(), []);
  const filteredTypes = useMemo(() => searchDiodes(query, category), [query, category]);
  const selectedDiode = getSelectedDiode(selectedId);

  const reset = () => {
    setSelectedId("generic-diode");
    setQuery("");
    setCategory("All");
  };

  return {
    selectedId,
    setSelectedId,
    query,
    setQuery,
    category,
    setCategory,
    categories,
    filteredTypes,
    selectedDiode,
    reset,
  };
}
