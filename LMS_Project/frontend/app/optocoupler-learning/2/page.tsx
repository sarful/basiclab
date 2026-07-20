"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning_optocoupler/2.OptocouplerPins/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning_optocoupler/2.OptocouplerPins/LogicTheoryTab";
import OptocouplerPins from "../../../src/courses/basics-electronics-and-electrical/Learning_optocoupler/2.OptocouplerPins/OptocouplerPins";
import OptocouplerLessonFrame from "../../../src/courses/basics-electronics-and-electrical/Learning_optocoupler/shared/OptocouplerLessonFrame";

export default function OptocouplerLearningLessonTwoPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const requestedTab = searchParams.get("tab");
  const activeTab =
    requestedTab === "logic" ||
    requestedTab === "logic_bn" ||
    requestedTab === "lesson"
      ? requestedTab
      : "lesson";

  const handleTabChange = (tabId: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", tabId);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const currentPanel =
    activeTab === "logic" ? (
      <LogicTheoryTab />
    ) : activeTab === "logic_bn" ? (
      <LogicTheoryBanglaTab />
    ) : (
      <OptocouplerPins />
    );

  return (
    <OptocouplerLessonFrame
      lessonId={2}
      tabs={[
        { id: "logic", label: "Logic & Theory" },
        { id: "logic_bn", label: "Logic & Theory (Bangla)" },
        { id: "lesson", label: "Simulation" },
      ]}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {currentPanel}
    </OptocouplerLessonFrame>
  );
}
