export const TRANSISTOR_LAYER_CARDS = [
  {
    title: "Emitter Layer",
    color: "#16a34a",
    doping: "Heavily Doped",
    description:
      "The emitter is heavily doped and supplies the charge carriers.",
  },
  {
    title: "Base Layer",
    color: "#facc15",
    doping: "Lightly Doped",
    description:
      "The base is very thin and lightly doped, so a small base current can control a much larger collector current.",
  },
  {
    title: "Collector Layer",
    color: "#2563eb",
    doping: "Moderately Doped",
    description:
      "The collector gathers the emitted carriers and carries the output current.",
  },
] as const;
