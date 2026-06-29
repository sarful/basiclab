import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import {
  ACCESS_TOKEN_TTL_JWT,
  REFRESH_TOKEN_TTL_JWT,
} from "@/lib/auth-constants";
import type { AuthTokenPayload, TokenKind, UserRole } from "@/types/auth";

export function signAuthToken(
  subject: string,
  kind: TokenKind,
  context: { role: UserRole; email: string },
) {
  const secret =
    kind === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;

  return jwt.sign({ kind, role: context.role, email: context.email }, secret, {
    subject,
    issuer: env.TOKEN_ISSUER,
    expiresIn: kind === "access" ? ACCESS_TOKEN_TTL_JWT : REFRESH_TOKEN_TTL_JWT,
  });
}

export function verifyAuthToken(token: string, kind: TokenKind) {
  const secret =
    kind === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;

  return jwt.verify(token, secret, {
    issuer: env.TOKEN_ISSUER,
  }) as jwt.JwtPayload & AuthTokenPayload;
}
