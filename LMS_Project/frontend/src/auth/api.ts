import type {
  AdminManagedUser,
  AdminDashboardData,
  ApiEnvelope,
  AuthUser,
  CourseRecord,
  CreateCoursePayload,
  EnrollmentRecord,
  LearnerDashboardData,
  LoginPayload,
  PublicCourseStats,
  RegisterPayload,
  RegisterVariant,
  UpdateUserPayload,
} from "./types";
import { isBackendDisconnected } from "./backend-mode";

const API_BASE_URL = (process.env.NEXT_PUBLIC_LMS_API_BASE_URL ?? "").replace(/\/$/, "");
const CSRF_TOKEN_HEADER = "x-csrf-token";
const mockTimestamp = "2026-06-18T00:00:00.000Z";
const mockCourseId = "mock-course-basics-electronics-and-electrical";

const mockUser: AuthUser = {
  id: "preview-admin",
  fullName: "Frontend Preview Admin",
  email: "preview@localhost",
  role: "ADMIN",
  preferredLanguage: "en",
  isEmailVerified: true,
  isSuspended: false,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
  lastLoginAt: mockTimestamp,
};

const mockManagedUsers: AdminManagedUser[] = [
  mockUser,
  {
    id: "preview-learner-en",
    fullName: "Preview Learner English",
    email: "learner-en@localhost",
    role: "LEARNER_EN",
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
    totalCourses: 1,
    pendingEnrollments: 0,
    completedCourses: 1,
    activeLearners: 2,
  },
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

  if (path.startsWith("/api/admin/users") && method === "GET") {
    return successEnvelope("Preview users loaded", mockManagedUsers as T);
  }

  if (path.startsWith("/api/admin/users/") && method === "PATCH") {
    const userId = path.split("/").pop() ?? "";
    return successEnvelope("Preview user updated", getMockAdminUser(userId) as T);
  }

  if (path.startsWith("/api/admin/users/") && method === "DELETE") {
    return successEnvelope("Preview user deleted", null as T);
  }

  if (path.endsWith("/suspend") && method === "POST") {
    const userId = path.split("/").at(-2) ?? "";
    return successEnvelope("Preview user suspended", getMockAdminUser(userId) as T);
  }

  if (path.endsWith("/activate") && method === "POST") {
    const userId = path.split("/").at(-2) ?? "";
    return successEnvelope("Preview user activated", getMockAdminUser(userId) as T);
  }

  if (path === "/api/learning/performance-dashboard" && method === "GET") {
    return successEnvelope("Preview learner dashboard loaded", mockLearnerDashboardData as T);
  }

  if (path.startsWith("/api/courses/") && path.endsWith("/stats") && method === "GET") {
    return successEnvelope("Preview course stats loaded", {
      courseId: mockCourse.id,
      slug: mockCourse.slug,
      title: mockCourse.title,
      studentsEnrolled: 24,
      lessons: 13,
      courseRating: 4.8,
      ratingSource: "quiz-attempt-average",
      quizAttempts: 18,
    } as T);
  }

  if ((path === "/api/courses" || path.startsWith("/api/courses?")) && method === "GET") {
    return successEnvelope("Preview course catalog loaded", [mockCourse] as T);
  }

  if (path === "/api/admin/courses" && method === "POST") {
    return successEnvelope("Preview course created", mockCourse as T);
  }

  if ((path === "/api/admin/courses" || path.startsWith("/api/admin/courses?")) && method === "GET") {
    return successEnvelope("Preview admin courses loaded", [mockCourse] as T);
  }

  if (path.includes("/publish") && method === "POST") {
    return successEnvelope("Preview course published", mockCourse as T);
  }

  if (path.includes("/archive") && method === "POST") {
    return successEnvelope("Preview course archived", { ...mockCourse, status: "ARCHIVED" } as T);
  }

  if (path === "/api/enrollments/history" && method === "GET") {
    return successEnvelope("Preview enrollments loaded", [mockEnrollment] as T);
  }

  if (path === "/api/enrollments" && method === "POST") {
    return successEnvelope("Preview enrollment created", mockEnrollment as T);
  }

  if (path === "/api/admin/enrollments" || path.startsWith("/api/admin/enrollments?")) {
    return successEnvelope("Preview enrollments loaded", [mockEnrollment] as T);
  }

  if (path === "/api/admin/enrollments/assign" && method === "POST") {
    return successEnvelope("Preview enrollment assigned", mockEnrollment as T);
  }

  if (path.includes("/approve") && method === "POST") {
    return successEnvelope("Preview enrollment approved", mockEnrollment as T);
  }

  if (path.includes("/reject") && method === "POST") {
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

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  if (isBackendDisconnected()) {
    return mockRequest<T>(path, init);
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

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : {
        success: response.ok,
        message: response.ok ? "Request completed" : "Request failed",
        data: null,
      };

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

export async function register(payload: RegisterPayload, variant: RegisterVariant) {
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
  suspended?: "true" | "false";
}) {
  const searchParams = new URLSearchParams();

  if (query?.q) {
    searchParams.set("q", query.q);
  }

  if (query?.role) {
    searchParams.set("role", query.role);
  }

  if (query?.suspended) {
    searchParams.set("suspended", query.suspended);
  }

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return request<AdminManagedUser[]>(`/api/admin/users${search}`, {
    method: "GET",
  });
}

export async function updateAdminUser(userId: string, payload: UpdateUserPayload) {
  return request<AdminManagedUser>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminUser(userId: string) {
  return request<null>(`/api/admin/users/${userId}`, {
    method: "DELETE",
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
