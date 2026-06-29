import type { LearnerDashboardSectionPlan } from "./types";

export const myCoursesPlan: LearnerDashboardSectionPlan = {
  id: "my-courses",
  label: "My Courses",
  status: "placeholder",
  route: "/dashboard/my-courses",
  summary: "Placeholder planning scaffold for the learner course list and continue-learning surface.",
  dataSources: ["/api/enrollments/history", "/api/courses", "/api/learning/performance-dashboard"],
  notes: [
    "Show approved enrollments first.",
    "Connect each course card to course page and first unlocked lesson.",
  ],
};
