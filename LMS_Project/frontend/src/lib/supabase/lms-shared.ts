import type {
  AuthUser,
  CourseRecord,
  EnrollmentRecord,
  LessonProgressRecord,
  PaymentRequestRecord,
  UserSubscriptionRecord,
} from "@/src/auth/types";

export type SupabaseProfileRow = {
  id: string;
  full_name?: string | null;
  username?: string | null;
  mobile_number?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  country?: string | null;
  address?: string | null;
  occupation?: AuthUser["occupation"] | null;
  engineering_discipline?: AuthUser["engineeringDiscipline"] | null;
  institution_or_company_name?: string | null;
  identity_number?: string | null;
  role?: AuthUser["role"] | null;
  account_state?: AuthUser["accountState"] | null;
  preferred_language?: "en" | "bn" | null;
  is_suspended?: boolean | null;
  blocked_at?: string | null;
  removed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupabaseCourseRow = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category_id?: string | null;
  status: CourseRecord["status"];
  access_type?: CourseRecord["accessType"] | null;
  price_bdt?: number | null;
  preview_lesson_limit?: number | null;
  trial_visible?: boolean | null;
  trial_days?: number | null;
  logic_theory_en?: string | null;
  logic_theory_bn?: string | null;
  udemy_script_en?: string | null;
  udemy_script_bn?: string | null;
  simulation_url?: string | null;
  resource_pdf_url?: string | null;
  video_url?: string | null;
  downloadable_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseEnrollmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentRecord["status"];
  source: EnrollmentRecord["source"];
  requested_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupabasePaymentRequestRow = {
  id: string;
  user_id: string;
  plan_name: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  screenshot_url?: string | null;
  status: PaymentRequestRecord["status"];
  invoice_status?: PaymentRequestRecord["invoiceStatus"] | null;
  invoice_number?: string | null;
  course_id?: string | null;
  payment_reference?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  additional_message?: string | null;
  paid_at?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  review_notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupabaseUserSubscriptionRow = {
  id: string;
  user_id: string;
  plan_code: UserSubscriptionRecord["planCode"];
  status: UserSubscriptionRecord["status"];
  payment_required: boolean;
  start_at: string;
  end_at?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupabaseLessonProgressRow = {
  id: string;
  user_id: string;
  course_slug: string;
  track_id: string;
  lesson_id: number;
  lesson_title: string;
  lesson_path: string;
  status: LessonProgressRecord["status"];
  progress_percent: number;
  first_started_at: string;
  last_viewed_at: string;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function normalizeProfileToAuthUser(
  authUser: {
    id: string;
    email?: string | null;
    created_at?: string;
    updated_at?: string;
    last_sign_in_at?: string | null;
    email_confirmed_at?: string | null;
    user_metadata?: Record<string, unknown>;
  },
  profile?: SupabaseProfileRow | null,
): AuthUser {
  const metadata = authUser.user_metadata ?? {};
  const role = (profile?.role ?? metadata.role ?? "LEARNER_EN") as AuthUser["role"];
  const metadataAccountState =
    metadata.account_state === "FREE" ||
    metadata.account_state === "TRIAL" ||
    metadata.account_state === "PAID"
      ? metadata.account_state
      : null;

  return {
    id: authUser.id,
    fullName:
      profile?.full_name ??
      (typeof metadata.full_name === "string" ? metadata.full_name : null) ??
      authUser.email?.split("@")[0] ??
      "Supabase User",
    email: authUser.email ?? "",
    username: profile?.username ?? (typeof metadata.username === "string" ? metadata.username : undefined),
    mobileNumber: profile?.mobile_number ?? (typeof metadata.mobile_number === "string" ? metadata.mobile_number : undefined),
    dateOfBirth: profile?.date_of_birth ?? (typeof metadata.date_of_birth === "string" ? metadata.date_of_birth : undefined),
    gender: profile?.gender ?? (typeof metadata.gender === "string" ? metadata.gender : undefined),
    country: profile?.country ?? (typeof metadata.country === "string" ? metadata.country : undefined),
    address: profile?.address ?? (typeof metadata.address === "string" ? metadata.address : undefined),
    occupation: profile?.occupation ?? (metadata.occupation as AuthUser["occupation"] | undefined),
    engineeringDiscipline: profile?.engineering_discipline ?? (metadata.engineering_discipline as AuthUser["engineeringDiscipline"] | undefined),
    institutionOrCompanyName: profile?.institution_or_company_name ?? (typeof metadata.institution_or_company_name === "string" ? metadata.institution_or_company_name : undefined),
    identityNumber: profile?.identity_number ?? (typeof metadata.identity_number === "string" ? metadata.identity_number : undefined),
    role,
    accountState: profile?.account_state ?? metadataAccountState ?? (role === "ADMIN" ? "PAID" : "TRIAL"),
    preferredLanguage:
      profile?.preferred_language ??
      (metadata.preferred_language === "bn" ? "bn" : role === "LEARNER_BN" ? "bn" : "en"),
    isEmailVerified: Boolean(authUser.email_confirmed_at),
    isSuspended: Boolean(profile?.is_suspended),
    blockedAt: profile?.blocked_at ?? undefined,
    removedAt: profile?.removed_at ?? undefined,
    createdAt: profile?.created_at ?? authUser.created_at ?? new Date().toISOString(),
    updatedAt: profile?.updated_at ?? authUser.updated_at ?? authUser.created_at ?? new Date().toISOString(),
    lastLoginAt: authUser.last_sign_in_at ?? undefined,
  };
}

export function normalizeCourse(row: SupabaseCourseRow): CourseRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? undefined,
    categoryId: row.category_id ?? undefined,
    status: row.status,
    accessType: row.access_type ?? "FREE",
    priceBdt: row.price_bdt ?? 0,
    previewLessonLimit: row.preview_lesson_limit ?? undefined,
    trialVisible: row.trial_visible ?? true,
    trialDays: row.trial_days ?? 7,
    logicTheoryEn: row.logic_theory_en ?? undefined,
    logicTheoryBn: row.logic_theory_bn ?? undefined,
    udemyScriptEn: row.udemy_script_en ?? undefined,
    udemyScriptBn: row.udemy_script_bn ?? undefined,
    simulationUrl: row.simulation_url ?? undefined,
    resourcePdfUrl: row.resource_pdf_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
    downloadableUrl: row.downloadable_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeEnrollment(row: SupabaseEnrollmentRow): EnrollmentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    status: row.status,
    source: row.source,
    requestedAt: row.requested_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewedBy: row.reviewed_by ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function normalizePaymentRequest(row: SupabasePaymentRequestRow): PaymentRequestRecord {
  return {
    id: row.id,
    userId: row.user_id,
    planName: row.plan_name,
    transactionId: row.transaction_id,
    paymentMethod: row.payment_method,
    amount: row.amount,
    currency: row.currency,
    screenshotUrl: row.screenshot_url ?? undefined,
    status: row.status,
    invoiceStatus: row.invoice_status ?? (row.status === "APPROVED" ? "PAID" : row.status === "PENDING" ? "PENDING" : "UNPAID"),
    invoiceNumber: row.invoice_number ?? undefined,
    courseId: row.course_id ?? undefined,
    paymentReference: row.payment_reference ?? undefined,
    buyerName: row.buyer_name ?? undefined,
    buyerEmail: row.buyer_email ?? undefined,
    buyerPhone: row.buyer_phone ?? undefined,
    additionalMessage: row.additional_message ?? undefined,
    paidAt: row.paid_at ?? undefined,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewedBy: row.reviewed_by ?? undefined,
    reviewNotes: row.review_notes ?? undefined,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function normalizeUserSubscription(
  row: SupabaseUserSubscriptionRow,
): UserSubscriptionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    planCode: row.plan_code,
    status: row.status,
    paymentRequired: row.payment_required,
    startAt: row.start_at,
    endAt: row.end_at ?? undefined,
    approvedAt: row.approved_at ?? undefined,
    approvedBy: row.approved_by ?? undefined,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function normalizeLessonProgress(row: SupabaseLessonProgressRow): LessonProgressRecord {
  return {
    id: row.id,
    userId: row.user_id,
    courseSlug: row.course_slug,
    trackId: row.track_id,
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    lessonPath: row.lesson_path,
    status: row.status,
    progressPercent: row.progress_percent,
    firstStartedAt: row.first_started_at,
    lastViewedAt: row.last_viewed_at,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}
