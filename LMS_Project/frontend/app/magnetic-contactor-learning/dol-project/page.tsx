"use client";

import DOLStarterProjectWorkspace from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/dol-project/DOLStarterProjectWorkspace";
import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/dol-project/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/dol-project/LogicTheoryTab";
import MagneticContactorLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning Magnetic Contactor/shared/MagneticContactorLessonFrame";

export default function MagneticContactorDolProjectPage() {
  const lessonPanel = <DOLStarterProjectWorkspace />;

  return (
    <MagneticContactorLessonFrame
      lessonId={5}
      lessonTitle="DOL Project"
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
