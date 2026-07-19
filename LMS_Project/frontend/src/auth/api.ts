import type {
  AdminActivityLogRecord,
  CreateAdminUserPayload,
  AdminManagedUser,
  AdminDashboardData,
  ApiEnvelope,
  AuthUser,
  CourseRecord,
  CreateCoursePayload,
  EnrollmentRecord,
  LearnerCertificateEligibility,
  LearnerCertificateRecord,
  LessonProgressRecord,
  LearnerDashboardData,
  LoginPayload,
  PaymentRequestRecord,
  PublicCourseStats,
  RegisterPayload,
  RegisterVariant,
  UpdateCoursePayload,
  UpdateUserPayload,
} from "./types";
import { isBackendDisconnected, shouldUseSupabase } from "./backend-mode";
import {
  fetchSupabaseCurrentUser,
  loginWithSupabase,
  logoutFromSupabase,
  prepareSupabasePasswordRecovery,
  registerWithSupabase,
  requestSupabasePasswordReset,
  resendSupabaseVerificationEmail,
  updateSupabasePassword,
} from "@/src/lib/supabase/auth";
import { isSupabaseConfigured } from "@/src/lib/supabase/config";

const API_BASE_URL = (process.env.NEXT_PUBLIC_LMS_API_BASE_URL ?? "").replace(/\/$/, "");
const CSRF_TOKEN_HEADER = "x-csrf-token";
const mockTimestamp = "2026-06-18T00:00:00.000Z";
const mockCourseId = "mock-course-basics-electronics-and-electrical";
const mockIndustrialSensorCourseId = "mock-course-industrial-sensor";

function isAuthPath(path: string) {
  return path === "/api/auth/login"
    || path === "/api/auth/logout"
    || path === "/api/auth/me"
    || path.startsWith("/api/auth/register-");
}

const mockUser: AuthUser = {
  id: "preview-admin",
  fullName: "Frontend Preview Admin",
  email: "preview@localhost",
  role: "ADMIN",
  accountState: "PAID",
  preferredLanguage: "en",
  isEmailVerified: true,
  isSuspended: false,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
  lastLoginAt: mockTimestamp,
};

let mockManagedUsers: AdminManagedUser[] = [
  mockUser,
  {
    id: "preview-learner-en",
    fullName: "Preview Learner English",
    email: "learner-en@localhost",
    role: "LEARNER_EN",
    accountState: "TRIAL",
    preferredLanguage: "en",
    isEmailVerified: true,
    isSuspended: false,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    lastLoginAt: mockTimestamp,
  },
  {
    id: "preview-learner-bn",
    fullName: "Preview Learner Bangla",
    email: "learner-bn@localhost",
    role: "LEARNER_BN",
    accountState: "FREE",
    preferredLanguage: "bn",
    isEmailVerified: true,
    isSuspended: false,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    lastLoginAt: mockTimestamp,
  },
];

const mockCourse: CourseRecord = {
  id: mockCourseId,
  title: "Basics Electronics and Electrical",
  slug: "basics-electronics-and-electrical",
  description: "Frontend preview course available while backend mode is disconnected.",
  status: "PUBLISHED",
  accessType: "FREE",
  priceBdt: 0,
  trialVisible: true,
  trialDays: 7,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
};

const mockIndustrialSensorCourse: CourseRecord = {
  id: mockIndustrialSensorCourseId,
  title: "Industrial Sensor",
  slug: "industrial-sensor",
  description: "Interactive industrial sensor simulator course with PLC wiring focused labs.",
  status: "PUBLISHED",
  accessType: "FREE",
  priceBdt: 0,
  previewLessonLimit: 0,
  trialVisible: true,
  trialDays: 7,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
};

const mockEnrollment: EnrollmentRecord = {
  id: "mock-enrollment-approved",
  userId: "preview-learner-en",
  courseId: mockCourseId,
  status: "APPROVED",
  source: "MANUAL",
  requestedAt: mockTimestamp,
  reviewedAt: mockTimestamp,
  reviewedBy: "preview-admin",
  notes: "Granted automatically in disconnected frontend preview mode.",
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
};

const mockAdminDashboardData: AdminDashboardData = {
  widgets: {
    totalUsers: mockManagedUsers.length,
    freeUsers: 1,
    trialUsers: 1,
    paidUsers: 1,
    blockedUsers: 0,
    totalCourses: 2,
    pendingEnrollments: 0,
    pendingPayments: 1,
    approvedPayments: 0,
    revenueBdt: 0,
    completedCourses: 1,
    activeLearners: 2,
  },
  topCourses: [
    {
      courseId: mockCourseId,
      title: mockCourse.title,
      slug: mockCourse.slug,
      accessType: mockCourse.accessType,
      enrolledUsers: 1,
      revenueBdt: 0,
    },
    {
      courseId: mockIndustrialSensorCourseId,
      title: mockIndustrialSensorCourse.title,
      slug: mockIndustrialSensorCourse.slug,
      accessType: mockIndustrialSensorCourse.accessType,
      enrolledUsers: 0,
      revenueBdt: 0,
    },
  ],
  recentActivities: [
    {
      id: "preview-activity-1",
      userId: "preview-admin",
      action: "PREVIEW_MODE_ENABLED",
      entityType: "System",
      entityId: "frontend-preview",
      metadata: { source: "frontend-only" },
      createdAt: mockTimestamp,
    },
    {
      id: "preview-activity-2",
      userId: "preview-learner-en",
      action: "LESSON_ACCESS_GRANTED",
      entityType: "Enrollment",
      entityId: mockEnrollment.id,
      metadata: { source: "frontend-only" },
      createdAt: mockTimestamp,
    },
  ],
  systemHealth: {
    service: "frontend-preview",
    database: "disconnected",
    storageDriver: "local",
    uploadDirectory: "preview-only",
    totalFiles: 0,
    totalStorageBytes: 0,
    totalStorageMegabytes: 0,
    timestamp: mockTimestamp,
  },
};

const mockLearnerDashboardData: LearnerDashboardData = {
  totalAttempts: 6,
  passedAttempts: 5,
  averageScore: 88,
  trackedLessons: 16,
  startedLessons: 6,
  completedLessons: 5,
  completionRate: 31,
  nextLessonHref: "/current-voltage-learning/6",
  nextLessonTitle: "Power in a Circuit",
  lessonProgress: [
    {
      id: "preview-progress-1",
      userId: "preview-learner-en",
      courseSlug: "basics-electronics-and-electrical",
      trackId: "current-voltage",
      lessonId: 1,
      lessonTitle: "What is Electricity",
      lessonPath: "/current-voltage-learning/1",
      status: "COMPLETED",
      progressPercent: 100,
      firstStartedAt: mockTimestamp,
      lastViewedAt: mockTimestamp,
      completedAt: mockTimestamp,
      createdAt: mockTimestamp,
      updatedAt: mockTimestamp,
    },
    {
      id: "preview-progress-2",
      userId: "preview-learner-en",
      courseSlug: "basics-electronics-and-electrical",
      trackId: "current-voltage",
      lessonId: 2,
      lessonTitle: "What is Current",
      lessonPath: "/current-voltage-learning/2",
      status: "STARTED",
      progressPercent: 35,
      firstStartedAt: mockTimestamp,
      lastViewedAt: mockTimestamp,
      createdAt: mockTimestamp,
      updatedAt: mockTimestamp,
    },
  ],
  certificateEligibility: {
    eligible: false,
    courseSlug: "basics-electronics-and-electrical",
    reason: "Complete the remaining lessons to unlock your certificate.",
    completionRate: 31,
    completedLessons: 5,
    requiredCompletionRate: 70,
    requiredCompletedLessons: 10,
    requirePaidAccount: false,
    accountState: "TRIAL",
    alreadyIssued: false,
  },
  certificateHistory: [
    {
      id: "preview-certificate-1",
      userId: "preview-learner-en",
      courseSlug: "basics-electronics-and-electrical",
      certificateCode: "CERT-BASICS-001",
      status: "ISSUED",
      issuedAt: mockTimestamp,
      completionRateSnapshot: 100,
      completedLessonsSnapshot: 16,
      createdAt: mockTimestamp,
      updatedAt: mockTimestamp,
    },
  ],
  results: [
    {
      id: "preview-result-1",
      quizId: "preview-quiz-current",
      userId: "preview-learner-en",
      courseId: mockCourseId,
      totalScore: 18,
      percentage: 90,
      passed: true,
      attemptType: "PRACTICE",
      submittedAt: mockTimestamp,
    },
  ],
};

let mockCourses: CourseRecord[] = [mockCourse, mockIndustrialSensorCourse];

let mockEnrollments: EnrollmentRecord[] = [mockEnrollment];

let mockPaymentRequests: PaymentRequestRecord[] = [{
  id: "mock-payment-request-1",
  userId: "preview-learner-en",
  planName: "Premium Plan",
  transactionId: "TXN-PREVIEW-001",
  paymentMethod: "BANK_TRANSFER",
  amount: 2000,
  currency: "BDT",
  screenshotUrl: "payment-proofs/preview-learner-en/mock-payment-proof.png",
  status: "PENDING",
  invoiceStatus: "PENDING",
  invoiceNumber: "INV-PREVIEW-001",
  paymentReference: "MLAB-PREVIEW-BKASH",
  submittedAt: mockTimestamp,
  reviewNotes: "Preview admin note",
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
}];

function successEnvelope<T>(message: string, data: T): ApiEnvelope<T> {
  return {
    success: true,
    message,
    data,
  };
}

function getMockAdminUser(userId: string) {
  return mockManagedUsers.find((user) => user.id === userId) ?? mockUser;
}

function getMockCourse(courseId: string) {
  return mockCourses.find((course) => course.id === courseId) ?? mockCourses[0] ?? mockCourse;
}

function getMockCoursesFromPath(path: string) {
  const url = new URL(`http://localhost${path}`);
  const query = url.searchParams.get("q")?.trim().toLowerCase();
  const status = url.searchParams.get("status");

  return mockCourses.filter((course) => {
    const queryMatch = query
      ? course.slug.toLowerCase().includes(query) ||
        course.title.toLowerCase().includes(query)
      : true;
    const statusMatch = status ? course.status === status : true;

    return queryMatch && statusMatch;
  });
}

async function mockRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  const method = init?.method?.toUpperCase() ?? "GET";

  if (path === "/api/auth/login" && method === "POST") {
    return successEnvelope("Preview login successful", { user: mockUser } as T);
  }

  if (path.startsWith("/api/auth/register-") && method === "POST") {
    return successEnvelope("Preview registration successful", { user: mockUser } as T);
  }

  if (path === "/api/auth/me" && method === "GET") {
    return successEnvelope("Preview user loaded", mockUser as T);
  }

  if (path === "/api/auth/logout" && method === "POST") {
    return successEnvelope("Preview logout completed", null as T);
  }

  if (path === "/api/admin/dashboard" && method === "GET") {
    return successEnvelope("Preview admin dashboard loaded", mockAdminDashboardData as T);
  }

  if (path === "/api/admin/activity-logs" || path.startsWith("/api/admin/activity-logs?")) {
    return successEnvelope(
      "Preview activity logs loaded",
      mockAdminDashboardData.recentActivities.map((activity) => ({
        id: activity.id,
        adminUserId: activity.userId ?? mockUser.id,
        action: activity.action,
        entityType: activity.entityType,
        entityId: activity.entityId,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
      })) as T,
    );
  }

  if (path === "/api/admin/payment-requests" || path.startsWith("/api/admin/payment-requests?")) {
    return successEnvelope("Preview payment requests loaded", mockPaymentRequests as T);
  }

  if (path === "/api/payments/history" && method === "GET") {
    return successEnvelope("Preview payment history loaded", mockPaymentRequests as T);
  }

  if (path === "/api/subscriptions/upgrade-request" && method === "POST") {
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    const createdRequest: PaymentRequestRecord = {
      ...mockPaymentRequests[0],
      id: `mock-payment-request-${Date.now()}`,
      userId: mockManagedUsers.find((user) => user.role !== "ADMIN")?.id ?? "preview-learner-en",
      planName: payload.planName ?? mockPaymentRequests[0]?.planName ?? "Premium Plan",
      transactionId: payload.transactionId ?? `TXN-${Date.now()}`,
      paymentMethod: payload.paymentMethod ?? "BANK_TRANSFER",
      amount: payload.amount ?? 2000,
      currency: payload.currency ?? "BDT",
      status: "PENDING",
      invoiceStatus: "PENDING",
      invoiceNumber: payload.invoiceNumber ?? `INV-${Date.now()}`,
      courseId: payload.courseId,
      paymentReference: payload.paymentReference,
      buyerName: payload.buyerName,
      buyerEmail: payload.buyerEmail,
      buyerPhone: payload.buyerPhone,
      additionalMessage: payload.additionalMessage,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPaymentRequests = [createdRequest, ...mockPaymentRequests];
    return successEnvelope("Preview upgrade request submitted", createdRequest as T);
  }

  if (path.startsWith("/api/admin/users") && method === "GET") {
    return successEnvelope("Preview users loaded", mockManagedUsers as T);
  }

  if (path === "/api/admin/users" && method === "POST") {
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    const createdUser: AdminManagedUser = {
      id: `preview-user-${Date.now()}`,
      fullName: payload.fullName ?? "New Preview User",
      email: payload.email ?? `preview-${Date.now()}@localhost`,
      role: payload.role ?? "LEARNER_EN",
      accountState: payload.accountState ?? "TRIAL",
      preferredLanguage: payload.preferredLanguage ?? "en",
      isEmailVerified: Boolean(payload.isEmailVerified ?? true),
      isSuspended: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: undefined,
    };
    mockManagedUsers = [...mockManagedUsers, createdUser];
    return successEnvelope("Preview user created", createdUser as T);
  }

  if (path.startsWith("/api/admin/users/") && method === "PATCH") {
    const userId = path.split("/").pop() ?? "";
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    let updatedUser = getMockAdminUser(userId);
    mockManagedUsers = mockManagedUsers.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      updatedUser = {
        ...user,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedUser;
    });

    return successEnvelope("Preview user updated", updatedUser as T);
  }

  if (path.startsWith("/api/admin/users/") && method === "DELETE") {
    const userId = path.split("/").pop() ?? "";
    const deletedUser = getMockAdminUser(userId);
    mockManagedUsers = mockManagedUsers.filter((user) => user.id !== userId);
    mockEnrollments = mockEnrollments.filter((enrollment) => enrollment.userId !== userId);
    return successEnvelope(
      "Preview user removed",
      { ...deletedUser, removedAt: mockTimestamp, isSuspended: true } as T,
    );
  }

  if (path.endsWith("/restore") && method === "POST") {
    const userId = path.split("/").at(-2) ?? "";
    let restoredUser = getMockAdminUser(userId);
    mockManagedUsers = mockManagedUsers.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      restoredUser = {
        ...user,
        removedAt: undefined,
        isSuspended: false,
        updatedAt: new Date().toISOString(),
      };

      return restoredUser;
    });
    return successEnvelope(
      "Preview user restored",
      restoredUser as T,
    );
  }

  if (path.endsWith("/suspend") && method === "POST") {
    const userId = path.split("/").at(-2) ?? "";
    let updatedUser = getMockAdminUser(userId);
    mockManagedUsers = mockManagedUsers.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      updatedUser = {
        ...user,
        isSuspended: true,
        updatedAt: new Date().toISOString(),
      };

      return updatedUser;
    });
    return successEnvelope("Preview user suspended", updatedUser as T);
  }

  if (path.endsWith("/activate") && method === "POST") {
    const userId = path.split("/").at(-2) ?? "";
    let updatedUser = getMockAdminUser(userId);
    mockManagedUsers = mockManagedUsers.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      updatedUser = {
        ...user,
        isSuspended: false,
        updatedAt: new Date().toISOString(),
      };

      return updatedUser;
    });
    return successEnvelope("Preview user activated", updatedUser as T);
  }

  if (path === "/api/learning/performance-dashboard" && method === "GET") {
    return successEnvelope("Preview learner dashboard loaded", mockLearnerDashboardData as T);
  }

  if (path === "/api/learning/certificates" && method === "GET") {
    return successEnvelope(
      "Preview learner certificates loaded",
      {
        eligibility: mockLearnerDashboardData.certificateEligibility,
        history: mockLearnerDashboardData.certificateHistory,
      } as T,
    );
  }

  if (path === "/api/learning/certificates/issue" && method === "POST") {
    return successEnvelope(
      "Preview learner certificate issued",
      mockLearnerDashboardData.certificateHistory[0] as T,
    );
  }

  if (path.startsWith("/api/learning/lesson-progress") && method === "GET") {
    const url = new URL(`http://localhost${path}`);
    const lessonPath = url.searchParams.get("lessonPath");
    const data = lessonPath
      ? mockLearnerDashboardData.lessonProgress.find((item) => item.lessonPath === lessonPath) ?? null
      : mockLearnerDashboardData.lessonProgress;
    return successEnvelope("Preview lesson progress loaded", data as T);
  }

  if (path === "/api/learning/lesson-progress" && method === "POST") {
    return successEnvelope(
      "Preview lesson progress saved",
      mockLearnerDashboardData.lessonProgress[0] as T,
    );
  }

  if (path.startsWith("/api/courses/") && path.endsWith("/stats") && method === "GET") {
    const slug = decodeURIComponent(path.replace("/api/courses/", "").replace("/stats", ""));
    const course = mockCourses.find((item) => item.slug === slug) ?? mockCourse;

    return successEnvelope("Preview course stats loaded", {
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      studentsEnrolled: 24,
      lessons: course.slug === "industrial-sensor" ? 19 : 13,
      courseRating: 4.8,
      ratingSource: "quiz-attempt-average",
      quizAttempts: 18,
    } as T);
  }

  if ((path === "/api/courses" || path.startsWith("/api/courses?")) && method === "GET") {
    return successEnvelope(
      "Preview course catalog loaded",
      getMockCoursesFromPath(path).filter((course) => course.status === "PUBLISHED") as T,
    );
  }

  if (path === "/api/admin/courses" && method === "POST") {
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    const createdCourse: CourseRecord = {
      ...mockCourse,
      id: `mock-course-${String(payload.slug ?? "new-course")}`,
      title: String(payload.title ?? "New Course"),
      slug: String(payload.slug ?? "new-course"),
      description: payload.description ?? "",
      accessType: payload.accessType ?? "FREE",
      priceBdt: payload.priceBdt ?? 0,
      previewLessonLimit: payload.previewLessonLimit ?? 0,
      trialVisible: payload.trialVisible ?? true,
      trialDays: payload.trialDays ?? 7,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCourses = [createdCourse, ...mockCourses];
    return successEnvelope("Preview course created", createdCourse as T);
  }

  if ((path === "/api/admin/courses" || path.startsWith("/api/admin/courses?")) && method === "GET") {
    return successEnvelope("Preview admin courses loaded", getMockCoursesFromPath(path) as T);
  }

  if (path.includes("/publish") && method === "POST") {
    const courseId = path.split("/").at(-2) ?? "";
    const publishedCourse = { ...getMockCourse(courseId), status: "PUBLISHED" as const };
    mockCourses = mockCourses.map((course) => (course.id === courseId ? publishedCourse : course));
    return successEnvelope("Preview course published", publishedCourse as T);
  }

  if (path.includes("/archive") && method === "POST") {
    const courseId = path.split("/").at(-2) ?? "";
    const archivedCourse = { ...getMockCourse(courseId), status: "ARCHIVED" as const };
    mockCourses = mockCourses.map((course) => (course.id === courseId ? archivedCourse : course));
    return successEnvelope("Preview course archived", archivedCourse as T);
  }

  if (path.startsWith("/api/admin/courses/") && method === "PATCH") {
    const courseId = path.split("/").pop() ?? "";
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    let updatedCourse = getMockCourse(courseId);
    mockCourses = mockCourses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      updatedCourse = {
        ...course,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedCourse;
    });
    return successEnvelope("Preview course updated", updatedCourse as T);
  }

  if (path.startsWith("/api/admin/courses/") && method === "DELETE") {
    const courseId = path.split("/").pop() ?? "";
    let updatedCourse = getMockCourse(courseId);
    mockCourses = mockCourses.map((course) => {
      if (course.id !== courseId) {
        return course;
      }

      updatedCourse = {
        ...course,
        status: "ARCHIVED",
        updatedAt: new Date().toISOString(),
      };

      return updatedCourse;
    });
    return successEnvelope("Preview course deleted", updatedCourse as T);
  }

  if (path === "/api/enrollments/history" && method === "GET") {
    return successEnvelope("Preview enrollments loaded", [mockEnrollment] as T);
  }

  if (path === "/api/enrollments" && method === "POST") {
    return successEnvelope("Preview enrollment created", mockEnrollment as T);
  }

  if (path === "/api/admin/enrollments" || path.startsWith("/api/admin/enrollments?")) {
    return successEnvelope("Preview enrollments loaded", mockEnrollments as T);
  }

  if (path === "/api/admin/enrollments/assign" && method === "POST") {
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    const existingEnrollment = mockEnrollments.find(
      (enrollment) => enrollment.userId === payload.userId && enrollment.courseId === payload.courseId,
    );

    let assignedEnrollment: EnrollmentRecord;

    if (existingEnrollment) {
      assignedEnrollment = {
        ...existingEnrollment,
        status: "APPROVED",
        reviewedAt: new Date().toISOString(),
        reviewedBy: "preview-admin",
        notes: payload.notes ?? existingEnrollment.notes,
        updatedAt: new Date().toISOString(),
      };
      mockEnrollments = mockEnrollments.map((enrollment) =>
        enrollment.id === existingEnrollment.id ? assignedEnrollment : enrollment,
      );
    } else {
      assignedEnrollment = {
        id: `mock-enrollment-${Date.now()}`,
        userId: payload.userId ?? mockEnrollment.userId,
        courseId: payload.courseId ?? mockEnrollment.courseId,
        status: "APPROVED",
        source: "MANUAL",
        requestedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: "preview-admin",
        notes: payload.notes ?? "Manual enrollment from preview admin workspace.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockEnrollments = [...mockEnrollments, assignedEnrollment];
    }

    return successEnvelope("Preview enrollment assigned", assignedEnrollment as T);
  }

  if (path === "/api/admin/enrollments/remove" && method === "POST") {
    const payload = init?.body ? JSON.parse(String(init.body)) : {};
    const targetEnrollment = mockEnrollments.find(
      (enrollment) => enrollment.userId === payload.userId && enrollment.courseId === payload.courseId,
    );

    let removedEnrollment = targetEnrollment ?? {
      ...mockEnrollment,
      id: `mock-enrollment-${Date.now()}`,
      userId: payload.userId ?? mockEnrollment.userId,
      courseId: payload.courseId ?? mockEnrollment.courseId,
      createdAt: new Date().toISOString(),
    };

    removedEnrollment = {
      ...removedEnrollment,
      status: "REMOVED",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "preview-admin",
      notes: payload.notes ?? removedEnrollment.notes,
      updatedAt: new Date().toISOString(),
    };

    if (targetEnrollment) {
      mockEnrollments = mockEnrollments.map((enrollment) =>
        enrollment.id === targetEnrollment.id ? removedEnrollment : enrollment,
      );
    } else {
      mockEnrollments = [...mockEnrollments, removedEnrollment];
    }

    return successEnvelope(
      "Preview enrollment removed",
      removedEnrollment as T,
    );
  }

  if (path.includes("/approve") && method === "POST") {
    if (path.includes("/payment-requests/")) {
      const paymentRequestId = path.split("/").at(-2) ?? "";
      let updatedRequest = mockPaymentRequests.find((payment) => payment.id === paymentRequestId) ?? mockPaymentRequests[0];
      mockPaymentRequests = mockPaymentRequests.map((payment) => {
        if (payment.id !== paymentRequestId) {
          return payment;
        }

        updatedRequest = {
          ...payment,
          status: "APPROVED",
          invoiceStatus: "PAID",
          paidAt: mockTimestamp,
          reviewedAt: mockTimestamp,
          updatedAt: new Date().toISOString(),
        };

        return updatedRequest;
      });
      return successEnvelope(
        "Preview payment request approved",
        updatedRequest as T,
      );
    }
    return successEnvelope("Preview enrollment approved", mockEnrollment as T);
  }

  if (path.includes("/reject") && method === "POST") {
    if (path.includes("/payment-requests/")) {
      const paymentRequestId = path.split("/").at(-2) ?? "";
      let updatedRequest = mockPaymentRequests.find((payment) => payment.id === paymentRequestId) ?? mockPaymentRequests[0];
      mockPaymentRequests = mockPaymentRequests.map((payment) => {
        if (payment.id !== paymentRequestId) {
          return payment;
        }

        updatedRequest = {
          ...payment,
          status: "REJECTED",
          invoiceStatus: "UNPAID",
          paidAt: undefined,
          reviewedAt: mockTimestamp,
          updatedAt: new Date().toISOString(),
        };

        return updatedRequest;
      });
      return successEnvelope(
        "Preview payment request rejected",
        updatedRequest as T,
      );
    }
    return successEnvelope(
      "Preview enrollment rejected",
      { ...mockEnrollment, status: "REJECTED" } as T,
    );
  }

  throw new Error(`No preview handler exists for ${method} ${path}`);
}

async function fetchCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  const payload = (await response.json()) as ApiEnvelope<{ csrfToken: string }>;

  if (!response.ok || !payload?.data?.csrfToken) {
    throw new Error(payload?.message ?? "Unable to fetch CSRF token");
  }

  return payload.data.csrfToken;
}

async function parseApiEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiEnvelope<T>;
  }

  const rawText = await response.text();

  if (rawText.trim().startsWith("<")) {
    throw new Error(
      "Auth/API route returned HTML instead of JSON. Switch to Supabase mode for login/register, or connect the legacy backend API correctly.",
    );
  }

  return {
    success: response.ok,
    message: response.ok ? "Request completed" : rawText || "Request failed",
    data: null as T,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  if (isBackendDisconnected()) {
    return mockRequest<T>(path, init);
  }

  if (shouldUseSupabase() || (isAuthPath(path) && isSupabaseConfigured())) {
    return supabaseRequest<T>(path, init);
  }

  const headers = new Headers(init?.headers);
  const method = init?.method?.toUpperCase() ?? "GET";

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = await fetchCsrfToken();
    headers.set(CSRF_TOKEN_HEADER, csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = await parseApiEnvelope<T>(response);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }

  return payload as ApiEnvelope<T>;
}

async function supabaseRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  const method = init?.method?.toUpperCase() ?? "GET";
  const headers = new Headers(init?.headers);

  if (path === "/api/auth/login" && method === "POST") {
    const payload = JSON.parse(String(init?.body ?? "{}")) as LoginPayload;
    const user = await loginWithSupabase(payload.email, payload.password);
    return successEnvelope("Supabase login successful", { user } as T);
  }

  if (path.startsWith("/api/auth/register-") && method === "POST") {
    const payload = JSON.parse(String(init?.body ?? "{}")) as RegisterPayload;
    const role =
      path === "/api/auth/register-admin"
        ? "ADMIN"
        : path === "/api/auth/register-user-bangla"
          ? "LEARNER_BN"
          : "LEARNER_EN";
    const user = await registerWithSupabase({
      ...payload,
      role,
    });

    return successEnvelope("Supabase registration successful", { user } as T);
  }

  if (path === "/api/auth/me" && method === "GET") {
    const user = await fetchSupabaseCurrentUser();
    return successEnvelope("Supabase user loaded", user as T);
  }

  if (path === "/api/auth/logout" && method === "POST") {
    await logoutFromSupabase();
    return successEnvelope("Supabase logout completed", null as T);
  }

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = await parseApiEnvelope<T>(response);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }

  return payload as ApiEnvelope<T>;
}

export async function login(payload: LoginPayload) {
  return request<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  if (!shouldUseSupabase()) {
    throw new Error("Password reset is available in Supabase mode.");
  }

  const account = await checkAccountAvailability({ email });
  if (!account.data.emailExists) {
    throw new Error("No account found with this email address.");
  }

  await requestSupabasePasswordReset(email);
  return successEnvelope("Password reset email sent", null);
}

export async function preparePasswordResetSession() {
  if (!shouldUseSupabase()) {
    throw new Error("Password reset is available in Supabase mode.");
  }

  await prepareSupabasePasswordRecovery();
  return successEnvelope("Password reset session ready", null);
}

export async function updatePassword(password: string) {
  if (!shouldUseSupabase()) {
    throw new Error("Password reset is available in Supabase mode.");
  }

  await updateSupabasePassword(password);
  return successEnvelope("Password updated successfully", null);
}

export async function resendVerificationEmail(email: string) {
  if (!shouldUseSupabase()) {
    throw new Error("Email verification is available in Supabase mode.");
  }

  const account = await checkAccountAvailability({ email });
  if (!account.data.emailExists) {
    throw new Error("No account found with this email address.");
  }

  await resendSupabaseVerificationEmail(email);
  return successEnvelope("Verification email sent", null);
}

export async function checkAccountAvailability(payload: {
  email?: string;
  username?: string;
}) {
  return request<{
    emailExists: boolean;
    authEmailExists: boolean;
    profileExistsForEmail: boolean;
    authEmailConfirmed: boolean;
    usernameExists: boolean;
  }>("/api/auth/account-check", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload, variant: RegisterVariant) {
  if (shouldUseSupabase()) {
    const account = await checkAccountAvailability({
      email: payload.email,
      username: payload.username,
    });

    if (account.data.emailExists) {
      if (!account.data.profileExistsForEmail) {
        throw new Error(
          "This email exists in Supabase Auth, but no profile row was found. Open Supabase Authentication > Users and delete or recover this email before registering again.",
        );
      }

      throw new Error("This email is already registered. Try logging in instead.");
    }

    if (account.data.usernameExists) {
      throw new Error("This username is already taken. Choose another username.");
    }
  }

  return request<{ user: AuthUser; verification?: { expiresAt: string }; otp?: { expiresAt: string } }>(
    variant.endpoint,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchCurrentUser() {
  return request<AuthUser>("/api/auth/me", {
    method: "GET",
  });
}

export async function logout() {
  return request<null>("/api/auth/logout", {
    method: "POST",
  });
}

export async function fetchAdminDashboard() {
  return request<AdminDashboardData>("/api/admin/dashboard", {
    method: "GET",
  });
}

export async function fetchAdminUsers(query?: {
  q?: string;
  role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  accountState?: "FREE" | "TRIAL" | "PAID";
  suspended?: "true" | "false";
}) {
  const searchParams = new URLSearchParams();

  if (query?.q) {
    searchParams.set("q", query.q);
  }

  if (query?.role) {
    searchParams.set("role", query.role);
  }

  if (query?.accountState) {
    searchParams.set("accountState", query.accountState);
  }

  if (query?.suspended) {
    searchParams.set("suspended", query.suspended);
  }

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return request<AdminManagedUser[]>(`/api/admin/users${search}`, {
    method: "GET",
  });
}

export async function fetchAdminActivityLogs(query?: {
  action?: string;
  entityType?: string;
  q?: string;
}) {
  const searchParams = new URLSearchParams();

  if (query?.action) {
    searchParams.set("action", query.action);
  }

  if (query?.entityType) {
    searchParams.set("entityType", query.entityType);
  }

  if (query?.q) {
    searchParams.set("q", query.q);
  }

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return request<AdminActivityLogRecord[]>(`/api/admin/activity-logs${search}`, {
    method: "GET",
  });
}

export async function updateAdminUser(userId: string, payload: UpdateUserPayload) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createAdminUser(payload: CreateAdminUserPayload) {
  return request<AdminManagedUser>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminUser(userId: string) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export async function restoreAdminUser(userId: string) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}/restore`, {
    method: "POST",
  });
}

export async function suspendAdminUser(userId: string) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}/suspend`, {
    method: "POST",
  });
}

export async function activateAdminUser(userId: string) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}/activate`, {
    method: "POST",
  });
}

export async function fetchLearnerDashboard() {
  return request<LearnerDashboardData>("/api/learning/performance-dashboard", {
    method: "GET",
  });
}

export async function fetchLessonProgress(lessonPath?: string) {
  const search = lessonPath ? `?lessonPath=${encodeURIComponent(lessonPath)}` : "";
  return request<LessonProgressRecord[] | LessonProgressRecord | null>(
    `/api/learning/lesson-progress${search}`,
    {
      method: "GET",
    },
  );
}

export async function saveLessonProgress(payload: {
  lessonPath: string;
  status?: "STARTED" | "COMPLETED";
  progressPercent?: number;
}) {
  return request<LessonProgressRecord | null>("/api/learning/lesson-progress", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchLearnerCertificates() {
  return request<{
    eligibility: LearnerCertificateEligibility | null;
    history: LearnerCertificateRecord[];
  }>("/api/learning/certificates", {
    method: "GET",
  });
}

export async function issueLearnerCertificateRequest() {
  return request<LearnerCertificateRecord>("/api/learning/certificates/issue", {
    method: "POST",
  });
}

export async function fetchCourseCatalog(query?: string) {
  const search = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<CourseRecord[]>(`/api/courses${search}`, {
    method: "GET",
  });
}

export async function fetchPublicCourseStats(slug: string) {
  return request<PublicCourseStats>(`/api/courses/${encodeURIComponent(slug)}/stats`, {
    method: "GET",
  });
}

export async function fetchAdminCourses(query?: string, status?: CourseRecord["status"]) {
  const searchParams = new URLSearchParams();

  if (query) {
    searchParams.set("q", query);
  }

  if (status) {
    searchParams.set("status", status);
  }

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return request<CourseRecord[]>(`/api/admin/courses${search}`, {
    method: "GET",
  });
}

export async function fetchEnrollmentHistory() {
  return request<EnrollmentRecord[]>("/api/enrollments/history", {
    method: "GET",
  });
}

export async function createEnrollmentRequest(courseId: string) {
  return request<EnrollmentRecord>("/api/enrollments", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
}

export async function createAdminCourse(payload: CreateCoursePayload) {
  return request<CourseRecord>("/api/admin/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCourse(courseId: string, payload: UpdateCoursePayload) {
  return request<CourseRecord>(`/api/admin/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCourse(courseId: string) {
  return request<CourseRecord>(`/api/admin/courses/${courseId}`, {
    method: "DELETE",
  });
}

export async function publishAdminCourse(courseId: string) {
  return request<CourseRecord>(`/api/admin/courses/${courseId}/publish`, {
    method: "POST",
  });
}

export async function archiveAdminCourse(courseId: string) {
  return request<CourseRecord>(`/api/admin/courses/${courseId}/archive`, {
    method: "POST",
  });
}

export async function fetchAdminEnrollments(courseId?: string) {
  const search = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  return request<EnrollmentRecord[]>(`/api/admin/enrollments${search}`, {
    method: "GET",
  });
}

export async function assignAdminEnrollment(userId: string, courseId: string, notes?: string) {
  return request<EnrollmentRecord>("/api/admin/enrollments/assign", {
    method: "POST",
    body: JSON.stringify(notes ? { userId, courseId, notes } : { userId, courseId }),
  });
}

export async function removeAdminEnrollment(userId: string, courseId: string, notes?: string) {
  return request<EnrollmentRecord>("/api/admin/enrollments/remove", {
    method: "POST",
    body: JSON.stringify(notes ? { userId, courseId, notes } : { userId, courseId }),
  });
}

export async function fetchAdminPaymentRequests(status?: "PENDING" | "APPROVED" | "REJECTED") {
  const search = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<PaymentRequestRecord[]>(`/api/admin/payment-requests${search}`, {
    method: "GET",
  });
}

export async function approveAdminPaymentRequest(paymentRequestId: string, reviewNotes?: string) {
  return request<PaymentRequestRecord>(
    `/api/admin/payment-requests/${paymentRequestId}/approve`,
    {
      method: "POST",
      body: JSON.stringify(reviewNotes ? { reviewNotes } : {}),
    },
  );
}

export async function rejectAdminPaymentRequest(paymentRequestId: string, reviewNotes?: string) {
  return request<PaymentRequestRecord>(
    `/api/admin/payment-requests/${paymentRequestId}/reject`,
    {
      method: "POST",
      body: JSON.stringify(reviewNotes ? { reviewNotes } : {}),
    },
  );
}

export async function fetchPaymentHistory() {
  return request<PaymentRequestRecord[]>("/api/payments/history", {
    method: "GET",
  });
}

export async function createUpgradeRequest(payload: {
  planName: string;
  transactionId: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  invoiceNumber?: string;
  courseId?: string;
  paymentReference?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  additionalMessage?: string;
}) {
  return request<PaymentRequestRecord>("/api/subscriptions/upgrade-request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function approveAdminEnrollment(enrollmentId: string, notes?: string) {
  return request<EnrollmentRecord>(`/api/admin/enrollments/${enrollmentId}/approve`, {
    method: "POST",
    body: JSON.stringify(notes ? { notes } : {}),
  });
}

export async function rejectAdminEnrollment(enrollmentId: string, notes?: string) {
  return request<EnrollmentRecord>(`/api/admin/enrollments/${enrollmentId}/reject`, {
    method: "POST",
    body: JSON.stringify(notes ? { notes } : {}),
  });
}
