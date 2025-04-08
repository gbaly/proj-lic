import { apiClient } from '../client';
import type { PagedCustomersResponse, GetCustomersQuery } from '../types/customer.types';

const CUSTOMERS_ENDPOINT = '/api/customers/customers';

/**
 * Fetches a paginated list of customers from the API.
 * @param query Optional query parameters for filtering, pagination.
 * @param token Optional auth token (will be needed later).
 * @returns A promise that resolves with the paged customer data.
 */
export const getCustomers = async (
    query: GetCustomersQuery = {},
    // TODO: Add token parameter and pass it to apiClient once auth is working
    // token?: string 
): Promise<PagedCustomersResponse> => {

  // Construct query string from parameters
  const queryString = new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]) // Ensure values are strings
  ).toString();

  const url = queryString ? `${CUSTOMERS_ENDPOINT}?${queryString}` : CUSTOMERS_ENDPOINT;

  try {
    // Assuming the response structure is { data: PagedCustomersResponse, message: ... }
    // The apiClient will extract the 'data' part.
    // TODO: Pass the token to apiClient options when auth is ready
    const response = await apiClient<PagedCustomersResponse>(url, {
      method: 'GET',
      // headers: { Authorization: `Bearer ${token}` } // Add this later
    });

    // Handle potential null results from the API spec
    if (!response.results) {
      return { ...response, results: [] };
    }

    return response;

  } catch (error) {
    console.error('Failed to fetch customers:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
    throw new Error('Failed to fetch customers due to an unknown error.');
  }
};

// TODO: Add functions for getCustomerById, createCustomer, updateCustomer, deleteCustomer later. 