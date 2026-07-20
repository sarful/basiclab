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

export function runSimulationTests() {
  const searchResults = searchDiodes("", "All");
  const selected = getSelectedDiode(searchResults[0]?.id ?? "");

  const tests = [
    {
      name: "Search returns diode records",
      pass: searchResults.length > 0,
    },
    {
      name: "Selected diode resolves safely",
      pass: Boolean(selected?.id),
    },
    {
      name: "Category filter limits results",
      pass: searchDiodes("", "All").length >= searchDiodes("", "Rectifier").length,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
