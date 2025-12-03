"use client";

import { TUser } from "@/types";
import { verifyJWT } from "@/utils/verifyJWT";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "./admin/LoadingSpinner";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "super_admin";
  fallbackPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredRole = "admin",
  fallbackPath = "/dashboard/user",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        // Get token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        if (!token) {
          router.push("/login");
          return;
        }

        // Verify token
        const user = verifyJWT(token) as TUser;

        if (!user) {
          router.push("/login");
          return;
        }

        // Check if user has admin or super_admin role
        const isAdmin = user.role === "admin" || user.role === "super_admin";
        
        if (!isAdmin) {
          // Not an admin user at all
          router.push(fallbackPath);
          return;
        }

        // Check specific role requirement
        // If super_admin is required, only allow super_admin
        // If admin is required, allow both admin and super_admin
        if (requiredRole === "super_admin" && user.role !== "super_admin") {
          router.push("/dashboard/admin");
          return;
        }

        // If we reach here, user is authorized
        setIsAuthorized(true);
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [requiredRole, fallbackPath, router]);

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

export default AdminRoute;
