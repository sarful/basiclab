import { multimeterGeometry } from "./multimeterGeometry";

type DigitalMultimeterVectorBoardProps = {
  className?: string;
};

function Jack({
  cx,
  cy,
  r,
  innerRadius,
}: {
  cx: number;
  cy: number;
  r: number;
  innerRadius: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#jackBodyGradient)" stroke="#76767c" strokeWidth="2.4" />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="url(#jackRimGradient)" />
      <circle cx={cx} cy={cy} r={innerRadius} fill="#020202" stroke="#cfd0d6" strokeWidth="1.5" />
      <circle cx={cx - r * 0.22} cy={cy - r * 0.26} r={r * 0.12} fill="rgba(255,255,255,0.22)" />
    </g>
  );
}

export default function DigitalMultimeterVectorBoard({
  className,
}: DigitalMultimeterVectorBoardProps) {
  const g = multimeterGeometry;

  return (
    <svg
      viewBox={g.canvas.viewBox}
      className={className}
      role="img"
      aria-label="Digital multimeter traced board shell"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7d7d84" />
          <stop offset="8%" stopColor="#b9bbc1" />
          <stop offset="18%" stopColor="#4b4c51" />
          <stop offset="82%" stopColor="#3a3a3f" />
          <stop offset="100%" stopColor="#0f0f12" />
        </linearGradient>

        <linearGradient id="innerBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5b5c61" />
          <stop offset="100%" stopColor="#121215" />
        </linearGradient>

        <linearGradient id="topPanelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9c9ea3" />
          <stop offset="100%" stopColor="#525359" />
        </linearGradient>

        <linearGradient id="displayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b4b0aa" />
          <stop offset="100%" stopColor="#a6a29c" />
        </linearGradient>

        <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4b4b50" />
          <stop offset="100%" stopColor="#3c3c41" />
        </linearGradient>

        <radialGradient id="dialGlow" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#75767b" />
          <stop offset="55%" stopColor="#505156" />
          <stop offset="100%" stopColor="#2a2b2f" />
        </radialGradient>

        <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#434449" />
          <stop offset="100%" stopColor="#26272c" />
        </linearGradient>

        <radialGradient id="jackBodyGradient" cx="38%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#888991" />
          <stop offset="55%" stopColor="#4e4f54" />
          <stop offset="100%" stopColor="#1d1d21" />
        </radialGradient>

        <radialGradient id="jackRimGradient" cx="40%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#101115" />
          <stop offset="100%" stopColor="#676870" />
        </radialGradient>

        <pattern id="topRidges" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <line x1="0" y1="4" x2="8" y2="4" stroke="#1e1f23" strokeOpacity="0.65" strokeWidth="1.3" />
          <line x1="0" y1="6.4" x2="8" y2="6.4" stroke="#d2d4d8" strokeOpacity="0.18" strokeWidth="0.8" />
        </pattern>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect width={g.canvas.width} height={g.canvas.height} fill="#f4f4f4" />

      <g filter="url(#softShadow)">
        <rect {...g.outerBody} fill="url(#bodyGradient)" />
        <rect {...g.innerBody} fill="url(#innerBodyGradient)" stroke="#b6b8bc" strokeOpacity="0.32" strokeWidth="1.1" />
      </g>

      <g>
        <rect {...g.topPanel} fill="url(#topPanelGradient)" stroke="#2d2f34" strokeWidth="1.8" />
        <rect {...g.topPanelInner} fill="url(#topPanelGradient)" stroke="#1d1e22" strokeWidth="1.4" />
        <rect {...g.topPanelInner} fill="url(#topRidges)" opacity="0.85" />

        <rect {...g.displayBezel} fill="#111214" stroke="#0b0b0d" strokeWidth="2" />
        <rect {...g.displayScreen} fill="url(#displayGradient)" stroke="#4a4a4a" strokeWidth="1.4" />
      </g>

      <rect {...g.controlPanel} fill="url(#panelGradient)" stroke="#dadce1" strokeWidth="1.3" />

      <g>
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.outerRadius}
          fill="#8d8f93"
          stroke="#1b1c20"
          strokeWidth="3"
        />
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.bezelRadius}
          fill="#5c5d61"
          stroke="#0f1012"
          strokeWidth="2.4"
        />
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.faceRadius}
          fill="url(#dialGlow)"
        />

        <path
          d={[
            `M ${g.dial.pointerStart.x - g.dial.pointerWidth * 0.44} ${g.dial.pointerStart.y + g.dial.pointerWidth * 0.18}`,
            `Q ${g.dial.pointerStart.x} ${g.dial.pointerStart.y - g.dial.pointerWidth * 0.75} ${g.dial.pointerStart.x + g.dial.pointerWidth * 0.42} ${g.dial.pointerStart.y + g.dial.pointerWidth * 0.12}`,
            `L ${g.dial.pointerEnd.x + g.dial.pointerWidth * 0.28} ${g.dial.pointerEnd.y - g.dial.pointerWidth * 0.32}`,
            `Q ${g.dial.pointerEnd.x + g.dial.pointerWidth * 0.14} ${g.dial.pointerEnd.y + g.dial.pointerWidth * 0.22} ${g.dial.pointerEnd.x - g.dial.pointerWidth * 0.12} ${g.dial.pointerEnd.y + g.dial.pointerWidth * 0.08}`,
            `L ${g.dial.pointerStart.x - g.dial.pointerWidth * 0.46} ${g.dial.pointerStart.y + g.dial.pointerWidth * 0.2}`,
            "Z",
          ].join(" ")}
          fill="url(#pointerGradient)"
          stroke="#1a1b1f"
          strokeWidth="1.6"
        />

        <line
          x1={g.dial.pointerStart.x - 2}
          y1={g.dial.pointerStart.y + 8}
          x2={g.dial.pointerEnd.x - 20}
          y2={g.dial.pointerEnd.y - 18}
          stroke="rgba(255,255,255,0.26)"
          strokeWidth="2.4"
        />

        <circle cx={g.dial.capCenter.x} cy={g.dial.capCenter.y} r={g.dial.capRadius} fill="#3c3d42" />
        <circle cx={g.dial.capCenter.x - 3} cy={g.dial.capCenter.y - 3} r={g.dial.capRadius * 0.42} fill="rgba(255,255,255,0.16)" />
      </g>

      <g>
        <Jack {...g.probeJacks.tenAmp} innerRadius={g.probeJacks.innerRadius} />
        <Jack {...g.probeJacks.vmA} innerRadius={g.probeJacks.innerRadius} />
        <Jack {...g.probeJacks.com} innerRadius={g.probeJacks.innerRadius} />
      </g>
    </svg>
  );
}
