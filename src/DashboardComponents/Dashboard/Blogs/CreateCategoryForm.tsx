"use client";

import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import { Button } from "@/components/ui/button";
import { useCreateCategoryMutation } from "@/redux/api/blogApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
}

export default function CreateCategoryForm(): React.ReactElement {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Create category mutation
  const [createCategory] = useCreateCategoryMutation();

  // Default values for form
  const defaultValues: CategoryFormData = {
    name: "",
  };

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

    setIsCreating(true);
    try {
      await createCategory({ name: data.name.trim() }).unwrap();
      toast.success("Category created successfully");
      router.push("/dashboard/admin/blogs/categories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
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
        <Button type="submit" className="flex-1" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </CustomForm>
  );
}
