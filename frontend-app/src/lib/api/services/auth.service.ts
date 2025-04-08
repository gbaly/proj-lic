import { apiClient } from '../client';
import type { SignInRequest, SignInResponse } from '../types/auth.types';

const AUTH_ENDPOINT = '/api/permissions/auth';

/**
 * Sends a sign-in request to the API.
 * @param credentials The username and password.
 * @returns A promise that resolves with the sign-in response (potentially including a token).
 */
export const signIn = async (credentials: SignInRequest): Promise<SignInResponse> => {
  // Note: The OpenAPI spec returns a generic ApiResponse for success,
  // which doesn't explicitly contain the token. We are assuming
  // the token might be in the `data` part or handled differently (e.g., cookies).
  // The return type `SignInResponse` is a placeholder.
  // We also might need to handle the response differently if the token is in headers/cookies.

  // We expect the response structure potentially to be { data: { token: '...' }, message: '...' }
  // or just { message: '...' } on success without data.
  // The apiClient is designed to extract the `data` part if it exists.

  try {
    const response = await apiClient<{ token?: string; message?: string } | null>(
        `${AUTH_ENDPOINT}/sign-in`,
         {
            method: 'POST',
            body: JSON.stringify(credentials),
         }
     );

    // If apiClient returns null (e.g., from a 204 or unexpected structure), handle it.
    // Or if the response object doesn't contain a token (as expected by SignInResponse)
    if (!response || typeof response !== 'object') {
        // If login is successful but returns no specific data (like just a message or 200 OK)
        // We need clarification on how the token is actually passed.
        // For now, return a success indicator or an empty object.
        console.warn('Sign-in response did not contain expected data structure. Check API.');
        return { message: 'Login successful (token handling needs verification)' }; // Placeholder response
    }

    // Assuming the token might be directly in the returned object (after apiClient extracts 'data')
    return response as SignInResponse;

  } catch (error) {
    console.error('Sign In failed:', error);
    // Enhance error handling based on specific API error responses if possible
    if (error instanceof Error) {
      throw new Error(`Sign In failed: ${error.message}`);
    }
    throw new Error('Sign In failed due to an unknown error.');
  }
};

/**
 * Sends a sign-out request to the API.
 * Requires the user's current auth token.
 * @param token The auth token of the user signing out.
 * @returns A promise that resolves when sign-out is successful.
 */
export const signOut = async (token: string): Promise<void> => {
  // Note: The API uses PUT for sign-out.
  // It expects the token in the Authorization header.
  try {
    await apiClient<void>(`${AUTH_ENDPOINT}/sign-out`, {
      method: 'PUT',
      token: token, // Pass the token to apiClient to add the Authorization header
    });
    console.log('Sign out successful on API.');
  } catch (error) {
    // We might want to proceed with local logout even if API call fails
    console.error('API Sign Out failed:', error);
    // Optionally re-throw or handle differently
    // if (error instanceof Error) {
    //   throw new Error(`API Sign Out failed: ${error.message}`);
    // }
    // throw new Error('API Sign Out failed due to an unknown error.');
  }
}; 