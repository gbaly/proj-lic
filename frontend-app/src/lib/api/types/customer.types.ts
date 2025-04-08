// Based on Almakhtuta.Licenses.Manager.Shared.DTOs.Customers.CustomerInfoDto
export interface CustomerInfoDto {
  customerId: string; // uuid
  name: string | null;
  phoneNumber: string | null;
  address: string | null;
}

// Based on Almakhtuta.Licenses.Manager.Shared.Abstractions.Queries.Paged<T>
export interface Paged<T> {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  results: T[] | null;
}

// Specific type for the paged customer response
export type PagedCustomersResponse = Paged<CustomerInfoDto>;

// Interface for query parameters for fetching customers
export interface GetCustomersQuery {
  SearchValue?: string;
  CurrentPage?: number;
  PageSize?: number;
} 