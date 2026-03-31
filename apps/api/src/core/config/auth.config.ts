const DEFAULT_ACCESS_TOKEN_TTL_MINUTES = 15;
const DEFAULT_REFRESH_TOKEN_TTL_DAYS = 30;
const DEFAULT_BCRYPT_SALT_ROUNDS = 12;

export interface AuthConfig {
  accessTokenSecret: string;
  accessTokenTtlMinutes: number;
  refreshTokenSecret: string;
  refreshTokenTtlDays: number;
  bcryptSaltRounds: number;
  googleClientId?: string;
  googleClientSecret?: string;
  googleCallbackUrl?: string;
}

function toNumber(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export function getAuthConfig(
  env: NodeJS.ProcessEnv = process.env,
): AuthConfig {
  if (
    env.NODE_ENV === "production" &&
    (!env.AUTH_ACCESS_TOKEN_SECRET || !env.AUTH_REFRESH_TOKEN_SECRET)
  ) {
    throw new Error(
      "AUTH_ACCESS_TOKEN_SECRET and AUTH_REFRESH_TOKEN_SECRET must be set in production",
    );
  }

  return {
    accessTokenSecret:
      env.AUTH_ACCESS_TOKEN_SECRET ?? "dimelscourse-dev-access-secret",
    accessTokenTtlMinutes: toNumber(
      env.AUTH_ACCESS_TOKEN_TTL_MINUTES,
      DEFAULT_ACCESS_TOKEN_TTL_MINUTES,
    ),
    refreshTokenSecret:
      env.AUTH_REFRESH_TOKEN_SECRET ?? "dimelscourse-dev-refresh-secret",
    refreshTokenTtlDays: toNumber(
      env.AUTH_REFRESH_TOKEN_TTL_DAYS,
      DEFAULT_REFRESH_TOKEN_TTL_DAYS,
    ),
    bcryptSaltRounds: toNumber(
      env.AUTH_BCRYPT_SALT_ROUNDS,
      DEFAULT_BCRYPT_SALT_ROUNDS,
    ),
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: env.GOOGLE_CALLBACK_URL,
  };
}
