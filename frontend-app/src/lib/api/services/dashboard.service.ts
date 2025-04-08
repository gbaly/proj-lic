import { apiClient } from '../client';
import type { DashboardStatsDto } from '../types/dashboard.types';

const DASHBOARD_ENDPOINT = '/api/institution/dashboard';

/**
 * Fetches dashboard statistics from the API.
 * Requires authentication.
 * @param token The auth token.
 * @returns A promise that resolves with the dashboard statistics.
 */
export const getDashboardStats = async (token: string): Promise<DashboardStatsDto> => {
  if (!token) {
    throw new Error('Authentication token is required to fetch dashboard stats.');
  }

  try {
    // Assuming the response structure is { data: DashboardStatsDto, message: ... }
    const response = await apiClient<DashboardStatsDto>(
        `${DASHBOARD_ENDPOINT}/stats`,
         {
            method: 'GET',
            token: token, // Pass the token to apiClient
         }
     );
    return response;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
    throw new Error('Failed to fetch dashboard stats due to an unknown error.');
  }
}; 