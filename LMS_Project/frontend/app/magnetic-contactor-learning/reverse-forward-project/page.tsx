"use client";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/reverse-forward-project/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/reverse-forward-project/LogicTheoryTab";
import ReverseForwardProjectWorkspace from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/reverse-forward-project/ReverseForwardProjectWorkspace";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorReverseForwardProjectPage() {
  const lessonPanel = <ReverseForwardProjectWorkspace />;

  return (
    <MagneticContactorLessonFrame
      lessonId={7}
      lessonTitle="Reverse-Forward Project"
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
