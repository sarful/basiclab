"use client";

import { motion } from "framer-motion";

type RatingItem = {
  label: string;
  value: number;
  colorClass: string;
};

type InternalPart = {
  icon: string;
  title: string;
  explanation: string;
  importance: string;
  colorClass: string;
};

type FailureMode = {
  title: string;
  cause: string;
  effect: string;
  prevention: string;
};

type MaterialProfile = {
  behavior: string[];
  temperatureBehavior: string;
  ratings: RatingItem[];
  selectedSummary: string;
  applications: string[];
};

function normalizeMaterialKey(materialLabel: string) {
  const label = materialLabel.toLowerCase();

  if (label.includes("carbon")) return "carbon";
  if (label.includes("wire")) return "wire-wound";
  if (label.includes("metal")) return "metal-film";

  return "general";
}

function getMaterialProfile(
  materialLabel: string,
  materialNote: string,
): MaterialProfile {
  const key = normalizeMaterialKey(materialLabel);

  if (key === "carbon") {
    return {
      behavior: [
        "Moderate precision",
        "Higher noise",
        "Larger tolerance drift",
        "Traditional design",
      ],
      temperatureBehavior:
        "Carbon composition resistors can change value more noticeably when temperature rises.",
      ratings: [
        { label: "Stability", value: 42, colorClass: "bg-yellow-500" },
        { label: "Noise", value: 35, colorClass: "bg-red-500" },
        { label: "Precision", value: 38, colorClass: "bg-orange-500" },
        { label: "Power Handling", value: 58, colorClass: "bg-blue-500" },
      ],
      selectedSummary: materialNote,
      applications: ["Vintage electronics", "General purpose circuits"],
    };
  }

  if (key === "wire-wound") {
    return {
      behavior: [
        "High power handling",
        "Excellent heat tolerance",
        "Low resistance applications",
        "Inductive characteristics possible",
      ],
      temperatureBehavior:
        "Wire wound resistors handle heat well because the resistive wire is supported by a heat-resistant ceramic core.",
      ratings: [
        { label: "Stability", value: 78, colorClass: "bg-blue-500" },
        { label: "Noise", value: 72, colorClass: "bg-purple-500" },
        { label: "Precision", value: 72, colorClass: "bg-green-500" },
        { label: "Power Handling", value: 94, colorClass: "bg-orange-500" },
      ],
      selectedSummary: materialNote,
      applications: [
        "Power supplies",
        "Motor circuits",
        "Industrial electronics",
      ],
    };
  }

  if (key === "metal-film") {
    return {
      behavior: [
        "High precision",
        "Low noise",
        "Excellent stability",
        "Common modern resistor",
      ],
      temperatureBehavior:
        "Metal film resistors remain stable across normal temperature changes, making them useful in accurate circuits.",
      ratings: [
        { label: "Stability", value: 92, colorClass: "bg-blue-500" },
        { label: "Noise", value: 90, colorClass: "bg-purple-500" },
        { label: "Precision", value: 94, colorClass: "bg-green-500" },
        { label: "Power Handling", value: 62, colorClass: "bg-orange-500" },
      ],
      selectedSummary: materialNote,
      applications: [
        "Precision circuits",
        "Measurement equipment",
        "Audio circuits",
      ],
    };
  }

  return {
    behavior: [
      "Current-limiting material",
      "Heat is produced during operation",
      "Value depends on construction",
      "Material choice affects stability",
    ],
    temperatureBehavior:
      "Different resistor materials respond differently when temperature changes.",
    ratings: [
      { label: "Stability", value: 60, colorClass: "bg-blue-500" },
      { label: "Noise", value: 60, colorClass: "bg-purple-500" },
      { label: "Precision", value: 60, colorClass: "bg-green-500" },
      { label: "Power Handling", value: 60, colorClass: "bg-orange-500" },
    ],
    selectedSummary: materialNote,
    applications: ["General learning circuits", "Basic current limiting"],
  };
}

function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-xl ${className}`}
    >
      <div className="mb-4">
        <h2 className="font-bold text-slate-900">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function RatingBar({ item }: { item: RatingItem }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600">{item.label}</p>
        <p className="text-xs font-bold text-slate-800">{item.value}%</p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className={`h-2.5 rounded-full ${item.colorClass}`}
          initial={false}
          animate={{ width: `${item.value}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}

function FlowStep({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm">
          {icon}
        </span>
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniResistanceDiagram() {
  return (
    <svg viewBox="0 0 420 170" className="h-auto w-full">
      <rect x="20" y="18" width="380" height="134" rx="24" fill="#f8fafc" />
      <text
        x="210"
        y="42"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="16"
        fontWeight="900"
      >
        R = ρL / A
      </text>

      <path
        d="M70 86 H120 L138 64 L156 108 L174 64 L192 108 L210 64 L228 108 L246 64 L264 108 L282 64 L300 86 H350"
        fill="none"
        stroke="#2563eb"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="72"
        y1="126"
        x2="348"
        y2="126"
        stroke="#f97316"
        strokeWidth="3"
      />
      <path d="M72 126 l10 -6 v12 Z" fill="#f97316" />
      <path d="M348 126 l-10 -6 v12 Z" fill="#f97316" />
      <text
        x="210"
        y="145"
        textAnchor="middle"
        fill="#ea580c"
        fontSize="12"
        fontWeight="800"
      >
        Longer path length L increases resistance
      </text>

      <circle
        cx="354"
        cy="86"
        r="14"
        fill="#dcfce7"
        stroke="#16a34a"
        strokeWidth="3"
      />
      <text
        x="354"
        y="91"
        textAnchor="middle"
        fill="#166534"
        fontSize="12"
        fontWeight="900"
      >
        A
      </text>
    </svg>
  );
}

function CurrentFlowDiagram() {
  const steps = [
    { x: 38, label: "Lead", color: "#0ea5e9" },
    { x: 134, label: "Element", color: "#f97316" },
    { x: 248, label: "Heat", color: "#ef4444" },
    { x: 346, label: "Exit", color: "#22c55e" },
  ];

  return (
    <svg viewBox="0 0 420 150" className="h-auto w-full">
      <rect x="18" y="24" width="384" height="88" rx="28" fill="#f8fafc" />
      <line
        x1="44"
        y1="68"
        x2="376"
        y2="68"
        stroke="#cbd5e1"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M138 68 H164 L176 48 L192 88 L208 48 L224 88 L240 48 L256 68"
        fill="none"
        stroke="#f97316"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {steps.map((step, index) => (
        <g key={step.label}>
          <motion.circle
            cx={step.x}
            cy="68"
            r="10"
            fill={step.color}
            animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: index * 0.2 }}
          />
          <text
            x={step.x}
            y="132"
            textAnchor="middle"
            fill="#334155"
            fontSize="11"
            fontWeight="800"
          >
            {step.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

const internalParts: InternalPart[] = [
  {
    icon: "⟶",
    title: "Lead Wire",
    explanation:
      "Conducts current into and out of the resistor. It is usually copper or tinned copper.",
    importance: "Creates the external connection to the circuit.",
    colorClass: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    icon: "▣",
    title: "End Cap",
    explanation:
      "Connects the lead wire to the resistive element and holds the internal structure together.",
    importance: "Provides both mechanical support and electrical contact.",
    colorClass: "bg-slate-50 text-slate-700 ring-slate-200",
  },
  {
    icon: "●",
    title: "Ceramic Core",
    explanation:
      "Supports the resistor body, does not conduct electricity, and tolerates heat.",
    importance: "Keeps the resistive element stable during heating.",
    colorClass: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  },
  {
    icon: "≈",
    title: "Resistive Element",
    explanation:
      "The main current-limiting section that determines most of the resistance value.",
    importance: "This is where collisions and energy conversion mainly occur.",
    colorClass: "bg-orange-50 text-orange-700 ring-orange-100",
  },
  {
    icon: "◯",
    title: "Protective Coating",
    explanation:
      "Protects the resistor from moisture, contamination, and physical damage.",
    importance: "Improves safety, durability, and long-term reliability.",
    colorClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    icon: "▮",
    title: "Color Bands",
    explanation:
      "Show the resistance value, multiplier, and tolerance using a color code.",
    importance: "Allows quick identification without measuring every resistor.",
    colorClass: "bg-purple-50 text-purple-700 ring-purple-100",
  },
];

const failureModes: FailureMode[] = [
  {
    title: "Overheating",
    cause: "Too much current or power beyond the resistor rating.",
    effect: "The resistor becomes very hot and may discolor or fail.",
    prevention:
      "Use a correct power rating and keep current within safe limits.",
  },
  {
    title: "Resistance Drift",
    cause: "Long-term heat stress or material aging.",
    effect: "The resistance value changes away from its marked value.",
    prevention:
      "Use stable materials such as metal film for precision circuits.",
  },
  {
    title: "Cracked Coating",
    cause: "Thermal cycling, poor handling, or mechanical stress.",
    effect: "Moisture can enter and reduce reliability.",
    prevention:
      "Avoid bending leads too close to the body and prevent overheating.",
  },
  {
    title: "Open Circuit Failure",
    cause: "The resistive element breaks internally.",
    effect: "Current can no longer pass through the resistor.",
    prevention: "Avoid overloads and choose the correct resistor type.",
  },
  {
    title: "Burn Damage",
    cause: "Severe overload or incorrect circuit connection.",
    effect: "The body chars and the resistor becomes unsafe to use.",
    prevention: "Check circuit design, current, voltage, and power before use.",
  },
];

export function KnowledgeCards({
  materialLabel,
  materialNote,
}: {
  materialLabel: string;
  materialNote: string;
}) {
  const profile = getMaterialProfile(materialLabel, materialNote);

  return (
    <div className="grid gap-6">
      <Card
        title="Resistor Internal Parts"
        subtitle="A fixed resistor is a small assembly of mechanical and electrical layers."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {internalParts.map((part) => (
            <div
              key={part.title}
              className={`rounded-2xl p-4 text-sm ring-1 ${part.colorClass}`}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg font-black shadow-sm">
                  {part.icon}
                </span>
                <div>
                  <p className="font-bold">{part.title}</p>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {part.explanation}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    Importance: {part.importance}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Material Behavior" subtitle={`Selected: ${materialLabel}`}>
          <div className="rounded-2xl bg-blue-50 p-4 text-sm ring-1 ring-blue-100">
            <p className="font-bold text-blue-700">Selected Material Summary</p>
            <p className="mt-1 leading-relaxed text-slate-700">
              {profile.selectedSummary}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profile.behavior.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm ring-1 ring-orange-100">
            <p className="font-bold text-orange-700">Temperature behavior</p>
            <p className="mt-1 leading-relaxed text-slate-700">
              {profile.temperatureBehavior}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {profile.ratings.map((rating) => (
              <RatingBar key={rating.label} item={rating} />
            ))}
          </div>
        </Card>

        <Card
          title="Current Flow Inside Resistor"
          subtitle="The resistor does not store current; it opposes current and converts part of the electrical energy into heat."
        >
          <CurrentFlowDiagram />

          <div className="mt-4 space-y-3">
            <FlowStep
              icon="1"
              title="Current enters through lead wire"
              description="The metal lead guides current from the circuit into the resistor body."
            />
            <FlowStep
              icon="2"
              title="Current travels through the resistive element"
              description="The resistive material gives charges a harder path than plain wire."
            />
            <FlowStep
              icon="3"
              title="Electrons collide with material atoms"
              description="These collisions are the reason the resistor limits current."
            />
            <FlowStep
              icon="4"
              title="Electrical energy converts into heat"
              description="The lost electrical energy becomes thermal energy inside the resistor body."
            />
            <FlowStep
              icon="5"
              title="Current exits through output lead"
              description="Current continues through the circuit after passing through the resistor."
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="text-lg font-black text-slate-900">I = V / R</p>
              <p className="mt-1 text-xs text-slate-700">
                Current depends on voltage and resistance.
              </p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
              <p className="text-lg font-black text-slate-900">P = VI</p>
              <p className="mt-1 text-xs text-slate-700">
                Power tells how much energy is changed into heat each second.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Resistance Creation"
          subtitle="Resistance is created by material type, path length, and cross-sectional area."
        >
          <MiniResistanceDiagram />

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="font-bold text-blue-700">Longer path</p>
              <p className="mt-1 text-sm text-slate-700">
                Longer resistive path means higher resistance.
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
              <p className="font-bold text-red-700">Smaller area</p>
              <p className="mt-1 text-sm text-slate-700">
                Smaller cross-sectional area makes current harder to pass.
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
              <p className="font-bold text-purple-700">Material type</p>
              <p className="mt-1 text-sm text-slate-700">
                Different materials have different resistivity.
              </p>
            </div>
          </div>
        </Card>

        <Card
          title="Heat Generation"
          subtitle="A resistor converts part of electrical energy into heat energy."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <FlowStep
              icon="⚡"
              title="Electrical Energy"
              description="Voltage pushes current through the resistor."
            />
            <FlowStep
              icon="≈"
              title="Resistive Losses"
              description="Collisions inside the material oppose current."
            />
            <FlowStep
              icon="♨"
              title="Heat Energy"
              description="Lost electrical energy appears as heat."
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-3 text-center ring-1 ring-green-100">
              <p className="font-bold text-green-700">Safe</p>
              <p className="mt-1 text-xs text-slate-600">Normal operation</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-3 text-center ring-1 ring-yellow-100">
              <p className="font-bold text-yellow-700">Warm</p>
              <p className="mt-1 text-xs text-slate-600">Monitor power</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3 text-center ring-1 ring-orange-100">
              <p className="font-bold text-orange-700">Hot</p>
              <p className="mt-1 text-xs text-slate-600">Reduce load</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3 text-center ring-1 ring-red-100">
              <p className="font-bold text-red-700">Failure Risk</p>
              <p className="mt-1 text-xs text-slate-600">Unsafe stress</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            Higher current creates more heat. Higher power also creates more
            heat. Too much heat can damage the resistive element and protective
            coating.
          </div>
        </Card>
      </div>

      <Card
        title="Failure Modes"
        subtitle="Most resistor failures happen when heat, power, or mechanical stress exceeds the safe design limit."
      >
        <div className="grid gap-3 lg:grid-cols-5">
          {failureModes.map((failure) => (
            <div
              key={failure.title}
              className="rounded-2xl bg-red-50 p-4 text-sm ring-1 ring-red-100"
            >
              <p className="font-bold text-red-700">{failure.title}</p>
              <p className="mt-2 text-xs font-bold text-slate-700">Cause</p>
              <p className="text-xs leading-relaxed text-slate-600">
                {failure.cause}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-700">Effect</p>
              <p className="text-xs leading-relaxed text-slate-600">
                {failure.effect}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-700">
                Prevention
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                {failure.prevention}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Practical Applications"
        subtitle="The best resistor construction depends on accuracy, noise, power, and heat requirements."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-bold text-slate-800">Carbon Composition</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Vintage electronics</li>
              <li>• General purpose circuits</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
            <p className="font-bold text-blue-700">Metal Film</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Precision circuits</li>
              <li>• Measurement equipment</li>
              <li>• Audio circuits</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
            <p className="font-bold text-orange-700">Wire Wound</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Power supplies</li>
              <li>• Motor circuits</li>
              <li>• Industrial electronics</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700 ring-1 ring-emerald-100">
          <p className="font-bold text-emerald-700">
            Selected material in this simulation
          </p>
          <p className="mt-1">
            {materialLabel}: {profile.applications.join(", ")}.
          </p>
        </div>
      </Card>
    </div>
  );
}
