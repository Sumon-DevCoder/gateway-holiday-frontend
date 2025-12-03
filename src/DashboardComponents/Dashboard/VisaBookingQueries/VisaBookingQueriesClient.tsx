"use client";

import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteVisaBookingMutation,
  useGetVisaBookingsQuery,
  useGetVisaBookingStatsQuery,
  useUpdateVisaBookingStatusMutation,
} from "@/redux/api/features/visaBooking/visaBookingApi";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import VisaBookingQueriesTable from "./VisaBookingQueriesTable";

export default function VisaBookingQueriesClient(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [queryToDelete, setQueryToDelete] = useState<string | null>(null);

  // API Calls
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useGetVisaBookingsQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { booking_type: typeFilter }),
  });

  const { data: statsData } = useGetVisaBookingStatsQuery();

  const [deleteBooking, { isLoading: isDeleting }] =
    useDeleteVisaBookingMutation();
  const [updateBookingStatus, { isLoading: isUpdating }] =
    useUpdateVisaBookingStatusMutation();

  const bookings = bookingsData?.data || [];
  const pagination = bookingsData?.pagination || { pages: 1 };
  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    contacted: 0,
    closed: 0,
  };

  const totalPages = pagination.pages || 1;

  // Handlers
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateBookingStatus({
        id,
        data: { status: status as any },
      }).unwrap();
      toast.success(`Booking status updated to ${status}!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = (id: string) => {
    setQueryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!queryToDelete) {
      return;
    }

    try {
      await deleteBooking(queryToDelete).unwrap();
      toast.success("Booking deleted successfully!");
      setDeleteConfirmOpen(false);
      setQueryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete booking");
    }
  };

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">
          Error loading visa bookings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Queries</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 shadow">
          <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 shadow">
          <h3 className="text-sm font-medium text-blue-700">Contacted</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 shadow">
          <h3 className="text-sm font-medium text-green-700">Closed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, country, or visa type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="query">Query</SelectItem>
              <SelectItem value="application">Application</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <VisaBookingQueriesTable
        queries={bookings}
        isLoading={isLoading || isDeleting || isUpdating}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Booking"
        description="Are you sure you want to delete this visa booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
