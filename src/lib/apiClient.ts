export type ApiError = Error & { status: number; code?: string };

export const apiFetch = async <T>(
  input: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...options,
    headers,
    credentials: "include"
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error?.message ?? "Request failed.") as ApiError;
    error.status = response.status;
    if (data?.error?.code) {
      error.code = data.error.code;
    }
    throw error;
  }

  return data as T;
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && "status" in error;
};
