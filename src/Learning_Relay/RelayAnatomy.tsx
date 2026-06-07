"use client";

export default function RelayAnatomySvg() {
  const cfg = {
    colors: {
      metal: "#a7abb3",
      dark: "#303449",
      coil: "#f9d83a",
      terminal: "#ef6b5c",
      contact: "#f59e0b",
      label: "#374151",
      rod: "#555b66",
    },

    coil: { x: 95, y: 130, width: 205, height: 235, lineCount: 36, lineGap: 6 },
    core: { x: 95, y: 90, width: 70, height: 27 },
    topPlate: { x: 70, y: 115, width: 260, height: 18 },
    armature: { x: 80, y: 56, width: 240, height: 7 },

    lShape: {
      x: 320,
      y: 56,
      topWidth: 56,
      downHeight: 209,
      thickness: 7,
      innerGap: 1,
    },

    pivot: { x: 320, y: 52, width: 10, height: 313, dotRadius: 4, dotY: 66 },
    base: { x: 35, y: 365, width: 540, height: 30 },

    spring: {
      x: 360,
      y: 130,
      coilWidth: 90,
      segmentHeight: 20,
      turns: 2,
      strokeWidth: 2.5,
      rotate: -90,
      pivotX: 390,
      pivotY: 190,
    },

    actuatorRod: {
      main: { x: 380, y: 215, width: 120, height: 16 },
      block: { x: 370, y: 205, width: 25, height: 36 },
    },

    fixedContacts: [
      { x: 460, y: 100, width: 7, height: 265 },
      { x: 495, y: 100, width: 7, height: 265 },
      { x: 530, y: 100, width: 7, height: 265 },
    ],

    // Moving contact pad size reduced by 20px height.
    movingContact: {
      offsetX: 0,
      offsetY: 0,

      left: {
        x1: 488,
        y1: 165,
        x2: 505,
        y2: 190,
        x3: 488,
        y3: 215,
      },

      right: {
        x1: 515,
        y1: 165,
        x2: 498,
        y2: 190,
        x3: 515,
        y3: 215,
      },
    },
  };

  const l = cfg.lShape;
  const mc = cfg.movingContact;

  return (
    <div className="w-full bg-white p-4">
      <svg
        viewBox="0 0 760 520"
        className="h-auto w-full max-w-4xl"
        role="img"
        aria-label="Relay anatomy diagram"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 Z" fill={cfg.colors.label} />
          </marker>
        </defs>

        <rect width="760" height="520" fill="white" />

        {/* Relay Coil */}
        <rect
          x={cfg.coil.x}
          y={cfg.coil.y}
          width={cfg.coil.width}
          height={cfg.coil.height}
          fill={cfg.colors.coil}
          stroke="#111827"
          strokeWidth="1"
        />

        {/* Coil Winding Lines */}
        {Array.from({ length: cfg.coil.lineCount }).map((_, i) => (
          <line
            key={i}
            x1={cfg.coil.x}
            y1={cfg.coil.y + 7 + i * cfg.coil.lineGap}
            x2={cfg.coil.x + cfg.coil.width}
            y2={cfg.coil.y + 7 + i * cfg.coil.lineGap}
            stroke={cfg.colors.label}
            strokeWidth="1"
          />
        ))}

        {/* Core and Magnetic Plate */}
        <rect {...cfg.core} fill={cfg.colors.metal} />
        <rect {...cfg.topPlate} fill="black" />

        {/* Armature */}
        <rect {...cfg.armature} fill={cfg.colors.metal} />

        {/* L-Shape Armature Extension */}
        <path
          d={`
            M${l.x} ${l.y}
            H${l.x + l.topWidth}
            V${l.y + l.downHeight}
            H${l.x + l.topWidth - l.thickness}
            V${l.y + l.thickness + l.innerGap}
            H${l.x}
            Z
          `}
          fill={cfg.colors.metal}
        />

        {/* Pivot Support */}
        <rect
          x={cfg.pivot.x}
          y={cfg.pivot.y}
          width={cfg.pivot.width}
          height={cfg.pivot.height}
          fill={cfg.colors.dark}
        />
        <circle
          cx={cfg.pivot.x + cfg.pivot.width / 2}
          cy={cfg.pivot.dotY}
          r={cfg.pivot.dotRadius}
          fill={cfg.colors.terminal}
        />

        {/* Relay Base */}
        <rect {...cfg.base} fill="black" />

        {/* External Terminals */}
        <rect
          x="92"
          y="395"
          width="10"
          height="45"
          fill={cfg.colors.terminal}
        />
        <rect
          x="245"
          y="395"
          width="10"
          height="45"
          fill={cfg.colors.terminal}
        />
        <rect
          x="458"
          y="395"
          width="10"
          height="45"
          fill={cfg.colors.terminal}
        />
        <rect
          x="493"
          y="395"
          width="10"
          height="45"
          fill={cfg.colors.terminal}
        />
        <rect
          x="530"
          y="395"
          width="10"
          height="45"
          fill={cfg.colors.terminal}
        />

        {/* Return Spring with Rotation Control */}
        <g
          transform={`rotate(${cfg.spring.rotate} ${cfg.spring.pivotX} ${cfg.spring.pivotY})`}
        >
          <path
            d={createVerticalSpringPath(cfg.spring)}
            fill="none"
            stroke={cfg.colors.dark}
            strokeWidth={cfg.spring.strokeWidth}
          />
        </g>

        {/* Actuator Rod */}
        <rect {...cfg.actuatorRod.main} fill={cfg.colors.rod} />
        <rect {...cfg.actuatorRod.block} fill={cfg.colors.rod} />

        {/* Fixed Contacts */}
        {cfg.fixedContacts.map((contact, index) => (
          <rect key={index} {...contact} fill={cfg.colors.metal} />
        ))}

        {/* Moving Contact Pads */}
        <g transform={`translate(${mc.offsetX - 20} ${mc.offsetY - 50})`}>
          <path
            d={`M${mc.left.x1} ${mc.left.y1} L${mc.left.x2} ${mc.left.y2} L${mc.left.x3} ${mc.left.y3} Z`}
            fill={cfg.colors.contact}
          />
          <path
            d={`M${mc.right.x1} ${mc.right.y1} L${mc.right.x2} ${mc.right.y2} L${mc.right.x3} ${mc.right.y3} Z`}
            fill={cfg.colors.contact}
          />
        </g>

        {/* Moving Contact Pads */}
        <g transform={`translate(${mc.offsetX + 15} ${mc.offsetY - 50})`}>
          <path
            d={`M${mc.left.x1} ${mc.left.y1} L${mc.left.x2} ${mc.left.y2} L${mc.left.x3} ${mc.left.y3} Z`}
            fill={cfg.colors.contact}
          />
        </g>

        {/* Component Labels */}
        <TextArrow
          text="Core"
          x={20}
          y={85}
          tx={100}
          ty={105}
          color={cfg.colors.label}
        />
        <TextArrow
          text="Coil"
          x={20}
          y={250}
          tx={95}
          ty={255}
          color={cfg.colors.label}
        />
        <TextArrow
          text="Armature"
          x={120}
          y={35}
          tx={150}
          ty={58}
          color={cfg.colors.label}
        />
        <TextArrow
          text="Return Spring"
          x={350}
          y={275}
          tx={390}
          ty={218}
          color={cfg.colors.label}
        />
        <TextArrow
          text="Fixed contacts"
          x={455}
          y={35}
          tx={476}
          ty={100}
          color={cfg.colors.label}
        />
        <TextArrow
          text="Moving contact"
          x={590}
          y={90}
          tx={505}
          ty={190}
          color={cfg.colors.label}
        />
        <TextArrow
          text="NC"
          x={420}
          y={455}
          tx={463}
          ty={395}
          color={cfg.colors.label}
        />
        <TextArrow
          text="COM"
          x={485}
          y={455}
          tx={498}
          ty={395}
          color={cfg.colors.label}
        />
        <TextArrow
          text="NO"
          x={555}
          y={455}
          tx={535}
          ty={395}
          color={cfg.colors.label}
        />
      </svg>
    </div>
  );
}

function createVerticalSpringPath({
  x,
  y,
  coilWidth,
  segmentHeight,
  turns,
}: {
  x: number;
  y: number;
  coilWidth: number;
  segmentHeight: number;
  turns: number;
  rotate?: number;
  pivotX?: number;
  pivotY?: number;
}) {
  let d = `M${x} ${y}`;

  for (let i = 0; i < turns; i++) {
    const y1 = y + i * segmentHeight;

    d += ` C${x - coilWidth / 2} ${y1 + segmentHeight * 0.33},
            ${x + coilWidth / 2} ${y1 + segmentHeight * 0.66},
            ${x} ${y1 + segmentHeight}`;
  }

  return d;
}

function TextArrow({
  text,
  x,
  y,
  tx,
  ty,
  color,
}: {
  text: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
}) {
  return (
    <g>
      <text x={x} y={y} className="text-xl font-bold" fill={color}>
        {text}
      </text>
      <line
        x1={x + 45}
        y1={y + 6}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
    </g>
  );
}
