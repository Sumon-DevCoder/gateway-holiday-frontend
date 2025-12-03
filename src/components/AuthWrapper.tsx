"use client";

import { Navbar } from "@/components/home";
import Footer from "@/components/shared/Footer";
import { useAppSelector } from "@/redux/store";
import { usePathname } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  // Get authentication state from Redux
  const { user, token } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!(user && token);
  const userType = user?.role || "user";

  return (
    <div className="bg-background min-h-screen">
      {/* Only show Navbar on non-admin routes */}
      {!isAdminRoute && <Navbar isLoggedIn={isLoggedIn} userType={userType} />}

      {children}

      {/* Only show Footer on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
