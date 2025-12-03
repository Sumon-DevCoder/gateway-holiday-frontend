"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import DynamicRichTextEditor from "@/components/CustomFormComponents/DynamicRichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBlogMutation,
  useCreateCategoryMutation,
  useGetBlogCategoriesQuery,
} from "@/redux/api/blogApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface CategoryOption {
  label: string;
  value: string;
}

interface BlogFormData {
  title: string;
  categoryName: string;
  coverImage: File | null;
  tags: string;
  readTime: string;
  status: string;
}

interface BlogPayload {
  title: string;
  categoryName: string;
  coverImage: File | null;
  tags: string;
  readTime: string;
  content: string;
  status: string;
}

export default function CreateBlogForm(): React.ReactElement {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] =
    useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // ✅ Fetch categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetBlogCategoriesQuery({});

  // ✅ Create blog mutation
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

  // ✅ Create category mutation
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();

  // ✅ Default values for form
  const defaultValues: BlogFormData = {
    title: "",
    categoryName: "",
    coverImage: null,
    tags: "",
    readTime: "",
    status: "draft",
  };

  // ✅ Handle category creation
  const handleCreateCategory = async (): Promise<void> => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (newCategoryName.trim().length < 2) {
      toast.error("Category name must be at least 2 characters long");
      return;
    }

    if (newCategoryName.trim().length > 50) {
      toast.error("Category name must be less than 50 characters");
      return;
    }

    // Validate category name format
    const categoryNameRegex = /^[a-zA-Z0-9\s-]+$/;
    if (!categoryNameRegex.test(newCategoryName.trim())) {
      toast.error(
        "Category name can only contain letters, numbers, spaces, and hyphens"
      );
      return;
    }

    // Check for consecutive spaces
    if (newCategoryName.includes("  ")) {
      toast.error("Category name cannot contain consecutive spaces");
      return;
    }

    // Check for leading/trailing spaces
    if (newCategoryName !== newCategoryName.trim()) {
      toast.error("Category name cannot start or end with spaces");
      return;
    }

    try {
      await createCategory({
        name: newCategoryName.trim(),
      }).unwrap();
      toast.success("Category created successfully");
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      await refetchCategories();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleSubmit = async (data: BlogFormData): Promise<void> => {
    // Debug logs
    // Enhanced validation
    if (!data.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (!data.categoryName) {
      toast.error("Please select a category");
      return;
    }

    if (!data.coverImage) {
      toast.error("Please select a cover image");
      return;
    }

    if (!data.tags.trim()) {
      toast.error("Please enter at least one tag");
      return;
    }

    if (!data.readTime.trim()) {
      toast.error("Please enter read time");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter blog content");
      return;
    }

    // Validate title length
    if (data.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (data.title.trim().length > 150) {
      toast.error("Title must be less than 150 characters");
      return;
    }

    // Validate content length
    if (content.trim().length < 100) {
      toast.error("Blog content must be at least 100 characters long");
      return;
    }

    // Validate tags
    const tagArray = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (tagArray.length === 0) {
      toast.error("Please enter at least one valid tag");
      return;
    }

    if (tagArray.length > 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }

    // Validate read time format
    const readTimePattern = /^\d+\s*(min|minutes?|mins?)$/i;
    if (!readTimePattern.test(data.readTime.trim())) {
      toast.error(
        "Please enter read time in format like '5 min' or '10 minutes'"
      );
      return;
    }

    const payload: BlogPayload = {
      ...data,
      tags: data.tags, // Keep as string for API
      content,
    };

    try {
      await createBlog(payload).unwrap();
      toast.success("Blog created successfully");

      // Redirect to blogs list page after successful creation
      router.push("/dashboard/admin/blogs");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create blog");
    }
  };

  // ✅ Transform API data to CategoryOption format
  const categoryOptions: CategoryOption[] =
    categoriesData?.data?.map((category: any) => ({
      label: category.name || category.title,
      value: category.name || category.title, // Use name as value instead of ID
    })) || [];

  // ✅ Show loading state for categories
  if (categoriesLoading) {
    return (
      <div className="w-full rounded-xl bg-gray-50 p-6 shadow-lg md:p-10">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  // ✅ Show error state for categories
  if (categoriesError) {
    return (
      <div className="w-full rounded-xl bg-gray-50 p-6 shadow-lg md:p-10">
        <div className="text-center text-red-500">
          Failed to load categories. Please try again.
        </div>
      </div>
    );
  }

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      hideSubmitUntilValid={true}
      className="w-full space-y-6 rounded-xl bg-gray-50 p-6 shadow-lg md:p-10"
    >
      {/* Title */}
      <div className="space-y-2">
        <CustomInput
          name="title"
          label="Blog Title *"
          placeholder="Enter blog title (5-150 characters)"
          required
        />
        <p className="text-xs text-gray-500">
          Title should be between 5-150 characters
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Category *</Label>
          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">
                    Category name must be 2-50 characters long
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCategoryDialogOpen(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                  >
                    {isCreatingCategory ? "Creating..." : "Create Category"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CustomSelect
          name={"categoryName"}
          label={""}
          required
          options={categoryOptions}
        />
        <p className="text-xs text-gray-500">
          Select an existing category or create a new one
        </p>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <CustomFileUploader
          name="coverImage"
          label="Cover Image *"
          required={true}
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
          }}
        />
        <p className="text-xs text-gray-500">
          Upload a high-quality cover image for your blog
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <CustomInput
          name="tags"
          label="Tags *"
          placeholder="travel, adventure, tips (comma-separated, max 10 tags)"
          required
        />
        <p className="text-xs text-gray-500">
          Enter tags separated by commas (maximum 10 tags)
        </p>
      </div>

      {/* Read Time */}
      <div className="space-y-2">
        <CustomInput
          name="readTime"
          label="Read Time *"
          placeholder="e.g. 5 min, 10 minutes"
          required
        />
        <p className="text-xs text-gray-500">
          Estimated reading time (e.g., "5 min" or "10 minutes")
        </p>
      </div>

      {/* Rich Text Editor */}
      <div className="form-group space-y-2">
        <DynamicRichTextEditor
          name="content"
          label="Blog Content *"
          required={true}
          content={content}
          onChangeHandler={setContent}
        />
        <p className="text-xs text-gray-500">
          Content must be at least 100 characters long
        </p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <CustomSelect
          name="status"
          label="Status *"
          required
          options={[
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ]}
        />
        <p className="text-xs text-gray-500">
          Choose whether to save as draft or publish immediately
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isCreating}>
        {isCreating ? "Creating Blog..." : "Save Blog"}
      </Button>
    </CustomForm>
  );
}
