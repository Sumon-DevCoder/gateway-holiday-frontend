"use client";

import { TUser } from "@/types";
import { verifyJWT } from "@/utils/verifyJWT";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "./admin/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        if (!token) {
          router.push(redirectTo);
          return;
        }

        // Verify token
        const user = verifyJWT(token) as TUser;

        if (!user) {
          router.push(redirectTo);
          return;
        }

        // Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on role
          const dashboardPath = `/dashboard/${user.role}`;
          router.push(dashboardPath);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
