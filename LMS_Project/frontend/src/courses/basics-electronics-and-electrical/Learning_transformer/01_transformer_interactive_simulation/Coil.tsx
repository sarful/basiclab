type CoilProps = {
  x: number;
  turns: number;
  color: string;
};

export default function Coil({ x, turns, color }: CoilProps) {
  const coilSpacing = 14;
  const totalHeight = turns * coilSpacing;
  const startY = 255 - totalHeight / 2;

  return (
    <g>
      {Array.from({ length: turns }).map((_, i) => (
        <path
          key={i}
          d={`M ${x} ${startY + i * coilSpacing} q 18 7 0 14 q -18 7 0 14`}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
