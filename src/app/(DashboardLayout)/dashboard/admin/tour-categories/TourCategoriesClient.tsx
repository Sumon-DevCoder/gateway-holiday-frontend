"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  useDeleteTourCategoryMutation,
  useGetTourCategoriesQuery,
  useReorderTourCategoriesMutation,
} from "@/redux/api/features/tourCategory/tourCategoryApi";
import { ITourCategory } from "@/types/tourCategory";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TourCategoriesTable from "./TourCategoriesTable";

export default function TourCategoriesClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoriesOrder, setCategoriesOrder] = useState<ITourCategory[]>([]);

  const { data, isLoading, error, refetch } = useGetTourCategoriesQuery({
    page,
    limit: 1000, // Fetch all for reordering
    ...(search && { search }),
  });

  const [deleteTourCategory, { isLoading: isDeleting }] =
    useDeleteTourCategoryMutation();
  const [reorderTourCategories, { isLoading: isReordering }] =
    useReorderTourCategoriesMutation();

  useEffect(() => {
    if (data?.data) {
      const sortedCategories = [...data.data].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return (a.category_name || "").localeCompare(b.category_name || "");
        }
        return orderA - orderB;
      });
      setCategoriesOrder(sortedCategories);
    } else {
      setCategoriesOrder([]);
    }
  }, [data?.data]);

  const isReorderDisabled = search.trim().length > 0;

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteTourCategory(categoryToDelete).unwrap();
      toast.success("Tour category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tour category");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    if (isReorderDisabled) {
      toast.error("Reordering is disabled while search is active.");
      return;
    }

    const previousOrder = categoriesOrder;
    const updatedOrder = [...categoriesOrder];
    const [movedCategory] = updatedOrder.splice(startIndex, 1);

    if (!movedCategory) {
      return;
    }

    updatedOrder.splice(endIndex, 0, movedCategory);
    setCategoriesOrder(updatedOrder);

    try {
      const categoryIds = updatedOrder
        .map((category) => category._id)
        .filter((id): id is string => Boolean(id));

      if (categoryIds.length !== updatedOrder.length) {
        throw new Error("Some categories are missing identifiers.");
      }

      await reorderTourCategories({ categoryIds }).unwrap();
      toast.success("Tour category order updated successfully");
      refetch();
    } catch (error: any) {
      setCategoriesOrder([...previousOrder]);
      toast.error(
        error?.data?.message ||
          "Failed to update category order. Please try again."
      );
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Error loading tour categories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tour Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tour categories
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/tour-categories/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <TourCategoriesTable
        data={categoriesOrder}
        isLoading={isLoading}
        {...(data?.pagination && { pagination: data.pagination })}
        currentPage={page}
        onPageChange={setPage}
        onDelete={handleDelete}
        onReorder={handleReorder}
        isDeleting={isDeleting}
        isReordering={isReordering}
        enableReorder={!isReorderDisabled}
      />

      {isReorderDisabled && categoriesOrder.length > 0 && (
        <Card>
          <CardContent className="border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
            Drag-and-drop ordering is available only when viewing all categories
            without search. Clear search to reorder.
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tour Category"
        description="Are you sure you want to delete this tour category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
