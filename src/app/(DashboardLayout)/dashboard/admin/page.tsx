"use client";

import DashboardCharts from "@/components/admin/DashboardCharts";
import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import { useGetDashboardStatsQuery } from "@/redux/api/features/dashboard/dashboardApi";
import {
  Calendar,
  Camera,
  ClipboardList,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Shield,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // Fetch real-time dashboard statistics from API
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery();

  const stats = statsResponse?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load dashboard statistics</p>
          <p className="mt-2 text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your travel booking business performance"
        />

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Link
            href="/dashboard/admin/tours"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Total Tours"
              value={stats?.tours.total.toLocaleString() || "0"}
              icon={MapPin}
              trend="up"
              trendValue={stats?.tours.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/custom-tour-queries"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Custom Tour Queries"
              value={stats?.customTourQueries.total.toLocaleString() || "0"}
              icon={ClipboardList}
              trend="up"
              trendValue={stats?.customTourQueries.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/tour-bookings"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Tour Bookings"
              value={stats?.bookings?.total.toLocaleString() || "0"}
              icon={Calendar}
              trend="up"
              trendValue={stats?.bookings?.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/gallery"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Gallery Images"
              value={stats?.gallery.total.toLocaleString() || "0"}
              icon={Camera}
              trend="up"
              trendValue={stats?.gallery.recent || 0}
            />
          </Link>
        </div>

        {/* Secondary Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Link
            href="/dashboard/admin/users"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Total Users"
              value={stats?.users.total.toLocaleString() || "0"}
              icon={Users}
              trend="up"
              trendValue={stats?.users.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/queries"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Total Queries"
              value={stats?.queries.total.toLocaleString() || "0"}
              icon={ClipboardList}
              trend="up"
              trendValue={stats?.queries.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/reviews"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Total Reviews"
              value={stats?.reviews.total.toLocaleString() || "0"}
              icon={Star}
              trend="up"
              trendValue={stats?.reviews.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/blogs"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Total Blogs"
              value={stats?.blogs.total.toLocaleString() || "0"}
              icon={FileText}
              trend="up"
              trendValue={stats?.blogs.recent || 0}
            />
          </Link>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Link
            href="/dashboard/admin/team"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Team Members"
              value={stats?.team.total.toLocaleString() || "0"}
              icon={UserCheck}
              trend="up"
              trendValue={stats?.team.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/contacts"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Contact Messages"
              value={stats?.contacts.total.toLocaleString() || "0"}
              icon={Mail}
              trend="up"
              trendValue={stats?.contacts.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/visa"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Visa Info"
              value={stats?.visas.total.toLocaleString() || "0"}
              icon={Shield}
              trend="up"
              trendValue={stats?.visas.recent || 0}
            />
          </Link>
          <Link
            href="/dashboard/admin/faqs"
            className="transition-transform hover:scale-105"
          >
            <StatsCard
              title="Active FAQs"
              value={stats?.faqs.active.toLocaleString() || "0"}
              icon={FileText}
              trend="up"
              trendValue={stats?.faqs.total || 0}
            />
          </Link>
        </div>

        {/* Charts Section */}
        <div className="w-full">
          <DashboardCharts />
        </div>
      </div>
    </>
  );
}
