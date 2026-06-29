import type { LearnerDashboardSectionPlan } from "./types";

export const lessonsPlan: LearnerDashboardSectionPlan = {
  id: "lessons",
  label: "Lessons",
  status: "placeholder",
  route: "/dashboard/lessons",
  summary: "Placeholder planning scaffold for the learner lesson directory and lesson progress listing.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "List only lessons the learner is allowed to access.",
    "Respect enrollment gating and lesson-variant access rules.",
  ],
};
