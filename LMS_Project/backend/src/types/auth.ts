export type UserRole = "ADMIN" | "LEARNER_EN" | "LEARNER_BN";

export type RegisterUserInput = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type TokenKind = "access" | "refresh";

export type AuthTokenPayload = {
  kind: TokenKind;
  role: UserRole;
  email: string;
};

export type SanitizedUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  preferredLanguage: "en" | "bn";
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};
