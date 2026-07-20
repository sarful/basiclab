"use client";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorInternalOperation/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorInternalOperation/LogicTheoryTab";
import MagneticContactorInternalOperation from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorInternalOperation/MagneticContactorInternalOperation";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorInternalOperationPage() {
  const lessonPanel = <MagneticContactorInternalOperation />;

  return (
    <MagneticContactorLessonFrame
      lessonId={3}
      lessonTitle="Magnetic Contactor Internal Operation"
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
