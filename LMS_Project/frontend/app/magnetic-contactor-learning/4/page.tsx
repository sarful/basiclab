"use client";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagram/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagram/LogicTheoryTab";
import MagneticContactorOperationDiagram from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/MagneticContactorOperationDiagram/MagneticContactorOperationDiagram";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorLearningLessonFourPage() {
  const lessonPanel = <MagneticContactorOperationDiagram />;

  return (
    <MagneticContactorLessonFrame
      lessonId={2}
      lessonTitle="Magnetic Contactor Operation Diagram"
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
