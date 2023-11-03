const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("Environment variable: JWT_SECRET is not configured");

export const DEFAULT_BCRYPT_NUMBER_OF_ROUNDS = 12;

export const JWT_SECRET = ENV_JWT_SECRET;

export const REQUIRED_RECORD_NOT_FOUND = "P2025";

export const UNIQUE_CONSTRAINT_VIOLATION = "P2002";
