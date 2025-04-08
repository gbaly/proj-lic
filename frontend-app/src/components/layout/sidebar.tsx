"use client"; // Needed for using next/link and potentially hooks later

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { cn } from "@/lib/utils"; // Utility for conditional classes
import { Button } from "@/components/ui/button"; // Import Button for logout
// Import icons (example)
import { Home, Users, LogIn, LogOut } from 'lucide-react';
import { signOut } from '@/lib/api/services/auth.service'; // Import signOut service

// Base navigation items (always visible or managed separately)
const baseNavItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/customers', label: 'العملاء', icon: Users },
  // Add other links as needed (Products, Licenses, etc.)
  // Example:
  // { href: '/products', label: 'المنتجات', icon: Package }, 
  // { href: '/licenses', label: 'التراخيص', icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // --- Temporary Auth State --- 
  // Replace this with actual auth state management later (e.g., context, Zustand, Redux)
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Simulate checking auth status on component mount (replace with real check)
  useEffect(() => {
    // TODO: Replace this with checking localStorage or auth context
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (storedToken) {
      setIsAuthenticated(true);
      setAuthToken(storedToken);
    } else {
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  }, []);
  // --- End Temporary Auth State ---

  const handleLogout = async () => {
    console.log("Logging out...");
    // TODO: Enhance this logic
    if (authToken) {
        try {
            // Call API sign out (optional but recommended)
            await signOut(authToken);
        } catch (error) {
            console.error("Ignoring API sign out error during logout", error);
        }
    }
    // Clear local state and storage
    setIsAuthenticated(false);
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken'); 
    }
    // Redirect to login page
    router.push('/login');
  };

  // Combine base items with conditional login/logout item
  const navItems = [
    ...baseNavItems,
    ...(isAuthenticated
      ? [] // Don't show login when authenticated
      : [{ href: '/login', label: 'تسجيل الدخول', icon: LogIn }])
  ];

  return (
    <aside className="w-64 h-screen bg-card text-card-foreground border-l border-border p-4 flex flex-col fixed right-0 top-0 shadow-lg z-10">
      {/* Optional: Add a logo or title here */}
      <div className="mb-6 text-center">
        <Link href="/">
          <h2 className="text-2xl font-semibold text-primary">لوحة التحكم</h2>
        </Link>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href}>
                <span // Changed from <a> to <span> to avoid nesting <a>
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 ml-2" /> {/* ml-2 for RTL spacing */}
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
          {/* Conditional Logout Button */}
          {isAuthenticated && (
            <li className="mb-2">
              <Button
                variant="ghost" // Use ghost variant for less emphasis
                onClick={handleLogout}
                className="w-full flex items-center justify-start p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-right"
              >
                <LogOut className="mr-3 h-5 w-5 ml-2" /> 
                تسجيل الخروج
              </Button>
            </li>
          )}
        </ul>
      </nav>

      {/* Optional: Add user info or logout button at the bottom */}
      {/* <div className="mt-auto"> User Info / Logout </div> */}
    </aside>
  );
} 