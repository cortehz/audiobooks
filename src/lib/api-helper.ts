type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  data?: unknown;
  apiVersion?: 'v1' | 'v2';
}

interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
  status: number;
}

const baseUrl = 'https://librivox.org/api/feed/audiobooks/';
// Create the base fetcher
const fetchWithConfig = async <T>(
  endpoint: string,
  method: RequestMethod,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { requiresAuth = false, data, ...customOptions } = options;

  try {
    // Get token only if auth is required
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = '';

      if (!token) {
        return {
          data: null,
          error: { message: 'Authentication required' },
          status: 401,
        };
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
      ...customOptions,
    });

    const status = response.status;

    if (!response.ok) {
      if (status === 401) {
        return {
          data: null,
          error: { message: 'Unauthorized' },
          status,
        };
      }

      return {
        data: null,
        error: { message: `HTTP error! status: ${status}` },
        status,
      };
    }

    // Handle 204 No Content
    if (status === 204) {
      return { data: null, error: null, status };
    }

    //Ensure that we get a response back to prevent unexpected json input
    const responseData =
      status !== 204 && response.headers.get('Content-Length') !== '0'
        ? await response.json()
        : null;

    return { data: responseData, error: null, status };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
      status: 0,
    };
  }
};

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWithConfig<T>(endpoint, 'GET', options),

  post: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchWithConfig<T>(endpoint, 'POST', { ...options, data }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWithConfig<T>(endpoint, 'DELETE', options),
};
