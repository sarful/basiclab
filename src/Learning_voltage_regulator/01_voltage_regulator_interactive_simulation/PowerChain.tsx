import FlowDots from "./FlowDots";
import { formatNumber } from "./logic";
import type { RegulatorType } from "./types";

type PowerChainProps = {
  regulatedVoltage: number;
  inputVoltage: number;
  regulatorType: RegulatorType;
};

export default function PowerChain({
  regulatedVoltage,
  inputVoltage,
  regulatorType,
}: PowerChainProps) {
  const active = Math.abs(regulatedVoltage) > 0.1;

  return (
    <svg viewBox="0 0 921 492" className="h-auto w-full bg-white">
      <rect width="921" height="492" fill="#ffffff" />

      <text
        x="501"
        y="52"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="#333"
      >
        {regulatorType}
      </text>

      <line x1="95" y1="117" x2="448" y2="117" stroke="#3f4850" strokeWidth="3" />
      <line x1="560" y1="117" x2="799" y2="117" stroke="#3f4850" strokeWidth="3" />
      <line x1="799" y1="117" x2="799" y2="411" stroke="#3f4850" strokeWidth="3" />
      <line x1="95" y1="411" x2="799" y2="411" stroke="#3f4850" strokeWidth="3" />
      <line x1="95" y1="117" x2="95" y2="411" stroke="#3f4850" strokeWidth="3" />

      <circle cx="94" cy="264" r="39" fill="none" stroke="#3f4850" strokeWidth="3" />
      <line x1="94" y1="239" x2="94" y2="265" stroke="#3f4850" strokeWidth="3" />
      <line x1="82" y1="252" x2="106" y2="252" stroke="#3f4850" strokeWidth="3" />
      <line x1="82" y1="282" x2="106" y2="282" stroke="#3f4850" strokeWidth="3" />

      <text x="142" y="262" fontSize="20" fontWeight="700" fill="#1f2937">
        V1
      </text>
      <text x="142" y="290" fontSize="20" fontWeight="700" fill="#1f2937">
        {inputVoltage} V
      </text>

      <rect
        x="448"
        y="81"
        width="112"
        height="93"
        fill="#ffffff"
        stroke="#4b5563"
        strokeWidth="3"
      />
      <text x="480" y="121" fontSize="16" fontStyle="italic" fontWeight="700" fill="#4b5563">
        IN
      </text>
      <text x="513" y="121" fontSize="16" fontStyle="italic" fontWeight="700" fill="#4b5563">
        OUT
      </text>
      <text x="482" y="164" fontSize="16" fontStyle="italic" fontWeight="700" fill="#4b5563">
        GND
      </text>

      <line x1="504" y1="174" x2="504" y2="411" stroke="#3f4850" strokeWidth="3" />

      <rect
        x="750"
        y="162"
        width="96"
        height="141"
        rx="16"
        fill="#efefef"
        stroke="#3f4850"
        strokeWidth="1.5"
      />
      <text x="798" y="252" textAnchor="middle" fontSize="22" fill="#000">
        {formatNumber(regulatedVoltage, 0)}V
      </text>

      <circle cx="504" cy="411" r="6" fill="#3f4850" />
      <circle cx="799" cy="411" r="8" fill="none" stroke="#3f4850" strokeWidth="3" />

      <FlowDots path="M95 117 H448" active={active} color="#2563eb" count={8} />
      <FlowDots
        path="M560 117 H799 V411 H504"
        active={active}
        color="#16a34a"
        count={10}
      />
    </svg>
  );
}
