import type { LearnerDashboardSectionPlan } from "./types";

export const progressPlan: LearnerDashboardSectionPlan = {
  id: "progress",
  label: "Progress",
  status: "placeholder",
  route: "/dashboard/progress",
  summary: "Placeholder planning scaffold for learner completion metrics, streaks, and lesson-by-lesson progress.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "Use only the learner's allowed lesson set for percentages.",
    "Keep compatibility with certificate completion logic.",
  ],
};
