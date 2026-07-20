"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  basicsCourseModules,
  basicsCourseProjects,
} from "../courses/basics-electronics-and-electrical/courseCatalog";
import { industrialSensorCourseModules } from "../courses/Industrial_Sensor/courseCatalog";
import {
  activateAdminUser,
  approveAdminPaymentRequest,
  assignAdminEnrollment,
  createAdminUser,
  createEnrollmentRequest,
  deleteAdminCourse,
  deleteAdminUser,
  fetchAdminActivityLogs,
  fetchAdminCourses,
  fetchAdminDashboard,
  fetchAdminEnrollments,
  fetchAdminPaymentRequests,
  fetchAdminUsers,
  fetchCurrentUser,
  fetchLearnerDashboard,
  fetchPaymentHistory,
  logout,
  rejectAdminPaymentRequest,
  removeAdminEnrollment,
  suspendAdminUser,
  updateAdminCourse,
  updateAdminUser,
} from "./api";
import { useBackendMode } from "./backend-mode";
import { learnerDashboardSections } from "./learner-dashboard-planning";
import { getPreferredRoleRoute } from "./routes";
import type {
  AdminActivityLogRecord,
  AdminDashboardData,
  AdminManagedUser,
  AuthUser,
  CourseRecord,
  CreateAdminUserPayload,
  EnrollmentRecord,
  LearnerDashboardData,
  PaymentRequestRecord,
  UpdateCoursePayload,
  UpdateUserPayload,
  UserRole,
} from "./types";
import { useBasicsCourseAccess } from "./useBasicsCourseAccess";
import { useIndustrialSensorCourseAccess } from "./useIndustrialSensorCourseAccess";

type DashboardState =
  | {
      status: "loading";
    }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "ready";
      user: AuthUser;
      adminData?: AdminDashboardData;
      learnerData?: LearnerDashboardData;
    };

const coursePortalLink = "/courses/basics-electronics-and-electrical";
const courseInvoiceLink = "/courses/basics-electronics-and-electrical/invoice";
const courseProjectsLink =
  "/courses/basics-electronics-and-electrical/projects";
const homepageLink = "/";
const courseTitle = "Basics Electronics and Electrical";
const primaryAdminCourseSlug = "basics-electronics-and-electrical";
const invoiceBdtPerUsd = 122;
const invoiceTaxPercentage = 5;
const courseCategoryOptions = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    label: "Electrical Fundamentals",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    label: "Industrial Automation",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    label: "Sensors and Instrumentation",
  },
  { id: "44444444-4444-4444-8444-444444444444", label: "Motor Control" },
  { id: "55555555-5555-4555-8555-555555555555", label: "PLC and Control" },
] as const;

function formatCourseCategoryLabel(categoryId?: string) {
  if (!categoryId) {
    return "Uncategorized";
  }

  return (
    courseCategoryOptions.find((category) => category.id === categoryId)
      ?.label ?? "Other"
  );
}

const adminCourseRequirementCards = [
  {
    slug: primaryAdminCourseSlug,
    title: courseTitle,
    categoryId: "11111111-1111-4111-8111-111111111111",
    href: coursePortalLink,
    lessons: basicsCourseModules.length,
    projects: basicsCourseProjects.length,
    requirement:
      "Core electrical basics course with project workspaces and payment access rules.",
  },
  {
    slug: "industrial-sensor",
    title: "Industrial Sensor",
    categoryId: "33333333-3333-4333-8333-333333333333",
    href: "/courses/industrial-sensor",
    lessons: industrialSensorCourseModules.length,
    projects: 0,
    requirement:
      "New simulator course requiring admin visibility, access assignment, and course status controls.",
  },
];
const allAdminCourseLessons = [
  ...basicsCourseModules,
  ...industrialSensorCourseModules,
];
const adminSidebarItems = [
  {
    label: "Dashboard",
    href: "/Admin/dashboard",
    sectionId: "dashboard" as const,
    tone: "current" as const,
  },
  {
    label: "Users",
    href: "/Admin/users",
    sectionId: "users" as const,
    tone: "current" as const,
  },
  {
    label: "Courses",
    href: "/Admin/courses",
    sectionId: "courses" as const,
    tone: "default" as const,
  },
  {
    label: "Course Access",
    href: "/Admin/course-access",
    sectionId: "course-access" as const,
    tone: "default" as const,
  },
  {
    label: "Payments",
    href: "/Admin/payments",
    sectionId: "payments" as const,
    tone: "default" as const,
  },
  {
    label: "Analytics",
    href: "/Admin/analytics",
    sectionId: "analytics" as const,
    tone: "default" as const,
  },
] as const;

const learnerSidebarItems = [
  {
    label: "Dashboard",
    href: "/User/dashboard",
    sectionId: "dashboard" as const,
  },
  {
    label: "My Courses",
    href: "/User/my-courses",
    sectionId: "my-courses" as const,
  },
  { label: "Lessons", href: "/User/lessons", sectionId: "lessons" as const },
  { label: "Progress", href: "/User/progress", sectionId: "progress" as const },
  { label: "Settings", href: "/User/settings", sectionId: "settings" as const },
] as const;

function getLearnerDashboardSection(pathname: string | null) {
  if (
    !pathname ||
    pathname === "/dashboard" ||
    pathname === "/User" ||
    pathname === "/User/dashboard"
  ) {
    return "dashboard";
  }

  return (
    learnerSidebarItems.find((item) => item.href === pathname)?.sectionId ??
    "dashboard"
  );
}

function getAdminDashboardSection(pathname: string | null) {
  if (
    !pathname ||
    pathname === "/dashboard" ||
    pathname === "/Admin" ||
    pathname === "/Admin/dashboard"
  ) {
    return "dashboard";
  }

  const normalizedPathname =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  return (
    adminSidebarItems.find(
      (item) =>
        normalizedPathname === item.href ||
        normalizedPathname.startsWith(`${item.href}/`),
    )?.sectionId ?? "dashboard"
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}

function getDashboardIntro(user: AuthUser) {
  if (user.role === "ADMIN") {
    return {
      kicker: "Admin dashboard",
      title: `Manage ${courseTitle}`,
      copy: `Open the ${courseTitle} course page, review lesson access, and monitor LMS activity from the backend.`,
      actionLabel: "Course page",
      actionHref: coursePortalLink,
    };
  }

  return {
    kicker: "Learner dashboard",
    title: `Continue ${courseTitle}`,
    copy: `Open the ${courseTitle} course page and continue your lesson flow from Current and Voltage onward.`,
    actionLabel: "My course page",
    actionHref: coursePortalLink,
  };
}

function roleLabel(role: UserRole) {
  if (role === "ADMIN") {
    return "Admin";
  }

  if (role === "LEARNER_BN") {
    return "Learner Bangla";
  }

  return "Learner English";
}

function formatCourseAccessTypeLabel(accessType?: CourseRecord["accessType"]) {
  if (accessType === "PAID") {
    return "Paid";
  }

  if (accessType === "TRIAL_PREVIEW") {
    return "Trial";
  }

  return "Free";
}

function roundInvoiceCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function formatInvoiceMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  })}`;
}

function getExpectedInvoiceAmounts(course?: CourseRecord | null) {
  if (!course || course.priceBdt <= 0) {
    return null;
  }

  const coursePriceUsd = roundInvoiceCurrency(
    course.priceBdt / invoiceBdtPerUsd,
  );
  const taxAmountUsd = roundInvoiceCurrency(
    coursePriceUsd * (invoiceTaxPercentage / 100),
  );

  return {
    courseAmountBdt: course.priceBdt,
    coursePriceUsd,
    taxAmountUsd,
    totalAmountUsd: roundInvoiceCurrency(coursePriceUsd + taxAmountUsd),
  };
}

function formatAccountStateLabel(accountState?: AuthUser["accountState"]) {
  if (accountState === "PAID") {
    return "Paid";
  }

  if (accountState === "TRIAL") {
    return "Trial";
  }

  return "Free";
}

function matchesSearch(values: Array<string | undefined>, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function formatShortDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCurrentWeekLabel() {
  const now = new Date();
  const dayIndex = now.getDay();
  const diffToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startLabel = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startLabel} - ${endLabel}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getActivitySeries(activities: AdminDashboardData["recentActivities"]) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const result = labels.map((label) => ({
    label,
    value: 0,
  }));

  const today = new Date();

  activities.forEach((activity) => {
    const date = new Date(activity.createdAt);
    const diffInDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays < 0 || diffInDays > 6) {
      return;
    }

    const day = date.getDay();
    const mondayIndex = day === 0 ? 6 : day - 1;
    result[mondayIndex].value += 1;
  });

  return result.map((item, index) => ({
    ...item,
    value: item.value || (index % 2 === 0 ? index + 2 : index + 1),
  }));
}

export default function DashboardView() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDisconnected, setMode } = useBackendMode();
  const basicsCourseAccess = useBasicsCourseAccess();
  const industrialSensorCourseAccess = useIndustrialSensorCourseAccess();
  const [state, setState] = useState<DashboardState>({ status: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminManagedUser[]>([]);
  const [adminCourses, setAdminCourses] = useState<CourseRecord[]>([]);
  const [adminEnrollments, setAdminEnrollments] = useState<EnrollmentRecord[]>(
    [],
  );
  const [activityLogs, setActivityLogs] = useState<AdminActivityLogRecord[]>(
    [],
  );
  const [paymentRequests, setPaymentRequests] = useState<
    PaymentRequestRecord[]
  >([]);
  const [adminUserActionId, setAdminUserActionId] = useState<string | null>(
    null,
  );
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [adminUserNotice, setAdminUserNotice] = useState<string | null>(null);
  const [adminUserCreateNotice, setAdminUserCreateNotice] = useState<
    string | null
  >(null);
  const [adminCourseId, setAdminCourseId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [adminCourseActionId, setAdminCourseActionId] = useState<string | null>(
    null,
  );
  const [adminCourseNotice, setAdminCourseNotice] = useState<string | null>(
    null,
  );
  const [deleteCourseConfirmId, setDeleteCourseConfirmId] = useState<
    string | null
  >(null);
  const [deleteCourseConfirmValue, setDeleteCourseConfirmValue] = useState("");
  const [adminAccessActionId, setAdminAccessActionId] = useState<string | null>(
    null,
  );
  const [adminAccessNotice, setAdminAccessNotice] = useState<string | null>(
    null,
  );
  const [selectedAccessUserId, setSelectedAccessUserId] = useState("");
  const [selectedAccessCourseId, setSelectedAccessCourseId] = useState("");
  const [accessNotes, setAccessNotes] = useState("");
  const [paymentActionId, setPaymentActionId] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [paymentReviewNotes, setPaymentReviewNotes] = useState<
    Record<string, string>
  >({});
  const [paymentHistory, setPaymentHistory] = useState<PaymentRequestRecord[]>(
    [],
  );
  const [learnerEnrollSubmitting, setLearnerEnrollSubmitting] = useState(false);
  const [learnerEnrollNotice, setLearnerEnrollNotice] = useState<string | null>(
    null,
  );
  const [certificateSubmitting, setCertificateSubmitting] = useState(false);
  const [certificateNotice, setCertificateNotice] = useState<string | null>(
    null,
  );
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [activityLogFilters, setActivityLogFilters] = useState({
    category: "ALL",
    q: "",
  });
  const [createUserForm, setCreateUserForm] = useState<CreateAdminUserPayload>({
    fullName: "",
    email: "",
    password: "",
    role: "LEARNER_EN",
    accountState: "TRIAL",
    preferredLanguage: "en",
    isEmailVerified: true,
  });
  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    fullName: "",
    preferredLanguage: "en",
    role: "LEARNER_EN",
    accountState: "TRIAL",
    isEmailVerified: false,
  });
  const [courseEditForm, setCourseEditForm] = useState<UpdateCoursePayload>({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    accessType: "FREE",
    priceBdt: 0,
    previewLessonLimit: 0,
    trialVisible: true,
    trialDays: 7,
    status: "DRAFT",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const userResponse = await fetchCurrentUser();
        const user = userResponse.data;

        if (cancelled) {
          return;
        }

        if (user.role === "ADMIN") {
          const [
            adminResponse,
            usersResponse,
            coursesResponse,
            enrollmentsResponse,
            paymentResponse,
            activityLogsResponse,
          ] = await Promise.all([
            fetchAdminDashboard(),
            fetchAdminUsers(),
            fetchAdminCourses(),
            fetchAdminEnrollments(),
            fetchAdminPaymentRequests(),
            fetchAdminActivityLogs(),
          ]);

          if (!cancelled) {
            setAdminUsers(usersResponse.data);
            setAdminCourses(coursesResponse.data);
            setAdminEnrollments(enrollmentsResponse.data);
            setPaymentRequests(paymentResponse.data);
            setActivityLogs(activityLogsResponse.data);
            setAdminCourseId(
              coursesResponse.data.find(
                (course) => course.slug === primaryAdminCourseSlug,
              )?.id ?? null,
            );
            setSelectedAccessCourseId(coursesResponse.data[0]?.id ?? "");
            setSelectedAccessUserId(
              usersResponse.data.find(
                (managedUser) => managedUser.role !== "ADMIN",
              )?.id ?? "",
            );
            setState({
              status: "ready",
              user,
              adminData: adminResponse.data,
            });
          }
          return;
        }

        const [learnerResponse, paymentHistoryResponse] = await Promise.all([
          fetchLearnerDashboard(),
          fetchPaymentHistory(),
        ]);
        if (!cancelled) {
          setPaymentHistory(paymentHistoryResponse.data);
          setState({
            status: "ready",
            user,
            learnerData: learnerResponse.data,
          });
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard.";

        if (message.toLowerCase().includes("unauthorized")) {
          router.replace("/login");
          return;
        }

        if (!cancelled) {
          setState({ status: "error", message });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (state.status !== "ready") {
      return;
    }

    const targetPath = getPreferredRoleRoute(pathname, state.user.role);

    if (pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [pathname, router, state]);

  async function reloadAdminUsers() {
    const response = await fetchAdminUsers();
    setAdminUsers(response.data);
  }

  async function reloadAdminCourseId() {
    const response = await fetchAdminCourses();
    setAdminCourses(response.data);
    setAdminCourseId(
      response.data.find((course) => course.slug === primaryAdminCourseSlug)
        ?.id ?? null,
    );
    setSelectedAccessCourseId(
      (current) => current || response.data[0]?.id || "",
    );
  }

  async function reloadAdminEnrollments() {
    const response = await fetchAdminEnrollments();
    setAdminEnrollments(response.data);
  }

  async function reloadActivityLogs(query?: {
    action?: string;
    entityType?: string;
    q?: string;
  }) {
    const response = await fetchAdminActivityLogs(query);
    setActivityLogs(response.data);
  }

  async function reloadPaymentRequests() {
    const response = await fetchAdminPaymentRequests();
    setPaymentRequests(response.data);
  }

  async function reloadLearnerDashboard(user: AuthUser) {
    const [learnerResponse, paymentHistoryResponse] = await Promise.all([
      fetchLearnerDashboard(),
      fetchPaymentHistory(),
    ]);
    setPaymentHistory(paymentHistoryResponse.data);
    setState({
      status: "ready",
      user,
      learnerData: learnerResponse.data,
    });
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      if (isDisconnected) {
        setMode("connected");
      }
      router.push("/login");
      router.refresh();
    } catch (logoutError) {
      setState({
        status: "error",
        message:
          logoutError instanceof Error
            ? logoutError.message
            : "Unable to logout right now.",
      });
    } finally {
      setLoggingOut(false);
    }
  }

  function startEditingUser(targetUser: AdminManagedUser) {
    setEditingUserId(targetUser.id);
    setAdminUserNotice(null);
    setEditForm({
      fullName: targetUser.fullName,
      preferredLanguage: targetUser.preferredLanguage,
      role: targetUser.role,
      accountState: targetUser.accountState,
      isEmailVerified: targetUser.isEmailVerified,
    });
  }

  function startEditingCourse(targetCourse: CourseRecord) {
    setEditingCourseId(targetCourse.id);
    setAdminCourseNotice(null);
    setDeleteCourseConfirmId(null);
    setDeleteCourseConfirmValue("");
    setCourseEditForm({
      title: targetCourse.title,
      slug: targetCourse.slug,
      description: targetCourse.description ?? "",
      categoryId: targetCourse.categoryId ?? "",
      status: targetCourse.status,
      accessType: targetCourse.accessType,
      priceBdt: targetCourse.priceBdt,
      previewLessonLimit: targetCourse.previewLessonLimit ?? 0,
      trialVisible: targetCourse.trialVisible,
      trialDays: targetCourse.trialDays ?? 7,
    });
  }

  async function handleSaveUser(userId: string) {
    setAdminUserActionId(userId);
    setAdminUserNotice(null);

    try {
      await updateAdminUser(userId, {
        fullName: editForm.fullName,
        preferredLanguage: editForm.preferredLanguage,
        role: editForm.role,
        accountState: editForm.accountState,
      });
      await reloadAdminUsers();
      setEditingUserId(null);
      setAdminUserNotice("User updated successfully.");
    } catch (updateError) {
      setAdminUserNotice(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update user.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleCreateUser() {
    setAdminUserActionId("create-user");
    setAdminUserCreateNotice(null);

    try {
      if (
        !createUserForm.fullName.trim() ||
        !createUserForm.email.trim() ||
        !createUserForm.password
      ) {
        throw new Error("Full name, email, and password are required.");
      }

      if (createUserForm.password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      await createAdminUser({
        ...createUserForm,
        fullName: createUserForm.fullName.trim(),
        email: createUserForm.email.trim(),
      });
      await reloadAdminUsers();
      setCreateUserForm({
        fullName: "",
        email: "",
        password: "",
        role: "LEARNER_EN",
        accountState: "TRIAL",
        preferredLanguage: "en",
        isEmailVerified: true,
      });
      setAdminUserCreateNotice("Admin-managed user created successfully.");
    } catch (createError) {
      setAdminUserCreateNotice(
        createError instanceof Error
          ? createError.message
          : "Unable to create user.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleToggleAccess(targetUser: AdminManagedUser) {
    setAdminUserActionId(targetUser.id);
    setAdminUserNotice(null);

    try {
      if (targetUser.isSuspended) {
        await activateAdminUser(targetUser.id);
        setAdminUserNotice("User access restored successfully.");
      } else {
        await suspendAdminUser(targetUser.id);
        setAdminUserNotice("User access removed successfully.");
      }

      await reloadAdminUsers();
    } catch (toggleError) {
      setAdminUserNotice(
        toggleError instanceof Error
          ? toggleError.message
          : "Unable to change user access.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleDeleteUser(
    targetUser: AdminManagedUser,
    currentUserId: string,
  ) {
    if (targetUser.id === currentUserId) {
      setAdminUserNotice(
        "You cannot delete your own admin account from this dashboard.",
      );
      return;
    }

    setAdminUserActionId(targetUser.id);
    setAdminUserNotice(null);

    try {
      await deleteAdminUser(targetUser.id);
      await reloadAdminUsers();
      setAdminUserNotice("User deleted successfully.");
    } catch (deleteError) {
      setAdminUserNotice(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete user.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleManualEnroll(targetUser: AdminManagedUser) {
    if (!adminCourseId) {
      setAdminUserNotice(
        "Create or publish the backend course first before manual enrollment.",
      );
      return;
    }

    setAdminUserActionId(targetUser.id);
    setAdminUserNotice(null);

    try {
      await assignAdminEnrollment(
        targetUser.id,
        adminCourseId,
        "Manual enrollment from admin dashboard",
      );
      await reloadAdminUsers();
      await reloadAdminCourseId();
      await reloadAdminEnrollments();
      await reloadActivityLogs();
      const courseName =
        adminCourses.find((course) => course.id === adminCourseId)?.title ??
        courseTitle;
      setAdminUserNotice(`User enrolled manually into ${courseName}.`);
    } catch (enrollError) {
      setAdminUserNotice(
        enrollError instanceof Error
          ? enrollError.message
          : "Unable to enroll user manually.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleSaveCourse(courseId: string) {
    setAdminCourseActionId(courseId);
    setAdminCourseNotice(null);

    try {
      if (!courseEditForm.title?.trim() || !courseEditForm.slug?.trim()) {
        throw new Error("Course title and slug are required.");
      }

      const accessType = courseEditForm.accessType ?? "FREE";
      const normalizedPayload: UpdateCoursePayload = {
        ...courseEditForm,
        title: courseEditForm.title.trim(),
        slug: courseEditForm.slug.trim(),
        description: courseEditForm.description?.trim() || "",
        categoryId: courseEditForm.categoryId?.trim() || "",
        accessType,
        priceBdt:
          accessType === "FREE" ? 0 : Number(courseEditForm.priceBdt ?? 0),
        trialDays:
          accessType === "TRIAL_PREVIEW"
            ? Math.min(
                365,
                Math.max(1, Math.trunc(Number(courseEditForm.trialDays ?? 7))),
              )
            : 7,
        previewLessonLimit:
          accessType === "TRIAL_PREVIEW"
            ? Number(courseEditForm.previewLessonLimit ?? 0)
            : 0,
        trialVisible:
          accessType === "TRIAL_PREVIEW"
            ? Boolean(courseEditForm.trialVisible)
            : false,
      };

      const response = await updateAdminCourse(courseId, normalizedPayload);
      setAdminCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === courseId ? response.data : course,
        ),
      );
      setAdminCourseId((current) =>
        response.data.slug === primaryAdminCourseSlug
          ? response.data.id
          : current,
      );
      setEditingCourseId(null);
      setAdminCourseNotice("Course updated successfully.");
    } catch (courseError) {
      setAdminCourseNotice(
        courseError instanceof Error
          ? courseError.message
          : "Unable to update course.",
      );
    } finally {
      setAdminCourseActionId(null);
    }
  }

  async function handleDeleteCourse(courseId: string) {
    setAdminCourseActionId(courseId);
    setAdminCourseNotice(null);

    try {
      await deleteAdminCourse(courseId);
      await reloadAdminCourseId();
      await reloadActivityLogs();
      setEditingCourseId(null);
      setDeleteCourseConfirmId(null);
      setDeleteCourseConfirmValue("");
      setAdminCourseNotice("Course soft-deleted successfully.");
    } catch (courseError) {
      setAdminCourseNotice(
        courseError instanceof Error
          ? courseError.message
          : "Unable to delete course.",
      );
    } finally {
      setAdminCourseActionId(null);
    }
  }

  async function handleAssignAccess() {
    if (!selectedAccessUserId || !selectedAccessCourseId) {
      setAdminAccessNotice(
        "Select both a user and a course before assigning access.",
      );
      return;
    }

    const selectedCourse =
      adminCourses.find((course) => course.id === selectedAccessCourseId) ??
      null;
    const hasPaidInvoice = paymentRequests.some(
      (paymentRequest) =>
        paymentRequest.userId === selectedAccessUserId &&
        paymentRequest.courseId === selectedAccessCourseId &&
        paymentRequest.invoiceStatus === "PAID",
    );
    const invoiceAuditNote =
      selectedCourse?.accessType === "PAID"
        ? hasPaidInvoice
          ? "Paid invoice verified for selected course."
          : "Manual paid-course access assigned without a paid invoice record."
        : "Manual access assigned for non-paid course.";

    setAdminAccessActionId("assign");
    setAdminAccessNotice(null);

    try {
      await assignAdminEnrollment(
        selectedAccessUserId,
        selectedAccessCourseId,
        accessNotes.trim() || invoiceAuditNote,
      );
      await reloadAdminEnrollments();
      await reloadActivityLogs();
      setAccessNotes("");
      setAdminAccessNotice("Manual course access assigned successfully.");
    } catch (accessError) {
      setAdminAccessNotice(
        accessError instanceof Error
          ? accessError.message
          : "Unable to assign access.",
      );
    } finally {
      setAdminAccessActionId(null);
    }
  }

  async function handleRemoveAccess() {
    if (!selectedAccessUserId || !selectedAccessCourseId) {
      setAdminAccessNotice(
        "Select both a user and a course before removing access.",
      );
      return;
    }

    setAdminAccessActionId("remove");
    setAdminAccessNotice(null);

    try {
      await removeAdminEnrollment(
        selectedAccessUserId,
        selectedAccessCourseId,
        accessNotes.trim() || "Manual access removed from dashboard.",
      );
      await reloadAdminEnrollments();
      await reloadActivityLogs();
      setAccessNotes("");
      setAdminAccessNotice("Course access removed successfully.");
    } catch (accessError) {
      setAdminAccessNotice(
        accessError instanceof Error
          ? accessError.message
          : "Unable to remove access.",
      );
    } finally {
      setAdminAccessActionId(null);
    }
  }

  async function handlePaymentReview(
    paymentRequestId: string,
    action: "approve" | "reject",
  ) {
    setPaymentActionId(paymentRequestId);
    setPaymentNotice(null);

    try {
      const reviewNotes =
        paymentReviewNotes[paymentRequestId]?.trim() || undefined;

      if (action === "approve") {
        await approveAdminPaymentRequest(paymentRequestId, reviewNotes);
        setPaymentNotice("Payment request approved successfully.");
      } else {
        await rejectAdminPaymentRequest(paymentRequestId, reviewNotes);
        setPaymentNotice("Payment request rejected successfully.");
      }

      setPaymentReviewNotes((current) => ({
        ...current,
        [paymentRequestId]: "",
      }));
      await reloadPaymentRequests();
    } catch (reviewError) {
      setPaymentNotice(
        reviewError instanceof Error
          ? reviewError.message
          : "Unable to review payment request.",
      );
    } finally {
      setPaymentActionId(null);
    }
  }

  async function handleLearnerCourseEnroll() {
    if (state.status !== "ready" || !state.learnerData) {
      return;
    }

    if (state.user.accountState === "FREE") {
      router.push(courseInvoiceLink);
      return;
    }

    if (!basicsCourseAccess.course) {
      setLearnerEnrollNotice("Course is not available right now.");
      return;
    }

    setLearnerEnrollSubmitting(true);
    setLearnerEnrollNotice(null);

    try {
      const response = await createEnrollmentRequest(
        basicsCourseAccess.course.id,
      );
      setLearnerEnrollNotice(
        response.data.status === "APPROVED"
          ? "Course access is active now."
          : "Course access updated.",
      );
      basicsCourseAccess.refresh();
      await reloadLearnerDashboard(state.user);
    } catch (enrollError) {
      setLearnerEnrollNotice(
        enrollError instanceof Error
          ? enrollError.message
          : "Unable to open course access.",
      );
    } finally {
      setLearnerEnrollSubmitting(false);
    }
  }

  if (state.status === "loading") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Loading dashboard</p>
            <h1>Checking your LMS session and pulling live backend data.</h1>
          </div>
        </section>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-empty">
            <p className="dashboard-kicker">Dashboard error</p>
            <h1>We could not load the dashboard.</h1>
            <p>{state.message}</p>
            <div className="dashboard-actions">
              <Link href="/login" className="dashboard-primary-link">
                Back to login
              </Link>
              <Link href={homepageLink} className="dashboard-secondary-link">
                Open homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { user, adminData, learnerData } = state;
  const isAdmin = user.role === "ADMIN";
  const dashboardIntro = getDashboardIntro(user);

  if (isAdmin && adminData) {
    const adminSection = getAdminDashboardSection(pathname);
    const filteredLessons = allAdminCourseLessons.filter((lesson) =>
      matchesSearch([lesson.title, lesson.href], dashboardSearch),
    );
    const filteredProjects = basicsCourseProjects.filter((project) =>
      matchesSearch([project.title, project.href], dashboardSearch),
    );
    const filteredUsers = adminUsers.filter((managedUser) =>
      matchesSearch(
        [
          managedUser.fullName,
          managedUser.email,
          managedUser.preferredLanguage,
          managedUser.accountState,
          roleLabel(managedUser.role),
        ],
        dashboardSearch,
      ),
    );
    const editingManagedUser = editingUserId
      ? (adminUsers.find((managedUser) => managedUser.id === editingUserId) ??
        null)
      : null;
    const filteredCourses = adminCourses.filter((course) =>
      matchesSearch(
        [
          course.title,
          course.slug,
          course.description ?? undefined,
          course.categoryId,
          formatCourseCategoryLabel(course.categoryId),
          course.status,
          course.accessType,
        ],
        dashboardSearch,
      ),
    );
    const activitySeries = getActivitySeries(adminData.recentActivities);
    const maxActivityValue = Math.max(
      ...activitySeries.map((item) => item.value),
      1,
    );
    const activeUsersCount = adminUsers.filter(
      (managedUser) => !managedUser.isSuspended,
    ).length;
    const suspendedUsersCount = adminUsers.filter(
      (managedUser) => managedUser.isSuspended,
    ).length;
    const adminCount = adminUsers.filter(
      (managedUser) => managedUser.role === "ADMIN",
    ).length;
    const learnerCount = adminUsers.filter(
      (managedUser) => managedUser.role !== "ADMIN",
    ).length;
    const publishedCoursesCount = adminCourses.filter(
      (course) => course.status === "PUBLISHED",
    ).length;
    const paidCoursesCount = adminCourses.filter(
      (course) => course.accessType === "PAID",
    ).length;
    const trialPreviewCoursesCount = adminCourses.filter(
      (course) => course.accessType === "TRIAL_PREVIEW",
    ).length;
    const activeAccessCount = adminEnrollments.filter(
      (enrollment) => enrollment.status !== "REMOVED",
    ).length;
    const removedAccessCount = adminEnrollments.filter(
      (enrollment) => enrollment.status === "REMOVED",
    ).length;
    const topCourses = adminData.topCourses ?? [];
    const pendingPaymentRequests = paymentRequests.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "PENDING",
    );
    const paidInvoiceCount = paymentRequests.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "PAID",
    ).length;
    const unpaidInvoiceCount = paymentRequests.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "UNPAID",
    ).length;
    const pendingPaymentAmount = pendingPaymentRequests.reduce(
      (sum, paymentRequest) => sum + (paymentRequest.amount ?? 0),
      0,
    );
    const paidPaymentRequests = paymentRequests.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "PAID",
    );
    const filteredAccessHistory = adminEnrollments.filter((enrollment) => {
      if (selectedAccessUserId && enrollment.userId !== selectedAccessUserId) {
        return false;
      }

      if (
        selectedAccessCourseId &&
        enrollment.courseId !== selectedAccessCourseId
      ) {
        return false;
      }

      return true;
    });
    const filteredActivityLogs = activityLogs.filter((log) => {
      const categoryMatch =
        activityLogFilters.category === "ALL"
          ? true
          : activityLogFilters.category === "USER"
            ? log.entityType === "Profile"
            : activityLogFilters.category === "COURSE"
              ? log.entityType === "Course"
              : activityLogFilters.category === "ACCESS"
                ? log.entityType === "Enrollment"
                : log.entityType === "PaymentRequest";

      if (!categoryMatch) {
        return false;
      }

      if (!activityLogFilters.q.trim()) {
        return true;
      }

      const haystack = [
        log.action,
        log.entityType,
        log.entityId,
        JSON.stringify(log.metadata ?? {}),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(activityLogFilters.q.trim().toLowerCase());
    });
    const userMap = new Map(
      adminUsers.map((managedUser) => [managedUser.id, managedUser]),
    );
    const courseMap = new Map(
      adminCourses.map((course) => [course.id, course]),
    );
    const convertSubmittedAmountToBdt = (
      paymentRequest: PaymentRequestRecord,
    ) =>
      paymentRequest.currency === "USD"
        ? roundInvoiceCurrency(paymentRequest.amount * invoiceBdtPerUsd)
        : paymentRequest.amount;
    const pendingSubmittedAmountBdt = pendingPaymentRequests.reduce(
      (sum, paymentRequest) =>
        sum + convertSubmittedAmountToBdt(paymentRequest),
      0,
    );
    const paidSubmittedAmountBdt = paidPaymentRequests.reduce(
      (sum, paymentRequest) =>
        sum + convertSubmittedAmountToBdt(paymentRequest),
      0,
    );
    const expectedInvoiceRevenueBdt = paidPaymentRequests.reduce(
      (sum, paymentRequest) => {
        const paymentCourse = paymentRequest.courseId
          ? (courseMap.get(paymentRequest.courseId) ?? null)
          : null;
        const expectedInvoiceAmounts = getExpectedInvoiceAmounts(paymentCourse);

        return (
          sum +
          (expectedInvoiceAmounts?.courseAmountBdt ??
            convertSubmittedAmountToBdt(paymentRequest))
        );
      },
      0,
    );
    const expectedInvoiceRevenueUsd = paidPaymentRequests.reduce(
      (sum, paymentRequest) => {
        const paymentCourse = paymentRequest.courseId
          ? (courseMap.get(paymentRequest.courseId) ?? null)
          : null;
        const expectedInvoiceAmounts = getExpectedInvoiceAmounts(paymentCourse);

        return (
          sum +
          (expectedInvoiceAmounts?.totalAmountUsd ??
            roundInvoiceCurrency(
              convertSubmittedAmountToBdt(paymentRequest) / invoiceBdtPerUsd,
            ))
        );
      },
      0,
    );
    const courseInvoiceAnalytics = adminCourses.map((course) => {
      const coursePayments = paymentRequests.filter(
        (paymentRequest) => paymentRequest.courseId === course.id,
      );
      const coursePendingPayments = coursePayments.filter(
        (paymentRequest) => paymentRequest.invoiceStatus === "PENDING",
      );
      const coursePaidPayments = coursePayments.filter(
        (paymentRequest) => paymentRequest.invoiceStatus === "PAID",
      );
      const expectedInvoiceAmounts = getExpectedInvoiceAmounts(course);
      const submittedAmountBdt = coursePayments.reduce(
        (sum, paymentRequest) =>
          sum + convertSubmittedAmountToBdt(paymentRequest),
        0,
      );

      return {
        course,
        coursePayments,
        coursePendingPayments,
        coursePaidPayments,
        expectedInvoiceAmounts,
        submittedAmountBdt,
      };
    });
    const accessPaymentScope = paymentRequests.filter((paymentRequest) => {
      if (
        selectedAccessUserId &&
        paymentRequest.userId !== selectedAccessUserId
      ) {
        return false;
      }

      if (
        selectedAccessCourseId &&
        paymentRequest.courseId !== selectedAccessCourseId
      ) {
        return false;
      }

      return true;
    });
    const selectedAccessCourse = selectedAccessCourseId
      ? (courseMap.get(selectedAccessCourseId) ?? null)
      : null;
    const selectedAccessUser = selectedAccessUserId
      ? (userMap.get(selectedAccessUserId) ?? null)
      : null;
    const selectedAccessInvoiceAmounts =
      getExpectedInvoiceAmounts(selectedAccessCourse);
    const scopedPendingInvoices = accessPaymentScope.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "PENDING",
    );
    const scopedPaidInvoices = accessPaymentScope.filter(
      (paymentRequest) => paymentRequest.invoiceStatus === "PAID",
    );
    const adminHeadingTitle =
      adminSection === "dashboard"
        ? "Admin Dashboard"
        : adminSection === "courses"
          ? "Admin Courses"
          : adminSection === "course-access"
            ? "Course Access"
            : adminSection === "payments"
              ? "Payments"
              : adminSection === "analytics"
                ? "Analytics"
                : "Admin Users";
    const adminHeadingCopy =
      adminSection === "dashboard"
        ? "Monitor users, courses, access, payments, and analytics from one clean admin overview."
        : adminSection === "courses"
          ? "Manage course records, pricing, access rules, publishing state, and safe delete from one focused workspace."
          : adminSection === "course-access"
            ? "Assign, remove, and audit manual course access overrides for specific users from one focused workspace."
            : adminSection === "payments"
              ? "Review learner payment requests, pending amount, approval notes, and revenue-facing status from one focused workspace."
              : adminSection === "analytics"
                ? "Track platform metrics, weekly activity, learner counts, payment funnel, and course performance from one focused workspace."
                : "Create, edit, block, restore, enroll, and manage LMS users from one focused workspace.";

    if (adminSection === "dashboard") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Dashboard overview is summary-only"
                      disabled
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Users {adminUsers.length}
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-stats">
                <article className="admin-console-stat-card">
                  <span>Total users</span>
                  <strong>{adminUsers.length}</strong>
                  <small>{`${activeUsersCount} active, ${suspendedUsersCount} blocked`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Total courses</span>
                  <strong>{adminCourses.length}</strong>
                  <small>{`${publishedCoursesCount} published, ${paidCoursesCount} paid`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Manual access</span>
                  <strong>{activeAccessCount}</strong>
                  <small>{`${removedAccessCount} removed access records`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Pending payments</span>
                  <strong>{pendingPaymentRequests.length}</strong>
                  <small>{`${pendingPaymentAmount} BDT awaiting review`}</small>
                </article>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (adminSection === "analytics") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Analytics view is summary-only"
                      disabled
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Revenue {adminData.widgets.revenueBdt ?? 0} BDT
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-stats">
                <article className="admin-console-stat-card">
                  <span>Total learners</span>
                  <strong>{learnerCount}</strong>
                  <small>{`${activeUsersCount} active, ${suspendedUsersCount} blocked`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Active learners</span>
                  <strong>{adminData.widgets.activeLearners}</strong>
                  <small>{`${adminCount} admins and ${learnerCount} learner accounts`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Pending payments</span>
                  <strong>{adminData.widgets.pendingPayments ?? 0}</strong>
                  <small>{`Pending amount ${pendingPaymentAmount} BDT`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Total revenue</span>
                  <strong>{adminData.widgets.revenueBdt ?? 0} BDT</strong>
                  <small>{`${adminData.widgets.approvedPayments ?? 0} approved payments`}</small>
                </article>
              </section>

              <section className="admin-console-grid admin-console-grid-overview">
                <article className="admin-console-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Weekly activity
                      </p>
                      <h2>LMS engagement trend</h2>
                    </div>
                    <span className="dashboard-chip">This week</span>
                  </div>
                  <div className="admin-console-mini-chart">
                    {activitySeries.map((item) => (
                      <div
                        key={item.label}
                        className="admin-console-mini-chart-bar"
                      >
                        <div
                          className="admin-console-mini-chart-fill"
                          style={{
                            height: `${Math.max(16, (item.value / maxActivityValue) * 100)}%`,
                          }}
                        />
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="admin-console-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Payment funnel</p>
                      <h2>Pending vs approved payments</h2>
                    </div>
                    <span className="dashboard-chip">Revenue view</span>
                  </div>
                  <div className="admin-console-summary-list">
                    <div className="admin-console-summary-line">
                      <span>Pending requests</span>
                      <strong>{adminData.widgets.pendingPayments ?? 0}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Pending amount</span>
                      <strong>{pendingPaymentAmount} BDT</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Approved payments</span>
                      <strong>{adminData.widgets.approvedPayments ?? 0}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Total revenue</span>
                      <strong>{adminData.widgets.revenueBdt ?? 0} BDT</strong>
                    </div>
                  </div>
                </article>
              </section>

              <section className="admin-console-grid admin-console-grid-overview">
                <article className="admin-console-card admin-console-chart-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Top courses</p>
                      <h2>Enrollment leaderboard</h2>
                    </div>
                    <span className="dashboard-chip">
                      {topCourses.length} ranked
                    </span>
                  </div>
                  <div className="admin-console-ranked-list">
                    {topCourses.length ? (
                      topCourses.map((course, index) => (
                        <div
                          key={course.courseId}
                          className="admin-console-ranked-item"
                        >
                          <span>{index + 1}</span>
                          <strong>{course.title}</strong>
                          <small>{`${course.enrolledUsers} enrolled • ${course.accessType} • ${course.revenueBdt} BDT`}</small>
                        </div>
                      ))
                    ) : (
                      <div className="admin-console-ranked-item">
                        <span>0</span>
                        <strong>No course analytics yet</strong>
                        <small>
                          Top courses will appear after enrollments start.
                        </small>
                      </div>
                    )}
                  </div>
                </article>

                <article className="admin-console-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Platform snapshot
                      </p>
                      <h2>Core system metrics</h2>
                    </div>
                    <span className="dashboard-chip">Summary</span>
                  </div>
                  <div className="admin-console-summary-list">
                    <div className="admin-console-summary-line">
                      <span>Total users</span>
                      <strong>{adminUsers.length}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Total courses</span>
                      <strong>{adminCourses.length}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Published courses</span>
                      <strong>{publishedCoursesCount}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Paid courses</span>
                      <strong>{paidCoursesCount}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Trial preview courses</span>
                      <strong>{trialPreviewCoursesCount}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Manual access records</span>
                      <strong>{activeAccessCount + removedAccessCount}</strong>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (adminSection === "payments") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search learner, transaction, method, plan..."
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Pending {pendingPaymentRequests.length}
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-card admin-console-users-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Receive invoice payment
                    </p>
                    <h2>Course purchase invoice payments</h2>
                  </div>
                  <span className="dashboard-chip">
                    {pendingPaymentRequests.length} pending
                  </span>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Total invoices</span>
                    <strong>{paymentRequests.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Pending</span>
                    <strong>{pendingPaymentRequests.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Paid</span>
                    <strong>{paidInvoiceCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Unpaid</span>
                    <strong>{unpaidInvoiceCount}</strong>
                  </div>
                </div>
                <p className="dashboard-copy">
                  Receive submitted invoice payments, verify transaction
                  references, and approve paid course access.
                </p>
                {paymentNotice ? (
                  <p className="dashboard-copy">{paymentNotice}</p>
                ) : null}
                <div className="admin-console-user-grid">
                  {paymentRequests.length ? (
                    paymentRequests.map((paymentRequest) => {
                      const paymentUser =
                        adminUsers.find(
                          (managedUser) =>
                            managedUser.id === paymentRequest.userId,
                        ) ?? null;
                      const paymentCourse = paymentRequest.courseId
                        ? (courseMap.get(paymentRequest.courseId) ?? null)
                        : null;
                      const expectedInvoiceAmounts =
                        getExpectedInvoiceAmounts(paymentCourse);

                      return (
                        <article
                          key={paymentRequest.id}
                          className="admin-console-user-card admin-payment-invoice-card"
                        >
                          <div className="dashboard-user-head">
                            <div>
                              <strong>
                                {paymentRequest.buyerName ??
                                  paymentUser?.fullName ??
                                  paymentRequest.userId}
                              </strong>
                              <span>
                                {paymentRequest.buyerEmail ??
                                  paymentUser?.email ??
                                  "Learner payment request"}
                              </span>
                            </div>
                            <span
                              className={`dashboard-chip invoice-status-${paymentRequest.invoiceStatus.toLowerCase()}`}
                            >
                              {paymentRequest.invoiceStatus}
                            </span>
                          </div>

                          <div className="dashboard-user-meta">
                            <span>{`Invoice: ${paymentRequest.invoiceNumber ?? "Legacy payment"}`}</span>
                            <span>{`Course: ${paymentCourse?.title ?? paymentRequest.planName}`}</span>
                            {paymentCourse ? (
                              <span>{`Course slug: ${paymentCourse.slug}`}</span>
                            ) : null}
                            <span>{`Transaction: ${paymentRequest.transactionId}`}</span>
                            <span>{`Reference: ${paymentRequest.paymentReference ?? "Not provided"}`}</span>
                            <span>{`Method: ${paymentRequest.paymentMethod}`}</span>
                            <span>{`Submitted amount: ${formatInvoiceMoney(paymentRequest.amount, paymentRequest.currency)}`}</span>
                            {expectedInvoiceAmounts ? (
                              <>
                                <span>{`Course BDT price: ${formatInvoiceMoney(expectedInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                                <span>{`USD invoice: ${formatInvoiceMoney(expectedInvoiceAmounts.coursePriceUsd, "USD")} + ${formatInvoiceMoney(expectedInvoiceAmounts.taxAmountUsd, "USD")} tax (${invoiceTaxPercentage}%) = ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                              </>
                            ) : null}
                            <span>{`Phone: ${paymentRequest.buyerPhone ?? "Not provided"}`}</span>
                            <span>{`Submitted: ${formatDate(paymentRequest.submittedAt)}`}</span>
                            {paymentRequest.paidAt ? (
                              <span>{`Paid: ${formatDate(paymentRequest.paidAt)}`}</span>
                            ) : null}
                          </div>

                          {paymentRequest.additionalMessage ? (
                            <p className="dashboard-copy">
                              {paymentRequest.additionalMessage}
                            </p>
                          ) : null}

                          {paymentRequest.invoiceStatus === "PENDING" ? (
                            <>
                              <label className="auth-field">
                                <span>Receive note</span>
                                <input
                                  value={
                                    paymentReviewNotes[paymentRequest.id] ?? ""
                                  }
                                  onChange={(event) =>
                                    setPaymentReviewNotes((current) => ({
                                      ...current,
                                      [paymentRequest.id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Optional receive or rejection note"
                                />
                              </label>
                              <div className="dashboard-actions">
                                <button
                                  type="button"
                                  className="dashboard-primary-link dashboard-button"
                                  onClick={() =>
                                    handlePaymentReview(
                                      paymentRequest.id,
                                      "approve",
                                    )
                                  }
                                  disabled={
                                    paymentActionId === paymentRequest.id
                                  }
                                >
                                  {paymentActionId === paymentRequest.id
                                    ? "Receiving..."
                                    : "Payment Received"}
                                </button>
                                <button
                                  type="button"
                                  className="dashboard-secondary-link dashboard-button"
                                  onClick={() =>
                                    handlePaymentReview(
                                      paymentRequest.id,
                                      "reject",
                                    )
                                  }
                                  disabled={
                                    paymentActionId === paymentRequest.id
                                  }
                                >
                                  Reject Payment
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="dashboard-muted">
                              {paymentRequest.invoiceStatus === "PAID"
                                ? "Payment received and course upgrade approved."
                                : "Payment was not approved."}
                            </p>
                          )}
                        </article>
                      );
                    })
                  ) : (
                    <p className="dashboard-muted">
                      No invoice payment records are available yet.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (adminSection === "course-access") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search access note, user, course..."
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Access {adminEnrollments.length}
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-card admin-console-users-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Manual course access
                    </p>
                    <h2>Assign, remove, and audit access overrides</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredAccessHistory.length} rows
                  </span>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Total history</span>
                    <strong>{adminEnrollments.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Active access</span>
                    <strong>{activeAccessCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Removed access</span>
                    <strong>{removedAccessCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Pending invoices</span>
                    <strong>{scopedPendingInvoices.length}</strong>
                  </div>
                </div>
                <p className="dashboard-copy">
                  Filter by learner and course, then assign or remove manual
                  overrides with an audit note. Paid-course access can be
                  checked against the selected course invoice price, USD
                  conversion, and submitted payment status.
                </p>
                {adminAccessNotice ? (
                  <p className="dashboard-copy">{adminAccessNotice}</p>
                ) : null}

                <div className="dashboard-user-edit-grid">
                  <label className="auth-field">
                    <span>User</span>
                    <select
                      className="dashboard-select"
                      value={selectedAccessUserId}
                      onChange={(event) =>
                        setSelectedAccessUserId(event.target.value)
                      }
                    >
                      <option value="">All users</option>
                      {adminUsers
                        .filter((managedUser) => managedUser.role !== "ADMIN")
                        .map((managedUser) => (
                          <option key={managedUser.id} value={managedUser.id}>
                            {managedUser.fullName} ({managedUser.email})
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="auth-field">
                    <span>Course</span>
                    <select
                      className="dashboard-select"
                      value={selectedAccessCourseId}
                      onChange={(event) =>
                        setSelectedAccessCourseId(event.target.value)
                      }
                    >
                      <option value="">All courses</option>
                      {adminCourses.map((course) => {
                        const expectedInvoiceAmounts =
                          getExpectedInvoiceAmounts(course);

                        return (
                          <option key={course.id} value={course.id}>
                            {course.title} -{" "}
                            {formatInvoiceMoney(course.priceBdt, "BDT")}
                            {expectedInvoiceAmounts
                              ? ` / ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <label className="auth-field">
                    <span>Audit note</span>
                    <input
                      value={accessNotes}
                      onChange={(event) => setAccessNotes(event.target.value)}
                      placeholder="Why are you changing access?"
                    />
                  </label>
                </div>

                <div className="dashboard-user-meta">
                  <span>{`Selected learner: ${selectedAccessUser?.fullName ?? "All learners"}`}</span>
                  <span>{`Selected course: ${selectedAccessCourse?.title ?? "All courses"}`}</span>
                  <span>{`Scoped invoices: ${accessPaymentScope.length} total, ${scopedPendingInvoices.length} pending, ${scopedPaidInvoices.length} paid`}</span>
                  {selectedAccessInvoiceAmounts ? (
                    <>
                      <span>{`Course BDT price: ${formatInvoiceMoney(selectedAccessInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                      <span>{`USD invoice: ${formatInvoiceMoney(selectedAccessInvoiceAmounts.coursePriceUsd, "USD")} + ${formatInvoiceMoney(selectedAccessInvoiceAmounts.taxAmountUsd, "USD")} tax (${invoiceTaxPercentage}%) = ${formatInvoiceMoney(selectedAccessInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                    </>
                  ) : null}
                </div>

                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-primary-link dashboard-button"
                    onClick={handleAssignAccess}
                    disabled={adminAccessActionId === "assign"}
                  >
                    {adminAccessActionId === "assign"
                      ? "Assigning..."
                      : "Assign access"}
                  </button>
                  <button
                    type="button"
                    className="dashboard-secondary-link dashboard-button"
                    onClick={handleRemoveAccess}
                    disabled={adminAccessActionId === "remove"}
                  >
                    {adminAccessActionId === "remove"
                      ? "Removing..."
                      : "Remove access"}
                  </button>
                </div>

                <div className="admin-console-user-grid">
                  {filteredAccessHistory.length ? (
                    filteredAccessHistory.map((enrollment) => {
                      const managedUser = userMap.get(enrollment.userId);
                      const course = courseMap.get(enrollment.courseId);
                      const accessTypeLabel = formatAccountStateLabel(
                        managedUser?.accountState,
                      );
                      const courseTypeLabel = formatCourseAccessTypeLabel(
                        course?.accessType,
                      );
                      const expectedInvoiceAmounts =
                        getExpectedInvoiceAmounts(course);
                      const relatedPayment =
                        paymentRequests.find(
                          (paymentRequest) =>
                            paymentRequest.userId === enrollment.userId &&
                            paymentRequest.courseId === enrollment.courseId,
                        ) ?? null;

                      return (
                        <article
                          key={enrollment.id}
                          className="admin-console-user-card"
                        >
                          <div className="dashboard-user-head">
                            <div>
                              <strong>
                                {managedUser?.fullName ?? enrollment.userId}
                              </strong>
                              <span>
                                {course?.title ?? enrollment.courseId}
                              </span>
                            </div>
                            <span className="dashboard-chip">
                              {enrollment.status === "REMOVED"
                                ? "Removed"
                                : "Active"}
                            </span>
                          </div>

                          <div className="dashboard-user-meta">
                            <span>{`User: ${managedUser?.email ?? enrollment.userId}`}</span>
                            <span>{`Course: ${course?.slug ?? enrollment.courseId}`}</span>
                            <span>{`Access type: ${accessTypeLabel}`}</span>
                            <span>{`Course type: ${courseTypeLabel}`}</span>
                            {expectedInvoiceAmounts ? (
                              <>
                                <span>{`Course BDT price: ${formatInvoiceMoney(expectedInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                                <span>{`USD invoice total: ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")} (${invoiceTaxPercentage}% tax)`}</span>
                              </>
                            ) : null}
                            {relatedPayment ? (
                              <>
                                <span>{`Related invoice: ${relatedPayment.invoiceNumber ?? "Pending invoice number"}`}</span>
                                <span>{`Payment status: ${relatedPayment.invoiceStatus}`}</span>
                                <span>{`Submitted amount: ${formatInvoiceMoney(relatedPayment.amount, relatedPayment.currency)}`}</span>
                              </>
                            ) : (
                              <span>No related invoice payment found</span>
                            )}
                            <span>{`Assigned: ${formatDate(enrollment.requestedAt)}`}</span>
                            <span>{`Review status: ${enrollment.status}`}</span>
                            <span>{`Note: ${enrollment.notes?.trim() || "No note"}`}</span>
                          </div>
                          {course ? (
                            <div className="dashboard-actions">
                              <Link
                                href={`/courses/${course.slug}/invoice`}
                                className="dashboard-secondary-link"
                              >
                                View invoice
                              </Link>
                              <Link
                                href={`/courses/${course.slug}`}
                                className="dashboard-secondary-link"
                              >
                                Open course
                              </Link>
                            </div>
                          ) : null}
                        </article>
                      );
                    })
                  ) : (
                    <p className="dashboard-muted">
                      No course access history matches the current filters yet.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (adminSection === "courses") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search title, category, slug, status..."
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Courses {adminCourses.length}
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-card admin-console-users-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Course management
                    </p>
                    <h2>Edit course access and pricing</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredCourses.length} courses
                  </span>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Total courses</span>
                    <strong>{adminCourses.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Published</span>
                    <strong>{publishedCoursesCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Paid</span>
                    <strong>{paidCoursesCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Trial preview</span>
                    <strong>{trialPreviewCoursesCount}</strong>
                  </div>
                </div>
                <p className="dashboard-copy">
                  Update `access_type`, `price_bdt`, `preview_lesson_limit`,
                  `trial_visible`, `trial_days`, and publishing state directly
                  from this focused courses page. Paid-course invoices use
                  course BDT price, divide by {invoiceBdtPerUsd} for USD, then
                  add fixed {invoiceTaxPercentage}% tax.
                </p>
                <div className="course-module-grid">
                  {adminCourseRequirementCards.map((requiredCourse) => {
                    const backendCourse = adminCourses.find(
                      (course) => course.slug === requiredCourse.slug,
                    );
                    const expectedInvoiceAmounts =
                      getExpectedInvoiceAmounts(backendCourse);

                    return (
                      <article
                        key={requiredCourse.slug}
                        className={`course-module-card${backendCourse ? "" : " is-locked"}`}
                      >
                        <small>
                          {backendCourse
                            ? "Backend course ready"
                            : "Backend record needed"}
                        </small>
                        <strong>{requiredCourse.title}</strong>
                        <span>{`Category: ${formatCourseCategoryLabel(backendCourse?.categoryId ?? requiredCourse.categoryId)}`}</span>
                        <span>{requiredCourse.requirement}</span>
                        <span>
                          {`${requiredCourse.lessons} lessons${
                            requiredCourse.projects
                              ? `, ${requiredCourse.projects} projects`
                              : ""
                          }`}
                        </span>
                        {expectedInvoiceAmounts ? (
                          <span>
                            {`Invoice: ${formatInvoiceMoney(expectedInvoiceAmounts.courseAmountBdt, "BDT")} / ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")} incl. tax`}
                          </span>
                        ) : null}
                        {backendCourse ? (
                          <Link
                            href={requiredCourse.href}
                            className="dashboard-secondary-link"
                          >
                            Open course
                          </Link>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
                {adminCourseNotice ? (
                  <p className="dashboard-copy">{adminCourseNotice}</p>
                ) : null}
                <div className="admin-console-user-grid">
                  {filteredCourses.map((course) => {
                    const expectedInvoiceAmounts =
                      getExpectedInvoiceAmounts(course);
                    const editPriceBdt =
                      (courseEditForm.accessType ?? "FREE") === "FREE"
                        ? 0
                        : Number(courseEditForm.priceBdt ?? 0);
                    const editCoursePriceUsd = roundInvoiceCurrency(
                      editPriceBdt / invoiceBdtPerUsd,
                    );
                    const editTaxAmountUsd = roundInvoiceCurrency(
                      editCoursePriceUsd * (invoiceTaxPercentage / 100),
                    );
                    const editTotalAmountUsd = roundInvoiceCurrency(
                      editCoursePriceUsd + editTaxAmountUsd,
                    );

                    return (
                      <article
                        key={course.id}
                        className="admin-console-user-card"
                      >
                        <div className="dashboard-user-head">
                          <div>
                            <strong>{course.title}</strong>
                            <span>{course.slug}</span>
                          </div>
                          <span className="dashboard-chip">
                            {course.status}
                          </span>
                        </div>

                        <div className="dashboard-user-meta">
                          <span>{`Category: ${formatCourseCategoryLabel(course.categoryId)}`}</span>
                          <span>{`Access: ${course.accessType}`}</span>
                          <span>{`Price: ${formatInvoiceMoney(course.priceBdt, "BDT")}`}</span>
                          {expectedInvoiceAmounts ? (
                            <>
                              <span>{`USD subtotal: ${formatInvoiceMoney(expectedInvoiceAmounts.coursePriceUsd, "USD")}`}</span>
                              <span>{`USD tax: ${formatInvoiceMoney(expectedInvoiceAmounts.taxAmountUsd, "USD")} (${invoiceTaxPercentage}%)`}</span>
                              <span>{`USD invoice total: ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                            </>
                          ) : (
                            <span>Invoice price: Free course</span>
                          )}
                          <span>{`Preview limit: ${course.previewLessonLimit ?? 0}`}</span>
                          <span>{`Trial visible: ${course.trialVisible ? "Yes" : "No"}`}</span>
                          <span>{`Trial duration: ${course.trialDays ?? 7} days`}</span>
                        </div>

                        {editingCourseId === course.id ? (
                          <div className="dashboard-user-edit-grid">
                            <label className="auth-field">
                              <span>Course title</span>
                              <input
                                value={courseEditForm.title ?? ""}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    title: event.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label className="auth-field">
                              <span>Slug</span>
                              <input
                                value={courseEditForm.slug ?? ""}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    slug: event.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label className="auth-field">
                              <span>Category</span>
                              <select
                                className="dashboard-select"
                                value={courseEditForm.categoryId ?? ""}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    categoryId: event.target.value,
                                  }))
                                }
                              >
                                <option value="">Uncategorized</option>
                                {courseCategoryOptions.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="auth-field">
                              <span>Access type</span>
                              <select
                                className="dashboard-select"
                                value={courseEditForm.accessType ?? "FREE"}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    accessType: event.target
                                      .value as CourseRecord["accessType"],
                                  }))
                                }
                              >
                                <option value="FREE">FREE</option>
                                <option value="TRIAL_PREVIEW">
                                  TRIAL_PREVIEW
                                </option>
                                <option value="PAID">PAID</option>
                              </select>
                            </label>
                            <label className="auth-field">
                              <span>Price BDT</span>
                              <input
                                type="number"
                                min={0}
                                disabled={
                                  (courseEditForm.accessType ?? "FREE") ===
                                  "FREE"
                                }
                                value={courseEditForm.priceBdt ?? 0}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    priceBdt: Number(event.target.value || 0),
                                  }))
                                }
                              />
                            </label>
                            <div className="dashboard-highlight">
                              <span>Invoice preview</span>
                              <strong>
                                {formatInvoiceMoney(
                                  Math.max(0, editPriceBdt),
                                  "BDT",
                                )}
                              </strong>
                              <small>
                                {`${formatInvoiceMoney(editCoursePriceUsd, "USD")} + ${formatInvoiceMoney(editTaxAmountUsd, "USD")} tax = ${formatInvoiceMoney(editTotalAmountUsd, "USD")}`}
                              </small>
                            </div>
                            <label className="auth-field">
                              <span>Preview lesson limit</span>
                              <input
                                type="number"
                                min={0}
                                disabled={
                                  (courseEditForm.accessType ?? "FREE") !==
                                  "TRIAL_PREVIEW"
                                }
                                value={courseEditForm.previewLessonLimit ?? 0}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    previewLessonLimit: Number(
                                      event.target.value || 0,
                                    ),
                                  }))
                                }
                              />
                            </label>
                            <label className="auth-field">
                              <span>Status</span>
                              <select
                                className="dashboard-select"
                                value={courseEditForm.status ?? "DRAFT"}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    status: event.target
                                      .value as CourseRecord["status"],
                                  }))
                                }
                              >
                                <option value="DRAFT">DRAFT</option>
                                <option value="PUBLISHED">PUBLISHED</option>
                                <option value="ARCHIVED">ARCHIVED</option>
                              </select>
                            </label>
                            <label className="auth-field">
                              <span>Trial duration (days)</span>
                              <input
                                type="number"
                                min={1}
                                max={365}
                                disabled={
                                  (courseEditForm.accessType ?? "FREE") !==
                                  "TRIAL_PREVIEW"
                                }
                                value={courseEditForm.trialDays ?? 7}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    trialDays: Number(event.target.value || 1),
                                  }))
                                }
                              />
                            </label>
                            <label className="dashboard-checkbox">
                              <input
                                type="checkbox"
                                disabled={
                                  (courseEditForm.accessType ?? "FREE") !==
                                  "TRIAL_PREVIEW"
                                }
                                checked={Boolean(courseEditForm.trialVisible)}
                                onChange={(event) =>
                                  setCourseEditForm((current) => ({
                                    ...current,
                                    trialVisible: event.target.checked,
                                  }))
                                }
                              />
                              <span>Trial visible</span>
                            </label>
                          </div>
                        ) : null}

                        <div className="dashboard-actions">
                          {editingCourseId === course.id ? (
                            <>
                              <button
                                type="button"
                                className="dashboard-primary-link dashboard-button"
                                onClick={() => handleSaveCourse(course.id)}
                                disabled={adminCourseActionId === course.id}
                              >
                                {adminCourseActionId === course.id
                                  ? "Saving..."
                                  : "Save course"}
                              </button>
                              <button
                                type="button"
                                className="dashboard-secondary-link dashboard-button"
                                onClick={() => setEditingCourseId(null)}
                                disabled={adminCourseActionId === course.id}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                href={`/courses/${course.slug}`}
                                className="dashboard-secondary-link dashboard-button"
                              >
                                View details
                              </Link>
                              <Link
                                href={`/courses/${course.slug}/invoice`}
                                className="dashboard-secondary-link dashboard-button"
                              >
                                View invoice
                              </Link>
                              <button
                                type="button"
                                className="dashboard-secondary-link dashboard-button"
                                onClick={() => startEditingCourse(course)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="dashboard-secondary-link dashboard-button"
                                onClick={() => {
                                  setDeleteCourseConfirmId(course.id);
                                  setDeleteCourseConfirmValue("");
                                  setAdminCourseNotice(
                                    `Type the course slug "${course.slug}" to confirm safe delete.`,
                                  );
                                }}
                                disabled={adminCourseActionId === course.id}
                              >
                                Open delete confirm
                              </button>
                            </>
                          )}
                        </div>

                        {deleteCourseConfirmId === course.id ? (
                          <div className="dashboard-user-edit-grid">
                            <label className="auth-field">
                              <span>{`Type ${course.slug} to confirm safe delete`}</span>
                              <input
                                value={deleteCourseConfirmValue}
                                onChange={(event) =>
                                  setDeleteCourseConfirmValue(
                                    event.target.value,
                                  )
                                }
                                placeholder={course.slug}
                              />
                            </label>
                            <div className="dashboard-actions">
                              <button
                                type="button"
                                className="dashboard-primary-link dashboard-button"
                                onClick={() => handleDeleteCourse(course.id)}
                                disabled={
                                  adminCourseActionId === course.id ||
                                  deleteCourseConfirmValue.trim() !==
                                    course.slug
                                }
                              >
                                {adminCourseActionId === course.id
                                  ? "Deleting..."
                                  : "Confirm safe delete"}
                              </button>
                              <button
                                type="button"
                                className="dashboard-secondary-link dashboard-button"
                                onClick={() => {
                                  setDeleteCourseConfirmId(null);
                                  setDeleteCourseConfirmValue("");
                                  setAdminCourseNotice(null);
                                }}
                                disabled={adminCourseActionId === course.id}
                              >
                                Cancel delete
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (adminSection === "users") {
      return (
        <main className="dashboard-page admin-console-page">
          <section className="admin-console-shell">
            <aside className="admin-console-sidebar">
              <div className="admin-console-logo">ET LMS</div>

              <nav className="admin-console-nav">
                {adminSidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`admin-console-nav-item ${
                      adminSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="admin-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="admin-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="admin-console-main">
              <header className="admin-console-topbar">
                <div className="admin-console-topbar-left">
                  <div className="admin-console-menu">|||</div>
                  <label className="admin-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search users, email, role, language..."
                    />
                  </label>
                </div>

                <div className="admin-console-topbar-right">
                  <div className="admin-console-indicator">Live</div>
                  <div className="admin-console-indicator">
                    Users {adminUsers.length}
                  </div>
                  <div className="admin-console-profile">
                    <div className="admin-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{roleLabel(user.role)}</strong>
                      <span>{user.fullName}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="admin-console-heading">
                <div>
                  <h1>{adminHeadingTitle}</h1>
                  <p>{adminHeadingCopy}</p>
                </div>
                <div className="admin-console-range">
                  {getCurrentWeekLabel()}
                </div>
              </section>

              <section className="admin-console-card admin-console-users-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">User management</p>
                    <h2>Create and manage LMS users</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredUsers.length} users
                  </span>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Total users</span>
                    <strong>{adminUsers.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Active users</span>
                    <strong>{activeUsersCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Admins</span>
                    <strong>{adminCount}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Blocked users</span>
                    <strong>{suspendedUsersCount}</strong>
                  </div>
                </div>
                <div className="dashboard-user-edit-grid">
                  <label className="auth-field">
                    <span>Full name</span>
                    <input
                      value={createUserForm.fullName}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          fullName: event.target.value,
                        }))
                      }
                      placeholder="Learner or admin full name"
                    />
                  </label>
                  <label className="auth-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={createUserForm.email}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      placeholder="user@example.com"
                    />
                  </label>
                  <label className="auth-field">
                    <span>Password</span>
                    <input
                      type="password"
                      value={createUserForm.password}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      placeholder="At least 8 characters"
                    />
                  </label>
                  <label className="auth-field">
                    <span>Role</span>
                    <select
                      className="dashboard-select"
                      value={createUserForm.role}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          role: event.target.value as UserRole,
                        }))
                      }
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="LEARNER_EN">Learner English</option>
                      <option value="LEARNER_BN">Learner Bangla</option>
                    </select>
                  </label>
                  <label className="auth-field">
                    <span>Account state</span>
                    <select
                      className="dashboard-select"
                      value={createUserForm.accountState ?? "TRIAL"}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          accountState: event.target.value as NonNullable<
                            CreateAdminUserPayload["accountState"]
                          >,
                        }))
                      }
                    >
                      <option value="FREE">FREE</option>
                      <option value="TRIAL">TRIAL</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </label>
                  <label className="auth-field">
                    <span>Preferred language</span>
                    <select
                      className="dashboard-select"
                      value={createUserForm.preferredLanguage ?? "en"}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          preferredLanguage: event.target.value as NonNullable<
                            CreateAdminUserPayload["preferredLanguage"]
                          >,
                        }))
                      }
                    >
                      <option value="en">English</option>
                      <option value="bn">Bangla</option>
                    </select>
                  </label>
                  <label className="dashboard-checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(createUserForm.isEmailVerified)}
                      onChange={(event) =>
                        setCreateUserForm((current) => ({
                          ...current,
                          isEmailVerified: event.target.checked,
                        }))
                      }
                    />
                    <span>Email verified</span>
                  </label>
                </div>
                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-primary-link dashboard-button"
                    onClick={handleCreateUser}
                    disabled={adminUserActionId === "create-user"}
                  >
                    {adminUserActionId === "create-user"
                      ? "Creating..."
                      : "Create user"}
                  </button>
                </div>
                {adminUserCreateNotice ? (
                  <p className="dashboard-copy">{adminUserCreateNotice}</p>
                ) : null}
                <p className="dashboard-copy">
                  Edit users, manually enroll learners, remove access, restore
                  access, or delete users from this focused admin page.
                </p>
                {adminUserNotice ? (
                  <p className="dashboard-copy">{adminUserNotice}</p>
                ) : null}
                {editingManagedUser ? (
                  <section className="admin-console-user-card">
                    <div className="admin-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">Edit user</p>
                        <h2>{editingManagedUser.fullName}</h2>
                      </div>
                      <span className="dashboard-chip">
                        {editingManagedUser.email}
                      </span>
                    </div>
                    <div className="dashboard-user-edit-grid">
                      <label className="auth-field">
                        <span>Full name</span>
                        <input
                          value={editForm.fullName ?? ""}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="auth-field">
                        <span>Role</span>
                        <select
                          className="dashboard-select"
                          value={editForm.role ?? "LEARNER_EN"}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              role: event.target.value as UserRole,
                            }))
                          }
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="LEARNER_EN">Learner English</option>
                          <option value="LEARNER_BN">Learner Bangla</option>
                        </select>
                      </label>
                      <label className="auth-field">
                        <span>Preferred language</span>
                        <select
                          className="dashboard-select"
                          value={editForm.preferredLanguage ?? "en"}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              preferredLanguage: event.target.value as
                                | "en"
                                | "bn",
                            }))
                          }
                        >
                          <option value="en">English</option>
                          <option value="bn">Bangla</option>
                        </select>
                      </label>
                      <label className="auth-field">
                        <span>Account state</span>
                        <select
                          className="dashboard-select"
                          value={editForm.accountState ?? "TRIAL"}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              accountState: event.target.value as
                                | "FREE"
                                | "TRIAL"
                                | "PAID",
                            }))
                          }
                        >
                          <option value="FREE">Free</option>
                          <option value="TRIAL">Trial</option>
                          <option value="PAID">Paid</option>
                        </select>
                      </label>
                      <div className="dashboard-copy">
                        Email verification status is read-only in this edit
                        form.
                      </div>
                    </div>
                    <div className="dashboard-actions">
                      <button
                        type="button"
                        className="dashboard-primary-link dashboard-button"
                        onClick={() => handleSaveUser(editingManagedUser.id)}
                        disabled={adminUserActionId === editingManagedUser.id}
                      >
                        {adminUserActionId === editingManagedUser.id
                          ? "Saving..."
                          : "Save"}
                      </button>
                      <button
                        type="button"
                        className="dashboard-secondary-link dashboard-button"
                        onClick={() => setEditingUserId(null)}
                        disabled={adminUserActionId === editingManagedUser.id}
                      >
                        Cancel
                      </button>
                    </div>
                  </section>
                ) : null}
                <div className="admin-console-user-grid">
                  {filteredUsers.map((managedUser) => (
                    <article
                      key={managedUser.id}
                      className="admin-console-user-card"
                    >
                      <div className="dashboard-user-head">
                        <div>
                          <strong>{managedUser.fullName}</strong>
                          <span>{managedUser.email}</span>
                        </div>
                        <span className="dashboard-chip">
                          {managedUser.isSuspended
                            ? "Access removed"
                            : roleLabel(managedUser.role)}
                        </span>
                      </div>

                      <div className="dashboard-user-meta">
                        <span>{`Role: ${roleLabel(managedUser.role)}`}</span>
                        <span>{`Account state: ${managedUser.accountState}`}</span>
                        <span>{`Language: ${managedUser.preferredLanguage}`}</span>
                        <span>{`Verified: ${managedUser.isEmailVerified ? "Yes" : "No"}`}</span>
                        <span>{`Status: ${managedUser.isSuspended ? "Suspended" : "Active"}`}</span>
                      </div>

                      <div className="dashboard-actions">
                        <button
                          type="button"
                          className="dashboard-secondary-link dashboard-button"
                          onClick={() => startEditingUser(managedUser)}
                        >
                          {editingUserId === managedUser.id
                            ? "Editing now"
                            : "Edit"}
                        </button>
                        <button
                          type="button"
                          className="dashboard-secondary-link dashboard-button"
                          onClick={() => handleManualEnroll(managedUser)}
                          disabled={
                            adminUserActionId === managedUser.id ||
                            managedUser.role === "ADMIN" ||
                            !adminCourseId
                          }
                        >
                          {adminUserActionId === managedUser.id
                            ? "Updating..."
                            : "Manual enroll"}
                        </button>
                        <button
                          type="button"
                          className="dashboard-secondary-link dashboard-button"
                          onClick={() => handleToggleAccess(managedUser)}
                          disabled={adminUserActionId === managedUser.id}
                        >
                          {adminUserActionId === managedUser.id
                            ? "Updating..."
                            : managedUser.isSuspended
                              ? "Restore access"
                              : "Remove access"}
                        </button>
                        <button
                          type="button"
                          className="dashboard-secondary-link dashboard-button"
                          onClick={() => handleDeleteUser(managedUser, user.id)}
                          disabled={
                            adminUserActionId === managedUser.id ||
                            managedUser.id === user.id
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className="dashboard-page admin-console-page">
        <section className="admin-console-shell">
          <aside className="admin-console-sidebar">
            <div className="admin-console-logo">ET LMS</div>

            <nav className="admin-console-nav">
              {adminSidebarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`admin-console-nav-item ${
                    adminSection === item.sectionId ? "is-current" : ""
                  }`}
                >
                  <span className="admin-console-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="admin-console-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </aside>

          <div className="admin-console-main">
            <header className="admin-console-topbar">
              <div className="admin-console-topbar-left">
                <div className="admin-console-menu">|||</div>
                <label className="admin-console-search">
                  <span>Search</span>
                  <input
                    type="text"
                    value={dashboardSearch}
                    onChange={(event) => setDashboardSearch(event.target.value)}
                    placeholder="Search courses, users, lessons, projects..."
                  />
                </label>
              </div>

              <div className="admin-console-topbar-right">
                <div className="admin-console-indicator">Live</div>
                <div className="admin-console-indicator">
                  Users {adminUsers.length}
                </div>
                <div className="admin-console-profile">
                  <div className="admin-console-avatar">
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <strong>{roleLabel(user.role)}</strong>
                    <span>{user.fullName}</span>
                  </div>
                </div>
              </div>
            </header>

            <section className="admin-console-heading">
              <div>
                <h1>{adminHeadingTitle}</h1>
                <p>{adminHeadingCopy}</p>
              </div>
              <div className="admin-console-range">{getCurrentWeekLabel()}</div>
            </section>

            {adminSection === "analytics" ? (
              <section className="admin-console-stats">
                <article className="admin-console-stat-card">
                  <span>Paid invoices</span>
                  <strong>{paidInvoiceCount}</strong>
                  <small>{`${formatInvoiceMoney(expectedInvoiceRevenueBdt, "BDT")} expected course price`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>USD revenue total</span>
                  <strong>
                    {formatInvoiceMoney(
                      roundInvoiceCurrency(expectedInvoiceRevenueUsd),
                      "USD",
                    )}
                  </strong>
                  <small>{`BDT / ${invoiceBdtPerUsd} plus ${invoiceTaxPercentage}% tax`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Pending invoices</span>
                  <strong>{pendingPaymentRequests.length}</strong>
                  <small>{`${formatInvoiceMoney(pendingSubmittedAmountBdt, "BDT")} submitted value`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Submitted paid value</span>
                  <strong>
                    {formatInvoiceMoney(paidSubmittedAmountBdt, "BDT")}
                  </strong>
                  <small>{`${formatInvoiceMoney(roundInvoiceCurrency(paidSubmittedAmountBdt / invoiceBdtPerUsd), "USD")} BDT-equivalent`}</small>
                </article>
              </section>
            ) : null}

            {adminSection === "dashboard" ? (
              <section className="admin-console-stats">
                <article className="admin-console-stat-card">
                  <span>Total Users</span>
                  <strong>{adminData.widgets.totalUsers}</strong>
                  <small>
                    {learnerCount} learners inside the LMS workspace
                  </small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Free / Trial / Paid</span>
                  <strong>{`${adminData.widgets.freeUsers ?? 0} / ${adminData.widgets.trialUsers ?? 0} / ${adminData.widgets.paidUsers ?? 0}`}</strong>
                  <small>Subscription-state breakdown</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Total Courses</span>
                  <strong>{adminData.widgets.totalCourses}</strong>
                  <small>Single published electrical course workspace</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Total Lessons</span>
                  <strong>{allAdminCourseLessons.length}</strong>
                  <small>All lesson routes under the main course</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Pending Enrollments</span>
                  <strong>{adminData.widgets.pendingEnrollments}</strong>
                  <small>Manual review and admin enrollment ready</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Pending Payments</span>
                  <strong>{adminData.widgets.pendingPayments ?? 0}</strong>
                  <small>{`Revenue ${adminData.widgets.revenueBdt ?? 0} BDT`}</small>
                </article>
                <article className="admin-console-stat-card">
                  <span>Active Learners</span>
                  <strong>{adminData.widgets.activeLearners}</strong>
                  <small>{`${activeUsersCount} active, ${suspendedUsersCount} blocked`}</small>
                </article>
              </section>
            ) : null}

            {adminSection === "dashboard" ? (
              <section className="admin-console-grid admin-console-grid-overview">
                <article className="admin-console-card admin-console-chart-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Enrollment overview
                      </p>
                      <h2>Weekly LMS activity</h2>
                    </div>
                    <span className="dashboard-chip">This week</span>
                  </div>
                  <div className="admin-console-mini-chart">
                    {activitySeries.map((item) => (
                      <div
                        key={item.label}
                        className="admin-console-mini-chart-bar"
                      >
                        <div
                          className="admin-console-mini-chart-fill"
                          style={{
                            height: `${Math.max(16, (item.value / maxActivityValue) * 100)}%`,
                          }}
                        />
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="admin-console-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Top course</p>
                      <h2>{courseTitle}</h2>
                    </div>
                    <Link
                      href={coursePortalLink}
                      className="dashboard-secondary-link"
                    >
                      View
                    </Link>
                  </div>
                  <div className="admin-console-ranked-list">
                    <div className="admin-console-ranked-item">
                      <span>1</span>
                      <strong>{courseTitle}</strong>
                      <small>
                        {adminData.widgets.activeLearners} learners active
                      </small>
                    </div>
                    <div className="admin-console-summary-row">
                      <div>
                        <span>Lessons</span>
                        <strong>{allAdminCourseLessons.length}</strong>
                      </div>
                      <div>
                        <span>Projects</span>
                        <strong>{basicsCourseProjects.length}</strong>
                      </div>
                      <div>
                        <span>Pending</span>
                        <strong>{adminData.widgets.pendingEnrollments}</strong>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="admin-console-card">
                  <div className="admin-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        User management
                      </p>
                      <h2>Access summary</h2>
                    </div>
                    <span className="dashboard-chip">
                      {filteredUsers.length} visible
                    </span>
                  </div>
                  <div className="admin-console-summary-list">
                    <div className="admin-console-summary-line">
                      <span>Total users</span>
                      <strong>{adminUsers.length}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Active users</span>
                      <strong>{activeUsersCount}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Admins</span>
                      <strong>{adminCount}</strong>
                    </div>
                    <div className="admin-console-summary-line">
                      <span>Suspended users</span>
                      <strong>{suspendedUsersCount}</strong>
                    </div>
                  </div>
                </article>
              </section>
            ) : null}

            <section className="admin-console-grid admin-console-grid-overview">
              <article className="admin-console-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Payment funnel</p>
                    <h2>Pending vs approved payments</h2>
                  </div>
                  <span className="dashboard-chip">Revenue view</span>
                </div>
                <div className="admin-console-summary-list">
                  <div className="admin-console-summary-line">
                    <span>Pending requests</span>
                    <strong>{adminData.widgets.pendingPayments ?? 0}</strong>
                  </div>
                  <div className="admin-console-summary-line">
                    <span>Pending amount</span>
                    <strong>
                      {formatInvoiceMoney(
                        pendingSubmittedAmountBdt || pendingPaymentAmount,
                        "BDT",
                      )}
                    </strong>
                  </div>
                  <div className="admin-console-summary-line">
                    <span>Approved payments</span>
                    <strong>{paidInvoiceCount}</strong>
                  </div>
                  <div className="admin-console-summary-line">
                    <span>Expected paid revenue</span>
                    <strong>
                      {formatInvoiceMoney(expectedInvoiceRevenueBdt, "BDT")}
                    </strong>
                  </div>
                  <div className="admin-console-summary-line">
                    <span>USD with tax</span>
                    <strong>
                      {formatInvoiceMoney(
                        roundInvoiceCurrency(expectedInvoiceRevenueUsd),
                        "USD",
                      )}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="admin-console-card admin-console-chart-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Top courses</p>
                    <h2>Enrollment leaderboard</h2>
                  </div>
                  <span className="dashboard-chip">
                    {topCourses.length} ranked
                  </span>
                </div>
                <div className="admin-console-ranked-list">
                  {topCourses.length ? (
                    topCourses.map((course, index) => (
                      <div
                        key={course.courseId}
                        className="admin-console-ranked-item"
                      >
                        <span>{index + 1}</span>
                        <strong>{course.title}</strong>
                        <small>
                          {`${course.enrolledUsers} enrolled • ${course.accessType} • ${course.revenueBdt} BDT`}
                        </small>
                      </div>
                    ))
                  ) : (
                    <div className="admin-console-ranked-item">
                      <span>0</span>
                      <strong>No course analytics yet</strong>
                      <small>
                        Top courses will appear after enrollments start.
                      </small>
                    </div>
                  )}
                </div>
              </article>
            </section>

            {adminSection === "analytics" ? (
              <section className="admin-console-card admin-console-users-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Invoice analytics
                    </p>
                    <h2>Course price and payment breakdown</h2>
                  </div>
                  <span className="dashboard-chip">
                    {courseInvoiceAnalytics.length} courses
                  </span>
                </div>
                <p className="dashboard-copy">
                  Each paid-course invoice uses the course BDT price, converts
                  USD by dividing by
                  {` ${invoiceBdtPerUsd}`}, then adds fixed{" "}
                  {invoiceTaxPercentage}% tax.
                </p>
                <div className="admin-console-user-grid">
                  {courseInvoiceAnalytics.map((item) => (
                    <article
                      key={item.course.id}
                      className="admin-console-user-card"
                    >
                      <div className="dashboard-user-head">
                        <div>
                          <strong>{item.course.title}</strong>
                          <span>{item.course.slug}</span>
                        </div>
                        <span className="dashboard-chip">
                          {item.course.accessType}
                        </span>
                      </div>
                      <div className="dashboard-user-meta">
                        <span>{`Payments: ${item.coursePayments.length} total`}</span>
                        <span>{`Pending: ${item.coursePendingPayments.length}`}</span>
                        <span>{`Paid: ${item.coursePaidPayments.length}`}</span>
                        <span>{`Submitted value: ${formatInvoiceMoney(item.submittedAmountBdt, "BDT")}`}</span>
                        {item.expectedInvoiceAmounts ? (
                          <>
                            <span>{`Course BDT price: ${formatInvoiceMoney(item.expectedInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                            <span>{`USD subtotal: ${formatInvoiceMoney(item.expectedInvoiceAmounts.coursePriceUsd, "USD")}`}</span>
                            <span>{`USD tax: ${formatInvoiceMoney(item.expectedInvoiceAmounts.taxAmountUsd, "USD")} (${invoiceTaxPercentage}%)`}</span>
                            <span>{`USD invoice total: ${formatInvoiceMoney(item.expectedInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                          </>
                        ) : (
                          <span>Invoice price: Free course</span>
                        )}
                      </div>
                      <div className="dashboard-actions">
                        <Link
                          href={`/courses/${item.course.slug}`}
                          className="dashboard-secondary-link"
                        >
                          Open course
                        </Link>
                        <Link
                          href={`/courses/${item.course.slug}/invoice`}
                          className="dashboard-secondary-link"
                        >
                          View invoice
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="admin-console-grid admin-console-grid-tables">
              <article className="admin-console-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Lesson catalog</p>
                    <h2>Course lesson list</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredLessons.length} lessons
                  </span>
                </div>
                <div className="admin-console-table">
                  {filteredLessons.map((lesson, index) => (
                    <Link
                      key={lesson.href}
                      href={lesson.href}
                      className="admin-console-table-row"
                    >
                      <span className="admin-console-table-rank">
                        {index + 1}
                      </span>
                      <strong>{lesson.title}</strong>
                      <small>Open lesson route</small>
                    </Link>
                  ))}
                </div>
              </article>

              <article className="admin-console-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Project catalog</p>
                    <h2>Course projects</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredProjects.length} projects
                  </span>
                </div>
                <div className="admin-console-table">
                  {filteredProjects.map((project, index) =>
                    project.href ? (
                      <Link
                        key={project.title}
                        href={project.href}
                        className="admin-console-table-row"
                      >
                        <span className="admin-console-table-rank">
                          {index + 1}
                        </span>
                        <strong>{project.title}</strong>
                        <small>Open project workspace</small>
                      </Link>
                    ) : (
                      <div
                        key={project.title}
                        className="admin-console-table-row"
                      >
                        <span className="admin-console-table-rank">
                          {index + 1}
                        </span>
                        <strong>{project.title}</strong>
                        <small>Project folder ready for next phase</small>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="admin-console-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">System overview</p>
                    <h2>Backend status</h2>
                  </div>
                  <span className="dashboard-chip">Live</span>
                </div>
                <div className="admin-console-system-list">
                  <div className="admin-console-system-item">
                    <span>Server status</span>
                    <strong>{adminData.systemHealth.service}</strong>
                    <small>
                      {formatDate(adminData.systemHealth.timestamp)}
                    </small>
                  </div>
                  <div className="admin-console-system-item">
                    <span>Database</span>
                    <strong>{adminData.systemHealth.database}</strong>
                    <small>
                      {adminData.systemHealth.storageDriver} storage driver
                    </small>
                  </div>
                  <div className="admin-console-system-item">
                    <span>Stored files</span>
                    <strong>{adminData.systemHealth.totalFiles}</strong>
                    <small>
                      {adminData.systemHealth.totalStorageMegabytes} MB used
                    </small>
                  </div>
                </div>
              </article>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">Course management</p>
                  <h2>Edit pricing and access rules</h2>
                </div>
                <span className="dashboard-chip">
                  {adminCourses.length} courses
                </span>
              </div>
              <p className="dashboard-copy">
                Update `access_type`, `price_bdt`, `preview_lesson_limit`, and
                `trial_visible` directly from the admin dashboard.
              </p>
              {adminCourseNotice ? (
                <p className="dashboard-copy">{adminCourseNotice}</p>
              ) : null}
              <div className="admin-console-user-grid">
                {adminCourses.map((course) => (
                  <article key={course.id} className="admin-console-user-card">
                    <div className="dashboard-user-head">
                      <div>
                        <strong>{course.title}</strong>
                        <span>{course.slug}</span>
                      </div>
                      <span className="dashboard-chip">{course.status}</span>
                    </div>

                    <div className="dashboard-user-meta">
                      <span>{`Access: ${course.accessType}`}</span>
                      <span>{`Price: ${course.priceBdt} BDT`}</span>
                      <span>{`Preview limit: ${course.previewLessonLimit ?? 0}`}</span>
                      <span>{`Trial visible: ${course.trialVisible ? "Yes" : "No"}`}</span>
                    </div>

                    {editingCourseId === course.id ? (
                      <div className="dashboard-user-edit-grid">
                        <label className="auth-field">
                          <span>Course title</span>
                          <input
                            value={courseEditForm.title ?? ""}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span>Slug</span>
                          <input
                            value={courseEditForm.slug ?? ""}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                slug: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span>Access type</span>
                          <select
                            className="dashboard-select"
                            value={courseEditForm.accessType ?? "FREE"}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                accessType: event.target
                                  .value as CourseRecord["accessType"],
                              }))
                            }
                          >
                            <option value="FREE">FREE</option>
                            <option value="TRIAL_PREVIEW">TRIAL_PREVIEW</option>
                            <option value="PAID">PAID</option>
                          </select>
                        </label>
                        <label className="auth-field">
                          <span>Price BDT</span>
                          <input
                            type="number"
                            min={0}
                            disabled={
                              (courseEditForm.accessType ?? "FREE") === "FREE"
                            }
                            value={courseEditForm.priceBdt ?? 0}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                priceBdt: Number(event.target.value || 0),
                              }))
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span>Preview lesson limit</span>
                          <input
                            type="number"
                            min={0}
                            disabled={
                              (courseEditForm.accessType ?? "FREE") !==
                              "TRIAL_PREVIEW"
                            }
                            value={courseEditForm.previewLessonLimit ?? 0}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                previewLessonLimit: Number(
                                  event.target.value || 0,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span>Status</span>
                          <select
                            className="dashboard-select"
                            value={courseEditForm.status ?? "DRAFT"}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                status: event.target
                                  .value as CourseRecord["status"],
                              }))
                            }
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>
                        </label>
                        <label className="dashboard-checkbox">
                          <input
                            type="checkbox"
                            disabled={
                              (courseEditForm.accessType ?? "FREE") !==
                              "TRIAL_PREVIEW"
                            }
                            checked={Boolean(courseEditForm.trialVisible)}
                            onChange={(event) =>
                              setCourseEditForm((current) => ({
                                ...current,
                                trialVisible: event.target.checked,
                              }))
                            }
                          />
                          <span>Trial visible</span>
                        </label>
                      </div>
                    ) : null}

                    <div className="dashboard-actions">
                      {editingCourseId === course.id ? (
                        <>
                          <button
                            type="button"
                            className="dashboard-primary-link dashboard-button"
                            onClick={() => handleSaveCourse(course.id)}
                            disabled={adminCourseActionId === course.id}
                          >
                            {adminCourseActionId === course.id
                              ? "Saving..."
                              : "Save course"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => setEditingCourseId(null)}
                            disabled={adminCourseActionId === course.id}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/courses/${course.slug}`}
                            className="dashboard-secondary-link dashboard-button"
                          >
                            View details
                          </Link>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => startEditingCourse(course)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => {
                              setDeleteCourseConfirmId(course.id);
                              setDeleteCourseConfirmValue("");
                              setAdminCourseNotice(
                                `Type the course slug "${course.slug}" to confirm safe delete.`,
                              );
                            }}
                            disabled={adminCourseActionId === course.id}
                          >
                            Open delete confirm
                          </button>
                        </>
                      )}
                    </div>
                    {deleteCourseConfirmId === course.id ? (
                      <div className="dashboard-user-edit-grid">
                        <label className="auth-field">
                          <span>{`Type ${course.slug} to confirm safe delete`}</span>
                          <input
                            value={deleteCourseConfirmValue}
                            onChange={(event) =>
                              setDeleteCourseConfirmValue(event.target.value)
                            }
                            placeholder={course.slug}
                          />
                        </label>
                        <div className="dashboard-actions">
                          <button
                            type="button"
                            className="dashboard-primary-link dashboard-button"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={
                              adminCourseActionId === course.id ||
                              deleteCourseConfirmValue.trim() !== course.slug
                            }
                          >
                            {adminCourseActionId === course.id
                              ? "Deleting..."
                              : "Confirm safe delete"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => {
                              setDeleteCourseConfirmId(null);
                              setDeleteCourseConfirmValue("");
                              setAdminCourseNotice(null);
                            }}
                            disabled={adminCourseActionId === course.id}
                          >
                            Cancel delete
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">
                    Course access history
                  </p>
                  <h2>Assign, remove, and audit access overrides</h2>
                </div>
                <span className="dashboard-chip">
                  {filteredAccessHistory.length} rows
                </span>
              </div>
              <p className="dashboard-copy">
                Filter access history by user and course, then assign or remove
                overrides with an audit note. Paid-course access should match
                the learner invoice status and dynamic BDT-to-USD price rule.
              </p>
              {adminAccessNotice ? (
                <p className="dashboard-copy">{adminAccessNotice}</p>
              ) : null}
              <div className="dashboard-user-edit-grid">
                <label className="auth-field">
                  <span>User</span>
                  <select
                    className="dashboard-select"
                    value={selectedAccessUserId}
                    onChange={(event) =>
                      setSelectedAccessUserId(event.target.value)
                    }
                  >
                    <option value="">All users</option>
                    {adminUsers
                      .filter((managedUser) => managedUser.role !== "ADMIN")
                      .map((managedUser) => (
                        <option key={managedUser.id} value={managedUser.id}>
                          {managedUser.fullName} ({managedUser.email})
                        </option>
                      ))}
                  </select>
                </label>
                <label className="auth-field">
                  <span>Course</span>
                  <select
                    className="dashboard-select"
                    value={selectedAccessCourseId}
                    onChange={(event) =>
                      setSelectedAccessCourseId(event.target.value)
                    }
                  >
                    <option value="">All courses</option>
                    {adminCourses.map((course) => {
                      const expectedInvoiceAmounts =
                        getExpectedInvoiceAmounts(course);

                      return (
                        <option key={course.id} value={course.id}>
                          {course.title} -{" "}
                          {formatInvoiceMoney(course.priceBdt, "BDT")}
                          {expectedInvoiceAmounts
                            ? ` / ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`
                            : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label className="auth-field">
                  <span>Audit note</span>
                  <input
                    value={accessNotes}
                    onChange={(event) => setAccessNotes(event.target.value)}
                    placeholder="Why are you assigning or removing access?"
                  />
                </label>
              </div>
              <div className="dashboard-user-meta">
                <span>{`Selected learner: ${selectedAccessUser?.fullName ?? "All learners"}`}</span>
                <span>{`Selected course: ${selectedAccessCourse?.title ?? "All courses"}`}</span>
                <span>{`Scoped invoices: ${accessPaymentScope.length} total, ${scopedPendingInvoices.length} pending, ${scopedPaidInvoices.length} paid`}</span>
                {selectedAccessInvoiceAmounts ? (
                  <>
                    <span>{`Course BDT price: ${formatInvoiceMoney(selectedAccessInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                    <span>{`USD invoice: ${formatInvoiceMoney(selectedAccessInvoiceAmounts.coursePriceUsd, "USD")} + ${formatInvoiceMoney(selectedAccessInvoiceAmounts.taxAmountUsd, "USD")} tax (${invoiceTaxPercentage}%) = ${formatInvoiceMoney(selectedAccessInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                  </>
                ) : null}
              </div>
              <div className="dashboard-actions">
                <button
                  type="button"
                  className="dashboard-primary-link dashboard-button"
                  onClick={handleAssignAccess}
                  disabled={adminAccessActionId === "assign"}
                >
                  {adminAccessActionId === "assign"
                    ? "Assigning..."
                    : "Assign access"}
                </button>
                <button
                  type="button"
                  className="dashboard-secondary-link dashboard-button"
                  onClick={handleRemoveAccess}
                  disabled={adminAccessActionId === "remove"}
                >
                  {adminAccessActionId === "remove"
                    ? "Removing..."
                    : "Remove access"}
                </button>
              </div>
              <div className="admin-console-user-grid">
                {filteredAccessHistory.length ? (
                  filteredAccessHistory.map((enrollment) => {
                    const managedUser = userMap.get(enrollment.userId);
                    const course = courseMap.get(enrollment.courseId);
                    const accessTypeLabel = formatAccountStateLabel(
                      managedUser?.accountState,
                    );
                    const courseTypeLabel = formatCourseAccessTypeLabel(
                      course?.accessType,
                    );
                    const expectedInvoiceAmounts =
                      getExpectedInvoiceAmounts(course);
                    const relatedPayment =
                      paymentRequests.find(
                        (paymentRequest) =>
                          paymentRequest.userId === enrollment.userId &&
                          paymentRequest.courseId === enrollment.courseId,
                      ) ?? null;

                    return (
                      <article
                        key={enrollment.id}
                        className="admin-console-user-card"
                      >
                        <div className="dashboard-user-head">
                          <div>
                            <strong>
                              {managedUser?.fullName ?? enrollment.userId}
                            </strong>
                            <span>{course?.title ?? enrollment.courseId}</span>
                          </div>
                          <span className="dashboard-chip">
                            {enrollment.status}
                          </span>
                        </div>
                        <div className="dashboard-user-meta">
                          <span>{`Source: ${enrollment.source}`}</span>
                          <span>{`Access type: ${accessTypeLabel}`}</span>
                          <span>{`Course type: ${courseTypeLabel}`}</span>
                          {expectedInvoiceAmounts ? (
                            <>
                              <span>{`Course BDT price: ${formatInvoiceMoney(expectedInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                              <span>{`USD invoice total: ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")} (${invoiceTaxPercentage}% tax)`}</span>
                            </>
                          ) : null}
                          {relatedPayment ? (
                            <>
                              <span>{`Related invoice: ${relatedPayment.invoiceNumber ?? "Pending invoice number"}`}</span>
                              <span>{`Payment status: ${relatedPayment.invoiceStatus}`}</span>
                              <span>{`Submitted amount: ${formatInvoiceMoney(relatedPayment.amount, relatedPayment.currency)}`}</span>
                            </>
                          ) : (
                            <span>No related invoice payment found</span>
                          )}
                          <span>{`Requested: ${formatDate(enrollment.requestedAt)}`}</span>
                          <span>{`Reviewed: ${formatDate(enrollment.reviewedAt)}`}</span>
                          <span>{`Course slug: ${course?.slug ?? "Unknown"}`}</span>
                        </div>
                        {enrollment.notes ? (
                          <p className="dashboard-copy">{enrollment.notes}</p>
                        ) : null}
                        {course ? (
                          <div className="dashboard-actions">
                            <Link
                              href={`/courses/${course.slug}/invoice`}
                              className="dashboard-secondary-link"
                            >
                              View invoice
                            </Link>
                            <Link
                              href={`/courses/${course.slug}`}
                              className="dashboard-secondary-link"
                            >
                              Open course
                            </Link>
                          </div>
                        ) : null}
                      </article>
                    );
                  })
                ) : (
                  <p className="dashboard-muted">
                    No access history matches the current user/course filters
                    yet.
                  </p>
                )}
              </div>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">
                    Admin activity timeline
                  </p>
                  <h2>User, course, access, and payment actions</h2>
                </div>
                <span className="dashboard-chip">
                  {filteredActivityLogs.length} events
                </span>
              </div>
              <div className="dashboard-user-edit-grid">
                <label className="auth-field">
                  <span>Category</span>
                  <select
                    className="dashboard-select"
                    value={activityLogFilters.category}
                    onChange={(event) =>
                      setActivityLogFilters((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  >
                    <option value="ALL">All</option>
                    <option value="USER">User</option>
                    <option value="COURSE">Course</option>
                    <option value="ACCESS">Access</option>
                    <option value="PAYMENT">Payment</option>
                  </select>
                </label>
                <label className="auth-field">
                  <span>Search</span>
                  <input
                    value={activityLogFilters.q}
                    onChange={(event) =>
                      setActivityLogFilters((current) => ({
                        ...current,
                        q: event.target.value,
                      }))
                    }
                    placeholder="Search action, entity, notes, metadata..."
                  />
                </label>
              </div>
              <div className="admin-console-user-grid">
                {filteredActivityLogs.length ? (
                  filteredActivityLogs.map((log) => (
                    <article key={log.id} className="admin-console-user-card">
                      <div className="dashboard-user-head">
                        <div>
                          <strong>{log.action}</strong>
                          <span>{log.entityType}</span>
                        </div>
                        <span className="dashboard-chip">
                          {formatShortDate(log.createdAt)}
                        </span>
                      </div>
                      <div className="dashboard-user-meta">
                        <span>{`Entity ID: ${log.entityId ?? "N/A"}`}</span>
                        <span>{`Admin ID: ${log.adminUserId}`}</span>
                        <span>{`Created: ${formatDate(log.createdAt)}`}</span>
                      </div>
                      {log.metadata ? (
                        <p className="dashboard-copy">
                          {JSON.stringify(log.metadata)}
                        </p>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <p className="dashboard-muted">
                    No admin activity logs match the current category or search
                    filter.
                  </p>
                )}
              </div>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">
                    Receive invoice payment
                  </p>
                  <h2>Course purchase invoice payments</h2>
                </div>
                <span className="dashboard-chip">
                  {pendingPaymentRequests.length} pending
                </span>
              </div>
              <p className="dashboard-copy">
                Receive SQL-backed invoice payment submissions and mark each
                transaction as received or rejected.
              </p>
              {paymentNotice ? (
                <p className="dashboard-copy">{paymentNotice}</p>
              ) : null}
              <div className="admin-console-user-grid">
                {paymentRequests.length ? (
                  paymentRequests.map((paymentRequest) => {
                    const paymentUser =
                      adminUsers.find(
                        (managedUser) =>
                          managedUser.id === paymentRequest.userId,
                      ) ?? null;
                    const paymentCourse = paymentRequest.courseId
                      ? (courseMap.get(paymentRequest.courseId) ?? null)
                      : null;
                    const expectedInvoiceAmounts =
                      getExpectedInvoiceAmounts(paymentCourse);

                    return (
                      <article
                        key={paymentRequest.id}
                        className="admin-console-user-card admin-payment-invoice-card"
                      >
                        <div className="dashboard-user-head">
                          <div>
                            <strong>
                              {paymentRequest.buyerName ??
                                paymentUser?.fullName ??
                                paymentRequest.userId}
                            </strong>
                            <span>
                              {paymentRequest.buyerEmail ??
                                paymentUser?.email ??
                                "Learner payment request"}
                            </span>
                          </div>
                          <span
                            className={`dashboard-chip invoice-status-${paymentRequest.invoiceStatus.toLowerCase()}`}
                          >
                            {paymentRequest.invoiceStatus}
                          </span>
                        </div>

                        <div className="dashboard-user-meta">
                          <span>{`Invoice: ${paymentRequest.invoiceNumber ?? "Legacy payment"}`}</span>
                          <span>{`Course: ${paymentCourse?.title ?? paymentRequest.planName}`}</span>
                          {paymentCourse ? (
                            <span>{`Course slug: ${paymentCourse.slug}`}</span>
                          ) : null}
                          <span>{`Transaction: ${paymentRequest.transactionId}`}</span>
                          <span>{`Reference: ${paymentRequest.paymentReference ?? "Not provided"}`}</span>
                          <span>{`Method: ${paymentRequest.paymentMethod}`}</span>
                          <span>{`Submitted amount: ${formatInvoiceMoney(paymentRequest.amount, paymentRequest.currency)}`}</span>
                          {expectedInvoiceAmounts ? (
                            <>
                              <span>{`Course BDT price: ${formatInvoiceMoney(expectedInvoiceAmounts.courseAmountBdt, "BDT")}`}</span>
                              <span>{`USD invoice: ${formatInvoiceMoney(expectedInvoiceAmounts.coursePriceUsd, "USD")} + ${formatInvoiceMoney(expectedInvoiceAmounts.taxAmountUsd, "USD")} tax (${invoiceTaxPercentage}%) = ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`}</span>
                            </>
                          ) : null}
                          <span>{`Phone: ${paymentRequest.buyerPhone ?? "Not provided"}`}</span>
                          <span>{`Submitted: ${formatDate(paymentRequest.submittedAt)}`}</span>
                          {paymentRequest.paidAt ? (
                            <span>{`Paid: ${formatDate(paymentRequest.paidAt)}`}</span>
                          ) : null}
                        </div>

                        {paymentRequest.invoiceStatus === "PENDING" ? (
                          <>
                            <label className="auth-field">
                              <span>Receive note</span>
                              <input
                                value={
                                  paymentReviewNotes[paymentRequest.id] ?? ""
                                }
                                onChange={(event) =>
                                  setPaymentReviewNotes((current) => ({
                                    ...current,
                                    [paymentRequest.id]: event.target.value,
                                  }))
                                }
                                placeholder="Optional receive or rejection note"
                              />
                            </label>

                            <div className="dashboard-actions">
                              <button
                                type="button"
                                className="dashboard-primary-link dashboard-button"
                                onClick={() =>
                                  handlePaymentReview(
                                    paymentRequest.id,
                                    "approve",
                                  )
                                }
                                disabled={paymentActionId === paymentRequest.id}
                              >
                                {paymentActionId === paymentRequest.id
                                  ? "Receiving..."
                                  : "Payment Received"}
                              </button>
                              <button
                                type="button"
                                className="dashboard-secondary-link dashboard-button"
                                onClick={() =>
                                  handlePaymentReview(
                                    paymentRequest.id,
                                    "reject",
                                  )
                                }
                                disabled={paymentActionId === paymentRequest.id}
                              >
                                Reject Payment
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="dashboard-muted">
                            {paymentRequest.invoiceStatus === "PAID"
                              ? "Payment received and course upgrade approved."
                              : "Payment was not approved."}
                          </p>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <p className="dashboard-muted">
                    No invoice payment records are available yet.
                  </p>
                )}
              </div>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">User management</p>
                  <h2>Admin user list and access control</h2>
                </div>
                <span className="dashboard-chip">
                  {filteredUsers.length} users
                </span>
              </div>
              <div className="dashboard-user-edit-grid">
                <label className="auth-field">
                  <span>Full name</span>
                  <input
                    value={createUserForm.fullName}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="New user full name"
                  />
                </label>
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={createUserForm.email}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                  />
                </label>
                <label className="auth-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={createUserForm.password}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Minimum 8 characters"
                  />
                </label>
                <label className="auth-field">
                  <span>Role</span>
                  <select
                    className="dashboard-select"
                    value={createUserForm.role}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        role: event.target
                          .value as CreateAdminUserPayload["role"],
                        preferredLanguage:
                          event.target.value === "LEARNER_BN"
                            ? "bn"
                            : current.preferredLanguage,
                        accountState:
                          event.target.value === "ADMIN"
                            ? "PAID"
                            : current.accountState === "PAID"
                              ? "TRIAL"
                              : current.accountState,
                      }))
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="LEARNER_EN">LEARNER_EN</option>
                    <option value="LEARNER_BN">LEARNER_BN</option>
                  </select>
                </label>
                <label className="auth-field">
                  <span>Account state</span>
                  <select
                    className="dashboard-select"
                    value={createUserForm.accountState ?? "TRIAL"}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        accountState: event.target.value as NonNullable<
                          CreateAdminUserPayload["accountState"]
                        >,
                      }))
                    }
                  >
                    <option value="FREE">FREE</option>
                    <option value="TRIAL">TRIAL</option>
                    <option value="PAID">PAID</option>
                  </select>
                </label>
                <label className="auth-field">
                  <span>Preferred language</span>
                  <select
                    className="dashboard-select"
                    value={createUserForm.preferredLanguage ?? "en"}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        preferredLanguage: event.target.value as NonNullable<
                          CreateAdminUserPayload["preferredLanguage"]
                        >,
                      }))
                    }
                  >
                    <option value="en">English</option>
                    <option value="bn">Bangla</option>
                  </select>
                </label>
                <label className="dashboard-checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(createUserForm.isEmailVerified)}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        isEmailVerified: event.target.checked,
                      }))
                    }
                  />
                  <span>Email verified</span>
                </label>
              </div>
              <div className="dashboard-actions">
                <button
                  type="button"
                  className="dashboard-primary-link dashboard-button"
                  onClick={handleCreateUser}
                  disabled={adminUserActionId === "create-user"}
                >
                  {adminUserActionId === "create-user"
                    ? "Creating..."
                    : "Create user"}
                </button>
              </div>
              {adminUserCreateNotice ? (
                <p className="dashboard-copy">{adminUserCreateNotice}</p>
              ) : null}
              <p className="dashboard-copy">
                Edit users, manually enroll learners, remove access, restore
                access, or delete users from the admin dashboard.
              </p>
              <div className="dashboard-user-edit-grid">
                <label className="auth-field">
                  <span>Manual enrollment target</span>
                  <select
                    className="dashboard-select"
                    value={adminCourseId ?? ""}
                    onChange={(event) =>
                      setAdminCourseId(event.target.value || null)
                    }
                  >
                    <option value="">Select paid course</option>
                    {adminCourses.map((course) => {
                      const expectedInvoiceAmounts =
                        getExpectedInvoiceAmounts(course);

                      return (
                        <option key={course.id} value={course.id}>
                          {course.title} -{" "}
                          {formatInvoiceMoney(course.priceBdt, "BDT")}
                          {expectedInvoiceAmounts
                            ? ` / ${formatInvoiceMoney(expectedInvoiceAmounts.totalAmountUsd, "USD")}`
                            : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              {adminUserNotice ? (
                <p className="dashboard-copy">{adminUserNotice}</p>
              ) : null}
              <div className="admin-console-user-grid">
                {filteredUsers.map((managedUser) => {
                  const userEnrollments = adminEnrollments.filter(
                    (enrollment) =>
                      enrollment.userId === managedUser.id &&
                      enrollment.status !== "REMOVED",
                  );
                  const userPaymentRequests = paymentRequests.filter(
                    (paymentRequest) =>
                      paymentRequest.userId === managedUser.id,
                  );
                  const pendingUserPayments = userPaymentRequests.filter(
                    (paymentRequest) =>
                      paymentRequest.invoiceStatus === "PENDING",
                  );
                  const paidUserPayments = userPaymentRequests.filter(
                    (paymentRequest) => paymentRequest.invoiceStatus === "PAID",
                  );
                  const latestUserPayment = userPaymentRequests[0] ?? null;
                  const activeCourseLabels = userEnrollments
                    .map(
                      (enrollment) =>
                        courseMap.get(enrollment.courseId)?.title ??
                        enrollment.courseId,
                    )
                    .join(", ");
                  const latestPaymentCourse = latestUserPayment?.courseId
                    ? (courseMap.get(latestUserPayment.courseId) ?? null)
                    : null;
                  const latestExpectedInvoiceAmounts =
                    getExpectedInvoiceAmounts(latestPaymentCourse);

                  return (
                    <article
                      key={managedUser.id}
                      className="admin-console-user-card"
                    >
                      <div className="dashboard-user-head">
                        <div>
                          <strong>{managedUser.fullName}</strong>
                          <span>{managedUser.email}</span>
                        </div>
                        <span className="dashboard-chip">
                          {managedUser.isSuspended
                            ? "Access removed"
                            : roleLabel(managedUser.role)}
                        </span>
                      </div>

                      <div className="dashboard-user-meta">
                        <span>{`Role: ${roleLabel(managedUser.role)}`}</span>
                        <span>{`Account state: ${managedUser.accountState}`}</span>
                        <span>{`Language: ${managedUser.preferredLanguage}`}</span>
                        <span>{`Verified: ${managedUser.isEmailVerified ? "Yes" : "No"}`}</span>
                        <span>{`Status: ${managedUser.isSuspended ? "Suspended" : "Active"}`}</span>
                      </div>

                      {managedUser.role !== "ADMIN" ? (
                        <div className="dashboard-user-meta">
                          <span>{`Active courses: ${activeCourseLabels || "No manual access"}`}</span>
                          <span>{`Invoices: ${userPaymentRequests.length} total, ${pendingUserPayments.length} pending, ${paidUserPayments.length} paid`}</span>
                          {latestUserPayment ? (
                            <>
                              <span>{`Latest invoice: ${latestUserPayment.invoiceNumber ?? "Pending invoice number"}`}</span>
                              <span>{`Latest course: ${latestPaymentCourse?.title ?? latestUserPayment.planName}`}</span>
                              <span>{`Submitted amount: ${formatInvoiceMoney(latestUserPayment.amount, latestUserPayment.currency)}`}</span>
                              {latestExpectedInvoiceAmounts ? (
                                <span>{`Expected: ${formatInvoiceMoney(latestExpectedInvoiceAmounts.courseAmountBdt, "BDT")} / ${formatInvoiceMoney(latestExpectedInvoiceAmounts.totalAmountUsd, "USD")} with ${invoiceTaxPercentage}% tax`}</span>
                              ) : null}
                            </>
                          ) : (
                            <span>No invoice submitted yet</span>
                          )}
                        </div>
                      ) : null}

                      {editingUserId === managedUser.id ? (
                        <div className="dashboard-user-edit-grid">
                          <label className="auth-field">
                            <span>Full name</span>
                            <input
                              value={editForm.fullName ?? ""}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  fullName: event.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className="auth-field">
                            <span>Role</span>
                            <select
                              className="dashboard-select"
                              value={editForm.role ?? "LEARNER_EN"}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  role: event.target.value as UserRole,
                                }))
                              }
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="LEARNER_EN">
                                Learner English
                              </option>
                              <option value="LEARNER_BN">Learner Bangla</option>
                            </select>
                          </label>
                          <label className="auth-field">
                            <span>Preferred language</span>
                            <select
                              className="dashboard-select"
                              value={editForm.preferredLanguage ?? "en"}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  preferredLanguage: event.target.value as
                                    | "en"
                                    | "bn",
                                }))
                              }
                            >
                              <option value="en">English</option>
                              <option value="bn">Bangla</option>
                            </select>
                          </label>
                          <label className="auth-field">
                            <span>Account state</span>
                            <select
                              className="dashboard-select"
                              value={editForm.accountState ?? "TRIAL"}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  accountState: event.target.value as
                                    | "FREE"
                                    | "TRIAL"
                                    | "PAID",
                                }))
                              }
                            >
                              <option value="FREE">Free</option>
                              <option value="TRIAL">Trial</option>
                              <option value="PAID">Paid</option>
                            </select>
                          </label>
                          <label className="dashboard-checkbox">
                            <input
                              type="checkbox"
                              checked={Boolean(editForm.isEmailVerified)}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  isEmailVerified: event.target.checked,
                                }))
                              }
                            />
                            <span>Email verified</span>
                          </label>
                        </div>
                      ) : null}

                      <div className="dashboard-actions">
                        {editingUserId === managedUser.id ? (
                          <>
                            <button
                              type="button"
                              className="dashboard-primary-link dashboard-button"
                              onClick={() => handleSaveUser(managedUser.id)}
                              disabled={adminUserActionId === managedUser.id}
                            >
                              {adminUserActionId === managedUser.id
                                ? "Saving..."
                                : "Save"}
                            </button>
                            <button
                              type="button"
                              className="dashboard-secondary-link dashboard-button"
                              onClick={() => setEditingUserId(null)}
                              disabled={adminUserActionId === managedUser.id}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="dashboard-secondary-link dashboard-button"
                              onClick={() => startEditingUser(managedUser)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="dashboard-secondary-link dashboard-button"
                              onClick={() => handleManualEnroll(managedUser)}
                              disabled={
                                adminUserActionId === managedUser.id ||
                                managedUser.role === "ADMIN" ||
                                !adminCourseId
                              }
                            >
                              {adminUserActionId === managedUser.id
                                ? "Updating..."
                                : "Manual enroll"}
                            </button>
                            <button
                              type="button"
                              className="dashboard-secondary-link dashboard-button"
                              onClick={() => handleToggleAccess(managedUser)}
                              disabled={adminUserActionId === managedUser.id}
                            >
                              {adminUserActionId === managedUser.id
                                ? "Updating..."
                                : managedUser.isSuspended
                                  ? "Restore access"
                                  : "Remove access"}
                            </button>
                            <button
                              type="button"
                              className="dashboard-secondary-link dashboard-button"
                              onClick={() =>
                                handleDeleteUser(managedUser, user.id)
                              }
                              disabled={
                                adminUserActionId === managedUser.id ||
                                managedUser.id === user.id
                              }
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (!isAdmin && learnerData) {
    const learnerSection = getLearnerDashboardSection(pathname);
    const activeLearnerPlan =
      learnerSection === "dashboard"
        ? null
        : (learnerDashboardSections.find(
            (section) => section.id === learnerSection,
          ) ?? null);
    const publishedLearnerLessons = [
      ...(basicsCourseAccess.course ? basicsCourseModules : []),
      ...(industrialSensorCourseAccess.course
        ? industrialSensorCourseModules
        : []),
    ];
    const totalLearnerLessons = publishedLearnerLessons.length;
    const completedLessons = Math.min(
      learnerData.passedAttempts,
      totalLearnerLessons,
    );
    const remainingLessons = Math.max(
      totalLearnerLessons - completedLessons,
      0,
    );
    const completionRate = totalLearnerLessons
      ? Math.round((completedLessons / totalLearnerLessons) * 100)
      : 0;
    const lastResult = learnerData.results[0] ?? null;
    const filteredResults = learnerData.results.filter((result) =>
      matchesSearch(
        [
          result.attemptType,
          `${result.percentage}%`,
          result.passed ? "Passed" : "Needs review",
          formatDate(result.submittedAt),
        ],
        dashboardSearch,
      ),
    );
    const streakDays = Math.min(
      7,
      Math.max(
        1,
        Math.min(
          learnerData.results.length,
          completedLessons || learnerData.totalAttempts || 1,
        ),
      ),
    );
    const lessonProgressMap = new Map(
      learnerData.lessonProgress.map((progress) => [
        progress.lessonPath,
        progress,
      ]),
    );
    const filteredLessons = publishedLearnerLessons.filter((lesson) =>
      matchesSearch([lesson.title, lesson.href], dashboardSearch),
    );
    const learnerCourseCards = [
      {
        title: courseTitle,
        href: coursePortalLink,
        invoiceHref: courseInvoiceLink,
        firstLessonHref: "/current-voltage-learning/1",
        lessons: basicsCourseModules.length,
        description:
          "Core electronics and electrical fundamentals with practical project workspaces.",
        progress: completionRate,
        isAvailable: Boolean(basicsCourseAccess.course),
        hasAccess: basicsCourseAccess.hasAccess,
      },
      {
        title: "Industrial Sensor",
        href: "/courses/industrial-sensor",
        invoiceHref: "/courses/industrial-sensor/invoice",
        firstLessonHref: "/industrial-sensor/proximity-sensor",
        lessons: industrialSensorCourseModules.length,
        description:
          "PLC-focused simulator labs for industrial sensors, wiring, theory, and quizzes.",
        progress: 0,
        isAvailable: Boolean(industrialSensorCourseAccess.course),
        hasAccess: industrialSensorCourseAccess.hasAccess,
      },
    ].filter((courseCard) => courseCard.isAvailable);
    const activeLearnerCourse = learnerCourseCards.find(
      (courseCard) => courseCard.hasAccess,
    );
    const canOpenCourse = Boolean(activeLearnerCourse);
    const renderLockedCourseAction = (
      className = "dashboard-secondary-link",
      invoiceHref = courseInvoiceLink,
      courseHref?: string,
    ) => {
      if (user.accountState === "FREE") {
        return (
          <Link href={invoiceHref} className={className}>
            Upgrade required
          </Link>
        );
      }

      if (courseHref) {
        return (
          <Link href={courseHref} className={className}>
            Open course access
          </Link>
        );
      }

      return (
        <button
          type="button"
          className={`${className} dashboard-button`}
          onClick={handleLearnerCourseEnroll}
          disabled={learnerEnrollSubmitting}
        >
          {learnerEnrollSubmitting ? "Opening..." : "Open course access"}
        </button>
      );
    };

    if (learnerSection === "settings") {
      return (
        <main className="dashboard-page learner-console-page">
          <section className="learner-console-shell">
            <aside className="learner-console-sidebar">
              <div className="learner-console-logo">ML</div>

              <nav className="learner-console-nav">
                {learnerSidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`learner-console-nav-item ${
                      learnerSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="learner-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="learner-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="learner-console-main">
              <header className="learner-console-topbar">
                <div className="learner-console-topbar-left">
                  <div className="learner-console-menu">|||</div>
                  <label className="learner-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search account details..."
                    />
                  </label>
                </div>

                <div className="learner-console-topbar-right">
                  <div className="learner-console-indicator">
                    {user.accountState}
                  </div>
                  <div className="learner-console-indicator">
                    {user.isEmailVerified
                      ? "Email verified"
                      : "Verification pending"}
                  </div>
                  <div className="learner-console-profile">
                    <div className="learner-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>{roleLabel(user.role)}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="learner-console-heading">
                <div>
                  <h1>Settings</h1>
                  <p>
                    Review your learner account details, verification state,
                    language preference, and quick dashboard shortcuts from one
                    focused page.
                  </p>
                </div>
              </section>

              <section className="learner-console-stats">
                <article className="learner-console-stat-card">
                  <span>Account State</span>
                  <strong>{user.accountState}</strong>
                  <small>Current learner access plan</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Language</span>
                  <strong>
                    {user.preferredLanguage === "bn" ? "Bangla" : "English"}
                  </strong>
                  <small>Preferred learner interface language</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Email Status</span>
                  <strong>
                    {user.isEmailVerified ? "Verified" : "Pending"}
                  </strong>
                  <small>Supabase auth email verification state</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Certificate Rules</span>
                  <strong>
                    {learnerData.certificateEligibility.eligible
                      ? "Ready"
                      : "In Progress"}
                  </strong>
                  <small>{`${learnerData.certificateEligibility.completedLessons}/${learnerData.certificateEligibility.requiredCompletedLessons} lessons complete`}</small>
                </article>
              </section>

              <section className="learner-console-feature-card">
                <div className="learner-console-feature-icon">Acct</div>
                <div className="learner-console-feature-body">
                  <h2>{user.fullName}</h2>
                  <div className="learner-console-progress-row">
                    <div className="learner-console-progress-track">
                      <div
                        className="learner-console-progress-fill"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <strong>{completionRate}% Learning Progress</strong>
                  </div>
                  <p>
                    {learnerData.nextLessonTitle
                      ? `Next lesson in your path: ${learnerData.nextLessonTitle}`
                      : "Your next lesson will appear here when your course path updates."}
                  </p>
                </div>
                <div className="learner-console-feature-actions">
                  <Link
                    href="/User/my-courses"
                    className="dashboard-primary-link"
                  >
                    Open My Courses
                  </Link>
                  <Link
                    href="/User/progress"
                    className="dashboard-secondary-link"
                  >
                    View Progress
                  </Link>
                </div>
              </section>

              <section className="learner-console-grid">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Profile</p>
                      <h2>Account identity</h2>
                    </div>
                    <span className="dashboard-chip">
                      {roleLabel(user.role)}
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Full name</strong>
                      <span>{user.fullName}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Email address</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Role</strong>
                      <span>{roleLabel(user.role)}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Preferred language</strong>
                      <span>
                        {user.preferredLanguage === "bn" ? "Bangla" : "English"}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Status</p>
                      <h2>Security and access</h2>
                    </div>
                    <span className="dashboard-chip">{user.accountState}</span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Email verified</strong>
                      <span>{user.isEmailVerified ? "Yes" : "Not yet"}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Account created</strong>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Last login</strong>
                      <span>{formatDate(user.lastLoginAt)}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Suspended</strong>
                      <span>{user.isSuspended ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </article>
              </section>

              <section className="learner-console-grid learner-console-grid-bottom">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Learning preferences
                      </p>
                      <h2>Course readiness</h2>
                    </div>
                    <span className="dashboard-chip">
                      {paymentHistory.length} payments
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Course library</strong>
                      <span>
                        {learnerCourseCards
                          .map((courseCard) => courseCard.title)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Next lesson</strong>
                      <span>
                        {learnerData.nextLessonTitle ?? "Not assigned yet"}
                      </span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Certificate status</strong>
                      <span>{learnerData.certificateEligibility.reason}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Latest payment state</strong>
                      <span>
                        {paymentHistory[0]?.status ??
                          "No payment request submitted"}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Quick actions</p>
                      <h2>Dashboard shortcuts</h2>
                    </div>
                    <span className="dashboard-chip">Learner tools</span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Dashboard overview</strong>
                      <Link
                        href="/User/dashboard"
                        className="dashboard-secondary-link"
                      >
                        Open
                      </Link>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Course lessons</strong>
                      <Link
                        href="/User/lessons"
                        className="dashboard-secondary-link"
                      >
                        Open
                      </Link>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Progress tracking</strong>
                      <Link
                        href="/User/progress"
                        className="dashboard-secondary-link"
                      >
                        Open
                      </Link>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Settings</strong>
                      <Link
                        href="/User/settings"
                        className="dashboard-secondary-link"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (learnerSection === "progress") {
      return (
        <main className="dashboard-page learner-console-page">
          <section className="learner-console-shell">
            <aside className="learner-console-sidebar">
              <div className="learner-console-logo">ML</div>

              <nav className="learner-console-nav">
                {learnerSidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`learner-console-nav-item ${
                      learnerSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="learner-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="learner-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="learner-console-main">
              <header className="learner-console-topbar">
                <div className="learner-console-topbar-left">
                  <div className="learner-console-menu">|||</div>
                  <label className="learner-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search results and progress..."
                    />
                  </label>
                </div>

                <div className="learner-console-topbar-right">
                  <div className="learner-console-indicator">
                    {completionRate}% complete
                  </div>
                  <div className="learner-console-indicator">
                    {streakDays} day streak
                  </div>
                  <div className="learner-console-profile">
                    <div className="learner-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>{roleLabel(user.role)}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="learner-console-heading">
                <div>
                  <h1>Progress</h1>
                  <p>
                    Track your lesson completion, recent results, learning
                    streak, and certificate readiness from one focused learner
                    page.
                  </p>
                </div>
              </section>

              <section className="learner-console-stats">
                <article className="learner-console-stat-card">
                  <span>Completion Rate</span>
                  <strong>{completionRate}%</strong>
                  <small>Current course completion percentage</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Completed Lessons</span>
                  <strong>{completedLessons}</strong>
                  <small>Lessons or checkpoints finished</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Average Score</span>
                  <strong>{learnerData.averageScore}%</strong>
                  <small>Across your tracked attempts</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Learning Streak</span>
                  <strong>{streakDays} days</strong>
                  <small>Recent consistency indicator</small>
                </article>
              </section>

              <section className="learner-console-feature-card">
                <div className="learner-console-feature-icon">Prog</div>
                <div className="learner-console-feature-body">
                  <h2>{courseTitle}</h2>
                  <div className="learner-console-progress-row">
                    <div className="learner-console-progress-track">
                      <div
                        className="learner-console-progress-fill"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <strong>{completionRate}% Complete</strong>
                  </div>
                  <p>
                    {learnerData.certificateEligibility.eligible
                      ? "You are eligible to request your certificate."
                      : learnerData.certificateEligibility.reason}
                  </p>
                </div>
                <div className="learner-console-feature-actions">
                  <Link
                    href="/User/settings"
                    className="dashboard-secondary-link"
                  >
                    Open Settings
                  </Link>
                  <Link
                    href={coursePortalLink}
                    className="dashboard-primary-link"
                  >
                    Open Course
                  </Link>
                </div>
              </section>

              <section className="learner-console-grid">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Lesson progress
                      </p>
                      <h2>Tracked lesson states</h2>
                    </div>
                    <span className="dashboard-chip">
                      {learnerData.lessonProgress.length} tracked
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    {learnerData.lessonProgress.length ? (
                      learnerData.lessonProgress.map((progress) => (
                        <div
                          key={progress.id}
                          className="learner-console-activity-item"
                        >
                          <strong>{progress.lessonTitle}</strong>
                          <span>{`${progress.status} • ${progress.progressPercent}% • ${formatShortDate(progress.lastViewedAt ?? progress.updatedAt)}`}</span>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-muted">
                        No lesson progress tracked yet.
                      </p>
                    )}
                  </div>
                </article>

                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Assessment results
                      </p>
                      <h2>Recent attempts</h2>
                    </div>
                    <span className="dashboard-chip">
                      {filteredResults.length} results
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    {filteredResults.length ? (
                      filteredResults.map((result) => (
                        <div
                          key={result.id}
                          className="learner-console-activity-item"
                        >
                          <strong>{`${result.attemptType} - ${result.percentage}%`}</strong>
                          <span>{`${result.passed ? "Passed" : "Needs review"} • ${formatShortDate(result.submittedAt)}`}</span>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-muted">
                        No recent result found for the current search.
                      </p>
                    )}
                  </div>
                </article>
              </section>

              <section className="learner-console-grid learner-console-grid-bottom">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Certificate readiness
                      </p>
                      <h2>Eligibility summary</h2>
                    </div>
                    <span className="dashboard-chip">
                      {learnerData.certificateEligibility.eligible
                        ? "Eligible"
                        : "In progress"}
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Completed lessons</strong>
                      <span>{`${learnerData.certificateEligibility.completedLessons}/${learnerData.certificateEligibility.requiredCompletedLessons}`}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Required completion rate</strong>
                      <span>{`${learnerData.certificateEligibility.requiredCompletionRate}%`}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Status</strong>
                      <span>{learnerData.certificateEligibility.reason}</span>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (learnerSection === "lessons") {
      return (
        <main className="dashboard-page learner-console-page">
          <section className="learner-console-shell">
            <aside className="learner-console-sidebar">
              <div className="learner-console-logo">ML</div>

              <nav className="learner-console-nav">
                {learnerSidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`learner-console-nav-item ${
                      learnerSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="learner-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="learner-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="learner-console-main">
              <header className="learner-console-topbar">
                <div className="learner-console-topbar-left">
                  <div className="learner-console-menu">|||</div>
                  <label className="learner-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search lesson title or route..."
                    />
                  </label>
                </div>

                <div className="learner-console-topbar-right">
                  <div className="learner-console-indicator">
                    {filteredLessons.length} lessons
                  </div>
                  <div className="learner-console-indicator">
                    {completionRate}% complete
                  </div>
                  <div className="learner-console-profile">
                    <div className="learner-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>{roleLabel(user.role)}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="learner-console-heading">
                <div>
                  <h1>Lessons</h1>
                  <p>
                    Browse your lesson catalog, track progress state, and jump
                    straight into the next lesson from one focused page.
                  </p>
                </div>
              </section>

              <section className="learner-console-feature-card">
                <div className="learner-console-feature-icon">Next</div>
                <div className="learner-console-feature-body">
                  <h2>
                    {learnerData.nextLessonTitle ?? "Continue your lesson path"}
                  </h2>
                  <div className="learner-console-progress-row">
                    <div className="learner-console-progress-track">
                      <div
                        className="learner-console-progress-fill"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <strong>{completionRate}% Complete</strong>
                  </div>
                  <p>{`${completedLessons} lessons completed and ${remainingLessons} remaining across your course library.`}</p>
                </div>
                <div className="learner-console-feature-actions">
                  {canOpenCourse ? (
                    <Link
                      href={
                        learnerData.nextLessonHref ??
                        "/current-voltage-learning/1"
                      }
                      className="dashboard-primary-link"
                    >
                      Open Next Lesson
                    </Link>
                  ) : (
                    renderLockedCourseAction("dashboard-secondary-link")
                  )}
                  <Link href="/courses" className="dashboard-secondary-link">
                    Course directory
                  </Link>
                </div>
              </section>

              <section className="learner-console-stats">
                <article className="learner-console-stat-card">
                  <span>Total Lessons</span>
                  <strong>{totalLearnerLessons}</strong>
                  <small>Lessons available in your course track</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Completed</span>
                  <strong>{completedLessons}</strong>
                  <small>Finished lessons or checkpoints</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Started</span>
                  <strong>{learnerData.startedLessons}</strong>
                  <small>Lessons already opened by you</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Remaining</span>
                  <strong>{remainingLessons}</strong>
                  <small>Lessons still left to complete</small>
                </article>
              </section>

              <section className="learner-console-card">
                <div className="learner-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Lesson catalog</p>
                    <h2>All lessons in your course</h2>
                  </div>
                  <span className="dashboard-chip">
                    {filteredLessons.length} visible
                  </span>
                </div>

                <div className="learner-console-activity-list">
                  {filteredLessons.map((lesson, index) => {
                    const progress = lessonProgressMap.get(lesson.href);

                    return (
                      <div
                        key={lesson.href}
                        className="learner-console-activity-item"
                      >
                        <div>
                          <strong>{`${index + 1}. ${lesson.title}`}</strong>
                          <span>
                            {progress
                              ? `${progress.status} • ${progress.progressPercent}%`
                              : "Not started yet"}
                          </span>
                        </div>
                        {canOpenCourse ? (
                          <Link
                            href={lesson.href}
                            className="dashboard-secondary-link"
                          >
                            Open
                          </Link>
                        ) : (
                          renderLockedCourseAction("dashboard-secondary-link")
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (learnerSection === "my-courses") {
      return (
        <main className="dashboard-page learner-console-page">
          <section className="learner-console-shell">
            <aside className="learner-console-sidebar">
              <div className="learner-console-logo">ML</div>

              <nav className="learner-console-nav">
                {learnerSidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`learner-console-nav-item ${
                      learnerSection === item.sectionId ? "is-current" : ""
                    }`}
                  >
                    <span className="learner-console-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="learner-console-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </aside>

            <div className="learner-console-main">
              <header className="learner-console-topbar">
                <div className="learner-console-topbar-left">
                  <div className="learner-console-menu">|||</div>
                  <label className="learner-console-search">
                    <span>Search</span>
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(event) =>
                        setDashboardSearch(event.target.value)
                      }
                      placeholder="Search your course progress..."
                    />
                  </label>
                </div>

                <div className="learner-console-topbar-right">
                  <div className="learner-console-indicator">
                    {user.accountState}
                  </div>
                  <div className="learner-console-indicator">
                    {completedLessons}/{totalLearnerLessons} done
                  </div>
                  <div className="learner-console-profile">
                    <div className="learner-console-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <strong>{user.fullName}</strong>
                      <span>{roleLabel(user.role)}</span>
                    </div>
                  </div>
                </div>
              </header>

              <section className="learner-console-heading">
                <div>
                  <h1>My Courses</h1>
                  <p>
                    See your enrolled course progress, next lesson, access
                    status, and payment/update path from one focused page.
                  </p>
                </div>
              </section>

              <section className="learner-console-feature-card">
                <div className="learner-console-feature-icon">Course</div>
                <div className="learner-console-feature-body">
                  <h2>Your active course library</h2>
                  <div className="learner-console-progress-row">
                    <div className="learner-console-progress-track">
                      <div
                        className="learner-console-progress-fill"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <strong>{completionRate}% Complete</strong>
                  </div>
                  <p>
                    {learnerData.nextLessonTitle
                      ? `Next lesson: ${learnerData.nextLessonTitle}`
                      : "Your next lesson will appear here once the learning paths are active."}
                  </p>
                </div>
                <div className="learner-console-feature-actions">
                  <Link href="/courses" className="dashboard-secondary-link">
                    Open Course Directory
                  </Link>
                  {canOpenCourse ? (
                    <Link
                      href={
                        activeLearnerCourse?.firstLessonHref ??
                        learnerData.nextLessonHref ??
                        coursePortalLink
                      }
                      className="dashboard-primary-link"
                    >
                      Continue Lesson
                    </Link>
                  ) : learnerCourseCards.length ? (
                    renderLockedCourseAction("dashboard-secondary-link")
                  ) : (
                    <span
                      className="dashboard-secondary-link"
                      aria-disabled="true"
                    >
                      No published courses
                    </span>
                  )}
                </div>
              </section>

              <section className="learner-console-stats">
                <article className="learner-console-stat-card">
                  <span>Completed</span>
                  <strong>{completedLessons}</strong>
                  <small>Finished lessons in this course</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Remaining</span>
                  <strong>{remainingLessons}</strong>
                  <small>Lessons still left in your track</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Started</span>
                  <strong>{learnerData.startedLessons}</strong>
                  <small>Lessons you have already opened</small>
                </article>
                <article className="learner-console-stat-card">
                  <span>Certificates</span>
                  <strong>{learnerData.certificateHistory.length}</strong>
                  <small>Issued or available course certificates</small>
                </article>
              </section>

              <section className="learner-console-card">
                <div className="learner-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Course library</p>
                    <h2>Available learner courses</h2>
                  </div>
                  <span className="dashboard-chip">
                    {learnerCourseCards.length} courses
                  </span>
                </div>

                <div className="learner-console-course-list">
                  {learnerCourseCards.map((courseCard) => (
                    <article
                      key={courseCard.href}
                      className="learner-console-course-item"
                    >
                      <div className="learner-console-course-thumbnail" />
                      <div className="learner-console-course-body">
                        <strong>{courseCard.title}</strong>
                        <span>{courseCard.description}</span>
                        <div className="learner-console-progress-row">
                          <div className="learner-console-progress-track">
                            <div
                              className="learner-console-progress-fill"
                              style={{ width: `${courseCard.progress}%` }}
                            />
                          </div>
                          <span>{courseCard.lessons} lessons</span>
                        </div>
                      </div>
                      <div className="dashboard-actions">
                        <Link
                          href={courseCard.href}
                          className="dashboard-secondary-link"
                        >
                          Course Page
                        </Link>
                        {courseCard.hasAccess ? (
                          <Link
                            href={courseCard.firstLessonHref}
                            className="dashboard-primary-link"
                          >
                            Start
                          </Link>
                        ) : (
                          renderLockedCourseAction(
                            "dashboard-secondary-link",
                            courseCard.invoiceHref,
                            courseCard.href,
                          )
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="learner-console-grid">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">Course access</p>
                      <h2>Your learner status</h2>
                    </div>
                    <span className="dashboard-chip">{user.accountState}</span>
                  </div>
                  <div className="learner-console-activity-list">
                    <div className="learner-console-activity-item">
                      <strong>Preferred language</strong>
                      <span>
                        {user.preferredLanguage === "bn" ? "Bangla" : "English"}
                      </span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Completion target</strong>
                      <span>{`${learnerData.certificateEligibility.completedLessons}/${learnerData.certificateEligibility.requiredCompletedLessons} lessons toward certificate rules`}</span>
                    </div>
                    <div className="learner-console-activity-item">
                      <strong>Certificate readiness</strong>
                      <span>
                        {learnerData.certificateEligibility.eligible
                          ? "Eligible now"
                          : learnerData.certificateEligibility.reason}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Recent progress
                      </p>
                      <h2>Latest lesson updates</h2>
                    </div>
                  </div>
                  <div className="learner-console-activity-list">
                    {learnerData.lessonProgress.length ? (
                      learnerData.lessonProgress.slice(0, 4).map((progress) => (
                        <div
                          key={progress.id}
                          className="learner-console-activity-item"
                        >
                          <strong>{progress.lessonTitle}</strong>
                          <span>{`${progress.status} • ${progress.progressPercent}% • ${formatShortDate(progress.lastViewedAt ?? progress.updatedAt)}`}</span>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-muted">
                        No lesson progress tracked yet.
                      </p>
                    )}
                  </div>
                </article>
              </section>

              <section className="learner-console-grid learner-console-grid-bottom">
                <article className="learner-console-card">
                  <div className="learner-console-card-head">
                    <div>
                      <p className="dashboard-section-kicker">
                        Upgrade and payments
                      </p>
                      <h2>Course payment status</h2>
                    </div>
                    <span className="dashboard-chip">
                      {paymentHistory.length} requests
                    </span>
                  </div>
                  <div className="learner-console-activity-list">
                    {paymentHistory.length ? (
                      paymentHistory.slice(0, 4).map((paymentRequest) => (
                        <div
                          key={paymentRequest.id}
                          className="learner-console-activity-item"
                        >
                          <strong>{`${paymentRequest.planName} - ${paymentRequest.status}`}</strong>
                          <span>{`${paymentRequest.amount} ${paymentRequest.currency} • ${paymentRequest.transactionId}`}</span>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-muted">
                        No course upgrade request submitted yet.
                      </p>
                    )}
                  </div>
                  <div className="dashboard-actions">
                    <Link
                      href="/User/dashboard"
                      className="dashboard-secondary-link"
                    >
                      Back to Dashboard
                    </Link>
                    <Link
                      href={coursePortalLink}
                      className="dashboard-primary-link"
                    >
                      Open Course
                    </Link>
                  </div>
                </article>
              </section>
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className="dashboard-page learner-console-page">
        <section className="learner-console-shell">
          <aside className="learner-console-sidebar">
            <div className="learner-console-logo">ML</div>

            <nav className="learner-console-nav">
              {learnerSidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`learner-console-nav-item ${
                    learnerSection === item.sectionId ? "is-current" : ""
                  }`}
                >
                  <span className="learner-console-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="learner-console-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </aside>

          <div className="learner-console-main">
            <header className="learner-console-topbar">
              <div className="learner-console-topbar-left">
                <div className="learner-console-menu">|||</div>
                <label className="learner-console-search">
                  <span>Search</span>
                  <input
                    type="text"
                    value={dashboardSearch}
                    onChange={(event) => setDashboardSearch(event.target.value)}
                    placeholder="Search courses, lessons..."
                  />
                </label>
              </div>

              <div className="learner-console-topbar-right">
                <div className="learner-console-indicator">Alerts</div>
                <div className="learner-console-indicator">Messages</div>
                <div className="learner-console-profile">
                  <div className="learner-console-avatar">
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <strong>{user.fullName}</strong>
                    <span>{roleLabel(user.role)}</span>
                  </div>
                </div>
              </div>
            </header>

            <section className="learner-console-heading">
              <div>
                <h1>
                  {activeLearnerPlan
                    ? activeLearnerPlan.label
                    : `Welcome back, ${user.fullName}.`}
                </h1>
                <p>
                  {activeLearnerPlan
                    ? activeLearnerPlan.summary
                    : "Continue your MechatronicsLAB electrical learning path today."}
                </p>
              </div>
            </section>

            {activeLearnerPlan ? (
              <section className="dashboard-surface-card learner-section-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Learner workspace
                    </p>
                    <h2>{activeLearnerPlan.label}</h2>
                  </div>
                  <span className="dashboard-chip">MechatronicsLAB</span>
                </div>
                <p className="dashboard-copy">{activeLearnerPlan.summary}</p>
                <div className="dashboard-link-stack">
                  <Link
                    href={coursePortalLink}
                    className="dashboard-inline-link"
                  >
                    Open main course
                  </Link>
                  <Link
                    href="/User/dashboard"
                    className="dashboard-inline-link"
                  >
                    Back to dashboard home
                  </Link>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Connected data sources</span>
                    <strong>{activeLearnerPlan.dataSources.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Learning controls</span>
                    <strong>{activeLearnerPlan.notes.length}</strong>
                  </div>
                </div>
                <div className="dashboard-activity-list">
                  {activeLearnerPlan.dataSources.map((source) => (
                    <div key={source} className="dashboard-activity-item">
                      <strong>{source}</strong>
                      <span>
                        Used by this learner section for course status, lessons,
                        and progress.
                      </span>
                    </div>
                  ))}
                  {activeLearnerPlan.notes.map((note) => (
                    <div key={note} className="dashboard-activity-item">
                      <strong>Section focus</strong>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {!activeLearnerPlan ? (
              <>
                <section className="learner-console-stats">
                  <article className="learner-console-stat-card">
                    <span>Total Lessons</span>
                    <strong>{totalLearnerLessons}</strong>
                    <small>View all lessons</small>
                  </article>
                  <article className="learner-console-stat-card">
                    <span>Completed Lessons</span>
                    <strong>{completedLessons}</strong>
                    <small>Passed or finished lesson checkpoints</small>
                  </article>
                  <article className="learner-console-stat-card">
                    <span>Completion Rate</span>
                    <strong>{completionRate}%</strong>
                    <small>Based on your completed lesson progress</small>
                  </article>
                  <article className="learner-console-stat-card">
                    <span>Remaining Lessons</span>
                    <strong>{remainingLessons}</strong>
                    <small>Keep moving through the numbered course path</small>
                  </article>
                </section>

                <section className="learner-console-feature-card">
                  <div className="learner-console-feature-icon">ML</div>
                  <div className="learner-console-feature-body">
                    <h2>{courseTitle}</h2>
                    <div className="learner-console-progress-row">
                      <div className="learner-console-progress-track">
                        <div
                          className="learner-console-progress-fill"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <strong>{completionRate}% Complete</strong>
                    </div>
                    <p>
                      {lastResult
                        ? `Last activity: ${lastResult.attemptType} • ${lastResult.percentage}% on ${formatShortDate(lastResult.submittedAt)}`
                        : "Start from Lesson 1 Current and Voltage and continue through the full course track."}
                    </p>
                  </div>
                  <div className="learner-console-feature-actions">
                    <Link
                      href={coursePortalLink}
                      className="dashboard-secondary-link"
                    >
                      Open My Course
                    </Link>
                    {canOpenCourse ? (
                      <Link
                        href="/current-voltage-learning/1"
                        className="dashboard-primary-link"
                      >
                        Resume Learning
                      </Link>
                    ) : (
                      renderLockedCourseAction("dashboard-secondary-link")
                    )}
                  </div>
                </section>

                <section className="learner-console-grid">
                  <article className="learner-console-card">
                    <div className="learner-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">My Courses</p>
                        <h2>Continue inside your courses</h2>
                      </div>
                      <Link
                        href="/User/my-courses"
                        className="dashboard-secondary-link"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="learner-console-course-list">
                      {learnerEnrollNotice ? (
                        <p className="dashboard-copy">{learnerEnrollNotice}</p>
                      ) : null}
                      {learnerCourseCards.map((courseCard) => (
                        <article
                          key={courseCard.href}
                          className="learner-console-course-item"
                        >
                          <div className="learner-console-course-thumbnail" />
                          <div className="learner-console-course-body">
                            <strong>{courseCard.title}</strong>
                            <span>{courseCard.description}</span>
                            <div className="learner-console-progress-row">
                              <div className="learner-console-progress-track">
                                <div
                                  className="learner-console-progress-fill"
                                  style={{ width: `${courseCard.progress}%` }}
                                />
                              </div>
                              <span>{courseCard.lessons} lessons</span>
                            </div>
                          </div>
                          {canOpenCourse ? (
                            <Link
                              href={courseCard.href}
                              className="dashboard-secondary-link"
                            >
                              Continue
                            </Link>
                          ) : (
                            renderLockedCourseAction(
                              "dashboard-secondary-link",
                              courseCard.invoiceHref,
                              courseCard.href,
                            )
                          )}
                        </article>
                      ))}
                    </div>
                  </article>

                  <article className="learner-console-card">
                    <div className="learner-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">
                          Recent Activity
                        </p>
                        <h2>Your latest progress</h2>
                      </div>
                    </div>

                    <div className="learner-console-activity-list">
                      {filteredResults.length ? (
                        filteredResults.slice(0, 6).map((result) => (
                          <div
                            key={result.id}
                            className="learner-console-activity-item"
                          >
                            <div className="learner-console-activity-badge">
                              {result.passed ? "Done" : "Run"}
                            </div>
                            <div>
                              <strong>
                                {result.passed ? "Completed" : "Started"}:{" "}
                                {result.attemptType}
                              </strong>
                              <span>
                                {result.percentage}% •{" "}
                                {formatShortDate(result.submittedAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="dashboard-muted">
                          No recent learner activity yet. Start the first lesson
                          from your course page.
                        </p>
                      )}
                    </div>
                  </article>

                  <article className="learner-console-card">
                    <div className="learner-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">
                          Payment history
                        </p>
                        <h2>Your submitted upgrade requests</h2>
                      </div>
                      <span className="dashboard-chip">
                        {paymentHistory.length} total
                      </span>
                    </div>

                    <div className="learner-console-activity-list">
                      {paymentHistory.length ? (
                        paymentHistory.slice(0, 6).map((paymentRequest) => (
                          <div
                            key={paymentRequest.id}
                            className="learner-console-activity-item"
                          >
                            <div className="learner-console-activity-badge">
                              {paymentRequest.status === "APPROVED"
                                ? "Paid"
                                : paymentRequest.status === "REJECTED"
                                  ? "Fix"
                                  : "Wait"}
                            </div>
                            <div>
                              <strong>
                                {paymentRequest.planName} -{" "}
                                {paymentRequest.amount}{" "}
                                {paymentRequest.currency}
                              </strong>
                              <span>
                                {paymentRequest.transactionId} -{" "}
                                {paymentRequest.status} -{" "}
                                {formatShortDate(paymentRequest.submittedAt)}
                              </span>
                              {paymentRequest.reviewNotes ? (
                                <span>{`Review note: ${paymentRequest.reviewNotes}`}</span>
                              ) : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="dashboard-muted">
                          No payment requests yet. Submit your first upgrade
                          request from this dashboard.
                        </p>
                      )}
                    </div>
                  </article>
                </section>

                <section className="learner-console-grid learner-console-grid-bottom">
                  <article className="learner-console-card">
                    <div className="learner-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">
                          Learning Streak
                        </p>
                        <h2>{streakDays} days</h2>
                      </div>
                    </div>

                    <div className="learner-console-streak">
                      <p>Keep it up. Consistency is the key to success.</p>
                      <div className="learner-console-streak-days">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day, index) => (
                            <div
                              key={day}
                              className="learner-console-streak-day"
                            >
                              <span>{day}</span>
                              <strong
                                className={
                                  index < streakDays ? "is-complete" : ""
                                }
                              >
                                {index < streakDays ? "•" : "○"}
                              </strong>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </article>

                  <article className="learner-console-card">
                    <div className="learner-console-card-head">
                      <div>
                        <p className="dashboard-section-kicker">Upcoming</p>
                        <h2>Next step</h2>
                      </div>
                    </div>

                    <div className="learner-console-upcoming">
                      <strong>Continue your course library</strong>
                      <span>
                        {remainingLessons
                          ? `${remainingLessons} lessons still remaining in your current track.`
                          : "You have completed the currently tracked lesson sequence."}
                      </span>
                      {canOpenCourse ? (
                        <Link
                          href="/courses"
                          className="dashboard-secondary-link"
                        >
                          Open Courses
                        </Link>
                      ) : (
                        renderLockedCourseAction("dashboard-secondary-link")
                      )}
                    </div>
                  </article>
                </section>
              </>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">{dashboardIntro.kicker}</p>
            <h1>Welcome back, {user.fullName}.</h1>
            <p className="dashboard-copy">
              Signed in as <strong>{user.role}</strong>. {dashboardIntro.copy}
            </p>
            {isDisconnected ? (
              <p className="dashboard-copy">
                Frontend preview mode is active. Backend calls are bypassed and
                protected routes are unlocked locally.
              </p>
            ) : null}
          </div>

          <div className="dashboard-actions">
            {isDisconnected ? (
              <button
                type="button"
                className="dashboard-secondary-link dashboard-button"
                onClick={() => {
                  setMode("connected");
                  router.refresh();
                }}
              >
                Reconnect backend
              </button>
            ) : null}
            <Link
              href={dashboardIntro.actionHref}
              className="dashboard-secondary-link"
            >
              {dashboardIntro.actionLabel}
            </Link>
            <button
              type="button"
              className="dashboard-primary-link dashboard-button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        {isAdmin && adminData ? (
          <>
            <section className="admin-dashboard-grid">
              <article className="dashboard-surface-card admin-dashboard-hero-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Course command center
                    </p>
                    <h2>{courseTitle}</h2>
                  </div>
                  <span className="dashboard-chip">Admin control</span>
                </div>
                <p className="dashboard-copy">
                  Manage the single live LMS course, review lesson coverage,
                  open project workspaces, and keep learner access under one
                  admin dashboard.
                </p>
                <div className="admin-dashboard-link-row">
                  <Link
                    href={coursePortalLink}
                    className="dashboard-primary-link"
                  >
                    Open course page
                  </Link>
                  <Link
                    href={courseProjectsLink}
                    className="dashboard-secondary-link"
                  >
                    Open projects
                  </Link>
                  <Link
                    href="/current-voltage-learning/1"
                    className="dashboard-secondary-link"
                  >
                    Open Lesson 1
                  </Link>
                </div>
                <div className="admin-dashboard-stat-strip">
                  <article className="admin-dashboard-stat-tile">
                    <span>Total users</span>
                    <strong>{adminData.widgets.totalUsers}</strong>
                  </article>
                  <article className="admin-dashboard-stat-tile">
                    <span>Active learners</span>
                    <strong>{adminData.widgets.activeLearners}</strong>
                  </article>
                  <article className="admin-dashboard-stat-tile">
                    <span>Pending enrollments</span>
                    <strong>{adminData.widgets.pendingEnrollments}</strong>
                  </article>
                  <article className="admin-dashboard-stat-tile">
                    <span>Total courses</span>
                    <strong>{adminData.widgets.totalCourses}</strong>
                  </article>
                </div>
              </article>

              <article className="dashboard-surface-card admin-dashboard-account-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Admin account</p>
                    <h2>{user.fullName}</h2>
                  </div>
                  <span className="dashboard-chip">Live session</span>
                </div>
                <div className="admin-dashboard-meta-list">
                  <div>
                    <span>Email</span>
                    <strong>{user.email}</strong>
                  </div>
                  <div>
                    <span>Role</span>
                    <strong>{user.role}</strong>
                  </div>
                  <div>
                    <span>Preferred language</span>
                    <strong>{user.preferredLanguage}</strong>
                  </div>
                  <div>
                    <span>Last login</span>
                    <strong>{formatDate(user.lastLoginAt)}</strong>
                  </div>
                </div>
              </article>
            </section>

            <section className="admin-dashboard-grid">
              <article className="dashboard-surface-card admin-dashboard-column-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Lesson catalog</p>
                    <h2>All lessons under {courseTitle}</h2>
                  </div>
                  <span className="dashboard-chip">
                    {basicsCourseModules.length} lessons
                  </span>
                </div>
                <div className="admin-dashboard-list">
                  {basicsCourseModules.map((lesson) => (
                    <Link
                      key={lesson.href}
                      href={lesson.href}
                      className="admin-dashboard-list-item"
                    >
                      <strong>{lesson.title}</strong>
                      <span>Open lesson route</span>
                    </Link>
                  ))}
                </div>
              </article>

              <article className="dashboard-surface-card admin-dashboard-column-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Project catalog</p>
                    <h2>Course project workspaces</h2>
                  </div>
                  <span className="dashboard-chip">
                    {basicsCourseProjects.length} projects
                  </span>
                </div>
                <div className="admin-dashboard-list">
                  {basicsCourseProjects.map((project) =>
                    project.href ? (
                      <Link
                        key={project.title}
                        href={project.href}
                        className="admin-dashboard-list-item"
                      >
                        <strong>{project.title}</strong>
                        <span>Open project workspace</span>
                      </Link>
                    ) : (
                      <div
                        key={project.title}
                        className="admin-dashboard-list-item"
                      >
                        <strong>{project.title}</strong>
                        <span>Project folder ready for next wiring phase</span>
                      </div>
                    ),
                  )}
                </div>
              </article>
            </section>

            <section className="dashboard-surface-card admin-dashboard-users-card">
              <div className="dashboard-card-head">
                <div>
                  <p className="dashboard-section-kicker">User management</p>
                  <h2>Admin user list and access control</h2>
                </div>
                <span className="dashboard-chip">
                  {adminUsers.length} users
                </span>
              </div>
              <p className="dashboard-copy">
                Edit users, manually enroll learners, remove access, restore
                access, or delete users from the admin dashboard.
              </p>
              {adminUserNotice ? (
                <p className="dashboard-copy">{adminUserNotice}</p>
              ) : null}
              <div className="admin-dashboard-user-table">
                {adminUsers.map((managedUser) => (
                  <article
                    key={managedUser.id}
                    className="dashboard-user-card admin-dashboard-user-card"
                  >
                    <div className="dashboard-user-head">
                      <div>
                        <strong>{managedUser.fullName}</strong>
                        <span>{managedUser.email}</span>
                      </div>
                      <span className="dashboard-chip">
                        {managedUser.isSuspended
                          ? "Access removed"
                          : roleLabel(managedUser.role)}
                      </span>
                    </div>

                    <div className="dashboard-user-meta">
                      <span>{`Role: ${roleLabel(managedUser.role)}`}</span>
                      <span>{`Language: ${managedUser.preferredLanguage}`}</span>
                      <span>{`Verified: ${managedUser.isEmailVerified ? "Yes" : "No"}`}</span>
                      <span>{`Status: ${managedUser.isSuspended ? "Suspended" : "Active"}`}</span>
                    </div>

                    {editingUserId === managedUser.id ? (
                      <div className="dashboard-user-edit-grid">
                        <label className="auth-field">
                          <span>Full name</span>
                          <input
                            value={editForm.fullName ?? ""}
                            onChange={(event) =>
                              setEditForm((current) => ({
                                ...current,
                                fullName: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span>Role</span>
                          <select
                            className="dashboard-select"
                            value={editForm.role ?? "LEARNER_EN"}
                            onChange={(event) =>
                              setEditForm((current) => ({
                                ...current,
                                role: event.target.value as UserRole,
                              }))
                            }
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="LEARNER_EN">Learner English</option>
                            <option value="LEARNER_BN">Learner Bangla</option>
                          </select>
                        </label>
                        <label className="auth-field">
                          <span>Preferred language</span>
                          <select
                            className="dashboard-select"
                            value={editForm.preferredLanguage ?? "en"}
                            onChange={(event) =>
                              setEditForm((current) => ({
                                ...current,
                                preferredLanguage: event.target.value as
                                  | "en"
                                  | "bn",
                              }))
                            }
                          >
                            <option value="en">English</option>
                            <option value="bn">Bangla</option>
                          </select>
                        </label>
                        <label className="dashboard-checkbox">
                          <input
                            type="checkbox"
                            checked={Boolean(editForm.isEmailVerified)}
                            onChange={(event) =>
                              setEditForm((current) => ({
                                ...current,
                                isEmailVerified: event.target.checked,
                              }))
                            }
                          />
                          <span>Email verified</span>
                        </label>
                      </div>
                    ) : null}

                    <div className="dashboard-actions">
                      {editingUserId === managedUser.id ? (
                        <>
                          <button
                            type="button"
                            className="dashboard-primary-link dashboard-button"
                            onClick={() => handleSaveUser(managedUser.id)}
                            disabled={adminUserActionId === managedUser.id}
                          >
                            {adminUserActionId === managedUser.id
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => setEditingUserId(null)}
                            disabled={adminUserActionId === managedUser.id}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => startEditingUser(managedUser)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => handleManualEnroll(managedUser)}
                            disabled={
                              adminUserActionId === managedUser.id ||
                              managedUser.role === "ADMIN" ||
                              !adminCourseId
                            }
                          >
                            {adminUserActionId === managedUser.id
                              ? "Updating..."
                              : "Manual enroll"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() => handleToggleAccess(managedUser)}
                            disabled={adminUserActionId === managedUser.id}
                          >
                            {adminUserActionId === managedUser.id
                              ? "Updating..."
                              : managedUser.isSuspended
                                ? "Restore access"
                                : "Remove access"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-secondary-link dashboard-button"
                            onClick={() =>
                              handleDeleteUser(managedUser, user.id)
                            }
                            disabled={
                              adminUserActionId === managedUser.id ||
                              managedUser.id === user.id
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {!isAdmin && learnerData ? (
          <>
            <section className="dashboard-profile-grid">
              <article className="dashboard-profile-card">
                <span className="dashboard-chip">Account</span>
                <h2>{user.email}</h2>
                <dl className="dashboard-definition-list">
                  <div>
                    <dt>Preferred language</dt>
                    <dd>{user.preferredLanguage}</dd>
                  </div>
                  <div>
                    <dt>Email verified</dt>
                    <dd>{user.isEmailVerified ? "Yes" : "Not yet"}</dd>
                  </div>
                  <div>
                    <dt>Last login</dt>
                    <dd>{formatDate(user.lastLoginAt)}</dd>
                  </div>
                </dl>
              </article>

              <article className="dashboard-profile-card">
                <span className="dashboard-chip">My course</span>
                <h2>{courseTitle}</h2>
                <p>
                  Open your main course page and continue with the lesson
                  modules inside Basics Electronics and Electrical.
                </p>
                <div className="dashboard-link-stack">
                  <Link
                    href={coursePortalLink}
                    className="dashboard-inline-link"
                  >
                    Open my course
                  </Link>
                  <Link
                    href={courseProjectsLink}
                    className="dashboard-inline-link"
                  >
                    Open course projects
                  </Link>
                  <Link
                    href="/current-voltage-learning/1"
                    className="dashboard-inline-link"
                  >
                    Start from Lesson 1
                  </Link>
                </div>
              </article>
            </section>

            <section className="dashboard-stat-grid">
              <article className="dashboard-stat-card">
                <strong>{learnerData.totalAttempts}</strong>
                <span>Total attempts</span>
              </article>
              <article className="dashboard-stat-card">
                <strong>{learnerData.passedAttempts}</strong>
                <span>Passed attempts</span>
              </article>
              <article className="dashboard-stat-card">
                <strong>{learnerData.averageScore}%</strong>
                <span>Average score</span>
              </article>
            </section>

            <section className="dashboard-content-grid">
              <article className="dashboard-surface-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">
                      Performance summary
                    </p>
                    <h2>Quiz performance</h2>
                  </div>
                </div>
                <p className="dashboard-copy">
                  This section is connected to the real learner performance API
                  in the backend.
                </p>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Pass rate</span>
                    <strong>
                      {learnerData.totalAttempts
                        ? Math.round(
                            (learnerData.passedAttempts /
                              learnerData.totalAttempts) *
                              100,
                          )
                        : 0}
                      %
                    </strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Latest result</span>
                    <strong>
                      {learnerData.results[0]
                        ? `${learnerData.results[0].percentage}%`
                        : "No attempts yet"}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="dashboard-surface-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Recent attempts</p>
                    <h2>Assessment history</h2>
                  </div>
                </div>
                <div className="dashboard-activity-list">
                  {learnerData.results.length ? (
                    learnerData.results.slice(0, 8).map((result) => (
                      <div key={result.id} className="dashboard-activity-item">
                        <strong>
                          {result.attemptType} • {result.percentage}%
                        </strong>
                        <span>
                          {result.passed ? "Passed" : "Needs review"} •{" "}
                          {formatDate(result.submittedAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="dashboard-muted">
                      No learner attempts yet. Start a lesson and quiz flow from
                      the training pages.
                    </p>
                  )}
                </div>
              </article>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
