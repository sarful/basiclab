"use client";

import WhatIsCapacitorInteractiveSimulation from "./WhatIsCapacitorInteractiveSimulation";

export default function CapacitorLessonOneSimulation({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  return <WhatIsCapacitorInteractiveSimulation embedded={embedded} />;
}
