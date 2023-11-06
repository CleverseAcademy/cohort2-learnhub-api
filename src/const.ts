import { Prisma } from "@prisma/client";

const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("Environment variable: JWT_SECRET is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;

export const DEFAULT_USER_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  registeredAt: true,
};

export const REQUIRED_RECORD_NOT_FOUND = "P2025";

export const UNIQUE_CONSTRAINT_VIOLATION = "P2002";

export const getAuthToken = (authorizationHeader: string) =>
  authorizationHeader.replace("Bearer ", "").trim();
