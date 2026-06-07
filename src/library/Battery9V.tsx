"use client";

export interface Battery9VProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Battery9V({
  className = "",
  width = 360,
  height = 620,
}: Battery9VProps) {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 620"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gold" x1="20" y1="0" x2="340" y2="0">
            <stop offset="0%" stopColor="#b76500" />
            <stop offset="16%" stopColor="#ffbf35" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="84%" stopColor="#ffbf35" />
            <stop offset="100%" stopColor="#9c5600" />
          </linearGradient>

          <linearGradient id="black" x1="20" y1="0" x2="340" y2="0">
            <stop offset="0%" stopColor="#050505" />
            <stop offset="18%" stopColor="#202020" />
            <stop offset="50%" stopColor="#090909" />
            <stop offset="82%" stopColor="#1b1b1b" />
            <stop offset="100%" stopColor="#030303" />
          </linearGradient>

          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#8b8b8b" />
            <stop offset="50%" stopColor="#f2f2f2" />
            <stop offset="78%" stopColor="#555555" />
            <stop offset="100%" stopColor="#d8d8d8" />
          </linearGradient>

          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="14"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Main body */}
          <rect
            x="36"
            y="80"
            width="288"
            height="500"
            rx="28"
            fill="url(#black)"
          />

          {/* Gold top body */}
          <path
            d="
              M36 110
              Q36 80 66 80
              H294
              Q324 80 324 110
              V270
              H36
              Z
            "
            fill="url(#gold)"
          />

          {/* Thin black top plate */}
          <rect x="58" y="52" width="244" height="44" rx="13" fill="#101010" />

          {/* Top plate shine */}
          <path
            d="M68 58 H292"
            stroke="#333"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Positive terminal */}
          <g>
            <ellipse cx="123" cy="51" rx="34" ry="9" fill="#2b2b2b" />
            <rect
              x="98"
              y="30"
              width="50"
              height="22"
              rx="7"
              fill="url(#metal)"
            />
            <ellipse cx="123" cy="30" rx="25" ry="9" fill="url(#metal)" />
            <ellipse cx="123" cy="29" rx="14" ry="4.5" fill="#151515" />
            <ellipse
              cx="123"
              cy="27"
              rx="10"
              ry="3"
              fill="#f5f5f5"
              opacity="0.55"
            />
          </g>

          {/* Negative terminal */}
          <g>
            <ellipse cx="237" cy="51" rx="38" ry="9" fill="#2b2b2b" />
            <path
              d="
                M203 42
                Q208 21 237 18
                Q266 21 271 42
                Q262 58 237 59
                Q212 58 203 42
                Z
              "
              fill="url(#metal)"
            />
            <ellipse cx="237" cy="39" rx="22" ry="6" fill="#161616" />
            <rect
              x="219"
              y="35"
              width="36"
              height="7"
              rx="4"
              fill="#eee"
              opacity="0.75"
            />
          </g>

          {/* Polarity */}
          <g stroke="#050505" strokeWidth="4" fill="none">
            <circle cx="95" cy="165" r="25" />
            <path d="M82 165 H108" />
            <path d="M95 152 V178" />

            <circle cx="265" cy="165" r="25" />
            <path d="M252 165 H278" />
          </g>

          {/* Upper text */}
          <text
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="72"
            fontWeight="900"
            fill="#070707"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            9V
          </text>

          <text
            x="180"
            y="264"
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill="#070707"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            6F22
          </text>

          {/* Divider */}
          <line
            x1="36"
            y1="270"
            x2="324"
            y2="270"
            stroke="#111"
            strokeWidth="3"
          />

          {/* Center clean label */}
          <text
            x="180"
            y="430"
            textAnchor="middle"
            fontSize="76"
            fontWeight="900"
            fill="#ffffff"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            9V
          </text>

          {/* Very soft reflections */}
          <path
            d="M57 112 C48 250 48 425 57 560"
            stroke="#ffffff"
            strokeOpacity="0.07"
            strokeWidth="8"
            fill="none"
          />

          <path
            d="M303 112 C312 250 312 425 303 560"
            stroke="#ffffff"
            strokeOpacity="0.06"
            strokeWidth="7"
            fill="none"
          />

          {/* Bottom bevel */}
          <path
            d="M63 580 H297"
            stroke="#111"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
