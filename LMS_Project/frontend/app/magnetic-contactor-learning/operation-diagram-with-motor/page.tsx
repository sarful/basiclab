"use client";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagramWithMotor/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagramWithMotor/LogicTheoryTab";
import MagneticContactorOperationDiagramWithMotor from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagramWithMotor/MagneticContactorOperationDiagramWithMotor";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorOperationDiagramWithMotorPage() {
  const lessonPanel = <MagneticContactorOperationDiagramWithMotor />;

  return (
    <MagneticContactorLessonFrame
      lessonId={4}
      lessonTitle="Operation Diagram With Motor"
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
