"use client";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/star_delta_control_diagram/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/star_delta_control_diagram/LogicTheoryTab";
import StarDeltaWithTimerWorkspace from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/star_delta_control_diagram/StarDeltaWithTimerWorkspace";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorStarDeltaControlDiagramPage() {
  const lessonPanel = <StarDeltaWithTimerWorkspace />;

  return (
    <MagneticContactorLessonFrame
      lessonId={6}
      lessonTitle="Star-Delta Control Diagram"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
    >
      {lessonPanel}
    </MagneticContactorLessonFrame>
  );
}
