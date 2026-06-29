import { cookies } from "next/headers";

import { UserModel } from "@/db/models/User";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-constants";
import { verifyAuthToken } from "@/lib/tokens";
import type { UserRole } from "@/types/auth";
import { sanitizeUser } from "@/lib/auth-utils";

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const payload = verifyAuthToken(accessToken, "access");
    const user = await UserModel.findById(payload.sub);

    if (!user || user.isSuspended) {
      return null;
    }

    return {
      user: sanitizeUser(user),
      payload,
    };
  } catch {
    return null;
  }
}

export async function requireRole(roles: UserRole[]) {
  const auth = await requireAuth();

  if (!auth) {
    return null;
  }

  if (!roles.includes(auth.user.role)) {
    return { ...auth, forbidden: true as const };
  }

  return auth;
}
