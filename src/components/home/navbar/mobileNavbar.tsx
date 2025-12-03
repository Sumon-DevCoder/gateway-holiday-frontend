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
import { ChevronDown, Lock, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface MobileNavbarProps {
  isLoggedIn?: boolean;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  navigationLinks: Array<{
    label: string;
    href: string;
    hasDropdown?: boolean;
  }>;
  queryDropdownItems: Array<{
    label: string;
    href: string;
  }>;
}

export default function MobileNavbar({
  isLoggedIn = false,
  userType,
  isScrolled = false,
  navigationLinks,
  queryDropdownItems,
}: MobileNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQueryDropdownOpen, setIsQueryDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { handleLogout, isLoading } = useLogout();
  const { getLogo } = useCompanyInfo();
  const router = useRouter();
  const pathname = usePathname();

  const handleGoogleLogin = () => {
    const API_URL = process.env["NEXT_PUBLIC_API_URL"]!;
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsQueryDropdownOpen(false);
  };

  const toggleQueryDropdown = () => {
    setIsQueryDropdownOpen(!isQueryDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsQueryDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar Header */}

      <div
        className={`flex items-center justify-between text-white transition-all duration-300 ${
          isScrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
        }`}
      >
        <Link href="/" className="group p-3">
          <Image
            src={getLogo()}
            alt="Gateway Holidays Logo"
            width={300}
            height={300}
            className="h-10 w-auto object-contain transition-all duration-300 sm:h-12"
            priority
          />
        </Link>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white transition-colors hover:text-yellow-400"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Login Button for Mobile */}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="bg-primary flex items-center justify-between p-4 text-white">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-1 text-white transition-colors hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1">
              {navigationLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.hasDropdown && pathname?.startsWith(link.href));

                return (
                  <div key={link.label}>
                    {link.hasDropdown ? (
                      <>
                        {/* Dropdown Toggle */}
                        <button
                          onClick={toggleQueryDropdown}
                          className={`flex w-full items-center justify-between px-6 py-3 font-medium transition-colors hover:bg-gray-50 ${
                            isActive
                              ? "border-l-4 border-yellow-400 bg-yellow-50 text-blue-600"
                              : "text-gray-700 hover:text-blue-600"
                          }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isQueryDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Items */}
                        <div
                          className={`overflow-hidden bg-gray-50 transition-all duration-300 ${
                            isQueryDropdownOpen
                              ? "max-h-48 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {queryDropdownItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => {
                                closeMobileMenu();
                                // Navigate directly to the page without auth check
                                router.push(item.href);
                              }}
                              className="hover:text-primary block w-full border-l-2 border-transparent px-8 py-3 text-left text-sm text-gray-600 transition-colors hover:border-yellow-400 hover:bg-gray-100"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`block px-6 py-3 font-medium transition-colors hover:bg-gray-50 ${
                          isActive
                            ? "border-l-4 border-yellow-400 bg-yellow-50 text-blue-600"
                            : "border-l-2 border-transparent text-gray-700 hover:border-yellow-400 hover:text-blue-600"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href={
                    userType === "admin" || userType === "super_admin"
                      ? "/dashboard/admin"
                      : "/dashboard"
                  }
                  onClick={closeMobileMenu}
                >
                  <Button className="mb-3 w-full bg-blue-600 text-white hover:bg-blue-300">
                    {userType === "admin" || userType === "super_admin"
                      ? "Admin Panel"
                      : "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary w-full hover:text-white"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  closeMobileMenu();
                  setIsLoginModalOpen(true);
                }}
                className="w-full bg-yellow-400 text-white hover:bg-yellow-500"
              >
                <Lock className="mr-2 h-4 w-4" />
                Customer Login
              </Button>
            )}
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
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
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
