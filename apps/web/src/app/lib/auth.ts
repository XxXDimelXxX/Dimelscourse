import { requestJson, type ApiError } from "./api-client";

const SESSION_STORAGE_KEY = "dimelscourse.auth-session";

export type AuthProvider = "local" | "google";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl: string | null;
  authProviders: AuthProvider[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface RegisterPayload {
  email: string;
  displayName: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

let refreshPromise: Promise<AuthSession | null> | null = null;

function getAuthorizationHeader(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  return requestJson<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return requestJson<AuthSession>("/auth/login/local", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const session = getAuthSession();

  if (!session) {
    throw new Error("Требуется авторизация");
  }

  return requestJson<AuthUser>("/auth/me", {
    method: "GET",
    headers: getAuthorizationHeader(session.accessToken),
  });
}

export async function refreshAuthSession(): Promise<AuthSession | null> {
  const existingSession = getAuthSession();

  if (!existingSession?.refreshToken) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = requestJson<AuthSession>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: existingSession.refreshToken,
      }),
    })
      .then((session) => {
        saveAuthSession(session);
        return session;
      })
      .catch(() => {
        clearAuthSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function logoutUser(): Promise<void> {
  const session = getAuthSession();

  if (!session?.refreshToken) {
    clearAuthSession();
    return;
  }

  try {
    await requestJson<{ success: boolean }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: session.refreshToken,
      }),
    });
  } finally {
    clearAuthSession();
  }
}

export async function authorizedRequest<TResponse>(
  path: string,
  init: RequestInit = {},
): Promise<TResponse> {
  const session = getAuthSession();

  if (!session) {
    throw new Error("Требуется авторизация");
  }

  try {
    return await requestJson<TResponse>(path, {
      ...init,
      headers: {
        ...getAuthorizationHeader(session.accessToken),
        ...init.headers,
      },
    });
  } catch (error) {
    const status = (error as ApiError).status;

    if (status !== 401) {
      throw error;
    }

    const refreshedSession = await refreshAuthSession();

    if (!refreshedSession) {
      throw new Error("Сессия истекла. Войдите снова.", { cause: error });
    }

    return requestJson<TResponse>(path, {
      ...init,
      headers: {
        ...getAuthorizationHeader(refreshedSession.accessToken),
        ...init.headers,
      },
    });
  }
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function patchStoredAuthUser(user: AuthUser): void {
  const session = getAuthSession();

  if (!session) {
    return;
  }

  saveAuthSession({
    ...session,
    user,
  });
}

export function clearAuthSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
