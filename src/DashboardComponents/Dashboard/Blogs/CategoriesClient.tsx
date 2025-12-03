"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBlogCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/blogApi";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoriesClient(): React.ReactElement {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  // Fetch categories
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetBlogCategoriesQuery({});

  // Mutations
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Create handler
  const handleCreate = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (categoryName.trim().length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }

    try {
      await createCategory({ name: categoryName.trim() }).unwrap();
      toast.success("Category created successfully");
      // Only reset form and close modal on success
      setIsCreateModalOpen(false);
      setCategoryName("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
      // Don't reset form or close modal on error - keep user's input
    }
  };

  // Edit handler
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!editingCategory?._id) return;

    try {
      await updateCategory({
        id: editingCategory._id,
        data: { name: categoryName.trim() },
      }).unwrap();
      toast.success("Category updated successfully");
      // Only reset form and close modal on success
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setCategoryName("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
      // Don't reset form or close modal on error - keep user's input
    }
  };

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-xl bg-gray-50 p-6 shadow-lg">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl bg-gray-50 p-6 shadow-lg">
        <div className="text-center text-red-500">
          Failed to load categories. Please try again.
        </div>
      </div>
    );
  }

  const categories = categoriesData?.data || [];

  return (
    <div className="w-full space-y-4 rounded-xl bg-gray-50 p-6 shadow-lg">
      {/* Add Category Button */}
      <div className="flex justify-end">
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Only reset when manually closing (not on error)
              setCategoryName("");
              setIsCreateModalOpen(false);
            } else {
              setIsCreateModalOpen(open);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setCategoryName("")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new blog category to organize your content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreate();
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Category Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Only reset when manually closing (not on error)
            setEditingCategory(null);
            setCategoryName("");
            setIsEditModalOpen(false);
          } else {
            setIsEditModalOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-category-name"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleUpdate();
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCategory(null);
                  setCategoryName("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {categories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="mb-4 text-gray-500">No categories found</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first category
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: any) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDelete(category._id, category.name)
                        }
                        disabled={deletingId === category._id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
