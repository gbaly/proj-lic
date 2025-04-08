// Based on Almakhtuta.Licenses.Manager.Shared.Requests.Permissions.SignInRequest
export interface SignInRequest {
  username: string;
  password: string;
}

// Note: The OpenAPI spec for sign-in response is generic (ApiResponse).
// We might need to adjust this later based on how the actual token is returned (e.g., in headers, cookies, or if the spec needs update).
export interface SignInResponse {
  // Assuming the token might be returned in the data object, although not specified.
  // This is a placeholder and might need adjustment.
  token?: string; 
  message?: string;
} 