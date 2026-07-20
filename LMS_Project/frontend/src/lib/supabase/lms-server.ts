import { getSupabaseAdminClient } from "./admin";
import { getServerSupabaseClient } from "./server";
import { findLessonByPathname, getAllLessons } from "@/src/courses/basics-electronics-and-electrical/shared/lessonRegistry";
import {
  normalizeCourse,
  normalizeEnrollment,
  normalizeLessonProgress,
  normalizePaymentRequest,
  normalizeProfileToAuthUser,
  normalizeUserSubscription,
  type SupabaseCourseRow,
  type SupabaseEnrollmentRow,
  type SupabaseLessonProgressRow,
  type SupabasePaymentRequestRow,
  type SupabaseProfileRow,
  type SupabaseUserSubscriptionRow,
} from "./lms-shared";

export function successResponse<T>(message: string, data: T) {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string) {
  return {
    success: false,
    message,
    data: null,
  };
}

type DashboardActivity = {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type AdminActivityLogRow = {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

type AccountState = "FREE" | "TRIAL" | "PAID";

type AuthProfileSelection = {
  id: string;
  full_name?: string | null;
  role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN" | null;
  account_state?: AccountState | null;
  preferred_language?: "en" | "bn" | null;
  is_suspended?: boolean | null;
  blocked_at?: string | null;
  removed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DashboardProfileSelection = {
  id: string;
  role: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  account_state?: AccountState | null;
  is_suspended: boolean;
  created_at: string;
};

type LessonProgressRowSelection = {
  id: string;
  user_id: string;
  course_slug: string;
  track_id: string;
  lesson_id: number;
  lesson_title: string;
  lesson_path: string;
  status: "STARTED" | "COMPLETED";
  progress_percent: number;
  first_started_at: string;
  last_viewed_at: string;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CertificateEligibilityRuleRow = {
  id: string;
  course_slug: string;
  min_completed_lessons: number;
  min_completion_rate: number;
  require_paid_account: boolean;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type LearnerCertificateRow = {
  id: string;
  user_id: string;
  course_slug: string;
  rule_id?: string | null;
  certificate_code: string;
  status: "ISSUED" | "REVOKED";
  issued_at: string;
  revoked_at?: string | null;
  completion_rate_snapshot: number;
  completed_lessons_snapshot: number;
  created_at?: string | null;
  updated_at?: string | null;
};

function normalizeAdminActivityLog(row: AdminActivityLogRow) {
  return {
    id: row.id,
    adminUserId: row.admin_user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id ?? undefined,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  };
}

const DEFAULT_BASICS_COURSE = {
  title: "Basics Electronics and Electrical",
  slug: "basics-electronics-and-electrical",
  description:
    "Single frontend course that groups the core electronics and electrical learning modules.",
  status: "PUBLISHED" as const,
};

const DEFAULT_INDUSTRIAL_SENSOR_COURSE = {
  title: "Industrial Sensor",
  slug: "industrial-sensor",
  description: "Interactive industrial sensor simulator course with PLC wiring focused labs.",
  status: "PUBLISHED" as const,
};

const DEFAULT_FRONTEND_COURSES = [
  DEFAULT_BASICS_COURSE,
  DEFAULT_INDUSTRIAL_SENSOR_COURSE,
] as const;

function isMissingTableError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() ?? "";
  return (
    message.includes("could not find the table") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

function isEnrollmentUniqueConflict(
  error: { code?: string; message?: string; details?: string } | null | undefined,
) {
  const message = error?.message?.toLowerCase() ?? "";
  const details = error?.details?.toLowerCase() ?? "";

  return (
    error?.code === "23505" ||
    message.includes("enrollments_user_id_course_id_key") ||
    details.includes("enrollments_user_id_course_id_key")
  );
}

function isMissingColumnError(
  error: { message?: string } | null | undefined,
  table: string,
  column: string,
) {
  const message = error?.message?.toLowerCase() ?? "";
  const normalizedTable = table.toLowerCase();
  const normalizedColumn = column.toLowerCase();
  return (
    message.includes("column") &&
    (
      (
        message.includes(`${normalizedTable}.${normalizedColumn}`) &&
        message.includes("does not exist")
      ) ||
      (
        message.includes(`'${normalizedColumn}'`) &&
        message.includes(`'${normalizedTable}'`) &&
        message.includes("schema cache")
      )
    )
  );
}

function isMissingProfilesAccountStateError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "profiles", "account_state");
}

function isMissingProfilesBlockedAtError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "profiles", "blocked_at");
}

function isMissingProfilesRemovedAtError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "profiles", "removed_at");
}

function isMissingOptionalProfilesColumnError(error: { message?: string } | null | undefined) {
  return (
    isMissingProfilesAccountStateError(error) ||
    isMissingProfilesBlockedAtError(error) ||
    isMissingProfilesRemovedAtError(error)
  );
}

function isMissingCoursesAccessTypeError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "access_type");
}

function isMissingCoursesPriceBdtError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "price_bdt");
}

function isMissingCoursesPreviewLessonLimitError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "preview_lesson_limit");
}

function isMissingCoursesTrialVisibleError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "trial_visible");
}

function isMissingCoursesTrialDaysError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "trial_days");
}

function isMissingCoursesDeletedAtError(error: { message?: string } | null | undefined) {
  return isMissingColumnError(error, "courses", "deleted_at");
}

function isMissingOptionalCoursesColumnError(error: { message?: string } | null | undefined) {
  return (
    isMissingCoursesAccessTypeError(error) ||
    isMissingCoursesPriceBdtError(error) ||
    isMissingCoursesPreviewLessonLimitError(error) ||
    isMissingCoursesTrialVisibleError(error) ||
    isMissingCoursesTrialDaysError(error) ||
    isMissingCoursesDeletedAtError(error)
  );
}

function isMissingInvoicePaymentColumnError(error: { message?: string } | null | undefined) {
  return [
    "invoice_status",
    "invoice_number",
    "course_id",
    "payment_reference",
    "buyer_name",
    "buyer_email",
    "buyer_phone",
    "additional_message",
    "paid_at",
  ].some((column) => isMissingColumnError(error, "payment_requests", column));
}

function toReadableSupabaseError(error: { message?: string } | null | undefined) {
  const message = error?.message ?? "Supabase request failed.";
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid api key")) {
    return "Invalid Supabase secret key. Update SUPABASE_SECRET_KEY in .env.local for project davogpcxtauqsrqtvcfw, then restart npm run dev.";
  }

  if (isMissingOptionalProfilesColumnError(error)) {
    return "Supabase schema is outdated: one or more profiles columns from migration 0003 are missing. Apply 0003_admin_subscription_foundation.sql in Supabase SQL Editor, then restart npm run dev.";
  }

  if (isMissingOptionalCoursesColumnError(error)) {
    return "Supabase schema is outdated: one or more courses columns from migration 0003 are missing. Apply 0003_admin_subscription_foundation.sql in Supabase SQL Editor, then restart npm run dev.";
  }

  return message;
}

function inferAccountStateFromRole(role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN" | null): AccountState {
  return role === "ADMIN" ? "PAID" : "TRIAL";
}

function isDefaultFrontendCourseSlug(value?: string) {
  const normalizedValue = value?.trim().toLowerCase();
  return DEFAULT_FRONTEND_COURSES.some((course) => course.slug === normalizedValue);
}

function clampProgressPercent(value?: number) {
  const normalized = Number.isFinite(value) ? Math.trunc(value as number) : 0;
  return Math.max(0, Math.min(normalized, 100));
}

function buildLearnerLessonSummary(progressRows: LessonProgressRowSelection[]) {
  const trackedLessons = getAllLessons();
  const progressByPath = new Map(progressRows.map((row) => [row.lesson_path, row]));
  const startedLessons = progressRows.length;
  const completedLessons = progressRows.filter((row) => row.status === "COMPLETED").length;
  const completionRate = trackedLessons.length
    ? Math.round((completedLessons / trackedLessons.length) * 100)
    : 0;
  const nextLesson = trackedLessons.find((lesson) => {
    const progress = progressByPath.get(lesson.href);
    return !progress || progress.status !== "COMPLETED";
  });

  return {
    trackedLessons: trackedLessons.length,
    startedLessons,
    completedLessons,
    completionRate,
    nextLessonHref: nextLesson?.href,
    nextLessonTitle: nextLesson?.title,
  };
}

async function loadLessonProgressRows(userId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .order("last_viewed_at", { ascending: false });

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [] as LessonProgressRowSelection[];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return ((response.data ?? []) as SupabaseLessonProgressRow[]).map((row) => ({
    ...row,
    status: row.status,
  }));
}

async function loadCertificateRule(courseSlug: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("certificate_eligibility_rules")
    .select("*")
    .eq("course_slug", courseSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return null;
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as CertificateEligibilityRuleRow | null) ?? null;
}

async function loadLearnerCertificates(userId: string, courseSlug?: string) {
  const admin = getSupabaseAdminClient();
  let request = admin
    .from("learner_certificates")
    .select("*")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  if (courseSlug) {
    request = request.eq("course_slug", courseSlug);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [] as LearnerCertificateRow[];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data ?? []) as LearnerCertificateRow[];
}

function normalizeLearnerCertificate(row: LearnerCertificateRow) {
  return {
    id: row.id,
    userId: row.user_id,
    courseSlug: row.course_slug,
    certificateCode: row.certificate_code,
    status: row.status,
    issuedAt: row.issued_at,
    revokedAt: row.revoked_at ?? undefined,
    completionRateSnapshot: row.completion_rate_snapshot,
    completedLessonsSnapshot: row.completed_lessons_snapshot,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

async function loadAuthenticatedProfile(userId: string) {
  const admin = getSupabaseAdminClient();
  const profileResponse = await admin
    .from("profiles")
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (profileResponse.error) {
    if (isMissingOptionalProfilesColumnError(profileResponse.error)) {
      const fallbackResponse = await admin
        .from("profiles")
        .select("id, full_name, role, preferred_language, is_suspended, created_at, updated_at")
        .eq("id", userId)
        .maybeSingle();

      if (fallbackResponse.error) {
        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      const fallbackProfile = (fallbackResponse.data as AuthProfileSelection | null) ?? null;
      return fallbackProfile
        ? {
            ...fallbackProfile,
            blocked_at: null,
            removed_at: null,
          }
        : null;
    }

    if (!isMissingTableError(profileResponse.error)) {
      throw new Error(toReadableSupabaseError(profileResponse.error));
    }
  }

  return (profileResponse.data as AuthProfileSelection | null) ?? null;
}

async function loadDashboardProfiles() {
  const admin = getSupabaseAdminClient();
  const profilesResponse = await admin
    .from("profiles")
    .select("id, role, account_state, is_suspended, created_at");

  if (profilesResponse.error) {
    if (isMissingProfilesAccountStateError(profilesResponse.error)) {
      const fallbackResponse = await admin
        .from("profiles")
        .select("id, role, is_suspended, created_at");

      if (fallbackResponse.error) {
        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      return {
        data: ((fallbackResponse.data ?? []) as Array<Omit<DashboardProfileSelection, "account_state">>).map(
          (profile) => ({
            ...profile,
            account_state: inferAccountStateFromRole(profile.role),
          }),
        ),
        schemaFallback: true,
      };
    }

    if (isMissingTableError(profilesResponse.error)) {
      return {
        data: [] as DashboardProfileSelection[],
        schemaFallback: true,
      };
    }

    throw new Error(toReadableSupabaseError(profilesResponse.error));
  }

  return {
    data: (profilesResponse.data ?? []) as DashboardProfileSelection[],
    schemaFallback: false,
  };
}

async function loadAdminManagedProfiles() {
  const admin = getSupabaseAdminClient();
  const profileResponse = await admin
    .from("profiles")
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .is("removed_at", null)
    .order("created_at", { ascending: false });

  if (profileResponse.error) {
    if (isMissingOptionalProfilesColumnError(profileResponse.error)) {
      const fallbackResponse = await admin
        .from("profiles")
        .select("id, full_name, role, preferred_language, is_suspended, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (fallbackResponse.error) {
        if (isMissingTableError(fallbackResponse.error)) {
          return {
            data: [] as SupabaseProfileRow[],
            schemaFallback: true,
          };
        }

        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      return {
        data: ((fallbackResponse.data ?? []) as SupabaseProfileRow[]).map((profile) => ({
          ...profile,
          blocked_at: null,
          removed_at: null,
        })),
        schemaFallback: true,
      };
    }

    if (isMissingTableError(profileResponse.error)) {
      return {
        data: [] as SupabaseProfileRow[],
        schemaFallback: true,
      };
    }

    throw new Error(toReadableSupabaseError(profileResponse.error));
  }

  return {
    data: (profileResponse.data ?? []) as SupabaseProfileRow[],
    schemaFallback: false,
  };
}

async function loadDashboardCourses() {
  const admin = getSupabaseAdminClient();
  const coursesResponse = await admin
    .from("courses")
    .select("id, title, slug, status, access_type, price_bdt, created_at, updated_at");

  if (coursesResponse.error) {
    if (isMissingOptionalCoursesColumnError(coursesResponse.error)) {
      const fallbackResponse = await admin
        .from("courses")
        .select("id, title, slug, status, created_at, updated_at");

      if (fallbackResponse.error) {
        if (isMissingTableError(fallbackResponse.error)) {
          return {
            data: [] as Array<{
              id: string;
              title: string;
              slug: string;
              status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
              access_type?: "FREE" | "TRIAL_PREVIEW" | "PAID";
              price_bdt?: number;
              created_at: string;
              updated_at: string;
            }>,
            schemaFallback: true,
          };
        }

        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      return {
        data: ((fallbackResponse.data ?? []) as Array<{
          id: string;
          title: string;
          slug: string;
          status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
          created_at: string;
          updated_at: string;
        }>).map((course) => ({
          ...course,
          access_type: "FREE" as const,
          price_bdt: 0,
        })),
        schemaFallback: true,
      };
    }

    if (isMissingTableError(coursesResponse.error)) {
      return {
        data: [] as Array<{
          id: string;
          title: string;
          slug: string;
          status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
          access_type?: "FREE" | "TRIAL_PREVIEW" | "PAID";
          price_bdt?: number;
          created_at: string;
          updated_at: string;
        }>,
        schemaFallback: true,
      };
    }

    throw new Error(toReadableSupabaseError(coursesResponse.error));
  }

  return {
    data: (coursesResponse.data ?? []) as Array<{
      id: string;
      title: string;
      slug: string;
      status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      access_type?: "FREE" | "TRIAL_PREVIEW" | "PAID";
      price_bdt?: number;
      created_at: string;
      updated_at: string;
    }>,
    schemaFallback: false,
  };
}

async function ensureDefaultBasicsCourse() {
  return ensureDefaultFrontendCourse(DEFAULT_BASICS_COURSE);
}

async function ensureDefaultFrontendCourse(defaultCourse: (typeof DEFAULT_FRONTEND_COURSES)[number]) {
  const admin = getSupabaseAdminClient() as any;
  const existingResponse = (await admin
    .from("courses")
    .select("*")
    .eq("slug", defaultCourse.slug)
    .maybeSingle()) as {
      data: SupabaseCourseRow | null;
      error: { message?: string } | null;
    };

  if (existingResponse.error) {
    if (isMissingTableError(existingResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(existingResponse.error.message);
  }

  if (existingResponse.data) {
    return normalizeCourse(existingResponse.data as SupabaseCourseRow);
  }

  const insertResponse = (await admin
    .from("courses")
    .insert(defaultCourse)
    .select("*")
    .single()) as {
      data: SupabaseCourseRow;
      error: { message?: string } | null;
    };

  if (insertResponse.error) {
    if (isMissingTableError(insertResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(insertResponse.error.message);
  }

  return normalizeCourse(insertResponse.data as SupabaseCourseRow);
}

async function ensureDefaultFrontendCourses() {
  const courses = [];

  for (const defaultCourse of DEFAULT_FRONTEND_COURSES) {
    courses.push(await ensureDefaultFrontendCourse(defaultCourse));
  }

  return courses;
}

async function ensureMissingDefaultFrontendCourses(existingCourses: ReturnType<typeof normalizeCourse>[]) {
  const coursesBySlug = new Map(existingCourses.map((course) => [course.slug, course]));
  const ensuredCourses = [...existingCourses];

  for (const defaultCourse of DEFAULT_FRONTEND_COURSES) {
    if (!coursesBySlug.has(defaultCourse.slug)) {
      const ensuredCourse = await ensureDefaultFrontendCourse(defaultCourse);
      if (ensuredCourse.status === "PUBLISHED") {
        ensuredCourses.push(ensuredCourse);
      }
    }
  }

  return ensuredCourses;
}

async function refreshExpiredTrialForUser(userId: string) {
  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();
  const subscriptionResponse = await admin
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_code", "TRIAL")
    .eq("status", "ACTIVE")
    .lt("end_at", now)
    .maybeSingle();

  if (subscriptionResponse.error) {
    if (isMissingTableError(subscriptionResponse.error)) {
      return false;
    }
    throw new Error(toReadableSupabaseError(subscriptionResponse.error));
  }

  if (!subscriptionResponse.data) {
    return false;
  }

  const subscription = subscriptionResponse.data as SupabaseUserSubscriptionRow;
  const updateSubscriptionResponse = await admin
    .from("user_subscriptions")
    .update({
      status: "EXPIRED",
      updated_at: now,
    })
    .eq("id", subscription.id);

  if (updateSubscriptionResponse.error) {
    throw new Error(toReadableSupabaseError(updateSubscriptionResponse.error));
  }

  const updateProfileResponse = await admin
    .from("profiles")
    .update({
      account_state: "FREE",
      updated_at: now,
    })
    .eq("id", userId)
    .eq("account_state", "TRIAL");

  if (updateProfileResponse.error) {
    if (isMissingProfilesAccountStateError(updateProfileResponse.error)) {
      return true;
    }
    throw new Error(toReadableSupabaseError(updateProfileResponse.error));
  }

  return true;
}

export async function requireAuthenticatedUser() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  await refreshExpiredTrialForUser(user.id);
  const profile = (await loadAuthenticatedProfile(user.id)) as SupabaseProfileRow | null;
  const normalizedUser = normalizeProfileToAuthUser(user, profile);

  if (normalizedUser.isSuspended) {
    throw new Error("Account is suspended");
  }

  return normalizedUser;
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}

export async function logAdminActivity(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("admin_activity_logs")
    .insert({
      admin_user_id: input.adminUserId,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return null;
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeAdminActivityLog(response.data as AdminActivityLogRow);
}

export async function listAdminActivityLogs(query?: {
  action?: string;
  entityType?: string;
  q?: string;
}) {
  const admin = getSupabaseAdminClient();
  let request = admin
    .from("admin_activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (query?.action) {
    request = request.eq("action", query.action);
  }

  if (query?.entityType) {
    request = request.eq("entity_type", query.entityType);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  const logs = ((response.data ?? []) as AdminActivityLogRow[]).map(normalizeAdminActivityLog);

  if (!query?.q) {
    return logs;
  }

  const normalizedQuery = query.q.trim().toLowerCase();
  return logs.filter((log) =>
    [log.action, log.entityType, log.entityId, JSON.stringify(log.metadata ?? {})]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
  );
}

export async function listPublishedCourses(query?: string) {
  const admin = getSupabaseAdminClient();
  let request = admin
    .from("courses")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("updated_at", { ascending: false });

  if (query) {
    request = request.or(`slug.ilike.%${query}%,title.ilike.%${query}%`);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  const courses = (response.data as SupabaseCourseRow[]).map(normalizeCourse);

  if (!courses.length && query && isDefaultFrontendCourseSlug(query)) {
    const defaultCourse = DEFAULT_FRONTEND_COURSES.find((course) => course.slug === query);
    if (!defaultCourse) {
      return [];
    }

    const ensuredCourse = await ensureDefaultFrontendCourse(defaultCourse);
    return ensuredCourse.status === "PUBLISHED" ? [ensuredCourse] : [];
  }

  if (!courses.length && !query) {
    const ensuredCourses = await ensureDefaultFrontendCourses();
    return ensuredCourses.filter((course) => course.status === "PUBLISHED");
  }

  if (!query) {
    return ensureMissingDefaultFrontendCourses(courses);
  }

  return courses;
}

export async function listAdminCourses(query?: string, status?: string) {
  const admin = getSupabaseAdminClient();
  let request = admin.from("courses").select("*").order("updated_at", { ascending: false });

  if (query) {
    request = request.or(`slug.ilike.%${query}%,title.ilike.%${query}%`);
  }

  if (status) {
    request = request.eq("status", status);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  const courses = (response.data as SupabaseCourseRow[]).map(normalizeCourse);

  if (!courses.length && (!query || isDefaultFrontendCourseSlug(query)) && (!status || status === "PUBLISHED")) {
    return ensureDefaultFrontendCourses();
  }

  if (!query && (!status || status === "PUBLISHED")) {
    return ensureMissingDefaultFrontendCourses(courses);
  }

  return courses;
}

export async function createCourse(input: {
  title: string;
  slug: string;
  description?: string;
  categoryId?: string;
  accessType?: "FREE" | "TRIAL_PREVIEW" | "PAID";
  priceBdt?: number;
  previewLessonLimit?: number;
  trialVisible?: boolean;
  trialDays?: number;
}) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("courses")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      category_id: input.categoryId || null,
      status: "DRAFT",
      access_type: input.accessType ?? "FREE",
      price_bdt: input.priceBdt ?? 0,
      preview_lesson_limit: input.previewLessonLimit ?? null,
      trial_visible: input.trialVisible ?? true,
      trial_days: Math.min(365, Math.max(1, Math.trunc(input.trialDays ?? 7))),
    })
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeCourse(response.data as SupabaseCourseRow);
}

export async function updateCourse(
  courseId: string,
  input: {
    title?: string;
    slug?: string;
    description?: string;
    categoryId?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    accessType?: "FREE" | "TRIAL_PREVIEW" | "PAID";
    priceBdt?: number;
    previewLessonLimit?: number;
    trialVisible?: boolean;
    trialDays?: number;
  },
) {
  const admin = getSupabaseAdminClient();
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    updatePayload.title = input.title;
  }
  if (input.slug !== undefined) {
    updatePayload.slug = input.slug;
  }
  if (input.description !== undefined) {
    updatePayload.description = input.description || null;
  }
  if (input.categoryId !== undefined) {
    updatePayload.category_id = input.categoryId || null;
  }
  if (input.status !== undefined) {
    updatePayload.status = input.status;
  }
  if (input.accessType !== undefined) {
    updatePayload.access_type = input.accessType;
  }
  if (input.priceBdt !== undefined) {
    updatePayload.price_bdt = input.priceBdt;
  }
  if (input.previewLessonLimit !== undefined) {
    updatePayload.preview_lesson_limit = input.previewLessonLimit || null;
  }
  if (input.trialVisible !== undefined) {
    updatePayload.trial_visible = input.trialVisible;
  }
  if (input.trialDays !== undefined) {
    updatePayload.trial_days = Math.min(365, Math.max(1, Math.trunc(input.trialDays)));
  }

  if (input.accessType === "FREE") {
    updatePayload.price_bdt = 0;
  }

  const response = await admin
    .from("courses")
    .update(updatePayload)
    .eq("id", courseId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (response.error) {
    if (isMissingOptionalCoursesColumnError(response.error)) {
      const fallbackUpdatePayload = { ...updatePayload };
      delete fallbackUpdatePayload.access_type;
      delete fallbackUpdatePayload.price_bdt;
      delete fallbackUpdatePayload.preview_lesson_limit;
      delete fallbackUpdatePayload.trial_visible;
      delete fallbackUpdatePayload.trial_days;

      const fallbackResponse = await admin
        .from("courses")
        .update(fallbackUpdatePayload)
        .eq("id", courseId)
        .select("id, title, slug, description, status, created_at, updated_at")
        .single();

      if (fallbackResponse.error) {
        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      return normalizeCourse({
        ...(fallbackResponse.data as SupabaseCourseRow),
        category_id: input.categoryId || null,
        access_type: input.accessType ?? "FREE",
        price_bdt: input.accessType === "FREE" ? 0 : input.priceBdt ?? 0,
        preview_lesson_limit:
          input.accessType === "TRIAL_PREVIEW" ? input.previewLessonLimit ?? null : null,
        trial_visible: input.trialVisible ?? true,
        trial_days: input.trialDays ?? 7,
      });
    }
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeCourse(response.data as SupabaseCourseRow);
}

export async function updateCourseStatus(courseId: string, status: "PUBLISHED" | "ARCHIVED") {
  const admin = getSupabaseAdminClient();
  const updatedAt = new Date().toISOString();
  const response = await admin
    .from("courses")
    .update({ status, updated_at: updatedAt })
    .eq("id", courseId)
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeCourse(response.data as SupabaseCourseRow);
}

export async function safeDeleteCourse(courseId: string) {
  const admin = getSupabaseAdminClient();
  const courseResponse = await admin
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .is("deleted_at", null)
    .maybeSingle();

  if (courseResponse.error) {
    if (isMissingTableError(courseResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(courseResponse.error));
  }

  if (!courseResponse.data) {
    throw new Error("Course not found or already deleted.");
  }

  const dependencyResponse = await admin
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId)
    .in("status", ["PENDING", "APPROVED"]);

  if (dependencyResponse.error) {
    if (isMissingTableError(dependencyResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(dependencyResponse.error));
  }

  if ((dependencyResponse.count ?? 0) > 0) {
    throw new Error(
      "Safe delete blocked. Remove or resolve pending and approved enrollments before deleting this course.",
    );
  }

  const deletedAt = new Date().toISOString();
  const originalSlug = (courseResponse.data as SupabaseCourseRow).slug;
  const response = await admin
    .from("courses")
    .update({
      status: "ARCHIVED",
      deleted_at: deletedAt,
      slug: `${originalSlug}--deleted-${Date.now()}`,
      updated_at: deletedAt,
    })
    .eq("id", courseId)
    .select("*")
    .single();

  if (response.error) {
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeCourse(response.data as SupabaseCourseRow);
}

export async function listUserEnrollments(userId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("requested_at", { ascending: false });

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as SupabaseEnrollmentRow[]).map(normalizeEnrollment);
}

export async function listAdminEnrollments(courseId?: string) {
  const admin = getSupabaseAdminClient();
  let request = admin
    .from("enrollments")
    .select("*")
    .order("requested_at", { ascending: false });

  if (courseId) {
    request = request.eq("course_id", courseId);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as SupabaseEnrollmentRow[]).map(normalizeEnrollment);
}

export async function createEnrollment(
  userId: string,
  courseId: string,
  accountState: AccountState,
) {
  const admin = getSupabaseAdminClient();
  const courseResponse = await admin
    .from("courses")
    .select("id, status, access_type, trial_visible")
    .eq("id", courseId)
    .maybeSingle();

  if (courseResponse.error) {
    throw new Error(toReadableSupabaseError(courseResponse.error));
  }

  if (!courseResponse.data || courseResponse.data.status !== "PUBLISHED") {
    throw new Error("This course is not published and cannot accept learner enrollment.");
  }

  const courseAccessType = courseResponse.data.access_type ?? "FREE";
  if (courseAccessType === "PAID" && accountState !== "PAID") {
    throw new Error("Paid course access requires an approved payment or manual admin access.");
  }

  if (
    courseAccessType === "TRIAL_PREVIEW" &&
    accountState === "TRIAL" &&
    courseResponse.data.trial_visible === false
  ) {
    throw new Error("Trial access is not available for this course.");
  }

  const returnOrReactivateEnrollment = async (enrollment: SupabaseEnrollmentRow) => {
    if (enrollment.status === "APPROVED") {
      return normalizeEnrollment(enrollment);
    }

    const updated = await admin
      .from("enrollments")
      .update({
        status: "APPROVED",
        source: "REQUEST",
        reviewed_at: new Date().toISOString(),
        reviewed_by: null,
        notes: enrollment.status === "PENDING" ? (enrollment.notes ?? "Auto-approved for trial/paid account.") : "Auto-approved for trial/paid account.",
        updated_at: new Date().toISOString(),
      })
      .eq("id", enrollment.id)
      .select("*")
      .single();

    if (updated.error) {
      throw new Error(toReadableSupabaseError(updated.error));
    }

    return normalizeEnrollment(updated.data as SupabaseEnrollmentRow);
  };

  const existing = await admin
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing.error) {
    if (isMissingTableError(existing.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(existing.error));
  }

  if (existing.data) {
    return returnOrReactivateEnrollment(existing.data as SupabaseEnrollmentRow);
  }

  const response = await admin
    .from("enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      status: "APPROVED",
      source: "REQUEST",
      reviewed_at: new Date().toISOString(),
      notes: "Auto-approved for trial/paid account.",
    })
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }

    if (isEnrollmentUniqueConflict(response.error)) {
      const conflict = await admin
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (conflict.error) {
        throw new Error(toReadableSupabaseError(conflict.error));
      }

      if (conflict.data) {
        return returnOrReactivateEnrollment(conflict.data as SupabaseEnrollmentRow);
      }
    }

    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeEnrollment(response.data as SupabaseEnrollmentRow);
}

export async function assignEnrollment(userId: string, courseId: string, notes?: string) {
  const admin = getSupabaseAdminClient();

  const existing = await admin
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing.error) {
    if (isMissingTableError(existing.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(existing.error));
  }

  if (existing.data) {
    const updated = await admin
      .from("enrollments")
      .update({
        status: "APPROVED",
        source: "MANUAL",
        notes: notes ?? existing.data.notes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", existing.data.id)
      .select("*")
      .single();

    if (updated.error) {
      if (isMissingTableError(updated.error)) {
        throw new Error(
          "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
        );
      }
      throw new Error(toReadableSupabaseError(updated.error));
    }

    return normalizeEnrollment(updated.data as SupabaseEnrollmentRow);
  }

  const response = await admin
    .from("enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      status: "APPROVED",
      source: "MANUAL",
      notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeEnrollment(response.data as SupabaseEnrollmentRow);
}

export async function removeEnrollmentAccess(userId: string, courseId: string, notes?: string) {
  const admin = getSupabaseAdminClient();
  const existing = await admin
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing.error) {
    if (isMissingTableError(existing.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(existing.error));
  }

  if (!existing.data) {
    throw new Error("No manual or requested access exists for this user and course.");
  }

  const response = await admin
    .from("enrollments")
    .update({
      status: "REMOVED",
      source: "MANUAL",
      notes: notes ?? existing.data.notes ?? "Access removed by admin.",
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.data.id)
    .select("*")
    .single();

  if (response.error) {
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeEnrollment(response.data as SupabaseEnrollmentRow);
}

export async function getPublicCourseStats(slug: string) {
  const admin = getSupabaseAdminClient();
  const courseResponse = await admin
    .from("courses")
    .select("id, slug, title")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (courseResponse.error) {
    if (isMissingTableError(courseResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(courseResponse.error));
  }

  if (!courseResponse.data && isDefaultFrontendCourseSlug(slug)) {
    const course = await ensureDefaultBasicsCourse();
    if (course.status !== "PUBLISHED") {
      throw new Error("Course is not published.");
    }

    return {
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      studentsEnrolled: 0,
      lessons: 0,
      courseRating: null,
      ratingSource: "no-quiz-attempts" as const,
      quizAttempts: 0,
    };
  }

  if (!courseResponse.data) {
    throw new Error("Course not found");
  }

  const enrollmentResponse = await admin
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseResponse.data.id)
    .eq("status", "APPROVED");

  if (enrollmentResponse.error) {
    if (isMissingTableError(enrollmentResponse.error)) {
      return {
        courseId: courseResponse.data.id,
        slug: courseResponse.data.slug,
        title: courseResponse.data.title,
        studentsEnrolled: 0,
        lessons: 0,
        courseRating: null,
        ratingSource: "no-quiz-attempts" as const,
        quizAttempts: 0,
      };
    }
    throw new Error(toReadableSupabaseError(enrollmentResponse.error));
  }

  return {
    courseId: courseResponse.data.id,
    slug: courseResponse.data.slug,
    title: courseResponse.data.title,
    studentsEnrolled: enrollmentResponse.count ?? 0,
    lessons: 0,
    courseRating: null,
    ratingSource: "no-quiz-attempts" as const,
    quizAttempts: 0,
  };
}

export async function listAdminUsers(query?: {
  q?: string;
  role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  accountState?: AccountState;
  suspended?: "true" | "false";
}) {
  const admin = getSupabaseAdminClient();
  const profilesResult = await loadAdminManagedProfiles();
  let profiles = profilesResult.data;

  if (query?.role) {
    profiles = profiles.filter((profile) => profile.role === query.role);
  }

  if (query?.suspended) {
    const suspended = query.suspended === "true";
    profiles = profiles.filter((profile) => Boolean(profile.is_suspended) === suspended);
  }

  if (query?.accountState) {
    profiles = profiles.filter((profile) => profile.account_state === query.accountState);
  }

  const ids = profiles.map((profile) => profile.id);

  const authUsers =
    ids.length > 0
      ? await Promise.all(
          ids.map(async (id) => {
            const response = await admin.auth.admin.getUserById(id);
            if (response.error || !response.data.user) {
              return null;
            }
            return response.data.user;
          }),
        )
      : [];

  const authUserMap = new Map(authUsers.filter(Boolean).map((user) => [user!.id, user!]));

  const normalized = profiles
    .map((profile) => {
      const authUser = authUserMap.get(profile.id);
      if (!authUser) {
        return null;
      }

      return normalizeProfileToAuthUser(authUser, profile);
    })
    .filter(Boolean);

  if (query?.q) {
    const normalizedQuery = query.q.trim().toLowerCase();
    return normalized.filter((user) => {
      if (!user) {
        return false;
      }

      return [user.fullName, user.email, user.role, user.preferredLanguage, user.accountState]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }

  return normalized;
}

export async function createAdminManagedUser(payload: {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  accountState?: AccountState;
  preferredLanguage?: "en" | "bn";
  isEmailVerified?: boolean;
}) {
  const admin = getSupabaseAdminClient();
  const preferredLanguage =
    payload.preferredLanguage ?? (payload.role === "LEARNER_BN" ? "bn" : "en");
  const createResponse = await admin.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: payload.isEmailVerified ?? true,
    user_metadata: {
      full_name: payload.fullName,
      role: payload.role,
      preferred_language: preferredLanguage,
    },
  });

  if (createResponse.error || !createResponse.data.user) {
    throw new Error(toReadableSupabaseError(createResponse.error));
  }

  const userId = createResponse.data.user.id;
  const profileResponse = await admin
    .from("profiles")
    .update({
      full_name: payload.fullName,
      role: payload.role,
      account_state: payload.accountState ?? (payload.role === "ADMIN" ? "PAID" : "TRIAL"),
      preferred_language: preferredLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .single();

  if (profileResponse.error) {
    throw new Error(toReadableSupabaseError(profileResponse.error));
  }

  return normalizeProfileToAuthUser(createResponse.data.user, profileResponse.data as SupabaseProfileRow);
}

export async function updateAdminUserProfile(
  targetUserId: string,
  payload: {
    fullName?: string;
    preferredLanguage?: "en" | "bn";
    role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
    accountState?: AccountState;
    isEmailVerified?: boolean;
  },
) {
  const admin = getSupabaseAdminClient();
  const existingAuthUserResponse = await admin.auth.admin.getUserById(targetUserId);
  if (existingAuthUserResponse.error || !existingAuthUserResponse.data.user) {
    throw new Error(existingAuthUserResponse.error?.message ?? "Unable to load target user.");
  }

  const existingAuthUser = existingAuthUserResponse.data.user;
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.fullName !== undefined) {
    updatePayload.full_name = payload.fullName;
  }
  if (payload.preferredLanguage !== undefined) {
    updatePayload.preferred_language = payload.preferredLanguage;
  }
  if (payload.role !== undefined) {
    updatePayload.role = payload.role;
  }
  if (payload.accountState !== undefined) {
    updatePayload.account_state = payload.accountState;
  }

  let normalizedProfile: SupabaseProfileRow;
  const response = await admin
    .from("profiles")
    .update(updatePayload)
    .eq("id", targetUserId)
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .single();

  if (response.error) {
    if (isMissingOptionalProfilesColumnError(response.error)) {
      const fallbackUpdatePayload = { ...updatePayload };
      delete fallbackUpdatePayload.account_state;

      const fallbackResponse = await admin
        .from("profiles")
        .update(fallbackUpdatePayload)
        .eq("id", targetUserId)
        .select("id, full_name, role, preferred_language, is_suspended, created_at, updated_at")
        .single();

      if (fallbackResponse.error) {
        throw new Error(toReadableSupabaseError(fallbackResponse.error));
      }

      const fallbackProfile = fallbackResponse.data as AuthProfileSelection;
      normalizedProfile = {
        ...fallbackProfile,
        account_state:
          payload.accountState ??
          inferAccountStateFromRole(
            (payload.role ?? fallbackProfile.role ?? "LEARNER_EN") as
              | "ADMIN"
              | "LEARNER_EN"
              | "LEARNER_BN",
          ),
        blocked_at: null,
        removed_at: null,
      };
    } else {
      throw new Error(toReadableSupabaseError(response.error));
    }
  } else {
    normalizedProfile = response.data as SupabaseProfileRow;
  }

  if (payload.isEmailVerified !== undefined) {
    const authUpdateResponse = await admin.auth.admin.updateUserById(targetUserId, {
      email_confirm: payload.isEmailVerified,
    });

    if (authUpdateResponse.error) {
      throw new Error(toReadableSupabaseError(authUpdateResponse.error));
    }
  }

  const metadataUpdate: Record<string, unknown> = {
    ...(existingAuthUser.user_metadata ?? {}),
  };
  if (payload.fullName !== undefined) {
    metadataUpdate.full_name = payload.fullName;
  }
  if (payload.role !== undefined) {
    metadataUpdate.role = payload.role;
  }
  if (payload.preferredLanguage !== undefined) {
    metadataUpdate.preferred_language = payload.preferredLanguage;
  }
  if (payload.accountState !== undefined) {
    metadataUpdate.account_state = payload.accountState;
  }

  if (Object.keys(metadataUpdate).length > 0) {
    const metadataResponse = await admin.auth.admin.updateUserById(targetUserId, {
      user_metadata: metadataUpdate,
    });

    if (metadataResponse.error) {
      console.error("Admin user metadata sync failed:", metadataResponse.error);
    }
  }

  const authUserResponse = await admin.auth.admin.getUserById(targetUserId);
  if (authUserResponse.error || !authUserResponse.data.user) {
    return normalizeProfileToAuthUser(existingAuthUser, normalizedProfile);
  }

  return normalizeProfileToAuthUser(authUserResponse.data.user, normalizedProfile);
}

export async function setAdminUserSuspended(targetUserId: string, suspended: boolean) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("profiles")
    .update({
      is_suspended: suspended,
      blocked_at: suspended ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetUserId)
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .single();

  if (response.error) {
    throw new Error(toReadableSupabaseError(response.error));
  }

  const authUserResponse = await admin.auth.admin.getUserById(targetUserId);
  if (authUserResponse.error || !authUserResponse.data.user) {
    throw new Error(authUserResponse.error?.message ?? "Unable to load updated user.");
  }

  return normalizeProfileToAuthUser(authUserResponse.data.user, response.data as SupabaseProfileRow);
}

export async function deleteAdminUserProfile(targetUserId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("profiles")
    .update({
      removed_at: new Date().toISOString(),
      is_suspended: true,
      blocked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetUserId)
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .single();

  if (response.error) {
    throw new Error(toReadableSupabaseError(response.error));
  }

  const authUserResponse = await admin.auth.admin.getUserById(targetUserId);
  if (authUserResponse.error || !authUserResponse.data.user) {
    throw new Error(authUserResponse.error?.message ?? "Unable to load removed user.");
  }

  return normalizeProfileToAuthUser(authUserResponse.data.user, response.data as SupabaseProfileRow);
}

export async function restoreAdminUserProfile(targetUserId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("profiles")
    .update({
      removed_at: null,
      is_suspended: false,
      blocked_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetUserId)
    .select("id, full_name, role, account_state, preferred_language, is_suspended, blocked_at, removed_at, created_at, updated_at")
    .single();

  if (response.error) {
    throw new Error(toReadableSupabaseError(response.error));
  }

  const authUserResponse = await admin.auth.admin.getUserById(targetUserId);
  if (authUserResponse.error || !authUserResponse.data.user) {
    throw new Error(authUserResponse.error?.message ?? "Unable to load restored user.");
  }

  return normalizeProfileToAuthUser(authUserResponse.data.user, response.data as SupabaseProfileRow);
}

export async function listPaymentRequests(status?: "PENDING" | "APPROVED" | "REJECTED") {
  const admin = getSupabaseAdminClient();
  let request = admin
    .from("payment_requests")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (status) {
    request = request.eq("status", status);
  }

  const response = await request;
  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as SupabasePaymentRequestRow[]).map(normalizePaymentRequest);
}

export async function listUserPaymentRequests(userId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("payment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as SupabasePaymentRequestRow[]).map(normalizePaymentRequest);
}

export async function createPaymentRequest(input: {
  userId: string;
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
  const admin = getSupabaseAdminClient();
  const planName = input.planName.trim();
  const transactionId = input.transactionId.trim();
  const paymentMethod = input.paymentMethod?.trim() || "BANK_TRANSFER";
  const currency = input.currency?.trim().toUpperCase() || "BDT";
  const amount = Math.max(0, Math.round((input.amount ?? 0) * 100) / 100);

  if (!planName) {
    throw new Error("Plan name is required.");
  }

  if (!transactionId) {
    throw new Error("Transaction ID is required.");
  }

  if (!paymentMethod) {
    throw new Error("Payment method is required.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (input.courseId) {
    const courseResponse = await admin
      .from("courses")
      .select("id, status")
      .eq("id", input.courseId)
      .maybeSingle();

    if (courseResponse.error) {
      throw new Error(toReadableSupabaseError(courseResponse.error));
    }

    if (!courseResponse.data || courseResponse.data.status !== "PUBLISHED") {
      throw new Error("This course is not published and cannot accept payment requests.");
    }
  }

  const duplicateResponse = await admin
    .from("payment_requests")
    .select("id, status, user_id")
    .ilike("transaction_id", transactionId)
    .in("status", ["PENDING", "APPROVED"])
    .limit(1)
    .maybeSingle();

  if (duplicateResponse.error) {
    if (isMissingTableError(duplicateResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(duplicateResponse.error));
  }

  if (duplicateResponse.data) {
    throw new Error("This transaction ID has already been used in an active payment request.");
  }

  const existingPendingResponse = await admin
    .from("payment_requests")
    .select("id")
    .eq("user_id", input.userId)
    .eq("status", "PENDING")
    .limit(1)
    .maybeSingle();

  if (existingPendingResponse.error) {
    if (isMissingTableError(existingPendingResponse.error)) {
      throw new Error(
        "Supabase project mismatch detected. Update .env.local to the project where you created the tables.",
      );
    }
    throw new Error(toReadableSupabaseError(existingPendingResponse.error));
  }

  if (existingPendingResponse.data) {
    throw new Error("You already have a pending payment request. Wait for review before submitting another.");
  }

  const basePaymentRequest = {
    user_id: input.userId,
    plan_name: planName,
    transaction_id: transactionId,
    payment_method: paymentMethod,
    amount,
    currency,
    status: "PENDING",
  };

  const response = await admin
    .from("payment_requests")
    .insert({
      ...basePaymentRequest,
      invoice_status: "PENDING",
      invoice_number: input.invoiceNumber?.trim() || null,
      course_id: input.courseId || null,
      payment_reference: input.paymentReference?.trim() || null,
      buyer_name: input.buyerName?.trim() || null,
      buyer_email: input.buyerEmail?.trim() || null,
      buyer_phone: input.buyerPhone?.trim() || null,
      additional_message: input.additionalMessage?.trim() || null,
    })
    .select("*")
    .single();

  if (response.error) {
    if (!isMissingInvoicePaymentColumnError(response.error)) {
      throw new Error(toReadableSupabaseError(response.error));
    }

    const legacyResponse = await admin
      .from("payment_requests")
      .insert(basePaymentRequest)
      .select("*")
      .single();

    if (legacyResponse.error) {
      throw new Error(toReadableSupabaseError(legacyResponse.error));
    }

    return normalizePaymentRequest(legacyResponse.data as SupabasePaymentRequestRow);
  }

  return normalizePaymentRequest(response.data as SupabasePaymentRequestRow);
}

export async function reviewPaymentRequest(
  paymentRequestId: string,
  review: {
    status: "APPROVED" | "REJECTED";
    reviewedBy: string;
    reviewNotes?: string;
  },
) {
  const admin = getSupabaseAdminClient();
  const reviewDate = new Date().toISOString();
  const baseReviewPayload = {
    status: review.status,
    reviewed_at: reviewDate,
    reviewed_by: review.reviewedBy,
    review_notes: review.reviewNotes ?? null,
    updated_at: reviewDate,
  };

  const paymentRequestResponse = await admin
    .from("payment_requests")
    .update({
      ...baseReviewPayload,
      invoice_status: review.status === "APPROVED" ? "PAID" : "UNPAID",
      paid_at: review.status === "APPROVED" ? reviewDate : null,
    })
    .eq("id", paymentRequestId)
    .select("*")
    .single();

  if (paymentRequestResponse.error) {
    if (!isMissingInvoicePaymentColumnError(paymentRequestResponse.error)) {
      throw new Error(toReadableSupabaseError(paymentRequestResponse.error));
    }

    const legacyReviewResponse = await admin
      .from("payment_requests")
      .update(baseReviewPayload)
      .eq("id", paymentRequestId)
      .select("*")
      .single();

    if (legacyReviewResponse.error) {
      throw new Error(toReadableSupabaseError(legacyReviewResponse.error));
    }

    const legacyPaymentRequest = legacyReviewResponse.data as SupabasePaymentRequestRow;

    if (review.status === "APPROVED") {
      const subscriptionResponse = await admin
        .from("user_subscriptions")
        .insert({
          user_id: legacyPaymentRequest.user_id,
          plan_code: "PAID",
          status: "ACTIVE",
          payment_required: true,
          start_at: reviewDate,
          approved_at: reviewDate,
          approved_by: review.reviewedBy,
        })
        .select("*")
        .single();

      if (subscriptionResponse.error) {
        throw new Error(toReadableSupabaseError(subscriptionResponse.error));
      }

      const profileResponse = await admin
        .from("profiles")
        .update({
          account_state: "PAID",
          updated_at: reviewDate,
        })
        .eq("id", legacyPaymentRequest.user_id);

      if (profileResponse.error) {
        throw new Error(toReadableSupabaseError(profileResponse.error));
      }
    }

    return normalizePaymentRequest(legacyPaymentRequest);
  }

  const paymentRequest = paymentRequestResponse.data as SupabasePaymentRequestRow;

  if (review.status === "APPROVED") {
    const subscriptionResponse = await admin
      .from("user_subscriptions")
      .insert({
        user_id: paymentRequest.user_id,
        plan_code: "PAID",
        status: "ACTIVE",
        payment_required: true,
        start_at: reviewDate,
        approved_at: reviewDate,
        approved_by: review.reviewedBy,
      })
      .select("*")
      .single();

    if (subscriptionResponse.error) {
      throw new Error(toReadableSupabaseError(subscriptionResponse.error));
    }

    const profileResponse = await admin
      .from("profiles")
      .update({
        account_state: "PAID",
        updated_at: reviewDate,
      })
      .eq("id", paymentRequest.user_id);

    if (profileResponse.error) {
      throw new Error(toReadableSupabaseError(profileResponse.error));
    }
  }

  return normalizePaymentRequest(paymentRequest);
}

export async function listUserSubscriptions(userId: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("start_at", { ascending: false });

  if (response.error) {
    if (isMissingTableError(response.error)) {
      return [];
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return (response.data as SupabaseUserSubscriptionRow[]).map(normalizeUserSubscription);
}

export function getCourseAccessDecision(input: {
  role?: "ADMIN" | "LEARNER_EN" | "LEARNER_BN";
  accountState?: AccountState;
  courseStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  courseAccessType?: "FREE" | "TRIAL_PREVIEW" | "PAID";
  trialVisible?: boolean;
  previewLessonLimit?: number;
  enrollmentStatus?: "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
  hasPendingPayment?: boolean;
  trialExpired?: boolean;
}) {
  if (input.role === "ADMIN") {
    return { allowed: true, outcome: "ALLOW" as const, reason: "Admin override access." };
  }

  if (input.courseStatus && input.courseStatus !== "PUBLISHED") {
    return {
      allowed: false,
      outcome: "LOCKED_UNPUBLISHED" as const,
      reason: "Only published courses are available to learners.",
    };
  }

  if (input.courseAccessType === "FREE") {
    return { allowed: true, outcome: "ALLOW" as const, reason: "Free course is open to all learners." };
  }

  if (input.accountState === "PAID") {
    return {
      allowed: true,
      outcome: "ALLOW" as const,
      reason: "Paid account has direct course access.",
    };
  }

  if (input.courseAccessType === "TRIAL_PREVIEW") {
    if (!input.trialVisible) {
      return {
        allowed: false,
        outcome: "LOCKED_UPGRADE_REQUIRED" as const,
        reason: "Trial preview is not currently visible.",
      };
    }

    if (input.trialExpired) {
      return {
        allowed: false,
        outcome: "LOCKED_TRIAL_EXPIRED" as const,
        reason: "Trial access expired. Upgrade to continue.",
      };
    }

    if (
      input.accountState === "TRIAL" &&
      input.enrollmentStatus === "APPROVED" &&
      (input.previewLessonLimit ?? 0) > 0
    ) {
      return {
        allowed: true,
        outcome: "ALLOW" as const,
        reason: "Trial preview is active within the configured lesson limit.",
      };
    }

    if (input.accountState === "TRIAL") {
      return {
        allowed: false,
        outcome: "LOCKED_ENROLLMENT_REQUIRED" as const,
        reason: "Start this course trial to activate the preview period.",
      };
    }

    return {
      allowed: false,
      outcome: "LOCKED_UPGRADE_REQUIRED" as const,
      reason: "Trial or paid access is required for this preview course.",
    };
  }

  if (input.enrollmentStatus === "APPROVED") {
    return { allowed: true, outcome: "ALLOW" as const, reason: "Enrollment already approved." };
  }

  if (input.courseAccessType === "PAID") {
    if (input.hasPendingPayment) {
      return {
        allowed: false,
        outcome: "LOCKED_PAYMENT_PENDING" as const,
        reason: "Payment request is pending admin review.",
      };
    }

    if (input.trialExpired) {
      return {
        allowed: false,
        outcome: "LOCKED_TRIAL_EXPIRED" as const,
        reason: "Trial expired. Paid upgrade is required.",
      };
    }

    return {
      allowed: false,
      outcome: "LOCKED_UPGRADE_REQUIRED" as const,
      reason: "Paid plan required for this course.",
    };
  }

  return {
    allowed: false,
    outcome: "LOCKED_FREE_ONLY" as const,
    reason: "This course is not currently available for your account state.",
  };
}

export async function downgradeExpiredTrialUsers() {
  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();
  const expiredSubscriptionsResponse = await admin
    .from("user_subscriptions")
    .select("*")
    .eq("plan_code", "TRIAL")
    .eq("status", "ACTIVE")
    .lt("end_at", now);

  if (expiredSubscriptionsResponse.error) {
    if (isMissingTableError(expiredSubscriptionsResponse.error)) {
      return { downgradedUsers: 0, users: [] as string[] };
    }
    throw new Error(toReadableSupabaseError(expiredSubscriptionsResponse.error));
  }

  const expiredSubscriptions =
    (expiredSubscriptionsResponse.data as SupabaseUserSubscriptionRow[] | null) ?? [];

  if (!expiredSubscriptions.length) {
    return { downgradedUsers: 0, users: [] as string[] };
  }

  const userIds = expiredSubscriptions.map((subscription) => subscription.user_id);
  const markExpiredResponse = await admin
    .from("user_subscriptions")
    .update({
      status: "EXPIRED",
      updated_at: now,
    })
    .in("id", expiredSubscriptions.map((subscription) => subscription.id));

  if (markExpiredResponse.error) {
    throw new Error(toReadableSupabaseError(markExpiredResponse.error));
  }

  const profileResponse = await admin
    .from("profiles")
    .update({
      account_state: "FREE",
      updated_at: now,
    })
    .in("id", userIds)
    .eq("account_state", "TRIAL");

  if (profileResponse.error) {
    if (isMissingProfilesAccountStateError(profileResponse.error)) {
      return { downgradedUsers: userIds.length, users: userIds };
    }
    throw new Error(toReadableSupabaseError(profileResponse.error));
  }

  return { downgradedUsers: userIds.length, users: userIds };
}

export async function getAdminDashboardData() {
  const admin = getSupabaseAdminClient();
  const [profilesResult, coursesResult, enrollmentsResponse, paymentRequestsResponse] = await Promise.all([
    loadDashboardProfiles(),
    loadDashboardCourses(),
    admin
      .from("enrollments")
      .select("id, user_id, course_id, status, source, created_at, requested_at, reviewed_at, updated_at"),
    admin.from("payment_requests").select("id, amount, status, submitted_at, reviewed_at"),
  ]);
  if (enrollmentsResponse.error) {
    if (isMissingTableError(enrollmentsResponse.error)) {
      return {
        widgets: {
          totalUsers: 0,
          totalCourses: 0,
          pendingEnrollments: 0,
          completedCourses: 0,
          activeLearners: 0,
        },
        recentActivities: [],
        systemHealth: {
          service: "supabase-nextjs",
          database: "schema-mismatch",
          storageDriver: "supabase",
          uploadDirectory: "supabase-storage",
          totalFiles: 0,
          totalStorageBytes: 0,
          totalStorageMegabytes: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
    throw new Error(toReadableSupabaseError(enrollmentsResponse.error));
  }
  if (paymentRequestsResponse.error) {
    if (isMissingTableError(paymentRequestsResponse.error)) {
      return {
        widgets: {
          totalUsers: 0,
          freeUsers: 0,
          trialUsers: 0,
          paidUsers: 0,
          blockedUsers: 0,
          totalCourses: 0,
          pendingEnrollments: 0,
          pendingPayments: 0,
          approvedPayments: 0,
          revenueBdt: 0,
          completedCourses: 0,
          activeLearners: 0,
        },
        recentActivities: [],
        systemHealth: {
          service: "supabase-nextjs",
          database: "schema-mismatch",
          storageDriver: "supabase",
          uploadDirectory: "supabase-storage",
          totalFiles: 0,
          totalStorageBytes: 0,
          totalStorageMegabytes: 0,
          timestamp: new Date().toISOString(),
        },
      };
    }
    throw new Error(toReadableSupabaseError(paymentRequestsResponse.error));
  }

  const profiles = profilesResult.data;
  const courses = coursesResult.data;
  const enrollments = (enrollmentsResponse.data ?? []) as Array<{
    id: string;
    user_id: string;
    course_id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
    source: "REQUEST" | "MANUAL";
    created_at?: string;
    requested_at: string;
    reviewed_at?: string | null;
    updated_at?: string;
  }>;
  const paymentRequests = (paymentRequestsResponse.data ?? []) as Array<{
    id: string;
    amount: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submitted_at: string;
    reviewed_at?: string | null;
  }>;

  const activeLearners = profiles.filter(
    (profile) => profile.role !== "ADMIN" && !profile.is_suspended,
  ).length;
  const pendingEnrollments = enrollments.filter((enrollment) => enrollment.status === "PENDING").length;
  const freeUsers = profiles.filter((profile) => profile.account_state === "FREE").length;
  const trialUsers = profiles.filter((profile) => profile.account_state === "TRIAL").length;
  const paidUsers = profiles.filter((profile) => profile.account_state === "PAID").length;
  const blockedUsers = profiles.filter((profile) => profile.is_suspended).length;
  const pendingPayments = paymentRequests.filter((request) => request.status === "PENDING").length;
  const approvedPayments = paymentRequests.filter((request) => request.status === "APPROVED").length;
  const revenueBdt = paymentRequests
    .filter((request) => request.status === "APPROVED")
    .reduce((sum, request) => sum + (request.amount ?? 0), 0);
  const topCourses = courses
    .map((course) => {
      const enrolledUsers = enrollments.filter(
        (enrollment) =>
          enrollment.course_id === course.id && enrollment.status === "APPROVED",
      ).length;

      return {
        courseId: course.id,
        title: course.title,
        slug: course.slug,
        accessType: course.access_type ?? "FREE",
        enrolledUsers,
        revenueBdt: course.access_type === "PAID" ? enrolledUsers * (course.price_bdt ?? 0) : 0,
      };
    })
    .sort((a, b) => b.enrolledUsers - a.enrolledUsers)
    .slice(0, 5);

  const recentActivities: DashboardActivity[] = [
    ...profiles.slice(0, 5).map((profile) => ({
      id: `user-${profile.id}`,
      userId: profile.id,
      action: "USER_REGISTERED",
      entityType: "Profile",
      entityId: profile.id,
      createdAt: profile.created_at,
    })),
    ...courses.slice(0, 5).map((course) => ({
      id: `course-${course.id}`,
      action: course.status === "PUBLISHED" ? "COURSE_PUBLISHED" : "COURSE_UPDATED",
      entityType: "Course",
      entityId: course.id,
      createdAt: course.updated_at ?? course.created_at,
    })),
    ...enrollments.slice(0, 8).map((enrollment) => ({
      id: `enrollment-${enrollment.id}`,
      userId: enrollment.user_id,
      action:
        enrollment.status === "APPROVED"
          ? "ENROLLMENT_APPROVED"
          : enrollment.status === "PENDING"
            ? "ENROLLMENT_REQUESTED"
            : "ENROLLMENT_UPDATED",
      entityType: "Enrollment",
      entityId: enrollment.id,
      metadata: {
        status: enrollment.status,
        source: enrollment.source,
        courseId: enrollment.course_id,
      },
      createdAt:
        enrollment.reviewed_at ?? enrollment.updated_at ?? enrollment.requested_at ?? new Date().toISOString(),
    })),
    ...paymentRequests.slice(0, 8).map((paymentRequest) => ({
      id: `payment-${paymentRequest.id}`,
      action:
        paymentRequest.status === "APPROVED"
          ? "PAYMENT_APPROVED"
          : paymentRequest.status === "REJECTED"
            ? "PAYMENT_REJECTED"
            : "PAYMENT_SUBMITTED",
      entityType: "PaymentRequest",
      entityId: paymentRequest.id,
      metadata: {
        status: paymentRequest.status,
        amount: paymentRequest.amount,
      },
      createdAt:
        paymentRequest.reviewed_at ?? paymentRequest.submitted_at ?? new Date().toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  return {
    widgets: {
      totalUsers: profiles.length,
      freeUsers,
      trialUsers,
      paidUsers,
      blockedUsers,
      totalCourses: courses.length,
      pendingEnrollments,
      pendingPayments,
      approvedPayments,
      revenueBdt,
      completedCourses: enrollments.filter((enrollment) => enrollment.status === "APPROVED").length,
      activeLearners,
    },
    topCourses,
    recentActivities,
    systemHealth: {
      service: "supabase-nextjs",
      database: profilesResult.schemaFallback || coursesResult.schemaFallback ? "schema-fallback" : "connected",
      storageDriver: "supabase",
      uploadDirectory: "supabase-storage",
      totalFiles: 0,
      totalStorageBytes: 0,
      totalStorageMegabytes: 0,
      timestamp: new Date().toISOString(),
    },
  };
}

export async function getLearnerCertificateOverview(input: {
  userId: string;
  accountState: AccountState;
  courseSlug?: string;
}) {
  const courseSlug = input.courseSlug ?? DEFAULT_BASICS_COURSE.slug;
  const [lessonProgressRows, rule, certificateRows] = await Promise.all([
    loadLessonProgressRows(input.userId),
    loadCertificateRule(courseSlug),
    loadLearnerCertificates(input.userId, courseSlug),
  ]);

  const summary = buildLearnerLessonSummary(lessonProgressRows);
  const normalizedHistory = certificateRows.map(normalizeLearnerCertificate);
  const alreadyIssued = normalizedHistory.some((certificate) => certificate.status === "ISSUED");
  const requiredCompletedLessons = rule?.min_completed_lessons ?? 10;
  const requiredCompletionRate = rule?.min_completion_rate ?? 70;
  const requirePaidAccount = rule?.require_paid_account ?? false;

  let reason: string;
  if (alreadyIssued) {
    reason = "Certificate already issued for this learner and course.";
  } else if (requirePaidAccount && input.accountState !== "PAID") {
    reason = "A paid learner account is required before issuing this certificate.";
  } else if (summary.completedLessons < requiredCompletedLessons) {
    reason = `Complete at least ${requiredCompletedLessons} lessons before issuing the certificate.`;
  } else if (summary.completionRate < requiredCompletionRate) {
    reason = `Reach at least ${requiredCompletionRate}% course completion before issuing the certificate.`;
  } else {
    reason = "All eligibility rules are satisfied. Certificate can now be issued.";
  }

  const eligible =
    !alreadyIssued &&
    (!requirePaidAccount || input.accountState === "PAID") &&
    summary.completedLessons >= requiredCompletedLessons &&
    summary.completionRate >= requiredCompletionRate;

  return {
    eligibility: {
      eligible,
      courseSlug,
      reason,
      completionRate: summary.completionRate,
      completedLessons: summary.completedLessons,
      requiredCompletionRate,
      requiredCompletedLessons,
      requirePaidAccount,
      accountState: input.accountState,
      alreadyIssued,
    },
    history: normalizedHistory,
  };
}

export async function issueLearnerCertificate(input: {
  userId: string;
  accountState: AccountState;
  courseSlug?: string;
}) {
  const admin = getSupabaseAdminClient();
  const courseSlug = input.courseSlug ?? DEFAULT_BASICS_COURSE.slug;
  const overview = await getLearnerCertificateOverview({
    userId: input.userId,
    accountState: input.accountState,
    courseSlug,
  });

  if (!overview.eligibility.eligible) {
    throw new Error(overview.eligibility.reason);
  }

  const rule = await loadCertificateRule(courseSlug);
  const certificateCode = `CERT-${courseSlug.slice(0, 6).toUpperCase()}-${Date.now()}`;
  const response = await admin
    .from("learner_certificates")
    .insert({
      user_id: input.userId,
      course_slug: courseSlug,
      rule_id: rule?.id ?? null,
      certificate_code: certificateCode,
      status: "ISSUED",
      issued_at: new Date().toISOString(),
      completion_rate_snapshot: overview.eligibility.completionRate,
      completed_lessons_snapshot: overview.eligibility.completedLessons,
    })
    .select("*")
    .single();

  if (response.error) {
    if (isMissingTableError(response.error)) {
      throw new Error(
        "Supabase schema is outdated: learner_certificates table is missing. Apply 0007_certificate_system_foundation.sql in Supabase SQL Editor, then retry.",
      );
    }
    throw new Error(toReadableSupabaseError(response.error));
  }

  return normalizeLearnerCertificate(response.data as LearnerCertificateRow);
}

export async function listLessonProgress(userId: string) {
  const rows = await loadLessonProgressRows(userId);
  return rows.map((row) => normalizeLessonProgress(row as SupabaseLessonProgressRow));
}

export async function upsertLessonProgress(input: {
  userId: string;
  lessonPath: string;
  status?: "STARTED" | "COMPLETED";
  progressPercent?: number;
}) {
  const admin = getSupabaseAdminClient();
  const lessonPath = input.lessonPath.trim();

  if (!lessonPath.startsWith("/")) {
    throw new Error("Lesson path is required.");
  }

  const courseResponse = await admin
    .from("courses")
    .select("id, status")
    .eq("slug", DEFAULT_BASICS_COURSE.slug)
    .maybeSingle();

  if (courseResponse.error) {
    throw new Error(toReadableSupabaseError(courseResponse.error));
  }

  if (!courseResponse.data || courseResponse.data.status !== "PUBLISHED") {
    throw new Error("This course is not published and cannot record learner progress.");
  }

  const lessonMeta = findLessonByPathname(lessonPath);
  if (!lessonMeta) {
    throw new Error("Unknown lesson route.");
  }

  const existingResponse = await admin
    .from("lesson_progress")
    .select("*")
    .eq("user_id", input.userId)
    .eq("lesson_path", lessonPath)
    .maybeSingle();

  if (existingResponse.error) {
    if (isMissingTableError(existingResponse.error)) {
      throw new Error(
        "Supabase schema is outdated: lesson_progress table is missing. Apply 0006_lesson_progress_tracking.sql in Supabase SQL Editor, then retry.",
      );
    }
    throw new Error(toReadableSupabaseError(existingResponse.error));
  }

  const requestedStatus = input.status === "COMPLETED" ? "COMPLETED" : "STARTED";
  const requestedPercent =
    requestedStatus === "COMPLETED"
      ? 100
      : Math.max(5, Math.min(clampProgressPercent(input.progressPercent), 95));
  const now = new Date().toISOString();

  if (existingResponse.data) {
    const existing = existingResponse.data as SupabaseLessonProgressRow;
    const nextStatus =
      existing.status === "COMPLETED" || requestedStatus === "COMPLETED"
        ? "COMPLETED"
        : "STARTED";
    const nextPercent =
      nextStatus === "COMPLETED"
        ? 100
        : Math.max(existing.progress_percent ?? 0, requestedPercent);

    const updateResponse = await admin
      .from("lesson_progress")
      .update({
        status: nextStatus,
        progress_percent: nextPercent,
        last_viewed_at: now,
        completed_at:
          nextStatus === "COMPLETED"
            ? existing.completed_at ?? now
            : existing.completed_at ?? null,
        updated_at: now,
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (updateResponse.error) {
      throw new Error(toReadableSupabaseError(updateResponse.error));
    }

    return normalizeLessonProgress(updateResponse.data as SupabaseLessonProgressRow);
  }

  const insertResponse = await admin
    .from("lesson_progress")
    .insert({
      user_id: input.userId,
      course_slug: DEFAULT_BASICS_COURSE.slug,
      track_id: lessonMeta.trackId,
      lesson_id: lessonMeta.id,
      lesson_title: lessonMeta.title,
      lesson_path: lessonMeta.href,
      status: requestedStatus,
      progress_percent: requestedStatus === "COMPLETED" ? 100 : requestedPercent,
      first_started_at: now,
      last_viewed_at: now,
      completed_at: requestedStatus === "COMPLETED" ? now : null,
    })
    .select("*")
    .single();

  if (insertResponse.error) {
    throw new Error(toReadableSupabaseError(insertResponse.error));
  }

  return normalizeLessonProgress(insertResponse.data as SupabaseLessonProgressRow);
}

export async function getLearnerPerformanceDashboard(userId: string, accountState: AccountState) {
  const lessonProgressRows = await loadLessonProgressRows(userId);
  const lessonProgress = lessonProgressRows.map((row) =>
    normalizeLessonProgress(row as SupabaseLessonProgressRow),
  );
  const summary = buildLearnerLessonSummary(lessonProgressRows);
  const certificateOverview = await getLearnerCertificateOverview({
    userId,
    accountState,
    courseSlug: DEFAULT_BASICS_COURSE.slug,
  });
  const results = lessonProgressRows.map((progress, index) => ({
    id: progress.id,
    quizId: `lesson-progress-${progress.lesson_id}`,
    userId,
    courseId: DEFAULT_BASICS_COURSE.slug,
    totalScore: progress.progress_percent,
    percentage: progress.progress_percent,
    passed: progress.status === "COMPLETED",
    attemptType: (progress.status === "COMPLETED" || index === 0 ? "FINAL" : "PRACTICE") as
      | "FINAL"
      | "PRACTICE",
    submittedAt: progress.completed_at ?? progress.last_viewed_at,
  }));
  const averageScore = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length)
    : 0;

  return {
    totalAttempts: results.length,
    passedAttempts: summary.completedLessons,
    averageScore,
    trackedLessons: summary.trackedLessons,
    startedLessons: summary.startedLessons,
    completedLessons: summary.completedLessons,
    completionRate: summary.completionRate,
    nextLessonHref: summary.nextLessonHref,
    nextLessonTitle: summary.nextLessonTitle,
    lessonProgress,
    certificateEligibility: certificateOverview.eligibility,
    certificateHistory: certificateOverview.history,
    results,
  };
}
