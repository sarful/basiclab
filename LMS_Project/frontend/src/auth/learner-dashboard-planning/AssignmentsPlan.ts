import type { LearnerDashboardSectionPlan } from "./types";

export const assignmentsPlan: LearnerDashboardSectionPlan = {
  id: "assignments",
  label: "Assignments",
  status: "placeholder",
  route: "/dashboard/assignments",
  summary: "Placeholder planning scaffold for learner assignments and due-work tracking.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "Prepare assignment cards, due dates, and submission status.",
    "Keep future API shape separate from quiz/exam results.",
  ],
};
