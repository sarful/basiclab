// OpAmpInvertingAmplifier.tsx
"use client";

import React from "react";

type Point = {
  x: number;
  y: number;
};

const BLACK = "#000000";
const WHITE = "#ffffff";

const stroke = {
  wire: 3,
  terminal: 3,
  resistor: 3,
  node: 8,
};

const font = {
  family: "Times New Roman, Times, serif",
  label: 24,
  title: 23,
  amp: 44,
};

function Wire({
  points,
  width = stroke.wire,
}: {
  points: Point[];
  width?: number;
}) {
  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <path
      d={d}
      fill="none"
      stroke={BLACK}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Terminal({ x, y, r = 10 }: Point & { r?: number }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={WHITE}
      stroke={BLACK}
      strokeWidth={stroke.terminal}
    />
  );
}

function Junction({ x, y, r = stroke.node }: Point & { r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={BLACK} />;
}

function Label({
  x,
  y,
  children,
  size = font.label,
  anchor = "middle",
  italic = true,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  italic?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={BLACK}
      fontFamily={font.family}
      fontSize={size}
      fontStyle={italic ? "italic" : "normal"}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

function SubLabel({
  x,
  y,
  main,
  sub,
  size = font.label,
  anchor = "middle",
}: {
  x: number;
  y: number;
  main: string;
  sub: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={BLACK}
      fontFamily={font.family}
      fontSize={size}
      fontStyle="italic"
      textAnchor={anchor}
    >
      {main}
      <tspan fontSize={size * 0.68} baselineShift="sub">
        {sub}
      </tspan>
    </text>
  );
}

function Resistor({
  x,
  y,
  length,
  height = 18,
  turns = 7,
}: {
  x: number;
  y: number;
  length: number;
  height?: number;
  turns?: number;
}) {
  const lead = 14;
  const startX = x + lead;
  const endX = x + length - lead;
  const step = (endX - startX) / turns;

  const points: Point[] = [
    { x, y },
    { x: startX, y },
  ];

  for (let i = 0; i <= turns; i++) {
    points.push({
      x: startX + step * i,
      y: i % 2 === 0 ? y - height : y + height,
    });
  }

  points.push({ x: endX, y });
  points.push({ x: x + length, y });

  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <path
      d={d}
      fill="none"
      stroke={BLACK}
      strokeWidth={stroke.resistor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Ground({ x, y }: Point) {
  return (
    <g stroke={BLACK} strokeWidth={2.4} strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + 16} />
      <line x1={x - 26} y1={y + 16} x2={x + 26} y2={y + 16} />
      <line x1={x - 18} y1={y + 24} x2={x + 18} y2={y + 24} />
      <line x1={x - 10} y1={y + 32} x2={x + 10} y2={y + 32} />
    </g>
  );
}

function OpAmp() {
  return (
    <g>
      <polygon
        points="420,158 420,342 610,250"
        fill={WHITE}
        stroke={BLACK}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      <Label x={450} y={202} size={28} italic={false}>
        -
      </Label>

      <Label x={450} y={308} size={32} italic={false}>
        +
      </Label>

      <Label x={520} y={265} size={font.amp} italic={false}>
        A
      </Label>
    </g>
  );
}

export default function OpAmpInvertingAmplifier() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <section className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 760 470"
          className="h-auto w-full bg-white"
          role="img"
          aria-label="Textbook style inverting op-amp amplifier circuit with virtual earth summing point"
        >
          <rect x="0" y="0" width="760" height="470" fill={WHITE} />

          {/* Input path with Rin */}
          <Wire
            points={[
              { x: 55, y: 180 },
              { x: 145, y: 180 },
            ]}
          />

          <Resistor x={145} y={180} length={96} />

          <Wire
            points={[
              { x: 241, y: 180 },
              { x: 318, y: 180 },
            ]}
          />

          {/* Full 0V bottom wire restored, because apparently wires enjoy disappearing */}
          <Wire
            points={[
              { x: 55, y: 390 },
              { x: 704, y: 390 },
            ]}
          />

          {/* Virtual earth summing node and vertical 0V reference conductor */}
          <Wire
            points={[
              { x: 318, y: 82 },
              { x: 318, y: 390 },
            ]}
          />

          <Junction x={318} y={180} />

          {/* Inverting input wire */}
          <Wire
            points={[
              { x: 318, y: 180 },
              { x: 420, y: 180 },
            ]}
          />

          {/* Non-inverting input connected to 0V wire */}
          <Wire
            points={[
              { x: 420, y: 302 },
              { x: 375, y: 302 },
              { x: 375, y: 390 },
            ]}
          />

          <Junction x={375} y={390} r={4.5} />

          {/* Feedback path from output to inverting input */}
          <Wire
            points={[
              { x: 318, y: 180 },
              { x: 318, y: 82 },
              { x: 438, y: 82 },
            ]}
          />

          <Resistor x={438} y={82} length={106} />

          <Wire
            points={[
              { x: 544, y: 82 },
              { x: 704, y: 82 },
              { x: 704, y: 250 },
            ]}
          />

          {/* Op-amp body and output */}
          <OpAmp />

          <Wire
            points={[
              { x: 610, y: 250 },
              { x: 704, y: 250 },
            ]}
          />

          {/* Output terminal and output vertical conductor */}
          <Terminal x={704} y={250} />

          <Wire
            points={[
              { x: 704, y: 250 },
              { x: 704, y: 390 },
            ]}
          />

          <Terminal x={704} y={390} r={7} />

          {/* Ground symbol */}
          <Ground x={318} y={390} />

          {/* Virtual earth annotation */}
          <Label x={145} y={31} size={font.title} italic={false}>
            Virtual earth
          </Label>

          <Label x={145} y={57} size={font.title} italic={false}>
            summing point
          </Label>

          {/* Text labels */}
          <SubLabel x={90} y={145} main="I" sub="in" size={22} />
          <SubLabel x={147} y={145} main="I" sub="r" size={22} />
          <SubLabel x={213} y={145} main="R" sub="in" size={22} />

          <SubLabel x={374} y={62} main="I" sub="f" size={22} />
          <SubLabel x={494} y={57} main="R" sub="f" size={24} />

          <SubLabel x={81} y={292} main="V" sub="in" size={22} />

          <Label x={338} y={171} size={18} italic={false}>
            x
          </Label>

          <SubLabel x={268} y={218} main="V" sub="b1" size={21} />
          <SubLabel x={375} y={160} main="V" sub="2" size={21} />
          <SubLabel x={347} y={321} main="V" sub="1" size={21} />

          <SubLabel x={654} y={215} main="I" sub="out" size={22} />
          <SubLabel x={725} y={322} main="V" sub="out" size={22} anchor="start" />

          <Label x={282} y={381} size={19} italic={false}>
            0V
          </Label>
        </svg>
      </section>
    </main>
  );
}