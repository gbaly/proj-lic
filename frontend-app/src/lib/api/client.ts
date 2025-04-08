import { API_BASE_URL } from './config';

interface ApiClientOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...restOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`; // Ensure endpoint starts with / if needed

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
    ...customHeaders, // Merge custom headers
  };

  const config: RequestInit = {
    method: restOptions.method || (restOptions.body ? 'POST' : 'GET'), // Default to GET, or POST if body exists
    headers: defaultHeaders,
    ...restOptions,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Attempt to parse error details from response if possible
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response body is not JSON or empty
      }
      console.error('API Error Response:', errorData);
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    // Handle cases where the response might be empty (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T; // Or return null or undefined based on expected behavior
    }

    // Assuming the successful response data is wrapped in a 'data' property
    // Adjust this based on the actual structure of your API responses (from the OpenAPI specs)
    const responseData = await response.json();

    // Check if the response follows the ApiResponse structure { data: ..., message: ... }
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
       return responseData.data as T;
    }

    // If not wrapped, return the whole response data
    // Be careful with this, ensure T matches the response structure
    // console.warn("API response might not be wrapped in 'data' property.", responseData);
    return responseData as T;

  } catch (error) {
    console.error('API Client Error:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
} 