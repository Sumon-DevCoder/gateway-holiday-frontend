"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useLogout } from "@/hooks/useLogout";
import { CompanyData } from "@/types/company";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  PhoneCall,
  Twitter,
  UserPlus,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TopNavbarProps {
  isLoggedIn?: boolean;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  companyData?: CompanyData;
}

export default function TopNavbar({
  isLoggedIn = false,
  userType,
  isScrolled = false,
  companyData: _companyData, // Keep for backward compatibility but use hook internally
}: TopNavbarProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { handleLogout, isLoading } = useLogout();
  // Get company info using custom hook
  const { getOpeningHours, getPrimaryPhone, getSocialLinks } = useCompanyInfo();

  const socialLinksData = getSocialLinks();
  const socialLinks = [
    {
      icon: Facebook,
      href: socialLinksData?.facebook || "#",
      color: "hover:text-blue-400",
      isActive: !!socialLinksData?.facebook,
    },
    {
      icon: Twitter,
      href: socialLinksData?.twitter || "#",
      color: "hover:text-sky-300",
      isActive: !!socialLinksData?.twitter,
    },
    {
      icon: Linkedin,
      href: socialLinksData?.linkedin || "#",
      color: "hover:text-blue-500",
      isActive: !!socialLinksData?.linkedin,
    },
    {
      icon: Youtube,
      href: socialLinksData?.youtube || "#",
      color: "hover:text-red-400",
      isActive: !!socialLinksData?.youtube,
    },
    {
      icon: Instagram,
      href: socialLinksData?.instagram || "#",
      color: "hover:text-pink-400",
      isActive: !!socialLinksData?.instagram,
    },
  ];

  const handleGoogleLogin = () => {
    const API_URL = process.env["NEXT_PUBLIC_API_URL"]!;
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGoogleRegister = () => {
    const API_URL = process.env["NEXT_PUBLIC_API_URL"]!;
    // Redirect to Google OAuth endpoint for registration
    window.location.href = `${API_URL}/auth/google`;
  };

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as HTMLElement;
  //     if (!target.closest(".dropdown-container")) {
  //       setIsQueryDropdownOpen(false);
  //       onDropdownToggle?.(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [onDropdownToggle]);

  return (
    <>
      <div
        className={`py-2 text-white transition-all duration-300 md:py-2.5 ${
          isScrolled ? "bg-slate-800/90 backdrop-blur-sm" : "bg-slate-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex w-full items-center justify-between gap-2 md:gap-4">
            {/* Left side - Social Media Icons (Hidden on mobile) */}
            <div className="hidden items-center gap-2 md:flex">
              {socialLinks
                .filter((social) => social.isActive)
                .map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-slate-300 transition-all hover:bg-slate-700 hover:text-white ${social.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
            </div>

            {/* Center - Contact Info (Left on mobile, Center on desktop) */}
            <div className="flex items-center gap-3 text-xs md:flex-1 md:justify-center md:gap-4 md:text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-400 md:h-4 md:w-4" />
                <span className="hidden md:inline">Opening Hours:</span>
                <span className="whitespace-nowrap">{getOpeningHours()}</span>
              </div>
              {/* Phone number - Hidden on mobile, visible on desktop */}
              <div className="hidden items-center gap-1.5 md:flex">
                <PhoneCall className="h-4 w-4 shrink-0 text-yellow-400" />
                <span className="whitespace-nowrap">{getPrimaryPhone()}</span>
              </div>
            </div>

            {/* Right side - Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href={
                      userType === "admin" || userType === "super_admin"
                        ? "/dashboard/admin"
                        : "/dashboard"
                    }
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 bg-blue-600 px-2.5 text-xs text-white hover:bg-blue-700 md:h-8 md:px-3 md:text-sm"
                    >
                      <span className="hidden sm:inline">
                        {userType === "admin" || userType === "super_admin"
                          ? "Admin Panel"
                          : "Dashboard"}
                      </span>
                      <span className="sm:hidden">
                        {userType === "admin" || userType === "super_admin"
                          ? "Admin"
                          : "Dashboard"}
                      </span>
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    className="h-7 border-white px-2.5 text-xs text-white hover:bg-white hover:text-blue-600 md:h-8 md:px-3 md:text-sm"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="h-7 border-white bg-transparent px-2.5 text-xs text-white transition-all duration-300 hover:bg-white hover:text-blue-600 md:h-8 md:px-3 md:text-sm"
                  >
                    <Lock className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="h-7 border-white bg-transparent px-2.5 text-xs text-white transition-all duration-300 hover:bg-white hover:text-blue-600 md:h-8 md:px-3 md:text-sm"
                  >
                    <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="mx-auto w-[90%] max-w-sm sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
              Welcome Back
            </DialogTitle>
            <p className="text-center text-sm text-gray-600">
              Sign in to access your account
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={handleGoogleLogin}
              className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-800 shadow-md transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:ring-2 focus:ring-blue-100 focus:outline-none sm:max-w-sm sm:gap-3 sm:px-6 sm:py-5 sm:text-base"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </Button>
            <p className="px-4 text-center text-xs leading-relaxed text-gray-500">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-blue-600 hover:text-blue-700">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-blue-600 hover:text-blue-700">
                Privacy Policy
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="mx-auto w-[90%] max-w-sm sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
              Create Account
            </DialogTitle>
            <p className="text-center text-sm text-gray-600">
              Sign up to get started with your account
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={handleGoogleRegister}
              className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-800 shadow-md transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg focus:ring-2 focus:ring-blue-100 focus:outline-none sm:max-w-sm sm:gap-3 sm:px-6 sm:py-5 sm:text-base"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </Button>
            <p className="px-4 text-center text-xs leading-relaxed text-gray-500">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-blue-600 hover:text-blue-700">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-blue-600 hover:text-blue-700">
                Privacy Policy
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
