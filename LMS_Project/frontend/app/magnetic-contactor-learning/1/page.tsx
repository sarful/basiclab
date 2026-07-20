"use client";

import AnatomyLessonOneWorkspace from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/Anatomy Components/AnatomyLessonOneWorkspace";
import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/Anatomy Components/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/Anatomy Components/LogicTheoryTab";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorLearningLessonOnePage() {
  const lessonPanel = <AnatomyLessonOneWorkspace />;

  return (
    <MagneticContactorLessonFrame
      lessonId={1}
      lessonTitle="Anatomy Components"
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
