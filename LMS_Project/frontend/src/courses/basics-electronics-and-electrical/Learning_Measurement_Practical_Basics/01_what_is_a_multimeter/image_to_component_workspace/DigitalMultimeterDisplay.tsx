import { multimeterGeometry } from "./multimeterGeometry";

type SegmentKey = "a" | "b" | "c" | "d" | "e" | "f" | "g";

type DisplayCharacter = {
  decimal?: boolean;
  kind: "digit" | "blank";
  value?: string;
};

type DigitalMultimeterDisplayProps = {
  className?: string;
  dimmed?: boolean;
  showHousing?: boolean;
  value?: string;
};

const digitSegments: Record<string, SegmentKey[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  "-": ["g"],
  E: ["a", "d", "e", "f", "g"],
  r: ["e", "g"],
};

function polygonPoints(points: Array<[number, number]>) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function SevenSegmentDigit({
  x,
  y,
  width,
  height,
  activeSegments,
  decimal = false,
  dimmed = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  activeSegments: SegmentKey[];
  decimal?: boolean;
  dimmed?: boolean;
}) {
  const h = height;
  const w = width;
  const t = Math.min(w * 0.2, h * 0.115);
  const s = t * 0.36;
  const midY = h / 2;

  const shapes: Record<SegmentKey, string> = {
    a: polygonPoints([
      [x + t * 0.95, y + s],
      [x + w - t * 0.95, y + s],
      [x + w - t * 0.62, y + t * 0.72],
      [x + w - t * 1.32, y + t * 1.46],
      [x + t * 1.32, y + t * 1.46],
      [x + t * 0.62, y + t * 0.72],
    ]),
    g: polygonPoints([
      [x + t * 1.15, y + midY - t * 0.42],
      [x + w - t * 1.15, y + midY - t * 0.42],
      [x + w - t * 0.62, y + midY],
      [x + w - t * 1.15, y + midY + t * 0.42],
      [x + t * 1.15, y + midY + t * 0.42],
      [x + t * 0.62, y + midY],
    ]),
    d: polygonPoints([
      [x + t * 1.32, y + h - t * 1.46],
      [x + w - t * 1.32, y + h - t * 1.46],
      [x + w - t * 0.62, y + h - t * 0.72],
      [x + w - t * 0.95, y + h - s],
      [x + t * 0.95, y + h - s],
      [x + t * 0.62, y + h - t * 0.72],
    ]),
    f: polygonPoints([
      [x + s, y + t * 1.1],
      [x + t * 0.85, y + t * 0.35],
      [x + t * 1.48, y + t * 1.05],
      [x + t * 1.2, y + midY - t * 0.72],
      [x + t * 0.5, y + midY - t * 0.08],
      [x + s * 0.45, y + midY - t * 0.44],
    ]),
    b: polygonPoints([
      [x + w - s, y + t * 1.1],
      [x + w - t * 0.85, y + t * 0.35],
      [x + w - t * 1.48, y + t * 1.05],
      [x + w - t * 1.2, y + midY - t * 0.72],
      [x + w - t * 0.5, y + midY - t * 0.08],
      [x + w - s * 0.45, y + midY - t * 0.44],
    ]),
    e: polygonPoints([
      [x + s * 0.45, y + midY + t * 0.44],
      [x + t * 0.5, y + midY + t * 0.08],
      [x + t * 1.2, y + h - t * 1.05 - t * 0.2],
      [x + t * 1.48, y + h - t * 1.05],
      [x + t * 0.85, y + h - t * 0.35],
      [x + s, y + h - t * 1.1],
    ]),
    c: polygonPoints([
      [x + w - s * 0.45, y + midY + t * 0.44],
      [x + w - t * 0.5, y + midY + t * 0.08],
      [x + w - t * 1.2, y + h - t * 1.05 - t * 0.2],
      [x + w - t * 1.48, y + h - t * 1.05],
      [x + w - t * 0.85, y + h - t * 0.35],
      [x + w - s, y + h - t * 1.1],
    ]),
  };

  return (
    <g>
      {(Object.keys(shapes) as SegmentKey[]).map((key) => {
        const isActive = activeSegments.includes(key);
        return (
          <polygon
            key={key}
            points={shapes[key]}
            fill={
              isActive
                ? "#111111"
                : dimmed
                  ? "rgba(25,25,25,0.06)"
                  : "rgba(25,25,25,0.12)"
            }
          />
        );
      })}
      <circle
        cx={x + width + t * 0.28}
        cy={y + height - t * 0.55}
        r={t * 0.24}
        fill={
          decimal
            ? "#111111"
            : dimmed
              ? "rgba(25,25,25,0.05)"
              : "rgba(25,25,25,0.1)"
        }
      />
    </g>
  );
}

function normalizeDisplayValue(value: string) {
  const trimmed = value.trim();
  const slots: DisplayCharacter[] = [];

  for (const character of trimmed) {
    if (character === ".") {
      const previous = slots[slots.length - 1];

      if (previous) {
        previous.decimal = true;
      }

      continue;
    }

    if (digitSegments[character]) {
      slots.push({ kind: "digit", value: character });
      continue;
    }

    slots.push({ kind: "blank" });
  }

  const paddedSlots = slots.slice(-3);

  while (paddedSlots.length < 3) {
    paddedSlots.unshift({ kind: "blank" });
  }

  return paddedSlots;
}

export default function DigitalMultimeterDisplay({
  className,
  dimmed = false,
  showHousing = true,
  value = "000",
}: DigitalMultimeterDisplayProps) {
  const { displayBezel, displayScreen, topPanel } = multimeterGeometry;

  const characters = normalizeDisplayValue(value);

  const digitArea = {
    x: displayScreen.x + displayScreen.width * 0.41,
    y: displayScreen.y + displayScreen.height * 0.05,
    width: displayScreen.width * 0.52,
    height: displayScreen.height * 0.88,
  };

  const digitWidth = digitArea.width * 0.255;
  const digitGap = digitArea.width * 0.07;
  const digitHeight = digitArea.height;

  return (
    <svg
      viewBox={`0 0 ${multimeterGeometry.canvas.width} ${multimeterGeometry.canvas.height}`}
      className={className}
      role="img"
      aria-label="Digital multimeter LCD display layer"
    >
      <defs>
        <linearGradient
          id="lcdHousingGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#1f2023" />
          <stop offset="100%" stopColor="#060608" />
        </linearGradient>

        <linearGradient
          id="lcdScreenGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#c4beb7" />
          <stop offset="100%" stopColor="#a9a49d" />
        </linearGradient>

        <linearGradient
          id="lcdGlassHighlight"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <pattern
          id="lcdTopRidges"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="transparent" />
          <line
            x1="0"
            y1="4"
            x2="8"
            y2="4"
            stroke="#1c1d20"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
          <line
            x1="0"
            y1="6.2"
            x2="8"
            y2="6.2"
            stroke="#f4f4f4"
            strokeOpacity="0.12"
            strokeWidth="0.7"
          />
        </pattern>

        <pattern
          id="lcdScreenLines"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="transparent" />
          <line
            x1="0"
            y1="3"
            x2="6"
            y2="3"
            stroke="#8e8880"
            strokeOpacity="0.15"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      {showHousing ? (
        <g>
          <rect
            x={topPanel.x}
            y={topPanel.y}
            width={topPanel.width}
            height={topPanel.height}
            rx={topPanel.rx}
            ry={topPanel.ry}
            fill="url(#lcdHousingGradient)"
            opacity={0.08}
          />
          <rect
            x={displayBezel.x}
            y={displayBezel.y}
            width={displayBezel.width}
            height={displayBezel.height}
            rx={displayBezel.rx}
            ry={displayBezel.ry}
            fill="url(#lcdHousingGradient)"
            stroke="#020203"
            strokeWidth="2"
          />
          <rect
            x={displayScreen.x}
            y={displayScreen.y}
            width={displayScreen.width}
            height={displayScreen.height}
            rx={displayScreen.rx}
            ry={displayScreen.ry}
            fill="url(#lcdScreenGradient)"
            stroke="#4e4d49"
            strokeWidth="1.4"
          />
          <rect
            x={displayScreen.x}
            y={displayScreen.y}
            width={displayScreen.width}
            height={displayScreen.height}
            rx={displayScreen.rx}
            ry={displayScreen.ry}
            fill="url(#lcdScreenLines)"
            opacity={0.55}
          />
          <rect
            x={displayBezel.x}
            y={displayBezel.y}
            width={displayBezel.width}
            height={displayBezel.height}
            rx={displayBezel.rx}
            ry={displayBezel.ry}
            fill="url(#lcdTopRidges)"
            opacity={0.16}
          />
          <path
            d={[
              `M ${displayScreen.x + 8} ${displayScreen.y + 5}`,
              `L ${displayScreen.x + displayScreen.width * 0.42} ${displayScreen.y + 5}`,
              `L ${displayScreen.x + displayScreen.width * 0.3} ${displayScreen.y + displayScreen.height - 8}`,
              `L ${displayScreen.x + 14} ${displayScreen.y + displayScreen.height - 8}`,
              "Z",
            ].join(" ")}
            fill="url(#lcdGlassHighlight)"
          />
        </g>
      ) : null}

      <g opacity={dimmed ? 0.84 : 1}>
        <g>
          {characters.map((character, index) => {
            const digitX = digitArea.x + index * (digitWidth + digitGap);
            const activeSegments =
              character.kind === "digit" && character.value
                ? digitSegments[character.value]
                : [];

            return (
              <SevenSegmentDigit
                key={`${character.kind}-${character.value ?? "blank"}-${index}`}
                x={digitX}
                y={digitArea.y}
                width={digitWidth}
                height={digitHeight}
                activeSegments={activeSegments}
                decimal={character.decimal}
                dimmed={dimmed}
              />
            );
          })}
        </g>

        <rect
          x={displayScreen.x + displayScreen.width * 0.04}
          y={displayScreen.y + displayScreen.height * 0.1}
          width={displayScreen.width * 0.22}
          height={displayScreen.height * 0.78}
          fill="rgba(255,255,255,0.07)"
        />
      </g>
    </svg>
  );
}
