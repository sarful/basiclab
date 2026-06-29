"use client";

type BlackWireRefs = {
  copper: string;
  filter: string;
  housing: string;
  pinMetal: string;
};

type GreenWireRefs = {
  filter: string;
  housing: string;
  metal: string;
};

export function BlackMalePin({
  refs,
  tipCx,
  tipCy,
  x1,
  x2,
  y1,
  y2,
}: {
  refs: Pick<BlackWireRefs, "pinMetal">;
  tipCx: number;
  tipCy: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) {
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={`url(#${refs.pinMetal})`}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={tipCx} cy={tipCy} r="3.5" fill="#e5e7eb" />
    </>
  );
}

export function BlackMaleHousing({
  refs,
  sleeveX,
  width,
  x,
  y,
}: {
  refs: BlackWireRefs;
  sleeveX: number;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <g filter={`url(#${refs.filter})`}>
      <rect x={x} y={y} width={width} height="42" rx="3" fill={`url(#${refs.housing})`} />
      <rect x={x + 20} y={y + 7} width="55" height="28" rx="2" fill="#101116" />
      <rect x={x + 81} y={y + 7} width="58" height="28" rx="2" fill="#24262d" />
      <rect x={x + 39} y={y + 14} width="19" height="13" rx="2" fill="#e5e7eb" />
      <rect x={x + 84} y={y + 11} width="42" height="6" rx="2" fill="#555862" opacity="0.65" />
      <rect x={sleeveX} y={y + 6} width="18" height="30" rx="2" fill="#16171d" />
    </g>
  );
}

export function BlackFemaleHousing({ refs }: { refs: BlackWireRefs }) {
  return (
    <>
      <g filter={`url(#${refs.filter})`}>
        <rect x="930" y="55" width="210" height="46" rx="3" fill={`url(#${refs.housing})`} />
        <rect x="1084" y="62" width="42" height="32" rx="2" fill="#0b0c10" />
        <rect x="1092" y="68" width="26" height="20" rx="2" fill="#1f2026" />
        <rect x="1072" y="64" width="13" height="28" rx="2" fill={`url(#${refs.copper})`} />
        <rect x="1125" y="64" width="13" height="28" rx="2" fill={`url(#${refs.copper})`} />
        <rect x="952" y="63" width="78" height="30" rx="2" fill="#2c2d34" />
        <rect x="965" y="69" width="50" height="6" rx="2" fill="#5f626b" opacity="0.7" />
        <rect x="1035" y="63" width="42" height="30" rx="2" fill="#15161c" />
        <rect x="922" y="63" width="20" height="31" rx="2" fill="#15161c" />
      </g>
      <rect x="1136" y="61" width="12" height="34" rx="2" fill="#0b0c10" />
    </>
  );
}

export function GreenFemaleConnectorLeft({ refs }: { refs: GreenWireRefs }) {
  return (
    <g filter={`url(#${refs.filter})`}>
      <rect x="25" y="38" width="240" height="48" rx="3" fill={`url(#${refs.housing})`} />
      <rect x="85" y="42" width="105" height="40" rx="3" fill="#111217" />
      <rect x="103" y="48" width="58" height="28" rx="3" fill="#292a30" />
      <rect x="105" y="51" width="54" height="8" rx="2" fill="#55565c" opacity="0.7" />
      <rect x="94" y="46" width="15" height="32" rx="2" fill={`url(#${refs.metal})`} />
      <rect x="174" y="46" width="15" height="32" rx="2" fill={`url(#${refs.metal})`} />
      <rect x="42" y="47" width="72" height="30" rx="2" fill="#15161b" />
      <rect x="118" y="47" width="115" height="30" rx="2" fill="#15161b" opacity="0.45" />
      <rect x="236" y="43" width="30" height="38" rx="2" fill="#222329" />
    </g>
  );
}

export function GreenFemaleConnectorRight({ refs }: { refs: GreenWireRefs }) {
  return (
    <g filter={`url(#${refs.filter})`}>
      <rect x="955" y="48" width="220" height="44" rx="3" fill={`url(#${refs.housing})`} />
      <rect x="1040" y="52" width="85" height="36" rx="3" fill="#111217" />
      <rect x="1053" y="57" width="50" height="24" rx="3" fill="#292a30" />
      <rect x="1055" y="59" width="46" height="7" rx="2" fill="#55565c" opacity="0.7" />
      <rect x="1030" y="55" width="15" height="30" rx="2" fill={`url(#${refs.metal})`} />
      <rect x="1115" y="55" width="15" height="30" rx="2" fill={`url(#${refs.metal})`} />
      <rect x="970" y="56" width="84" height="28" rx="2" fill="#15161b" opacity="0.55" />
      <rect x="1128" y="56" width="35" height="28" rx="2" fill="#15161b" />
    </g>
  );
}
