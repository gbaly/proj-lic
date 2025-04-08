"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCustomers } from '@/lib/api/services/customer.service';
import type { CustomerInfoDto, PagedCustomersResponse, GetCustomersQuery } from '@/lib/api/types/customer.types';

export default function CustomersPage() {
  const [customersData, setCustomersData] = useState<PagedCustomersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<GetCustomersQuery>({ CurrentPage: 1, PageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Prepare the final query including search term
        const finalQuery: GetCustomersQuery = {
          ...query,
          SearchValue: searchTerm || undefined, // Only include SearchValue if not empty
        };
        console.log("Fetching customers with query:", finalQuery);
        // TODO: This will likely fail without auth token
        const data = await getCustomers(finalQuery);
        console.log("Received customers data:", data);
        setCustomersData(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err instanceof Error ? err.message : 'فشل جلب بيانات العملاء');
        setCustomersData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [query, searchTerm]); // Refetch when query or searchTerm changes

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Trigger refetch by updating the query state (even if it's the same page)
    setQuery(prev => ({ ...prev, CurrentPage: 1 })); 
  };

  const handlePageChange = (newPage: number) => {
    setQuery(prev => ({ ...prev, CurrentPage: newPage }));
  };

  const customers = customersData?.results ?? [];
  const totalPages = customersData?.totalPages ?? 1;
  const currentPage = customersData?.currentPage ?? 1;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-semibold mb-6 text-right">إدارة العملاء</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
        <Input 
          type="search"
          placeholder="ابحث عن عميل (الاسم, الهاتف...)"
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
          dir="rtl"
        />
        <Button type="submit">بحث</Button>
      </form>

      {/* Loading State */}
      {isLoading && <p className="text-center py-4">جاري تحميل العملاء...</p>}

      {/* Error State */}
      {error && !isLoading && (
        <p className="text-center py-4 text-red-600">خطأ: {error}</p>
      )}

      {/* Data Table */}
      {!isLoading && !error && (
        <>
          <Table>
            <TableCaption className="py-4">قائمة العملاء المسجلين</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المعرف</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">رقم الهاتف</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                {/* Add Actions column later? */}
                {/* <TableHead className="text-right">إجراءات</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell className="font-medium truncate" style={{maxWidth: '100px'}}>{customer.customerId}</TableCell>
                    <TableCell>{customer.name ?? '-'}</TableCell>
                    <TableCell>{customer.phoneNumber ?? '-'}</TableCell>
                    <TableCell>{customer.address ?? '-'}</TableCell>
                    {/* Add actions cell later */}
                    {/* <TableCell className="text-right">...</TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {customersData && totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                السابق
              </Button>
              <span>
                صفحة {currentPage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                التالي
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 