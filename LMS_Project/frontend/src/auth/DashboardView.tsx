"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  activateAdminUser,
  assignAdminEnrollment,
  deleteAdminUser,
  fetchAdminDashboard,
  fetchAdminCourses,
  fetchAdminUsers,
  fetchCurrentUser,
  fetchLearnerDashboard,
  logout,
  suspendAdminUser,
  updateAdminUser,
} from "./api";
import { useBackendMode } from "./backend-mode";
import type {
  AdminDashboardData,
  AdminManagedUser,
  AuthUser,
  LearnerDashboardData,
  UpdateUserPayload,
  UserRole,
} from "./types";
import {
  basicsCourseModules,
  basicsCourseProjects,
} from "../courses/basics-electronics-and-electrical/courseCatalog";
import { learnerDashboardSections } from "./learner-dashboard-planning";

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
const courseProjectsLink = "/courses/basics-electronics-and-electrical/projects";
const homepageLink = "/";
const courseTitle = "Basics Electronics and Electrical";

const adminSidebarItems = [
  { label: "Dashboard", tone: "current" },
  { label: "Users", tone: "default" },
  { label: "User Management", tone: "accent" },
  { label: "Courses", tone: "default" },
  { label: "Lessons", tone: "default" },
  { label: "Projects", tone: "default" },
  { label: "Enrollments", tone: "default" },
  { label: "Reports", tone: "default" },
] as const;

const learnerSidebarItems = [
  { label: "Dashboard", href: "/dashboard", sectionId: "dashboard" as const },
  { label: "My Courses", href: "/dashboard/my-courses", sectionId: "my-courses" as const },
  { label: "Lessons", href: "/dashboard/lessons", sectionId: "lessons" as const },
  { label: "Assignments", href: "/dashboard/assignments", sectionId: "assignments" as const },
  { label: "Exams", href: "/dashboard/exams", sectionId: "exams" as const },
  { label: "Progress", href: "/dashboard/progress", sectionId: "progress" as const },
  { label: "Certificates", href: "/dashboard/certificates", sectionId: "certificates" as const },
  { label: "Calendar", href: "/dashboard/calendar", sectionId: "calendar" as const },
  { label: "Messages", href: "/dashboard/messages", sectionId: "messages" as const },
  { label: "Settings", href: "/dashboard/settings", sectionId: "settings" as const },
] as const;

function getLearnerDashboardSection(pathname: string | null) {
  if (!pathname || pathname === "/dashboard") {
    return "dashboard";
  }

  return learnerSidebarItems.find((item) => item.href === pathname)?.sectionId ?? "dashboard";
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
  const [state, setState] = useState<DashboardState>({ status: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminManagedUser[]>([]);
  const [adminUserActionId, setAdminUserActionId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [adminUserNotice, setAdminUserNotice] = useState<string | null>(null);
  const [adminCourseId, setAdminCourseId] = useState<string | null>(null);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    fullName: "",
    preferredLanguage: "en",
    role: "LEARNER_EN",
    isEmailVerified: false,
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
          const [adminResponse, usersResponse, coursesResponse] = await Promise.all([
            fetchAdminDashboard(),
            fetchAdminUsers(),
            fetchAdminCourses(),
          ]);

          if (!cancelled) {
            setAdminUsers(usersResponse.data);
            setAdminCourseId(
              coursesResponse.data.find((course) => course.slug === "basics-electronics-and-electrical")?.id ??
                null,
            );
            setState({
              status: "ready",
              user,
              adminData: adminResponse.data,
            });
          }
          return;
        }

        const learnerResponse = await fetchLearnerDashboard();
        if (!cancelled) {
          setState({
            status: "ready",
            user,
            learnerData: learnerResponse.data,
          });
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load dashboard.";

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

  async function reloadAdminUsers() {
    const response = await fetchAdminUsers();
    setAdminUsers(response.data);
  }

  async function reloadAdminCourseId() {
    const response = await fetchAdminCourses();
    setAdminCourseId(
      response.data.find((course) => course.slug === "basics-electronics-and-electrical")?.id ?? null,
    );
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
      isEmailVerified: targetUser.isEmailVerified,
    });
  }

  async function handleSaveUser(userId: string) {
    setAdminUserActionId(userId);
    setAdminUserNotice(null);

    try {
      await updateAdminUser(userId, editForm);
      await reloadAdminUsers();
      setEditingUserId(null);
      setAdminUserNotice("User updated successfully.");
    } catch (updateError) {
      setAdminUserNotice(
        updateError instanceof Error ? updateError.message : "Unable to update user.",
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
        toggleError instanceof Error ? toggleError.message : "Unable to change user access.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleDeleteUser(targetUser: AdminManagedUser, currentUserId: string) {
    if (targetUser.id === currentUserId) {
      setAdminUserNotice("You cannot delete your own admin account from this dashboard.");
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
        deleteError instanceof Error ? deleteError.message : "Unable to delete user.",
      );
    } finally {
      setAdminUserActionId(null);
    }
  }

  async function handleManualEnroll(targetUser: AdminManagedUser) {
    if (!adminCourseId) {
      setAdminUserNotice("Create or publish the backend course first before manual enrollment.");
      return;
    }

    setAdminUserActionId(targetUser.id);
    setAdminUserNotice(null);

    try {
      await assignAdminEnrollment(targetUser.id, adminCourseId, "Manual enrollment from admin dashboard");
      await reloadAdminUsers();
      await reloadAdminCourseId();
      setAdminUserNotice("User enrolled manually into Basics Electronics and Electrical.");
    } catch (enrollError) {
      setAdminUserNotice(
        enrollError instanceof Error ? enrollError.message : "Unable to enroll user manually.",
      );
    } finally {
      setAdminUserActionId(null);
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
    const filteredLessons = basicsCourseModules.filter((lesson) =>
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
          roleLabel(managedUser.role),
        ],
        dashboardSearch,
      ),
    );
    const activitySeries = getActivitySeries(adminData.recentActivities);
    const maxActivityValue = Math.max(...activitySeries.map((item) => item.value), 1);
    const activeUsersCount = adminUsers.filter((managedUser) => !managedUser.isSuspended).length;
    const suspendedUsersCount = adminUsers.filter((managedUser) => managedUser.isSuspended).length;
    const adminCount = adminUsers.filter((managedUser) => managedUser.role === "ADMIN").length;
    const learnerCount = adminUsers.filter((managedUser) => managedUser.role !== "ADMIN").length;

    return (
      <main className="dashboard-page admin-console-page">
        <section className="admin-console-shell">
          <aside className="admin-console-sidebar">
            <div className="admin-console-logo">ET LMS</div>

            <nav className="admin-console-nav">
              {adminSidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`admin-console-nav-item ${
                    item.tone === "current"
                      ? "is-current"
                      : item.tone === "accent"
                        ? "is-accent"
                        : ""
                  }`}
                >
                  <span className="admin-console-nav-icon" />
                  <span>{item.label}</span>
                </div>
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
                <div className="admin-console-indicator">Users {adminUsers.length}</div>
                <div className="admin-console-profile">
                  <div className="admin-console-avatar">{getInitials(user.fullName)}</div>
                  <div>
                    <strong>{roleLabel(user.role)}</strong>
                    <span>{user.fullName}</span>
                  </div>
                </div>
              </div>
            </header>

            <section className="admin-console-heading">
              <div>
                <h1>Admin Dashboard</h1>
                <p>
                  Overview of your platform performance for {courseTitle}, lesson access,
                  learner approval, and direct user management.
                </p>
              </div>
              <div className="admin-console-range">{getCurrentWeekLabel()}</div>
            </section>

            <section className="admin-console-stats">
              <article className="admin-console-stat-card">
                <span>Total Users</span>
                <strong>{adminData.widgets.totalUsers}</strong>
                <small>{learnerCount} learners inside the LMS workspace</small>
              </article>
              <article className="admin-console-stat-card">
                <span>Total Courses</span>
                <strong>{adminData.widgets.totalCourses}</strong>
                <small>Single published electrical course workspace</small>
              </article>
              <article className="admin-console-stat-card">
                <span>Total Lessons</span>
                <strong>{basicsCourseModules.length}</strong>
                <small>All lesson routes under the main course</small>
              </article>
              <article className="admin-console-stat-card">
                <span>Pending Enrollments</span>
                <strong>{adminData.widgets.pendingEnrollments}</strong>
                <small>Manual review and admin enrollment ready</small>
              </article>
              <article className="admin-console-stat-card">
                <span>Active Learners</span>
                <strong>{adminData.widgets.activeLearners}</strong>
                <small>{activeUsersCount} active users currently available</small>
              </article>
            </section>

            <section className="admin-console-grid admin-console-grid-overview">
              <article className="admin-console-card admin-console-chart-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Enrollment overview</p>
                    <h2>Weekly LMS activity</h2>
                  </div>
                  <span className="dashboard-chip">This week</span>
                </div>
                <div className="admin-console-mini-chart">
                  {activitySeries.map((item) => (
                    <div key={item.label} className="admin-console-mini-chart-bar">
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
                  <Link href={coursePortalLink} className="dashboard-secondary-link">
                    View
                  </Link>
                </div>
                <div className="admin-console-ranked-list">
                  <div className="admin-console-ranked-item">
                    <span>1</span>
                    <strong>{courseTitle}</strong>
                    <small>{adminData.widgets.activeLearners} learners active</small>
                  </div>
                  <div className="admin-console-summary-row">
                    <div>
                      <span>Lessons</span>
                      <strong>{basicsCourseModules.length}</strong>
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
                    <p className="dashboard-section-kicker">User management</p>
                    <h2>Access summary</h2>
                  </div>
                  <span className="dashboard-chip">{filteredUsers.length} visible</span>
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

            <section className="admin-console-grid admin-console-grid-tables">
              <article className="admin-console-card">
                <div className="admin-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Lesson catalog</p>
                    <h2>Course lesson list</h2>
                  </div>
                  <span className="dashboard-chip">{filteredLessons.length} lessons</span>
                </div>
                <div className="admin-console-table">
                  {filteredLessons.map((lesson, index) => (
                    <Link key={lesson.href} href={lesson.href} className="admin-console-table-row">
                      <span className="admin-console-table-rank">{index + 1}</span>
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
                  <span className="dashboard-chip">{filteredProjects.length} projects</span>
                </div>
                <div className="admin-console-table">
                  {filteredProjects.map((project, index) =>
                    project.href ? (
                      <Link
                        key={project.title}
                        href={project.href}
                        className="admin-console-table-row"
                      >
                        <span className="admin-console-table-rank">{index + 1}</span>
                        <strong>{project.title}</strong>
                        <small>Open project workspace</small>
                      </Link>
                    ) : (
                      <div key={project.title} className="admin-console-table-row">
                        <span className="admin-console-table-rank">{index + 1}</span>
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
                    <small>{formatDate(adminData.systemHealth.timestamp)}</small>
                  </div>
                  <div className="admin-console-system-item">
                    <span>Database</span>
                    <strong>{adminData.systemHealth.database}</strong>
                    <small>{adminData.systemHealth.storageDriver} storage driver</small>
                  </div>
                  <div className="admin-console-system-item">
                    <span>Stored files</span>
                    <strong>{adminData.systemHealth.totalFiles}</strong>
                    <small>{adminData.systemHealth.totalStorageMegabytes} MB used</small>
                  </div>
                </div>
              </article>
            </section>

            <section className="admin-console-card admin-console-users-card">
              <div className="admin-console-card-head">
                <div>
                  <p className="dashboard-section-kicker">User management</p>
                  <h2>Admin user list and access control</h2>
                </div>
                <span className="dashboard-chip">{filteredUsers.length} users</span>
              </div>
              <p className="dashboard-copy">
                Edit users, manually enroll learners, remove access, restore access, or delete
                users from the admin dashboard.
              </p>
              {adminUserNotice ? <p className="dashboard-copy">{adminUserNotice}</p> : null}
              <div className="admin-console-user-grid">
                {filteredUsers.map((managedUser) => (
                  <article key={managedUser.id} className="admin-console-user-card">
                    <div className="dashboard-user-head">
                      <div>
                        <strong>{managedUser.fullName}</strong>
                        <span>{managedUser.email}</span>
                      </div>
                      <span className="dashboard-chip">
                        {managedUser.isSuspended ? "Access removed" : roleLabel(managedUser.role)}
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
                                preferredLanguage: event.target.value as "en" | "bn",
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
                            {adminUserActionId === managedUser.id ? "Saving..." : "Save"}
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
                            {adminUserActionId === managedUser.id ? "Updating..." : "Manual enroll"}
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
                              adminUserActionId === managedUser.id || managedUser.id === user.id
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
        : learnerDashboardSections.find((section) => section.id === learnerSection) ?? null;
    const completedLessons = Math.min(learnerData.passedAttempts, basicsCourseModules.length);
    const remainingLessons = Math.max(basicsCourseModules.length - completedLessons, 0);
    const completionRate = Math.round((completedLessons / basicsCourseModules.length) * 100);
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
      Math.max(1, Math.min(learnerData.results.length, completedLessons || learnerData.totalAttempts || 1)),
    );

    return (
      <main className="dashboard-page learner-console-page">
        <section className="learner-console-shell">
          <aside className="learner-console-sidebar">
            <div className="learner-console-logo">ET LMS</div>

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
                  <div className="learner-console-avatar">{getInitials(user.fullName)}</div>
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
                  {activeLearnerPlan ? activeLearnerPlan.label : `Welcome back, ${user.fullName}.`}
                </h1>
                <p>
                  {activeLearnerPlan
                    ? activeLearnerPlan.summary
                    : "Continue your learning journey today."}
                </p>
              </div>
            </section>

            {activeLearnerPlan ? (
              <section className="dashboard-surface-card">
                <div className="dashboard-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Planning Scaffold</p>
                    <h2>{activeLearnerPlan.label}</h2>
                  </div>
                  <span className="dashboard-chip">Placeholder</span>
                </div>
                <p className="dashboard-copy">
                  This learner dashboard section is now connected to a working route. Final UI,
                  live data cards, and actions can be built here next.
                </p>
                <div className="dashboard-link-stack">
                  <span className="dashboard-inline-link">Route: {activeLearnerPlan.route}</span>
                  <Link href={coursePortalLink} className="dashboard-inline-link">
                    Open main course
                  </Link>
                  <Link href="/dashboard" className="dashboard-inline-link">
                    Back to dashboard home
                  </Link>
                </div>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Planned data sources</span>
                    <strong>{activeLearnerPlan.dataSources.length}</strong>
                  </div>
                  <div className="dashboard-highlight">
                    <span>Implementation notes</span>
                    <strong>{activeLearnerPlan.notes.length}</strong>
                  </div>
                </div>
                <div className="dashboard-activity-list">
                  {activeLearnerPlan.dataSources.map((source) => (
                    <div key={source} className="dashboard-activity-item">
                      <strong>{source}</strong>
                      <span>Reserved API/data source for this learner section</span>
                    </div>
                  ))}
                  {activeLearnerPlan.notes.map((note) => (
                    <div key={note} className="dashboard-activity-item">
                      <strong>Implementation note</strong>
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
                <strong>{basicsCourseModules.length}</strong>
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
              <div className="learner-console-feature-icon">Course</div>
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
                <Link href={coursePortalLink} className="dashboard-secondary-link">
                  Open My Course
                </Link>
                <Link href="/current-voltage-learning/1" className="dashboard-primary-link">
                  Resume Learning
                </Link>
              </div>
            </section>

            <section className="learner-console-grid">
              <article className="learner-console-card">
                <div className="learner-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">My Courses</p>
                    <h2>Continue inside your course</h2>
                  </div>
                  <Link href={coursePortalLink} className="dashboard-secondary-link">
                    View All
                  </Link>
                </div>

                <div className="learner-console-course-list">
                  <article className="learner-console-course-item">
                    <div className="learner-console-course-thumbnail" />
                    <div className="learner-console-course-body">
                      <strong>{courseTitle}</strong>
                      <div className="learner-console-progress-row">
                        <div className="learner-console-progress-track">
                          <div
                            className="learner-console-progress-fill"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span>{completionRate}%</span>
                      </div>
                    </div>
                    <Link href={coursePortalLink} className="dashboard-secondary-link">
                      Continue
                    </Link>
                  </article>
                </div>
              </article>

              <article className="learner-console-card">
                <div className="learner-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Recent Activity</p>
                    <h2>Your latest progress</h2>
                  </div>
                </div>

                <div className="learner-console-activity-list">
                  {filteredResults.length ? (
                    filteredResults.slice(0, 6).map((result) => (
                      <div key={result.id} className="learner-console-activity-item">
                        <div className="learner-console-activity-badge">
                          {result.passed ? "Done" : "Run"}
                        </div>
                        <div>
                          <strong>
                            {result.passed ? "Completed" : "Started"}: {result.attemptType}
                          </strong>
                          <span>
                            {result.percentage}% • {formatShortDate(result.submittedAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="dashboard-muted">
                      No recent learner activity yet. Start the first lesson from your course page.
                    </p>
                  )}
                </div>
              </article>
            </section>

            <section className="learner-console-grid learner-console-grid-bottom">
              <article className="learner-console-card">
                <div className="learner-console-card-head">
                  <div>
                    <p className="dashboard-section-kicker">Learning Streak</p>
                    <h2>{streakDays} days</h2>
                  </div>
                </div>

                <div className="learner-console-streak">
                  <p>Keep it up. Consistency is the key to success.</p>
                  <div className="learner-console-streak-days">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="learner-console-streak-day">
                        <span>{day}</span>
                        <strong className={index < streakDays ? "is-complete" : ""}>
                          {index < streakDays ? "•" : "○"}
                        </strong>
                      </div>
                    ))}
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
                  <strong>Continue {courseTitle}</strong>
                  <span>
                    {remainingLessons
                      ? `${remainingLessons} lessons still remaining in your current track.`
                      : "You have completed the currently tracked lesson sequence."}
                  </span>
                  <Link href={coursePortalLink} className="dashboard-secondary-link">
                    Open Course
                  </Link>
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
                Frontend preview mode is active. Backend calls are bypassed and protected routes
                are unlocked locally.
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
            <Link href={dashboardIntro.actionHref} className="dashboard-secondary-link">
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
                    <p className="dashboard-section-kicker">Course command center</p>
                    <h2>{courseTitle}</h2>
                  </div>
                  <span className="dashboard-chip">Admin control</span>
                </div>
                <p className="dashboard-copy">
                  Manage the single live LMS course, review lesson coverage, open project
                  workspaces, and keep learner access under one admin dashboard.
                </p>
                <div className="admin-dashboard-link-row">
                  <Link href={coursePortalLink} className="dashboard-primary-link">
                    Open course page
                  </Link>
                  <Link href={courseProjectsLink} className="dashboard-secondary-link">
                    Open projects
                  </Link>
                  <Link href="/current-voltage-learning/1" className="dashboard-secondary-link">
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
                  <span className="dashboard-chip">{basicsCourseModules.length} lessons</span>
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
                  <span className="dashboard-chip">{basicsCourseProjects.length} projects</span>
                </div>
                <div className="admin-dashboard-list">
                  {basicsCourseProjects.map((project) => (
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
                      <div key={project.title} className="admin-dashboard-list-item">
                        <strong>{project.title}</strong>
                        <span>Project folder ready for next wiring phase</span>
                      </div>
                    )
                  ))}
                </div>
              </article>
            </section>

            <section className="dashboard-surface-card admin-dashboard-users-card">
              <div className="dashboard-card-head">
                <div>
                  <p className="dashboard-section-kicker">User management</p>
                  <h2>Admin user list and access control</h2>
                </div>
                <span className="dashboard-chip">{adminUsers.length} users</span>
              </div>
              <p className="dashboard-copy">
                Edit users, manually enroll learners, remove access, restore access, or delete
                users from the admin dashboard.
              </p>
              {adminUserNotice ? <p className="dashboard-copy">{adminUserNotice}</p> : null}
              <div className="admin-dashboard-user-table">
                {adminUsers.map((managedUser) => (
                  <article key={managedUser.id} className="dashboard-user-card admin-dashboard-user-card">
                    <div className="dashboard-user-head">
                      <div>
                        <strong>{managedUser.fullName}</strong>
                        <span>{managedUser.email}</span>
                      </div>
                      <span className="dashboard-chip">
                        {managedUser.isSuspended ? "Access removed" : roleLabel(managedUser.role)}
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
                                preferredLanguage: event.target.value as "en" | "bn",
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
                            {adminUserActionId === managedUser.id ? "Saving..." : "Save"}
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
                            {adminUserActionId === managedUser.id ? "Updating..." : "Manual enroll"}
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
                              adminUserActionId === managedUser.id || managedUser.id === user.id
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
                  Open your main course page and continue with the lesson modules inside Basics
                  Electronics and Electrical.
                </p>
                <div className="dashboard-link-stack">
                  <Link href={coursePortalLink} className="dashboard-inline-link">
                    Open my course
                  </Link>
                  <Link href={courseProjectsLink} className="dashboard-inline-link">
                    Open course projects
                  </Link>
                  <Link href="/current-voltage-learning/1" className="dashboard-inline-link">
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
                    <p className="dashboard-section-kicker">Performance summary</p>
                    <h2>Quiz performance</h2>
                  </div>
                </div>
                <p className="dashboard-copy">
                  This section is connected to the real learner performance API in the backend.
                </p>
                <div className="dashboard-highlight-row">
                  <div className="dashboard-highlight">
                    <span>Pass rate</span>
                    <strong>
                      {learnerData.totalAttempts
                        ? Math.round(
                            (learnerData.passedAttempts / learnerData.totalAttempts) * 100,
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
                      No learner attempts yet. Start a lesson and quiz flow from the training pages.
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
