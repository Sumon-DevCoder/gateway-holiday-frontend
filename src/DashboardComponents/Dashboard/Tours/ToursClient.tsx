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
  ITour,
  useDeleteTourMutation,
  useGetToursQuery,
  useReorderToursMutation,
  useUpdateTourMutation,
} from "@/redux/api/features/tour/tourApi";
// import { TQueryParam } from "@/types"; // Unused
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import TourDetailDialog from "./TourDetailDialog";
import ToursDataTable from "./ToursDataTable";

export default function ToursClient(): React.ReactElement {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTour, setSelectedTour] = useState<ITour | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [toursOrder, setToursOrder] = useState<ITour[]>([]);

  // ✅ API Query Parameters (unused - kept for reference)
  // const queryParams: TQueryParam[] = [
  //   { name: "page", value: currentPage.toString() },
  //   { name: "limit", value: "10" },
  //   ...(searchTerm ? [{ name: "search", value: searchTerm }] : []),
  //   ...(statusFilter && statusFilter !== "all"
  //     ? [{ name: "status", value: statusFilter }]
  //     : []),
  // ];

  // ✅ API Calls
  // Fetch more tours when no filters/search to enable reordering across all tours
  const limit = searchTerm || statusFilter !== "all" ? 10 : 1000;

  const {
    data: toursData,
    isLoading,
    error,
    refetch: refetchTours,
  } = useGetToursQuery({
    page: currentPage,
    limit,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter !== "all" && { status: statusFilter }),
  });

  const [deleteTour, { isLoading: isDeleting }] = useDeleteTourMutation();
  const [updateTour] = useUpdateTourMutation();
  const [reorderTours, { isLoading: isReordering }] = useReorderToursMutation();

  // ✅ Extract data from API response
  const tours = Array.isArray(toursData?.data) ? toursData.data : [];
  const pagination = toursData?.pagination || {};

  // ✅ Pagination
  const totalPages = (pagination as any)?.totalPage || 1;

  // ✅ Sort tours by order
  useEffect(() => {
    if (tours.length > 0) {
      const sortedTours = [...tours].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return (a.title || "").localeCompare(b.title || "");
        }
        return orderA - orderB;
      });
      setToursOrder(sortedTours);
    } else {
      setToursOrder([]);
    }
  }, [tours]);

  const isReorderDisabled =
    searchTerm.trim().length > 0 || statusFilter !== "all";

  // ✅ Handlers
  const handleView = (tour: ITour) => {
    setSelectedTour(tour);
  };

  const handleEdit = (tour: ITour) => {
    router.push(`/dashboard/admin/tours/edit-tour/${tour._id}`);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      await updateTour({ id, data: formData }).unwrap();
      toast.success(`Tour ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update tour status");
    }
  };

  const handleDelete = (id: string) => {
    setTourToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      await deleteTour(tourToDelete).unwrap();
      toast.success("Tour deleted successfully!");
      setDeleteConfirmOpen(false);
      setTourToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tour");
    }
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    if (isReorderDisabled) {
      toast.error("Reordering is disabled while filters or search are active.");
      return;
    }

    const previousOrder = toursOrder;
    const updatedOrder = [...toursOrder];
    const [movedTour] = updatedOrder.splice(startIndex, 1);

    if (!movedTour) {
      return;
    }

    updatedOrder.splice(endIndex, 0, movedTour);
    setToursOrder(updatedOrder);

    try {
      const tourIds = updatedOrder
        .map((tour) => tour._id)
        .filter((id): id is string => Boolean(id));

      if (tourIds.length !== updatedOrder.length) {
        throw new Error("Some tours are missing identifiers.");
      }

      await reorderTours({ tourIds }).unwrap();
      toast.success("Tour order updated successfully");
      refetchTours();
    } catch (error: any) {
      setToursOrder([...previousOrder]);
      toast.error(
        error?.data?.message || "Failed to update tour order. Please try again."
      );
    }
  };

  // Removed category update function - category is now managed via edit form

  // ✅ Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ✅ Error handling
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading tours. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Tours</h3>
          <p className="text-2xl font-bold">
            {(pagination as any)?.total || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Published</h3>
          <p className="text-2xl font-bold">
            {tours.filter((tour) => tour.status === "PUBLISHED").length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="text-2xl font-bold">
            {tours.filter((tour) => tour.status === "DRAFT").length}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search tours by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tours Table */}
      <ToursDataTable
        tours={toursOrder}
        onView={handleView}
        onEdit={handleEdit}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        onReorder={handleReorder}
        isDeleting={isDeleting}
        isReordering={isReordering}
        enableReorder={!isReorderDisabled}
      />

      {isReorderDisabled && toursOrder.length > 0 && (
        <Card>
          <CardContent className="border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
            Drag-and-drop ordering is available only when viewing all tours
            without filters or search. Clear filters to reorder.
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {toursOrder.length} of {(pagination as any)?.total || 0}{" "}
            tours
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Tour Detail Dialog */}
      {selectedTour && (
        <TourDetailDialog
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Tour"
        description="Are you sure you want to delete this tour? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
