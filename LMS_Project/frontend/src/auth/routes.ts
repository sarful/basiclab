import type { UserRole } from "./types";

export const ADMIN_DASHBOARD_ROOT = "/Admin/dashboard";
export const USER_DASHBOARD_ROOT = "/User/dashboard";

export function getDefaultRouteForRole(role: UserRole) {
  return role === "ADMIN" ? ADMIN_DASHBOARD_ROOT : USER_DASHBOARD_ROOT;
}

export function getPreferredRoleRoute(pathname: string | null, role: UserRole) {
  if (role === "ADMIN") {
    if (!pathname || pathname === "/dashboard" || pathname === "/Admin" || pathname === "/Admin/dashboard") {
      return ADMIN_DASHBOARD_ROOT;
    }

    if (pathname.startsWith("/dashboard/")) {
      return `/Admin/${pathname.slice("/dashboard/".length)}`;
    }

    if (pathname.startsWith("/User")) {
      return ADMIN_DASHBOARD_ROOT;
    }

    return pathname;
  }

  if (!pathname || pathname === "/dashboard" || pathname === "/User" || pathname === "/User/dashboard") {
    return USER_DASHBOARD_ROOT;
  }

  if (pathname.startsWith("/dashboard/")) {
    return `/User/${pathname.slice("/dashboard/".length)}`;
  }

  if (pathname.startsWith("/Admin")) {
    return USER_DASHBOARD_ROOT;
  }

  return pathname;
}
