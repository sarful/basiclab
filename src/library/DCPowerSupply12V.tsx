"use client";

type Props = {
  className?: string;
  width?: number;
};

export default function DCPowerSupply12V({
  className = "",
  width = 900,
}: Props) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <svg
        width={width}
        viewBox="0 0 1200 720"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full"
      >
        <defs>
          <linearGradient id="case" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#eeeeea" />
            <stop offset="55%" stopColor="#d7d4ce" />
            <stop offset="100%" stopColor="#bfbdb8" />
          </linearGradient>

          <linearGradient id="screen" x1="0" x2="1">
            <stop offset="0%" stopColor="#050505" />
            <stop offset="50%" stopColor="#151515" />
            <stop offset="100%" stopColor="#030303" />
          </linearGradient>

          <radialGradient id="knob" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#d8d6d0" />
            <stop offset="100%" stopColor="#8d8c88" />
          </radialGradient>

          <radialGradient id="redLed" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff6a5f" />
            <stop offset="55%" stopColor="#f01810" />
            <stop offset="100%" stopColor="#8b0804" />
          </radialGradient>

          <radialGradient id="greenLed" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#51ff8a" />
            <stop offset="55%" stopColor="#18b947" />
            <stop offset="100%" stopColor="#0b5c24" />
          </radialGradient>

          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="12"
              floodOpacity="0.28"
            />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <rect
            x="55"
            y="55"
            width="1090"
            height="620"
            rx="38"
            fill="url(#case)"
          />
          <rect
            x="75"
            y="78"
            width="1050"
            height="570"
            rx="22"
            fill="none"
            stroke="#777"
            strokeWidth="3"
          />
          <rect
            x="83"
            y="86"
            width="1034"
            height="554"
            rx="18"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            opacity=".8"
          />

          <text
            x="600"
            y="130"
            textAnchor="middle"
            fontSize="40"
            fontWeight="700"
            fill="#111"
          >
            DC POWER SUPPLY
          </text>

          <rect
            x="135"
            y="155"
            width="720"
            height="260"
            rx="12"
            fill="url(#screen)"
            stroke="#333"
            strokeWidth="3"
          />

          <text
            x="230"
            y="305"
            fontSize="110"
            fontWeight="800"
            fill="#ff2a1f"
            fontFamily="monospace"
          >
            12.0
          </text>
          <text x="425" y="315" fontSize="36" fill="#eee">
            V
          </text>
          <text
            x="545"
            y="305"
            fontSize="110"
            fontWeight="800"
            fill="#ff2a1f"
            fontFamily="monospace"
          >
            0.00
          </text>
          <text x="775" y="315" fontSize="36" fill="#eee">
            A
          </text>

          <text x="265" y="365" fontSize="28" fontWeight="700" fill="#eee">
            VOLTAGE
          </text>
          <text x="600" y="365" fontSize="28" fontWeight="700" fill="#eee">
            CURRENT
          </text>

          <circle cx="815" cy="295" r="11" fill="url(#greenLed)" />
          <text x="790" y="330" fontSize="16" fontWeight="700" fill="#eee">
            POWER
          </text>

          <line
            x1="80"
            y1="470"
            x2="875"
            y2="470"
            stroke="#555"
            strokeWidth="2"
          />

          <text
            x="185"
            y="505"
            fontSize="25"
            fontWeight="700"
            textAnchor="middle"
          >
            ON
          </text>
          <rect
            x="140"
            y="520"
            width="85"
            height="125"
            rx="5"
            fill="#111"
            stroke="#333"
            strokeWidth="3"
          />
          <rect x="155" y="538" width="55" height="85" rx="3" fill="#222" />
          <text x="183" y="585" fontSize="28" fill="#fff" textAnchor="middle">
            I
          </text>
          <text x="183" y="620" fontSize="28" fill="#fff" textAnchor="middle">
            O
          </text>
          <text
            x="185"
            y="675"
            fontSize="25"
            fontWeight="700"
            textAnchor="middle"
          >
            OFF
          </text>

          <Terminal x={450} y={590} color="#111" label="-" />
          <Terminal x={600} y={590} color="#149448" label="GND" ground />
          <Terminal x={750} y={590} color="#ee1b12" label="+" />

          <Knob cx={980} cy={215} title="VOLTAGE" />
          <Knob cx={980} cy={430} title="CURRENT" />

          <rect
            x="915"
            y="560"
            width="140"
            height="105"
            rx="10"
            fill="none"
            stroke="#111"
            strokeWidth="3"
          />
          <text
            x="985"
            y="590"
            fontSize="25"
            fontWeight="700"
            textAnchor="middle"
          >
            OUTPUT
          </text>
          <line
            x1="940"
            y1="600"
            x2="1030"
            y2="600"
            stroke="#111"
            strokeWidth="2"
          />
          <text
            x="985"
            y="630"
            fontSize="24"
            fontWeight="700"
            textAnchor="middle"
          >
            12V DC
          </text>
          <text
            x="985"
            y="660"
            fontSize="24"
            fontWeight="700"
            textAnchor="middle"
          >
            0-5A
          </text>

          <rect x="135" y="665" width="80" height="22" rx="8" fill="#111" />
          <rect x="985" y="665" width="80" height="22" rx="8" fill="#111" />
        </g>
      </svg>
    </div>
  );
}

function Knob({ cx, cy, title }: { cx: number; cy: number; title: string }) {
  const ticks = Array.from({ length: 24 });

  return (
    <g>
      <text
        x={cx}
        y={cy - 105}
        fontSize="26"
        fontWeight="800"
        textAnchor="middle"
      >
        {title}
      </text>

      <path
        d={`M${cx - 75} ${cy + 10} A80 80 0 0 1 ${cx + 75} ${cy + 10}`}
        fill="none"
        stroke="#111"
        strokeWidth="4"
      />

      <text x={cx - 85} y={cy + 60} fontSize="30" fontWeight="700">
        -
      </text>
      <text x={cx + 72} y={cy + 60} fontSize="30" fontWeight="700">
        +
      </text>

      <circle
        cx={cx}
        cy={cy + 20}
        r="55"
        fill="url(#knob)"
        stroke="#8c8c88"
        strokeWidth="3"
      />

      {ticks.map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x1 = cx + Math.cos(angle) * 43;
        const y1 = cy + 20 + Math.sin(angle) * 43;
        const x2 = cx + Math.cos(angle) * 52;
        const y2 = cy + 20 + Math.sin(angle) * 52;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#999"
            strokeWidth="4"
          />
        );
      })}

      <line
        x1={cx}
        y1={cy - 15}
        x2={cx}
        y2={cy + 12}
        stroke="#aaa"
        strokeWidth="3"
      />
    </g>
  );
}

function Terminal({
  x,
  y,
  color,
  label,
  ground = false,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  ground?: boolean;
}) {
  return (
    <g>
      <text x={x} y={y - 65} fontSize="28" fontWeight="800" textAnchor="middle">
        {label}
      </text>

      <circle cx={x} cy={y} r="42" fill={color} stroke="#222" strokeWidth="4" />
      <circle
        cx={x}
        cy={y}
        r="29"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".25"
        strokeWidth="4"
      />
      <circle cx={x} cy={y} r="19" fill="#050505" />
      <circle cx={x} cy={y} r="11" fill="#1b1b1b" />

      {ground && (
        <g stroke="#111" strokeWidth="4">
          <line x1={x} y1={y + 58} x2={x} y2={y + 80} />
          <line x1={x - 22} y1={y + 80} x2={x + 22} y2={y + 80} />
          <line x1={x - 15} y1={y + 92} x2={x + 15} y2={y + 92} />
          <line x1={x - 8} y1={y + 104} x2={x + 8} y2={y + 104} />
        </g>
      )}
    </g>
  );
}
