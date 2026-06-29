export type UserRole = "ADMIN" | "LEARNER_EN" | "LEARNER_BN";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  preferredLanguage: "en" | "bn";
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type AdminManagedUser = AuthUser;

export type UpdateUserPayload = {
  fullName?: string;
  preferredLanguage?: "en" | "bn";
  role?: UserRole;
  isEmailVerified?: boolean;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CourseRecord = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  categoryId?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  logicTheoryEn?: string;
  logicTheoryBn?: string;
  udemyScriptEn?: string;
  udemyScriptBn?: string;
  simulationUrl?: string;
  resourcePdfUrl?: string;
  videoUrl?: string;
  downloadableUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";

export type EnrollmentRecord = {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  source: "REQUEST" | "MANUAL";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCoursePayload = {
  title: string;
  slug: string;
  description?: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterVariant = {
  key: UserRole;
  label: string;
  description: string;
  endpoint: "/api/auth/register-admin" | "/api/auth/register-user-english" | "/api/auth/register-user-bangla";
};

export type AdminDashboardData = {
  widgets: {
    totalUsers: number;
    totalCourses: number;
    pendingEnrollments: number;
    completedCourses: number;
    activeLearners: number;
  };
  recentActivities: Array<{
    id: string;
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }>;
  systemHealth: {
    service: string;
    database: string;
    storageDriver: string;
    uploadDirectory: string;
    totalFiles: number;
    totalStorageBytes: number;
    totalStorageMegabytes: number;
    timestamp: string;
  };
};

export type LearnerDashboardData = {
  totalAttempts: number;
  passedAttempts: number;
  averageScore: number;
  results: Array<{
    id: string;
    quizId: string;
    userId: string;
    courseId: string;
    totalScore: number;
    percentage: number;
    passed: boolean;
    attemptType: "MCQ" | "PRACTICE" | "FINAL";
    submittedAt: string;
  }>;
};

export type PublicCourseStats = {
  courseId: string;
  slug: string;
  title: string;
  studentsEnrolled: number;
  lessons: number;
  courseRating: number | null;
  ratingSource: "quiz-attempt-average" | "no-quiz-attempts";
  quizAttempts: number;
};

export const registerVariants: RegisterVariant[] = [
  {
    key: "LEARNER_EN",
    label: "Learner English",
    description: "English learner account for course access and quiz tracking.",
    endpoint: "/api/auth/register-user-english",
  },
  {
    key: "LEARNER_BN",
    label: "Learner Bangla",
    description: "Bangla learner account for the same LMS learner flow.",
    endpoint: "/api/auth/register-user-bangla",
  },
  {
    key: "ADMIN",
    label: "Admin",
    description: "Admin account for dashboard, reporting, files, and management tools.",
    endpoint: "/api/auth/register-admin",
  },
];
