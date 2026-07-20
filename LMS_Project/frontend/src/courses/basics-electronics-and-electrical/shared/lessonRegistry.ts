export type SharedLessonMeta = {
  id: number;
  serial?: number;
  title: string;
  href: string;
};

export type LessonTrackId =
  | "current-voltage"
  | "measurement-practical"
  | "resistor"
  | "capacitor"
  | "diode"
  | "transformer"
  | "fuse"
  | "magnetic-contactor"
  | "optocoupler"
  | "pushbutton"
  | "relay"
  | "transistor"
  | "voltage-regulator";

type LessonTrackConfig = {
  label: string;
  routeBase: string;
  lessons: SharedLessonMeta[];
  summary: string;
};

export const lessonRegistry: Record<LessonTrackId, LessonTrackConfig> = {
  "current-voltage": {
    label: "Current & Voltage Course",
    routeBase: "/current-voltage-learning",
    summary: "Move step by step through the course and keep track of where you are.",
    lessons: [
      { id: 1, title: "What is Electricity", href: "/current-voltage-learning/1" },
      { id: 2, title: "What is Current", href: "/current-voltage-learning/2" },
      { id: 3, title: "What is Voltage", href: "/current-voltage-learning/3" },
      { id: 4, title: "What is Resistance", href: "/current-voltage-learning/4" },
      { id: 5, title: "Ohm's Law Basics", href: "/current-voltage-learning/5" },
      { id: 6, title: "Power in a Circuit", href: "/current-voltage-learning/6" },
      { id: 7, title: "Open vs Closed Circuit", href: "/current-voltage-learning/7" },
      { id: 8, title: "Short Circuit Basics", href: "/current-voltage-learning/8" },
      { id: 9, title: "Series Circuit Basics", href: "/current-voltage-learning/9" },
      { id: 10, title: "Parallel Circuit Basics", href: "/current-voltage-learning/10" },
      { id: 11, title: "Series vs Parallel Comparison", href: "/current-voltage-learning/11" },
      { id: 12, title: "Electron Flow", href: "/current-voltage-learning/12" },
      { id: 13, title: "AC vs DC Basics", href: "/current-voltage-learning/13" },
      { id: 14, title: "Types of Current", href: "/current-voltage-learning/14" },
      { id: 15, title: "Types of Voltage", href: "/current-voltage-learning/15" },
      { id: 16, title: "Voltage vs Current Comparison", href: "/current-voltage-learning/16" },
    ],
  },
  "measurement-practical": {
    label: "Measurement & Practical Basics",
    routeBase: "/measurement-practical-basics",
    summary: "Move step by step through the practical measurement course and keep track of where you are.",
    lessons: [
      { id: 1, title: "What is a Multimeter", href: "/measurement-practical-basics/1" },
      { id: 2, title: "Measuring Voltage", href: "/measurement-practical-basics/2" },
      { id: 3, title: "Measuring Current", href: "/measurement-practical-basics/3" },
      { id: 4, title: "Measuring Resistance", href: "/measurement-practical-basics/4" },
      { id: 5, title: "Continuity Test", href: "/measurement-practical-basics/5" },
      { id: 6, title: "Breadboard Basics", href: "/measurement-practical-basics/6" },
      { id: 7, title: "Wire, Jumper, and Terminal Basics", href: "/measurement-practical-basics/7" },
      { id: 8, title: "Basic Circuit Safety", href: "/measurement-practical-basics/8" },
      { id: 9, title: "AC Voltage Socket", href: "/measurement-practical-basics/9" },
    ],
  },
  resistor: {
    label: "Resistor Learning",
    routeBase: "/resistor-learning",
    summary: "Move through the resistor course in order and keep the current lesson, previous lesson, and next lesson easy to reach.",
    lessons: [
      { id: 1, title: "What is Resistance", href: "/resistor-learning/1" },
      { id: 2, title: "What is Resistor", href: "/resistor-learning/2" },
      { id: 3, title: "Resistor Structure", href: "/resistor-learning/3" },
      { id: 4, title: "Resistor Types", href: "/resistor-learning/4" },
      { id: 5, title: "Fixed Resistor", href: "/resistor-learning/5" },
      { id: 6, title: "Potentiometer", href: "/resistor-learning/6" },
      { id: 7, title: "Thermistor", href: "/resistor-learning/7" },
      { id: 8, title: "LDR", href: "/resistor-learning/8" },
      { id: 9, title: "Resistor Color Code", href: "/resistor-learning/9" },
      { id: 10, title: "Resistor Power Rating", href: "/resistor-learning/10" },
      { id: 11, title: "Ohm's Law", href: "/resistor-learning/11" },
      { id: 12, title: "Series Resistor Circuit", href: "/resistor-learning/12" },
      { id: 13, title: "Parallel Resistor Circuit", href: "/resistor-learning/13" },
      { id: 14, title: "Voltage Drop", href: "/resistor-learning/14" },
    ],
  },
  capacitor: {
    label: "Capacitor Learning",
    routeBase: "/capacitor-learning",
    summary: "Move through the capacitor course in order and keep each lesson easy to reach while you study the chapter.",
    lessons: [
      { id: 1, title: "Capacitor", href: "/capacitor-learning/1" },
      { id: 2, title: "Capacitance", href: "/capacitor-learning/2" },
      { id: 3, title: "Capacitor Structure", href: "/capacitor-learning/3" },
      { id: 4, title: "Capacitor Working Principle", href: "/capacitor-learning/4" },
      { id: 5, title: "Ceramic Capacitor", href: "/capacitor-learning/5" },
      { id: 6, title: "Electrolytic Capacitor", href: "/capacitor-learning/6" },
      { id: 7, title: "Polarized vs Nonpolarized Capacitor", href: "/capacitor-learning/7" },
      { id: 8, title: "Variable Capacitor", href: "/capacitor-learning/8" },
      { id: 9, title: "Capacitor Charging", href: "/capacitor-learning/9" },
      { id: 10, title: "Capacitor Discharging", href: "/capacitor-learning/10" },
      { id: 11, title: "RC Time Constant", href: "/capacitor-learning/11" },
      { id: 12, title: "Capacitor in Filter Circuit", href: "/capacitor-learning/12" },
      { id: 13, title: "Capacitor in Timing Circuit", href: "/capacitor-learning/13" },
    ],
  },
  diode: {
    label: "Diode Learning",
    routeBase: "/diode-learning",
    summary: "Move through the diode course in order and keep the current lesson, previous lesson, and next lesson easy to reach.",
    lessons: [
      { id: 1, title: "What is Diode", href: "/diode-learning/1" },
      { id: 2, title: "Diode Construction", href: "/diode-learning/2" },
      { id: 3, title: "Working Principle", href: "/diode-learning/3" },
      { id: 4, title: "Diode Characteristics", href: "/diode-learning/4" },
      { id: 5, title: "Diode Types", href: "/diode-learning/5" },
      { id: 6, title: "Diode Testing", href: "/diode-learning/6" },
      { id: 7, title: "Half-Wave Rectifier", href: "/diode-learning/7" },
      { id: 8, title: "Center-Tap Full-Wave Rectifier", href: "/diode-learning/8" },
      { id: 9, title: "Bridge Rectifier", href: "/diode-learning/9" },
      { id: 10, title: "Filter Circuit", href: "/diode-learning/10" },
      { id: 11, title: "LED", href: "/diode-learning/11" },
      { id: 12, title: "Photodiode", href: "/diode-learning/12" },
      { id: 13, title: "Zener Diode", href: "/diode-learning/13" },
      { id: 14, title: "Clipper Circuit", href: "/diode-learning/14" },
      { id: 15, title: "Clamper Circuit", href: "/diode-learning/15" },
      { id: 16, title: "Flyback Diode Protection Diode", href: "/diode-learning/16" },
    ],
  },
  transformer: {
    label: "Transformer Learning",
    routeBase: "/transformer-learning",
    summary: "Move through the transformer lessons in order and keep every concept connected to the same course nav.",
    lessons: [
      { id: 1, title: "What is a Transformer", href: "/transformer-learning/1" },
      { id: 2, title: "Transformer Working Principle", href: "/transformer-learning/2" },
      { id: 3, title: "Center-Tap Transformer", href: "/transformer-learning/3" },
    ],
  },
  fuse: {
    label: "Fuse Learning",
    routeBase: "/fuse-learning",
    summary: "Move through the fuse lessons in order while keeping the current protection lesson easy to revisit.",
    lessons: [
      { id: 1, title: "Fuse Overvoltage Protection Simulation", href: "/fuse-learning/1" },
      { id: 2, title: "Fuse Basics", href: "/fuse-learning/2" },
      { id: 3, title: "Fuse in Overcurrent Protection", href: "/fuse-learning/3" },
    ],
  },
  "magnetic-contactor": {
    label: "Magnetic Contactor Learning",
    routeBase: "/magnetic-contactor-learning",
    summary: "Move through the magnetic contactor lessons in order and keep anatomy, construction, operation, and wiring views connected to one shared nav.",
    lessons: [
      { id: 1, serial: 1, title: "Anatomy Components", href: "/magnetic-contactor-learning/1" },
      { id: 2, serial: 2, title: "Magnetic Contactor Operation Diagram", href: "/magnetic-contactor-learning/4" },
      { id: 3, serial: 3, title: "Magnetic Contactor Internal Operation", href: "/magnetic-contactor-learning/internal-operation" },
      { id: 4, serial: 4, title: "Operation Diagram With Motor", href: "/magnetic-contactor-learning/operation-diagram-with-motor" },
      { id: 5, serial: 5, title: "DOL Starter Project", href: "/magnetic-contactor-learning/dol-project" },
      { id: 6, serial: 5, title: "Star Delta Control Diagram", href: "/magnetic-contactor-learning/star-delta-control-diagram" },
      { id: 7, serial: 6, title: "Reverse Forward Project", href: "/magnetic-contactor-learning/reverse-forward-project" },
    ],
  },
  optocoupler: {
    label: "Optocoupler Learning",
    routeBase: "/optocoupler-learning",
    summary: "Move through the optocoupler lessons in order and keep isolation examples connected to one shared nav.",
    lessons: [
      { id: 1, title: "What Is Optocoupler", href: "/optocoupler-learning/1" },
      { id: 2, title: "Optocoupler Pins", href: "/optocoupler-learning/2" },
      { id: 3, title: "Photodiode", href: "/optocoupler-learning/3" },
      { id: 4, title: "Phototransistor", href: "/optocoupler-learning/4" },
      { id: 5, title: "PhotoTRIAC", href: "/optocoupler-learning/5" },
      { id: 6, title: "Optotransistor DC Switch", href: "/optocoupler-learning/6" },
      { id: 7, title: "AC Photo-Triac Switching", href: "/optocoupler-learning/7" },
    ],
  },
  pushbutton: {
    label: "Pushbutton Learning",
    routeBase: "/pushbutton-learning",
    summary: "Move through the pushbutton lessons in order while keeping the next practical control lesson easy to open.",
    lessons: [
      { id: 1, title: "LED Pushbutton Switch Circuit", href: "/pushbutton-learning/1" },
      { id: 2, title: "Pushbutton Basics", href: "/pushbutton-learning/2" },
    ],
  },
  relay: {
    label: "Relay Learning",
    routeBase: "/relay-learning",
    summary: "Move through the relay lessons in order and keep the current control example easy to reach.",
    lessons: [
      { id: 1, title: "Basic Parts of a Relay", href: "/relay-learning/1" },
      { id: 2, title: "Relay Working Principle", href: "/relay-learning/2" },
      { id: 3, title: "Relay Coil Only", href: "/relay-learning/3" },
      { id: 4, title: "Relay Coil with SPST NC", href: "/relay-learning/4" },
      { id: 5, title: "Relay Coil with SPST NO", href: "/relay-learning/5" },
      { id: 6, title: "Relay SPDT", href: "/relay-learning/6" },
      { id: 7, title: "Relay DPDT", href: "/relay-learning/7" },
      { id: 8, title: "SSR40DA Relay", href: "/relay-learning/8" },
      { id: 9, title: "SSR Internals Circuit", href: "/relay-learning/9" },
      { id: 10, title: "DC to DC SSR Circuit", href: "/relay-learning/10" },
      { id: 11, title: "AC to AC SSR Circuit", href: "/relay-learning/11" },
    ],
  },
  transistor: {
    label: "Transistor Learning",
    routeBase: "/transistor-learning",
    summary: "Move through the transistor lessons in order and keep the full transistor roadmap under one shared nav.",
    lessons: [
      { id: 1, title: "What is a Transistor", href: "/transistor-learning/1" },
      { id: 2, title: "Transistor Structure", href: "/transistor-learning/2" },
      { id: 3, title: "Emitter, Base, Collector", href: "/transistor-learning/3" },
      { id: 4, title: "Transistor Types", href: "/transistor-learning/4" },
      { id: 5, title: "NPN Transistor Working", href: "/transistor-learning/5" },
      { id: 6, title: "PNP Transistor Working", href: "/transistor-learning/6" },
      { id: 7, title: "Transistor Driving Relay", href: "/transistor-learning/7" },
      { id: 8, title: "MOSFET Basics", href: "/transistor-learning/8" },
      { id: 9, title: "Enhancement MOSFET Working", href: "/transistor-learning/9" },
      { id: 10, title: "Depletion MOSFET Working", href: "/transistor-learning/10" },
      { id: 12, title: "MOSFET Types Simulator", href: "/transistor-learning/12" },
      { id: 13, title: "MOSFET N Channel Switch Circuit", href: "/transistor-learning/13" },
      { id: 14, title: "MOSFET P Channel Switch Circuit", href: "/transistor-learning/14" },
      { id: 15, title: "JFET Basics", href: "/transistor-learning/15" },
      { id: 16, title: "JFET vs MOSFET Difference Simulator", href: "/transistor-learning/16" },
    ],
  },
  "voltage-regulator": {
    label: "Voltage Regulator Learning",
    routeBase: "/voltage-regulator-learning",
    summary: "Move through the regulator lessons in order and keep theory, examples, and next lessons under one nav.",
    lessons: [
      { id: 1, title: "What is Voltage Regulator", href: "/voltage-regulator-learning/1" },
      { id: 2, title: "Linear Regulator Working", href: "/voltage-regulator-learning/2" },
      { id: 3, title: "Voltage Regulator Circuit Physical SVG", href: "/voltage-regulator-learning/3" },
      { id: 4, title: "Linear Voltage Regulator Circuit", href: "/voltage-regulator-learning/4" },
      { id: 5, title: "Adjustable Regulator LM317 Circuit", href: "/voltage-regulator-learning/5" },
    ],
  },
};

export function getLessonsForTrack(track: LessonTrackId) {
  return lessonRegistry[track].lessons;
}

export function getLessonTrackConfig(track: LessonTrackId) {
  return lessonRegistry[track];
}

export function getAllLessons() {
  return (Object.entries(lessonRegistry) as [LessonTrackId, LessonTrackConfig][])
    .flatMap(([trackId, config]) =>
      config.lessons.map((lesson) => ({
        ...lesson,
        trackId,
        trackLabel: config.label,
      })),
    );
}

export function getLessonTrackFromPathname(pathname: string): LessonTrackId | null {
  const match = (Object.entries(lessonRegistry) as [LessonTrackId, LessonTrackConfig][])
    .find(([, config]) => pathname.startsWith(config.routeBase + "/"));

  return match?.[0] ?? null;
}

export function findLessonByPathname(pathname: string) {
  return getAllLessons().find((lesson) => lesson.href === pathname) ?? null;
}
