import type { RegulatorType } from "./types";

type RegulatorSelectorSectionProps = {
  regulatorType: RegulatorType;
  setRegulatorType: (value: RegulatorType) => void;
};

export default function RegulatorSelectorSection({
  regulatorType,
  setRegulatorType,
}: RegulatorSelectorSectionProps) {
  const buttons: Array<{ value: RegulatorType; tone: string }> = [
    { value: "7805", tone: "bg-blue-600" },
    { value: "7809", tone: "bg-blue-600" },
    { value: "7812", tone: "bg-blue-600" },
    { value: "7905", tone: "bg-red-600" },
    { value: "7912", tone: "bg-red-600" },
    { value: "LM317", tone: "bg-green-600" },
  ];

  return (
    <>
      {buttons.map(({ value, tone }) => (
        <button
          key={value}
          onClick={() => setRegulatorType(value)}
          className={`rounded-2xl p-4 font-black text-white transition ${
            regulatorType === value ? `${tone} ring-4 ring-slate-200` : tone
          }`}
        >
          {value}
        </button>
      ))}
    </>
  );
}
