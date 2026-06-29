"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  ACCoilSymbol,
  ACMotor3P,
  ACMotor3P6Terminal,
  ACSocket220V,
  AmmeterSymbol,
  AuxiliaryContactNC,
  AuxiliaryContactNO,
  Battery9V,
  BackgroundPixelGred,
  BlackProbeLong,
  CircuitBreaker3P,
  ContactorCoil,
  ContactorPowerContacts3P,
  CounterPulseSymbol,
  CounterSwitchNCSymbol,
  CounterSwitchNOSymbol,
  DCPowerSupply12V,
  DCMotorSymbol,
  DiodeAnodeCathodeDiagram,
  DiffuseSensorDoubleWidthSymbol,
  ElectronicClockRelayCoilSymbol,
  electronicsSymbolCatalog,
  EmergencyStopSwitchSymbol,
  FlowSwitchNCSymbol,
  FlowSwitchSymbol,
  Fuse1PSymbol,
  groupElectronicsSymbols,
  InverterSymbol,
  LeverLimitSwitchSymbol,
  LimitSwitchNCSymbol,
  LimitSwitchNOSymbol,
  MCBControl2P,
  MagneticOverloadSymbol,
  NormallyCloseContactSymbol,
  NormallyOpenContactSymbol,
  OffDelayNCContactSymbol,
  OffDelayNOContactSymbol,
  OffDelayTimerSymbol,
  OnDelayNCContactSymbol,
  OnDelayNOContactSymbol,
  OnDelayTimerSymbol,
  PilotLight,
  PhotoelectricSensorRetroReflectiveDoubleWidthSymbol,
  ProximitySensorCapacitive3WireSymbol,
  ProximitySensorInductive3WireSymbol,
  PushButtonNC,
  PushButtonNO,
  RedProbeImage,
  RelayBase2PSymbol,
  SolidStateRelayACSymbol,
  SolidStateRelayDCSymbol,
  ThermalCurrentOverload1PSymbol,
  ThermalCurrentOverload2PSymbol,
  ThermalCurrentOverload3PSymbol,
  ThermalOverloadNC,
  ThermalOverloadRelay3P,
  VoltmeterSymbol,
} from "../../src/library";

type LibraryCard = {
  title: string;
  category: string;
  component: ReactNode;
};

function ProbePreview({ component }: { component: ReactNode }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center overflow-hidden rounded-3xl bg-slate-50 p-4">
      <div style={{ transform: "scale(0.42)", transformOrigin: "center center" }}>
        {component}
      </div>
    </div>
  );
}

function GridPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <svg viewBox="0 0 380 240" className="h-auto w-full">
        <BackgroundPixelGred
          width={380}
          height={240}
          minor={20}
          major={100}
          backgroundColor="#f8fafc"
          minorStroke="#e2e8f0"
          majorStroke="#cbd5e1"
          labelColor="#64748b"
          showBorder={false}
        />
      </svg>
    </div>
  );
}

const symbolCards = [
  {
    title: "Push Button NC",
    category: "Pushbuttons",
    component: <PushButtonNC label="" />,
  },
  {
    title: "Push Button NO",
    category: "Pushbuttons",
    component: <PushButtonNO label="" />,
  },
  {
    title: "Contactor Coil",
    category: "Contactor Devices",
    component: <ContactorCoil energized label="K1" />,
  },
  {
    title: "Auxiliary Contact NO",
    category: "Contactor Devices",
    component: <AuxiliaryContactNO />,
  },
  {
    title: "Auxiliary Contact NC",
    category: "Contactor Devices",
    component: <AuxiliaryContactNC />,
  },
  {
    title: "Contactor Power Contacts 3P",
    category: "Contactor Devices",
    component: <ContactorPowerContacts3P closed label="K1" />,
  },
  {
    title: "Pilot Light",
    category: "Indication",
    component: <PilotLight on label="" />,
  },
  {
    title: "AC Motor 3P",
    category: "Motors",
    component: <ACMotor3P label="" />,
  },
  {
    title: "AC Motor 3P - 6 Terminal",
    category: "Motors",
    component: <ACMotor3P6Terminal label="" />,
  },
  {
    title: "Circuit Breaker 3P",
    category: "Protection Devices",
    component: <CircuitBreaker3P on label="" />,
  },
  {
    title: "MCB Control 2P",
    category: "Protection Devices",
    component: <MCBControl2P on label="" />,
  },
  {
    title: "Thermal Overload NC",
    category: "Protection Devices",
    component: <ThermalOverloadNC label="" />,
  },
  {
    title: "Thermal Overload Relay 3P",
    category: "Protection Devices",
    component: <ThermalOverloadRelay3P label="" />,
  },
] satisfies LibraryCard[];

const coreSymbolGroups = Object.entries(
  symbolCards.reduce<Record<string, LibraryCard[]>>((groups, card) => {
    groups[card.category] ??= [];
    groups[card.category].push(card);
    return groups;
  }, {}),
);

const industrialCards = [
  {
    title: "AC Coil",
    category: "Relays",
    component: <ACCoilSymbol />,
  },
  {
    title: "Electronic Clock Relay Coil",
    category: "Relays",
    component: <ElectronicClockRelayCoilSymbol />,
  },
  {
    title: "Relay Base 2P",
    category: "Relays",
    component: <RelayBase2PSymbol />,
  },
  {
    title: "Solid State Relay AC",
    category: "Relays",
    component: <SolidStateRelayACSymbol />,
  },
  {
    title: "Solid State Relay DC",
    category: "Relays",
    component: <SolidStateRelayDCSymbol />,
  },
  {
    title: "Ammeter",
    category: "Meters",
    component: <AmmeterSymbol />,
  },
  {
    title: "Voltmeter",
    category: "Meters",
    component: <VoltmeterSymbol />,
  },
  {
    title: "Counter Pulse",
    category: "Counters",
    component: <CounterPulseSymbol />,
  },
  {
    title: "Counter Switch NC",
    category: "Counters",
    component: <CounterSwitchNCSymbol />,
  },
  {
    title: "Counter Switch NO",
    category: "Counters",
    component: <CounterSwitchNOSymbol />,
  },
  {
    title: "Emergency Stop Switch",
    category: "Switches",
    component: <EmergencyStopSwitchSymbol />,
  },
  {
    title: "Flow Switch",
    category: "Switches",
    component: <FlowSwitchSymbol />,
  },
  {
    title: "Flow Switch NC",
    category: "Switches",
    component: <FlowSwitchNCSymbol />,
  },
  {
    title: "Lever Limit Switch",
    category: "Switches",
    component: <LeverLimitSwitchSymbol />,
  },
  {
    title: "Limit Switch NC",
    category: "Switches",
    component: <LimitSwitchNCSymbol />,
  },
  {
    title: "Limit Switch NO",
    category: "Switches",
    component: <LimitSwitchNOSymbol />,
  },
  {
    title: "Normally Open Contact",
    category: "Contacts",
    component: <NormallyOpenContactSymbol />,
  },
  {
    title: "Normally Close Contact",
    category: "Contacts",
    component: <NormallyCloseContactSymbol />,
  },
  {
    title: "Off Delay NO Contact",
    category: "Contacts",
    component: <OffDelayNOContactSymbol />,
  },
  {
    title: "Off Delay NC Contact",
    category: "Contacts",
    component: <OffDelayNCContactSymbol />,
  },
  {
    title: "On Delay NO Contact",
    category: "Contacts",
    component: <OnDelayNOContactSymbol />,
  },
  {
    title: "On Delay NC Contact",
    category: "Contacts",
    component: <OnDelayNCContactSymbol />,
  },
  {
    title: "Off Delay Timer",
    category: "Timers",
    component: <OffDelayTimerSymbol />,
  },
  {
    title: "On Delay Timer",
    category: "Timers",
    component: <OnDelayTimerSymbol />,
  },
  {
    title: "Diffuse Sensor Double Width",
    category: "Sensors",
    component: <DiffuseSensorDoubleWidthSymbol />,
  },
  {
    title: "Photoelectric Sensor - Retro Reflective",
    category: "Sensors",
    component: <PhotoelectricSensorRetroReflectiveDoubleWidthSymbol />,
  },
  {
    title: "Proximity Sensor - Capacitive 3 Wire",
    category: "Sensors",
    component: <ProximitySensorCapacitive3WireSymbol />,
  },
  {
    title: "Proximity Sensor - Inductive 3 Wire",
    category: "Sensors",
    component: <ProximitySensorInductive3WireSymbol />,
  },
  {
    title: "DC Motor",
    category: "Motors",
    component: <DCMotorSymbol />,
  },
  {
    title: "Fuse 1P",
    category: "Protection",
    component: <Fuse1PSymbol />,
  },
  {
    title: "Magnetic Overload",
    category: "Protection",
    component: <MagneticOverloadSymbol />,
  },
  {
    title: "Thermal / Current Overload 1P",
    category: "Protection",
    component: <ThermalCurrentOverload1PSymbol />,
  },
  {
    title: "Thermal / Current Overload 2P",
    category: "Protection",
    component: <ThermalCurrentOverload2PSymbol />,
  },
  {
    title: "Thermal / Current Overload 3P",
    category: "Protection",
    component: <ThermalCurrentOverload3PSymbol />,
  },
  {
    title: "Inverter",
    category: "Power",
    component: <InverterSymbol />,
  },
  {
    title: "9V Battery",
    category: "Power Sources",
    component: <Battery9V width={180} height={300} />,
  },
  {
    title: "12V DC Power Supply",
    category: "Power Sources",
    component: <DCPowerSupply12V width={320} />,
  },
  {
    title: "220V AC Socket",
    category: "Power Sources",
    component: <ACSocket220V width={320} />,
  },
  {
    title: "Black Probe Long",
    category: "Measurement Accessories",
    component: <ProbePreview component={<BlackProbeLong />} />,
  },
  {
    title: "Red Probe Long",
    category: "Measurement Accessories",
    component: <ProbePreview component={<RedProbeImage />} />,
  },
  {
    title: "Diode Anode Cathode Diagram",
    category: "Learning Diagrams",
    component: <DiodeAnodeCathodeDiagram />,
  },
  {
    title: "Background Pixel Grid",
    category: "Learning Diagrams",
    component: <GridPreview />,
  },
] satisfies LibraryCard[];

const industrialGroups = Object.entries(
  industrialCards.reduce<Record<string, LibraryCard[]>>((groups, card) => {
    groups[card.category] ??= [];
    groups[card.category].push(card);
    return groups;
  }, {}),
);

const allLibraryCards = [
  ...electronicsSymbolCatalog,
  ...symbolCards,
  ...industrialCards,
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(allLibraryCards.map((card) => card.category))).sort(),
    ];
  }, []);

  const matchesFilter = (card: LibraryCard) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchMatch =
      normalizedSearch.length === 0 ||
      card.title.toLowerCase().includes(normalizedSearch) ||
      card.category.toLowerCase().includes(normalizedSearch);
    const categoryMatch =
      activeCategory === "All" || card.category === activeCategory;

    return searchMatch && categoryMatch;
  };

  const filteredElectronicsGroups = groupElectronicsSymbols(electronicsSymbolCatalog)
    .map(([groupName, cards]) => [groupName, cards.filter(matchesFilter)] as const)
    .filter(([, cards]) => cards.length > 0);

  const filteredCoreSymbolGroups = coreSymbolGroups
    .map(([groupName, cards]) => [groupName, cards.filter(matchesFilter)] as const)
    .filter(([, cards]) => cards.length > 0);

  const filteredIndustrialGroups = industrialGroups
    .map(([groupName, cards]) => [groupName, cards.filter(matchesFilter)] as const)
    .filter(([, cards]) => cards.length > 0);

  const totalMatches =
    filteredElectronicsGroups.reduce((total, [, cards]) => total + cards.length, 0) +
    filteredCoreSymbolGroups.reduce((total, [, cards]) => total + cards.length, 0) +
    filteredIndustrialGroups.reduce((total, [, cards]) => total + cards.length, 0);

  const totalLibrarySymbols = allLibraryCards.length;
  const totalCategories = categoryOptions.length - 1;
  const visibleSectionCount = [
    filteredElectronicsGroups.length > 0,
    filteredCoreSymbolGroups.length > 0,
    filteredIndustrialGroups.length > 0,
  ].filter(Boolean).length;

  return (
    <main className="library-shell">
      <section className="library-hero">
        <div className="library-hero-copy">
          <p className="eyebrow">Component Library</p>
          <h1>Electrical Symbol Showcase</h1>
          <p className="description">
            Browse reusable electrical and electronics symbols from one place. Use
            search and category filters to quickly find a component, inspect it,
            and reuse it in your diagrams.
          </p>
        </div>
        <div className="library-hero-stats">
          <article className="library-stat-card">
            <span>Total Symbols</span>
            <strong>{totalLibrarySymbols}</strong>
          </article>
          <article className="library-stat-card">
            <span>Categories</span>
            <strong>{totalCategories}</strong>
          </article>
          <article className="library-stat-card">
            <span>Visible Sections</span>
            <strong>{visibleSectionCount}</strong>
          </article>
        </div>
      </section>

      <section className="library-section">
        <div className="library-section-head">
          <h2>Library Tools</h2>
          <p>Find components fast by typing a keyword or narrowing the category.</p>
        </div>
        <div className="library-tools">
          <label className="library-search">
            <span>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search symbols..."
            />
          </label>
          <div className="library-filter-group">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                className={`library-filter-chip${
                  activeCategory === category ? " is-active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="library-tools-footer">
            <p className="library-results">
              {totalMatches} symbol{totalMatches === 1 ? "" : "s"} found
            </p>
            {(searchTerm || activeCategory !== "All") ? (
              <button
                type="button"
                className="library-clear-button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {totalMatches === 0 ? (
        <section className="library-section">
          <div className="library-empty-state">
            <h2>No Symbols Found</h2>
            <p>Try a different search term or switch back to the `All` category filter.</p>
          </div>
        </section>
      ) : null}

      <section className="library-section">
        <div className="library-section-head">
          <div>
            <h2>Electronics Symbols</h2>
            <p>Diodes, transistors, transformers, passive parts, and semiconductor families.</p>
          </div>
          <span className="library-section-count">
            {filteredElectronicsGroups.reduce((total, [, cards]) => total + cards.length, 0)}
          </span>
        </div>
        <div className="library-group-stack">
          {filteredElectronicsGroups.map(([groupName, cards]) => (
            <section key={groupName} className="library-subsection">
              <div className="library-subsection-head">
                <span className="library-badge">{groupName}</span>
              </div>
              <div className="library-grid">
                {cards.map((card) => (
                  <article key={card.title} className="library-card">
                    <div className="library-card-head">
                      <h3>{card.title}</h3>
                    </div>
                    <div className="library-preview">{card.component}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="library-section">
        <div className="library-section-head">
          <div>
            <h2>Core Electrical Symbols</h2>
            <p>Foundational control and power components for panels, motor starters, and schematic drafting.</p>
          </div>
          <span className="library-section-count">
            {filteredCoreSymbolGroups.reduce((total, [, cards]) => total + cards.length, 0)}
          </span>
        </div>
        <div className="library-group-stack">
          {filteredCoreSymbolGroups.map(([groupName, cards]) => (
            <section key={groupName} className="library-subsection">
              <div className="library-subsection-head">
                <span className="library-badge">{groupName}</span>
              </div>
              <div className="library-grid">
                {cards.map((card) => (
                  <article key={card.title} className="library-card">
                    <div className="library-card-head">
                      <h3>{card.title}</h3>
                    </div>
                    <div className="library-preview">{card.component}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="library-section">
        <div className="library-section-head">
          <div>
            <h2>Industrial Symbols</h2>
            <p>Field devices, timers, relays, meters, sensors, switches, and industrial protection items.</p>
          </div>
          <span className="library-section-count">
            {filteredIndustrialGroups.reduce((total, [, cards]) => total + cards.length, 0)}
          </span>
        </div>
        <div className="library-group-stack">
          {filteredIndustrialGroups.map(([groupName, cards]) => (
            <section key={groupName} className="library-subsection">
              <div className="library-subsection-head">
                <span className="library-badge">{groupName}</span>
              </div>
              <div className="library-grid">
                {cards.map((card) => (
                  <article key={card.title} className="library-card">
                    <div className="library-card-head">
                      <h3>{card.title}</h3>
                    </div>
                    <div className="library-preview">{card.component}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

    </main>
  );
}
