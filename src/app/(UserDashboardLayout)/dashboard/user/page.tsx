"use client";

import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMyBookingsQuery } from "@/redux/api/features/booking/bookingApi";
import { useGetMyQueriesQuery } from "@/redux/api/features/queries/queriesApi";
import { useGetMyVisaBookingsQuery } from "@/redux/api/features/visaBooking/visaBookingApi";
import { useCurrentUser } from "@/redux/authSlice";
import {
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Package,
  Plane,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const authUser = useSelector(useCurrentUser);

  // Fetch data from different APIs
  const {
    data: bookingsResponse,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useGetMyBookingsQuery();

  const {
    data: queriesResponse,
    isLoading: queriesLoading,
    error: queriesError,
  } = useGetMyQueriesQuery();

  const {
    data: visaQueriesResponse,
    isLoading: visaQueriesLoading,
    error: visaQueriesError,
  } = useGetMyVisaBookingsQuery();

  // Calculate statistics from fetched data
  const stats = useMemo(() => {
    const bookings = bookingsResponse?.data || [];
    const queries = queriesResponse?.data || [];
    const visaQueries = visaQueriesResponse?.data || [];

    const calculatedStats = {
      bookings: {
        total: bookings.length,
        pending: bookings.filter((b: any) => b.bookingStatus === "pending")
          .length,
        confirmed: bookings.filter((b: any) => b.bookingStatus === "confirmed")
          .length,
        completed: bookings.filter((b: any) => b.bookingStatus === "completed")
          .length,
      },
      queries: {
        total: queries.length,
        pending: queries.filter((q: any) => q.status === "pending").length,
      },
      visaQueries: {
        total: visaQueries.length,
        pending: visaQueries.filter((q: any) => q.status === "pending").length,
      },
      recentBookings: bookings.slice(0, 5),
      recentQueries: queries.slice(0, 5),
    };

    return calculatedStats;
  }, [bookingsResponse, queriesResponse, visaQueriesResponse]);

  const isLoading = bookingsLoading || queriesLoading || visaQueriesLoading;
  const error = bookingsError || queriesError || visaQueriesError;

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${authUser?.name || "User"}! Here's your account overview.`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={stats.bookings.total.toLocaleString()}
          icon={Package}
          trend="up"
          trendValue={stats.bookings.total}
        />
        <StatsCard
          title="Pending Visa Queries"
          value={stats.visaQueries.pending.toLocaleString()}
          icon={FileText}
          trend="up"
          trendValue={stats.visaQueries.pending}
        />
        <StatsCard
          title="Confirmed Bookings"
          value={stats.bookings.confirmed.toLocaleString()}
          icon={Plane}
          trend="up"
          trendValue={stats.bookings.confirmed}
        />
        <StatsCard
          title="Total Queries"
          value={stats.queries.total.toLocaleString()}
          icon={MessageSquare}
          trend="up"
          trendValue={stats.queries.total}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/user/profile">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <User className="h-6 w-6" />
                <span>Profile</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/visa">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Visa Info</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/tour">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <Package className="h-6 w-6" />
                <span>Bookings</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/queries">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Queries</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/contact">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <Mail className="h-6 w-6" />
                <span>Contacts</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Your latest tour and package bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.tourTitle}</p>
                        <p className="text-sm text-gray-600">
                          {booking.destination}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.bookingStatus)}>
                        {booking.bookingStatus}
                      </Badge>
                      <p className="mt-1 text-sm font-medium">
                        ৳{booking.bookingFee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No bookings yet
                </p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/user/tour">
                <Button variant="outline" className="w-full">
                  View All Tour Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>Your latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentQueries.length > 0 ? (
                stats.recentQueries.map((query) => (
                  <div
                    key={query._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {query.formType === "hajj_umrah"
                            ? "Hajj & Umrah Query"
                            : "Package Tour Query"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(query.startingDate).toLocaleDateString()} -{" "}
                          {new Date(query.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">No queries yet</p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/user/queries">
                <Button variant="outline" className="w-full">
                  View All Queries
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
