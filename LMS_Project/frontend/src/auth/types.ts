export type UserRole = "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
export type AccountState = "FREE" | "TRIAL" | "PAID";
export type CourseAccessType = "FREE" | "TRIAL_PREVIEW" | "PAID";
export type Occupation = "STUDENT" | "PROFESSIONAL";
export type EngineeringDiscipline =
  | "ELECTRICAL_AND_ELECTRONIC_ENGINEERING"
  | "MECHANICAL_ENGINEERING"
  | "MECHATRONICS_ENGINEERING"
  | "AUTOMATION_ENGINEERING"
  | "ROBOTICS_ENGINEERING";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  address?: string;
  occupation?: Occupation;
  engineeringDiscipline?: EngineeringDiscipline;
  institutionOrCompanyName?: string;
  identityNumber?: string;
  role: UserRole;
  accountState: AccountState;
  preferredLanguage: "en" | "bn";
  isEmailVerified: boolean;
  isSuspended: boolean;
  blockedAt?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type AdminManagedUser = AuthUser;

export type UpdateUserPayload = {
  fullName?: string;
  preferredLanguage?: "en" | "bn";
  role?: UserRole;
  accountState?: AccountState;
  isEmailVerified?: boolean;
};

export type CreateAdminUserPayload = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  accountState?: AccountState;
  preferredLanguage?: "en" | "bn";
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
  accessType: CourseAccessType;
  priceBdt: number;
  previewLessonLimit?: number;
  trialVisible: boolean;
  trialDays: number;
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

export type CourseAccessOutcome =
  | "ALLOW"
  | "LOCKED_COURSE_UNAVAILABLE"
  | "LOCKED_FREE_ONLY"
  | "LOCKED_UPGRADE_REQUIRED"
  | "LOCKED_TRIAL_EXPIRED"
  | "LOCKED_PAYMENT_PENDING"
  | "LOCKED_ENROLLMENT_REQUIRED";

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
  categoryId?: string;
  accessType?: CourseAccessType;
  priceBdt?: number;
  previewLessonLimit?: number;
  trialVisible?: boolean;
  trialDays?: number;
};

export type UpdateCoursePayload = {
  title?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  status?: CourseRecord["status"];
  accessType?: CourseAccessType;
  priceBdt?: number;
  previewLessonLimit?: number;
  trialVisible?: boolean;
  trialDays?: number;
};

export type PaymentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LessonProgressStatus = "STARTED" | "COMPLETED";

export type PaymentRequestRecord = {
  id: string;
  userId: string;
  planName: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  screenshotUrl?: string;
  status: PaymentRequestStatus;
  invoiceStatus: "UNPAID" | "PENDING" | "PAID";
  invoiceNumber?: string;
  courseId?: string;
  paymentReference?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  additionalMessage?: string;
  paidAt?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserSubscriptionRecord = {
  id: string;
  userId: string;
  planCode: AccountState;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING_APPROVAL";
  paymentRequired: boolean;
  startAt: string;
  endAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LessonProgressRecord = {
  id: string;
  userId: string;
  courseSlug: string;
  trackId: string;
  lessonId: number;
  lessonTitle: string;
  lessonPath: string;
  status: LessonProgressStatus;
  progressPercent: number;
  firstStartedAt: string;
  lastViewedAt: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CertificateEligibilityRuleRecord = {
  id: string;
  courseSlug: string;
  minCompletedLessons: number;
  minCompletionRate: number;
  requirePaidAccount: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LearnerCertificateRecord = {
  id: string;
  userId: string;
  courseSlug: string;
  certificateCode: string;
  status: "ISSUED" | "REVOKED";
  issuedAt: string;
  revokedAt?: string;
  completionRateSnapshot: number;
  completedLessonsSnapshot: number;
  createdAt?: string;
  updatedAt?: string;
};

export type LearnerCertificateEligibility = {
  eligible: boolean;
  courseSlug: string;
  reason: string;
  completionRate: number;
  completedLessons: number;
  requiredCompletionRate: number;
  requiredCompletedLessons: number;
  requirePaidAccount: boolean;
  accountState: AccountState;
  alreadyIssued: boolean;
};

export type RegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  mobileNumber: string;
  dateOfBirth?: string;
  gender?: string;
  country: string;
  preferredLanguage: "en" | "bn";
  address?: string;
  occupation: Occupation;
  engineeringDiscipline: EngineeringDiscipline;
  institutionOrCompanyName: string;
  identityNumber?: string;
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
    freeUsers?: number;
    trialUsers?: number;
    paidUsers?: number;
    blockedUsers?: number;
    totalCourses: number;
    pendingEnrollments: number;
    pendingPayments?: number;
    approvedPayments?: number;
    revenueBdt?: number;
    completedCourses: number;
    activeLearners: number;
  };
  topCourses?: Array<{
    courseId: string;
    title: string;
    slug: string;
    accessType: CourseAccessType;
    enrolledUsers: number;
    revenueBdt: number;
  }>;
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

export type AdminActivityLogRecord = {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type LearnerDashboardData = {
  totalAttempts: number;
  passedAttempts: number;
  averageScore: number;
  trackedLessons: number;
  startedLessons: number;
  completedLessons: number;
  completionRate: number;
  nextLessonHref?: string;
  nextLessonTitle?: string;
  lessonProgress: LessonProgressRecord[];
  certificateEligibility: LearnerCertificateEligibility;
  certificateHistory: LearnerCertificateRecord[];
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
