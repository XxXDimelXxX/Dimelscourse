/**
 * Shared HTTP client for all API calls.
 * Single source of truth for API_URL, error extraction, and request helpers.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000";

export interface ApiError extends Error {
  status?: number;
}

export async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(payload.message)) {
      return payload.message.join(", ");
    }

    return payload.message ?? payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

/**
 * Public (unauthenticated) JSON request.
 */
export async function requestJson<TResponse>(
  path: string,
  init: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}
