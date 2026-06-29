"use client";

type BlackJumperWireRefs = {
  copper: string;
  filter: string;
  housing: string;
  pinMetal: string;
  wire: string;
};

type GreenJumperWireRefs = {
  filter: string;
  housing: string;
  metal: string;
  wire: string;
};

export function getBlackJumperWireRefs(idPrefix: string): BlackJumperWireRefs {
  return {
    copper: `${idPrefix}-copper`,
    filter: `${idPrefix}-soft-shadow`,
    housing: `${idPrefix}-housing-black`,
    pinMetal: `${idPrefix}-pin-metal`,
    wire: `${idPrefix}-wire-black`,
  };
}

export function getGreenJumperWireRefs(idPrefix: string): GreenJumperWireRefs {
  return {
    filter: `${idPrefix}-soft-shadow`,
    housing: `${idPrefix}-black-body`,
    metal: `${idPrefix}-metal`,
    wire: `${idPrefix}-wire-green`,
  };
}

export function BlackJumperWireDefs({ idPrefix }: { idPrefix: string }) {
  const refs = getBlackJumperWireRefs(idPrefix);

  return (
    <defs>
      <linearGradient id={refs.wire} x1="0" x2="1">
        <stop offset="0%" stopColor="#111827" />
        <stop offset="50%" stopColor="#30343a" />
        <stop offset="100%" stopColor="#0b0f14" />
      </linearGradient>

      <linearGradient id={refs.housing} x1="0" x2="1">
        <stop offset="0%" stopColor="#14151a" />
        <stop offset="50%" stopColor="#303139" />
        <stop offset="100%" stopColor="#111217" />
      </linearGradient>

      <linearGradient id={refs.pinMetal} x1="0" x2="1">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="45%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#6b7280" />
      </linearGradient>

      <linearGradient id={refs.copper} x1="0" x2="1">
        <stop offset="0%" stopColor="#7c4a2c" />
        <stop offset="45%" stopColor="#f3c38b" />
        <stop offset="100%" stopColor="#5b341f" />
      </linearGradient>

      <filter id={refs.filter}>
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}

export function GreenJumperWireDefs({ idPrefix }: { idPrefix: string }) {
  const refs = getGreenJumperWireRefs(idPrefix);

  return (
    <defs>
      <linearGradient id={refs.wire} x1="0" x2="1">
        <stop offset="0%" stopColor="#16824d" />
        <stop offset="45%" stopColor="#2bb36f" />
        <stop offset="100%" stopColor="#0f6d3f" />
      </linearGradient>

      <linearGradient id={refs.housing} x1="0" x2="1">
        <stop offset="0%" stopColor="#1f2026" />
        <stop offset="50%" stopColor="#3a3b42" />
        <stop offset="100%" stopColor="#18191f" />
      </linearGradient>

      <linearGradient id={refs.metal} x1="0" x2="1">
        <stop offset="0%" stopColor="#7c4a2c" />
        <stop offset="40%" stopColor="#f3c38b" />
        <stop offset="100%" stopColor="#5b341f" />
      </linearGradient>

      <filter id={refs.filter}>
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}
