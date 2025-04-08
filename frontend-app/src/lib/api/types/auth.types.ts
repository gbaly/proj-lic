// Based on Almakhtuta.Licenses.Manager.Shared.Requests.Permissions.SignInRequest
export interface SignInRequest {
  username: string;
  password: string;
}

// Updated SignInResponse based on actual API response
export interface SignInResponse {
  userId: string;
  name: string;
  accessToken: string;
  // The top-level "message" property is usually handled by apiClient 
  // or can be ignored if only data is needed on success.
} 