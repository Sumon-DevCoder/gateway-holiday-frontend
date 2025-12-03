"use client";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileNavbar from "./mobileNavbar";

interface MainNavbarProps {
  isLoggedIn?: boolean;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  onDropdownToggle?: (isOpen: boolean) => void;
}

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Query", href: "/query", hasDropdown: true },
  { label: "Package", href: "/package" },
  { label: "Visa", href: "/visa" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Authorization", href: "/authorization" },
  { label: "News & Update", href: "/blog" },
];

const queryDropdownItems = [
  { label: "Umrah", href: "/query/umrah" },
  { label: "Package Tour", href: "/query/package-tour" },
];

export default function MainNavbar({
  isLoggedIn = false,
  userType,
  isScrolled = false,
  onDropdownToggle,
}: MainNavbarProps) {
  const [isQueryDropdownOpen, setIsQueryDropdownOpen] = useState(false);
  const { getLogo } = useCompanyInfo();
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsQueryDropdownOpen(false);
        onDropdownToggle?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDropdownToggle]);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden text-white transition-all duration-300 lg:block ${
          isScrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Logo Left */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={getLogo()}
                alt="Gateway Holidays Logo"
                width={500}
                height={500}
                className="h-10 w-auto object-contain transition-all duration-300 sm:h-12 md:h-14"
                priority
              />
            </Link>

            {/* Navigation Links Right */}
            <nav className="flex items-center space-x-8">
              {navigationLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.hasDropdown && pathname?.startsWith(link.href));
                
                return (
                  <div key={link.label} className="dropdown-container relative">
                    {link.hasDropdown ? (
                      <div
                        className="relative"
                        onMouseEnter={() => {
                          if (link.label === "Query")
                            setIsQueryDropdownOpen(true);
                        }}
                        onMouseLeave={() => {
                          if (link.label === "Query")
                            setIsQueryDropdownOpen(false);
                        }}
                      >
                        <button
                          className={`flex cursor-pointer items-center text-sm font-medium tracking-wide uppercase transition-colors ${
                            isActive
                              ? "text-yellow-400"
                              : isScrolled
                                ? "text-white hover:text-yellow-400"
                                : "text-white drop-shadow-lg hover:text-yellow-400"
                          }`}
                        >
                          {link.label}
                        <svg
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            isQueryDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute top-full left-0 mt-2 w-48 rounded-lg border bg-white shadow-xl transition-all duration-300 ${
                          link.label === "Query" && isQueryDropdownOpen
                            ? "visible translate-y-0 opacity-100"
                            : "invisible -translate-y-2 opacity-0"
                        }`}
                        style={{ zIndex: 50 }}
                      >
                        <div className="py-2">
                          {queryDropdownItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => {
                                setIsQueryDropdownOpen(false);
                                onDropdownToggle?.(false);
                                router.push(item.href);
                              }}
                              className="block w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg hover:bg-yellow-400 hover:text-white"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                        isActive
                          ? "text-yellow-400"
                          : isScrolled
                            ? "text-white hover:text-yellow-400"
                            : "text-white drop-shadow-lg hover:text-yellow-400"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navbar */}
      <div className="lg:hidden">
        <MobileNavbar
          isLoggedIn={isLoggedIn}
          userType={userType || "user"}
          isScrolled={isScrolled}
          navigationLinks={navigationLinks}
          queryDropdownItems={queryDropdownItems}
        />
      </div>

      {/* Login Modal */}
      {/* <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
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
      </Dialog> */}
    </>
  );
}
