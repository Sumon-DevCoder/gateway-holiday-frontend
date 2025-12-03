"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { useLoginMutation } from "@/redux/api/features/user/userApi";
import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  // Debug: Log redirect parameter
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      if (response.success) {
        toast.success("Login successful, redirecting...");
        dispatch(setUser({ user: response.user, token: response.token }));

        // If redirect parameter exists, go to that page
        if (redirect) {
          router.push(redirect);
        } else {
          // Otherwise, use role-based default redirect
          if (
            response.user.role === "admin" ||
            response.user.role === "super_admin"
          ) {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/user");
          }
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      {/* Flowing Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-bl from-green-300/30 to-emerald-400/40 blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-teal-400/25 to-green-500/35 blur-2xl"></div>
        <div className="absolute right-1/4 -bottom-32 h-72 w-72 rounded-full bg-gradient-to-tl from-lime-300/20 to-teal-300/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-3xl lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full space-y-6 p-8 sm:space-y-8 sm:p-10 md:p-12 lg:w-1/2">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-800">LOGIN</h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Access your account and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div className="relative">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-100/70 py-3 pr-5 pl-12 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none sm:text-lg"
                placeholder="Email or username"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-100/70 py-3 pr-12 pl-12 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none sm:text-lg"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl focus:ring-4 focus:ring-green-200 focus:outline-none"
            >
              {isLoading ? "Loading..." : "Login Now"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm font-medium text-gray-600 sm:text-base">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => {
              // Store redirect path in localStorage before Google OAuth
              if (redirect) {
                localStorage.setItem("auth_redirect", redirect);
              }
              const backendUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
              window.location.href = `${backendUrl}/api/v1/auth/google`;
            }}
            className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-gray-200 focus:outline-none sm:text-lg"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Login with Google
          </button>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-600">
              Do not have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image & Branding */}
        <div className="relative hidden w-full bg-gradient-to-br from-green-400 to-emerald-600 lg:flex lg:w-1/2">
          <div className="absolute inset-0 opacity-90">
            <Image
              src="/pages/login.jpg"
              alt="Mymensingh Traveler"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 ml-10 flex flex-col items-center justify-start p-12 pt-16 text-center text-black">
            <h2 className="mb-4 text-4xl font-bold">Mymensingh Traveler</h2>
            <p className="mb-6 text-lg opacity-90">
              Explore the beauty of Bangladesh
            </p>
            <p className="max-w-xs text-sm opacity-80">
              Join thousands of travelers exploring the cultural heritage,
              rivers, and green beauty of Mymensingh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
