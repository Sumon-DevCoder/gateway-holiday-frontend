"use client";

import { useLogout } from "@/hooks/useLogout";
import {
  Building2,
  Calendar,
  Camera,
  ClipboardList,
  Crown,
  FileCheck,
  FileText,
  FolderKanban,
  Globe,
  HelpCircle,
  ImageIcon,
  Images,
  LayoutDashboard,
  Mail,
  MailOpen,
  MessageSquare,
  Plane,
  PlaneIcon,
  Settings,
  Shield,
  Stamp,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import ReusableSidebar from "./ReusableSidebar";

const adminSidebarSections = [
  // Overview Section
  {
    section: "Overview",
    sectionIcon: <LayoutDashboard className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  // User & Team Management
  {
    section: "User Management",
    sectionIcon: <Users className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/users",
        label: "Users",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  },
  // Tour Management
  {
    section: "Tour Management",
    sectionIcon: <Plane className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/countries",
        label: "Countries",
        icon: <Globe className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/tour-categories",
        label: "Tour Categories",
        icon: <FolderKanban className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/tours",
        label: "Tours",
        icon: <PlaneIcon className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/custom-tour-queries",
        label: "Custom Tour Queries",
        icon: <FolderKanban className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/tour-bookings",
        label: "Tour Bookings",
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  // Visa Management
  {
    section: "Visa Management",
    sectionIcon: <Shield className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/countries",
        label: "Countries",
        icon: <Globe className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/visa-types",
        label: "Visa Types",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/visa",
        label: "Visa Info",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/visa-booking-queries",
        label: "Visa Bookings",
        icon: <Stamp className="h-5 w-5" />,
      },
    ],
  },
  // Customer Interactions
  {
    section: "Customer Interactions",
    sectionIcon: <MessageSquare className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/queries",
        label: "Queries",
        icon: <ClipboardList className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/contacts",
        label: "Contacts",
        icon: <Mail className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/newsletter",
        label: "Newsletter",
        icon: <MailOpen className="h-5 w-5" />,
      },
    ],
  },
  // company
  {
    section: "Company Overview",
    sectionIcon: <Building2 className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/company",
        label: "Company Info",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/company-images",
        label: "Company Authirity",
        icon: <Images className="h-5 w-5" />,
      },

      {
        href: "/dashboard/admin/authorization",
        label: "Authorization",
        icon: <FileCheck className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/faqs",
        label: "FAQs",
        icon: <HelpCircle className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/policies",
        label: "Policy Pages",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  // Content
  {
    section: "Content Management",
    sectionIcon: <Building2 className="h-4 w-4" />,
    items: [
      {
        href: "/dashboard/admin/blogs",
        label: "Blogs",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/gallery",
        label: "Gallery",
        icon: <Camera className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/banners",
        label: "Banners",
        icon: <ImageIcon className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/team",
        label: "Team",
        icon: <UserCheck className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/reviews",
        label: "Reviews",
        icon: <Star className="h-5 w-5" />,
      },
      {
        href: "/dashboard/admin/leadership",
        label: "Leadership",
        icon: <Crown className="h-5 w-5" />,
      },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { handleLogout, isLoading } = useLogout();

  return (
    <div className="bg-background min-h-screen">
      <ReusableSidebar
        title="GHL Admin Panel"
        sections={adminSidebarSections}
        basePath="/dashboard/admin"
        variant="admin"
        showLogout={true}
        onLogout={handleLogout}
        isLoggingOut={isLoading}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Page Content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
