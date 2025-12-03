"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useLogout } from "@/hooks/useLogout";
import {
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  User,
} from "lucide-react";
import { ReactNode } from "react";
import ReusableSidebar from "./ReusableSidebar";

const userSidebarItems = [
  {
    href: "/",
    label: "Home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user/profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user/visa",
    label: "Visa Booking Info",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user/tour",
    label: "Tour Booking Info",
    icon: <Package className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user/queries",
    label: "Queries",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    href: "/dashboard/user/contact",
    label: "Contacts",
    icon: <Mail className="h-5 w-5" />,
  },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  const { handleLogout, isLoading } = useLogout();

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-gray-50">
        <ReusableSidebar
          title="User Dashboard"
          items={userSidebarItems}
          basePath="/dashboard/user"
          variant="user"
          showLogout={true}
          onLogout={handleLogout}
          isLoggingOut={isLoading}
        />
        <div className="lg:pl-64">
          <main className="flex-1">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
