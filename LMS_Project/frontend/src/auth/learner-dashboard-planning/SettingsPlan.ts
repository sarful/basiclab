import type { LearnerDashboardSectionPlan } from "./types";

export const settingsPlan: LearnerDashboardSectionPlan = {
  id: "settings",
  label: "Settings",
  status: "placeholder",
  route: "/dashboard/settings",
  summary: "Placeholder planning scaffold for learner profile settings, language preference, and account preferences.",
  dataSources: ["/api/auth/me"],
  notes: [
    "Keep language, email verification, and profile editing aligned with auth user data.",
    "Separate security settings from course-preference settings when implemented.",
  ],
};
