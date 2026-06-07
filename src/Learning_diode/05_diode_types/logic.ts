import { comparisonRows, diodeTypes } from "./data";

export function searchDiodes(query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return diodeTypes;

  return diodeTypes.filter((diode) =>
    [diode.name, diode.bangla, diode.chip, diode.use, diode.working, diode.example].some((text) =>
      text.toLowerCase().includes(search),
    ),
  );
}

export function getSelectedDiode(selectedId: string) {
  return diodeTypes.find((diode) => diode.id === selectedId) ?? diodeTypes[0];
}

export function runSimulationTests() {
  const pnDiode = getSelectedDiode("pn");
  const zenerDiode = getSelectedDiode("zener");
  const ledDiode = getSelectedDiode("led");
  const photodiode = getSelectedDiode("photodiode");

  const tests = [
    { name: "Has diode type data", pass: diodeTypes.length >= 4 },
    { name: "PN Junction diode exists", pass: diodeTypes.some((diode) => diode.id === "pn") },
    { name: "Zener diode exists", pass: diodeTypes.some((diode) => diode.id === "zener") },
    { name: "LED diode exists", pass: diodeTypes.some((diode) => diode.id === "led") },
    { name: "Photodiode exists", pass: diodeTypes.some((diode) => diode.id === "photodiode") },
    { name: "Search finds LED", pass: searchDiodes("LED").some((diode) => diode.id === "led") },
    { name: "Search finds sensor related diode", pass: searchDiodes("sensor").some((diode) => diode.id === "photodiode") },
    { name: "Empty search returns all diodes", pass: searchDiodes("").length === diodeTypes.length },
    { name: "Unknown selected id falls back to first diode", pass: getSelectedDiode("unknown").id === diodeTypes[0].id },
    { name: "Comparison rows match diode count", pass: comparisonRows.length === diodeTypes.length },
    { name: "PN Junction has forward voltage", pass: pnDiode.forwardVoltage === "Silicon diode ≈ 0.7V" },
    { name: "PN Junction symbol matches general diode style", pass: pnDiode.symbol === "A ──▶|── K" },
    { name: "PN Junction symbol has cathode vertical bar", pass: pnDiode.symbol.includes("▶|") },
    { name: "PN Junction symbol note explains cathode", pass: Boolean(pnDiode.symbolNote?.toLowerCase().includes("cathode")) },
    { name: "PN Junction working explains depletion layer", pass: pnDiode.working.toLowerCase().includes("depletion") },
    { name: "Zener symbol uses angled cathode", pass: zenerDiode.symbol === "A ──▶⟍|⟋── K" },
    { name: "Zener has reverse voltage note", pass: Boolean(zenerDiode.forwardVoltage?.includes("Vz")) },
    {
      name: "Zener working explains reverse breakdown",
      pass:
        zenerDiode.working.toLowerCase().includes("reverse") &&
        zenerDiode.working.toLowerCase().includes("breakdown"),
    },
    { name: "PN and Zener use exact visual symbol renderer data", pass: ["pn", "zener"].every((id) => Boolean(getSelectedDiode(id).symbolNote)) },
    { name: "LED symbol has light arrows", pass: ledDiode.symbol.includes("⇗⇗") },
    { name: "LED has forward voltage range", pass: Boolean(ledDiode.forwardVoltage?.includes("1.8V")) },
    { name: "LED symbol note explains light emission arrows", pass: Boolean(ledDiode.symbolNote?.includes("arrow")) },
    { name: "Photodiode symbol has incoming light arrows", pass: photodiode.symbol.includes("⇙⇙") },
    { name: "Photodiode has reverse bias note", pass: Boolean(photodiode.forwardVoltage?.toLowerCase().includes("reverse")) },
    { name: "Photodiode working explains photocurrent", pass: photodiode.working.toLowerCase().includes("photocurrent") },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
