import { diodeCategories, diodeTypes } from "./data";

export function searchDiodes(query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return diodeTypes.filter((diode) => {
    const matchesCategory = category === "All" || diode.category === category;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        diode.name,
        diode.subtitle,
        diode.category,
        diode.keyFeature,
        diode.typicalUse,
        diode.packageStyle,
        diode.notes,
        ...diode.applications,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function getSelectedDiode(selectedId: string) {
  return diodeTypes.find((diode) => diode.id === selectedId) ?? diodeTypes[0];
}

export function getDiodeCategories() {
  return ["All", ...diodeCategories];
}
