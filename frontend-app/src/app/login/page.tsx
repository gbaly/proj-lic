"use client"; // Required for useState, useEffect, event handlers

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/api/services/auth.service'; // Adjust path if needed
import type { SignInRequest } from '@/lib/api/types/auth.types';

export default function LoginPage() {
  // Set default values for username and password for development
  const [username, setUsername] = useState('admin'); // Default username
  const [password, setPassword] = useState('password'); // Default password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const credentials: SignInRequest = { username, password };

    try {
      const response = await signIn(credentials);
      console.log('Login Response (data object):', response);

      // --- Updated Token Handling --- 
      // Get token from accessToken property
      const token = response?.accessToken; 

      if (token && typeof token === 'string') { // Check if token exists and is a string
        console.log("Login successful, token found:", token);
        // Store the token in localStorage
        localStorage.setItem('authToken', token); 

        // Set auth state in sidebar (might need a better global state solution later)
        // This won't automatically update the sidebar in this render, but on next load/navigation

        // Redirect to a protected page (e.g., dashboard or home)
        router.push('/'); // Redirect to home page
      } else {
         console.warn("Login successful, but accessToken not found or invalid in response data.", response);
         setError("تم تسجيل الدخول بنجاح، لكن لم يتم العثور على التوكن."); // Updated error message
      }
      // --- End Updated Token Handling ---

    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? `فشل تسجيل الدخول: ${err.message}` : 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 flex-grow">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-right">تسجيل الدخول</CardTitle>
          <CardDescription className="text-right">
            أدخل اسم المستخدم وكلمة المرور للوصول إلى حسابك.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-right">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="اسم المستخدم الخاص بك"
                required
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                disabled={isLoading}
                dir="ltr"
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password" className="text-right">كلمة المرور</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={isLoading}
                dir="ltr"
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-1.5 text-gray-500 hover:text-gray-700"
                style={{marginTop: '0.625rem'}}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive text-right">{error}</p>
            )}
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 