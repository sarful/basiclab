"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchCurrentUser } from "./api";
import type { UserRole } from "./types";

export type LessonTabAccessId = "logic" | "logic_bn" | "english" | "bangla" | "lesson";

export type LessonTabOption<T extends string = LessonTabAccessId> = {
  id: T;
  label: string;
};

export const LESSON_TAB_ACCESS: Record<UserRole, LessonTabAccessId[]> = {
  ADMIN: ["logic", "logic_bn", "english", "bangla", "lesson"],
  LEARNER_EN: ["logic", "lesson"],
  LEARNER_BN: ["logic_bn", "lesson"],
};

export function getAllowedLessonTabIds(role: UserRole | null) {
  if (!role) {
    return ["lesson"] as LessonTabAccessId[];
  }

  return LESSON_TAB_ACCESS[role];
}

export function filterLessonTabsByRole<T extends string>(
  tabs: LessonTabOption<T>[],
  role: UserRole | null,
) {
  const allowedTabIds = new Set<string>(getAllowedLessonTabIds(role));
  return tabs.filter((tab) => allowedTabIds.has(tab.id));
}

export function useAuthorizedLessonTabs<T extends string>(
  allTabs: LessonTabOption<T>[],
  preferredTab: T,
) {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((response) => {
        if (isMounted) {
          setRole(response.data.role);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRole(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = useMemo(() => {
    const visibleTabs = filterLessonTabsByRole(allTabs, role);

    if (visibleTabs.length > 0) {
      return visibleTabs;
    }

    return allTabs.filter((tab) => tab.id === preferredTab).slice(0, 1);
  }, [allTabs, preferredTab, role]);

  const [activeTab, setActiveTab] = useState<T>(preferredTab);

  useEffect(() => {
    const activeTabIsVisible = tabs.some((tab) => tab.id === activeTab);

    if (!activeTabIsVisible && tabs[0]) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

  return {
    activeTab,
    setActiveTab,
    tabs,
    role,
  };
}
