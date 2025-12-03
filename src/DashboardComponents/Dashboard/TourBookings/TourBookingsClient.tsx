"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllBookingsQuery,
  useGetBookingStatsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/redux/api/features/booking/bookingApi";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import TourBookingsTable from "./TourBookingsTable";

export default function TourBookingsClient(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  // API Calls
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useGetAllBookingsQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(paymentStatusFilter !== "all" && {
      paymentStatus: paymentStatusFilter,
    }),
    ...(bookingStatusFilter !== "all" && {
      bookingStatus: bookingStatusFilter,
    }),
  });

  const { data: statsData } = useGetBookingStatsQuery();

  const [updateBookingStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] =
    useDeleteBookingMutation();

  const bookings = bookingsData?.data || [];
  const pagination = bookingsData?.pagination || { pages: 1 };
  const stats = statsData?.data || {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  };

  const totalPages = pagination.pages || 1;

  // Handlers
  const handleStatusUpdate = async (id: string, bookingStatus: string) => {
    try {
      await updateBookingStatus({
        id,
        bookingStatus: bookingStatus as any,
      }).unwrap();
      toast.success(`Booking status updated to ${bookingStatus}!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id).unwrap();
      toast.success("Booking deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete booking");
    }
  };

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentStatusFilter, bookingStatusFilter]);

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">
          Error loading tour bookings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 shadow">
          <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingBookings}
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 shadow">
          <h3 className="text-sm font-medium text-green-700">Confirmed</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.confirmedBookings}
          </p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 shadow">
          <h3 className="text-sm font-medium text-red-700">Cancelled</h3>
          <p className="text-2xl font-bold text-red-600">
            {stats.cancelledBookings}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 shadow">
          <h3 className="text-sm font-medium text-blue-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">
            ৳{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, or tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={paymentStatusFilter}
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={bookingStatusFilter}
            onValueChange={setBookingStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Booking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <TourBookingsTable
        bookings={bookings}
        isLoading={isLoading || isUpdating || isDeleting}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}
