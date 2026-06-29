import type { LearnerDashboardSectionPlan } from "./types";

export const examsPlan: LearnerDashboardSectionPlan = {
  id: "exams",
  label: "Exams",
  status: "placeholder",
  route: "/dashboard/exams",
  summary: "Placeholder planning scaffold for learner exam attempts, results, and exam entry flow.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "Separate full exams from short lesson quizzes.",
    "Support pass/fail and percentage summaries.",
  ],
};
