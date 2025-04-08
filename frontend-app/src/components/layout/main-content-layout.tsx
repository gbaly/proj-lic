"use client"; // This component needs hooks

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function MainContentLayout({ 
  children 
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex flex-grow">
      {/* Conditionally render Sidebar */}
      {!isLoginPage && <Sidebar />}
      {/* Main content area */}
      <main className={cn(
        "flex flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto",
        !isLoginPage && "mr-64" // Apply margin only if sidebar is present
      )}>
        {children}
      </main>
    </div>
  );
} 