"use client";

import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import { Button } from "@/components/ui/button";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/blogApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
}

interface EditCategoryFormProps {
  categoryId: string;
}

export default function EditCategoryForm({
  categoryId,
}: EditCategoryFormProps): React.ReactElement {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Get single category
  const {
    data: categoryData,
    isLoading,
    error,
  } = useGetSingleCategoryQuery(categoryId);

  // Update category mutation
  const [updateCategory] = useUpdateCategoryMutation();

  // Default values for form
  // const defaultValues: CategoryFormData = {
  //   name: "",
  // };

  // Update form when category data is loaded
  useEffect(() => {
    if (categoryData?.data) {
      // You might need to set form values here if using react-hook-form
      // This depends on your CustomForm implementation
    }
  }, [categoryData]);

  const handleSubmit = async (data: CategoryFormData): Promise<void> => {
    // Enhanced validation
    if (!data.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (data.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters long");
      return;
    }

    if (data.name.trim().length > 50) {
      toast.error("Category name must be less than 50 characters");
      return;
    }

    // Validate category name format
    const categoryNameRegex = /^[a-zA-Z0-9\s-]+$/;
    if (!categoryNameRegex.test(data.name.trim())) {
      toast.error(
        "Category name can only contain letters, numbers, spaces, and hyphens"
      );
      return;
    }

    // Check for consecutive spaces
    if (data.name.includes("  ")) {
      toast.error("Category name cannot contain consecutive spaces");
      return;
    }

    // Check for leading/trailing spaces
    if (data.name !== data.name.trim()) {
      toast.error("Category name cannot start or end with spaces");
      return;
    }

    setIsUpdating(true);
    try {
      await updateCategory({
        id: categoryId,
        data: { name: data.name.trim() },
      }).unwrap();
      toast.success("Category updated successfully");
      router.push("/dashboard/admin/blogs/categories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md rounded-xl bg-gray-50 p-6 shadow-lg">
        <div className="text-center">Loading category...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md rounded-xl bg-gray-50 p-6 shadow-lg">
        <div className="text-center text-red-500">
          Failed to load category. Please try again.
        </div>
      </div>
    );
  }

  const category = categoryData?.data;

  if (!category) {
    return (
      <div className="w-full max-w-md rounded-xl bg-gray-50 p-6 shadow-lg">
        <div className="text-center text-red-500">Category not found</div>
      </div>
    );
  }

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={{ name: category.name }}
      className="w-full max-w-md space-y-6 rounded-xl bg-gray-50 p-6 shadow-lg"
    >
      {/* Category Name */}
      <div className="space-y-2">
        <CustomInput
          name="name"
          label="Category Name *"
          placeholder="Enter category name (2-50 characters)"
          required
        />
        <p className="text-xs text-gray-500">
          Category name must be 2-50 characters long and can only contain
          letters, numbers, spaces, and hyphens
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/blogs/categories")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </CustomForm>
  );
}
