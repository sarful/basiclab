import type { LearnerDashboardSectionPlan } from "./types";

export const calendarPlan: LearnerDashboardSectionPlan = {
  id: "calendar",
  label: "Calendar",
  status: "placeholder",
  route: "/dashboard/calendar",
  summary: "Placeholder planning scaffold for learner schedule, due dates, reminders, and lesson calendar items.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "Future calendar can combine assignments, exams, and study reminders.",
    "Keep timezone handling explicit for Bangladesh-based schedules.",
  ],
};
