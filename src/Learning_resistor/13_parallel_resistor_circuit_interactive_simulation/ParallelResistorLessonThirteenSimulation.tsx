"use client";

import WhatIsParallelResistorCircuitInteractiveSimulation from "./WhatIsParallelResistorCircuitInteractiveSimulation";

export default function ParallelResistorLessonThirteenSimulation({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  return (
    <WhatIsParallelResistorCircuitInteractiveSimulation embedded={embedded} />
  );
}
