"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Ticket, TicketCheck, TicketX, Ban } from 'lucide-react'; // Icons for stats
import { getDashboardStats } from "@/lib/api/services/dashboard.service";
import type { DashboardStatsDto } from "@/lib/api/types/dashboard.types";

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If no token, redirect to login
      router.push('/login');
      return; // Stop execution
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : 'فشل جلب الإحصائيات');
        // Handle specific errors like 401 Unauthorized later if needed
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
           // Token might be invalid or expired, redirect to login
           localStorage.removeItem('authToken'); // Clear invalid token
           router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (isLoading) {
    return <p className="text-center py-10">جاري تحميل لوحة التحكم...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">خطأ: {error}</p>;
  }

  if (!stats) {
     // This case might happen if the component rendered before useEffect ran and redirected
     // Or if API returned unexpected null despite success (unlikely)
    return <p className="text-center py-10">لا توجد بيانات لعرضها.</p>; 
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 text-right">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Total Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers ?? 0}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>

        {/* Total Licenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التراخيص</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLicenses ?? 0}</div>
          </CardContent>
        </Card>

        {/* Assigned Licenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التراخيص المفعلة</CardTitle>
            <TicketCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedLicenses ?? 0}</div>
          </CardContent>
        </Card>

        {/* Unassigned Licenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التراخيص غير المفعلة</CardTitle>
            <TicketX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unassignedLicenses ?? 0}</div>
          </CardContent>
        </Card>

        {/* Revoked Licenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التراخيص الملغاة</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revokedLicenses ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
