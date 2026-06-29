import type { LearnerDashboardSectionPlan } from "./types";

export const messagesPlan: LearnerDashboardSectionPlan = {
  id: "messages",
  label: "Messages",
  status: "placeholder",
  route: "/dashboard/messages",
  summary: "Placeholder planning scaffold for learner announcements, inbox, and admin communication threads.",
  dataSources: [],
  notes: [
    "Prepare for course announcements and direct admin-to-learner notices.",
    "This section currently has no dedicated API wired yet.",
  ],
};
