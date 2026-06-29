import type { LearnerDashboardSectionPlan } from "./types";

export const certificatesPlan: LearnerDashboardSectionPlan = {
  id: "certificates",
  label: "Certificates",
  status: "placeholder",
  route: "/dashboard/certificates",
  summary: "Placeholder planning scaffold for learner certificates, issue status, and downloadable records.",
  dataSources: ["/api/learning/performance-dashboard"],
  notes: [
    "Certificate readiness should follow approved course access and valid completion rules.",
    "Keep future export/download actions separate from dashboard summary cards.",
  ],
};
