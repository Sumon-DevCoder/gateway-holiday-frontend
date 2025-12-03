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
  useGetBlogCategoriesQuery,
  useUpdateBlogMutation,
} from "@/redux/api/blogApi";
import { Blog } from "@/types/blog";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

// interface BlogPayload {
//   title: string;
//   categoryName: string;
//   coverImage: File | null;
//   tags: string;
//   readTime: string;
//   content: string;
//   status: string;
//   featured: boolean;
// }

export default function UpdateBlogForm(): React.ReactElement {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [currentCoverImage, setCurrentCoverImage] = useState<string>("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] =
    useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);

  // ✅ Fetch categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetBlogCategoriesQuery({});

  // ✅ Update blog mutation
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  // ✅ Load blog data from localStorage on component mount
  useEffect(() => {
    const blogData = localStorage.getItem("editingBlog");
    if (blogData) {
      try {
        const blog = JSON.parse(blogData);
        setEditingBlog(blog);
        setContent(blog.content || "");
        setCurrentCoverImage(blog.coverImage || "");
      } catch (error) {
        toast.error("Error loading blog data");
        router.push("/dashboard/admin/blogs");
      }
    } else {
      toast.error("No blog data found");
      router.push("/dashboard/admin/blogs");
    }
  }, [router]);

  // ✅ Default values for form (will be updated when blog data loads)
  const defaultValues: BlogFormData = {
    title: editingBlog?.title || "",
    categoryName: editingBlog?.category?.name || "",
    coverImage: null,
    tags: Array.isArray(editingBlog?.tags)
      ? editingBlog.tags.join(", ")
      : editingBlog?.tags || "",
    readTime: editingBlog?.readTime || "",
    status: editingBlog?.status || "draft",
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

    setIsCreatingCategory(true);
    try {
      toast.success("Category will be created when you save the blog");
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      await refetchCategories();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (data: BlogFormData): Promise<void> => {
    if (!editingBlog) {
      toast.error("No blog data found");
      return;
    }

    // Build payload conditionally to avoid delete operator
    const basePayload = {
      ...data,
      tags: data.tags, // Keep as string for API
      content,
    };

    const payload: any =
      !data.coverImage && currentCoverImage
        ? (({ coverImage, ...rest }) => rest)(basePayload)
        : basePayload;

    try {
      await updateBlog({
        id: editingBlog._id,
        data: payload,
      }).unwrap();
      toast.success("Blog updated successfully");
      // Clear localStorage and redirect
      localStorage.removeItem("editingBlog");
      router.push("/dashboard/admin/blogs");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update blog");
    }
  };

  // ✅ Transform API data to CategoryOption format
  const categoryOptions: CategoryOption[] =
    categoriesData?.data?.map((category: any) => ({
      label: category.name || category.title,
      value: category.name || category.title, // Use name as value
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

  // ✅ Show loading state while blog data is being loaded
  if (!editingBlog) {
    return (
      <div className="w-full rounded-xl bg-gray-50 p-6 shadow-lg md:p-10">
        <div className="text-center">Loading blog data...</div>
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
      <CustomInput
        name="title"
        label="Blog Title"
        placeholder="Enter blog title"
        required
      />

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

      {/* Cover Image with Current Image Display */}
      <div className="space-y-4">
        <label className="text-lg font-semibold">Cover Image</label>

        {/* Current Cover Image */}
        {currentCoverImage && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Current cover image:</p>
            <div className="relative inline-block">
              <Image
                src={currentCoverImage}
                alt="Current cover image"
                width={200}
                height={150}
                className="rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={() => setCurrentCoverImage("")}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Click X to remove current image
            </p>
          </div>
        )}

        {/* File Uploader */}
        <CustomFileUploader
          name="coverImage"
          label={
            currentCoverImage
              ? "Upload New Cover Image (Optional)"
              : "Upload Cover Image"
          }
        />
      </div>

      {/* Tags */}
      <CustomInput
        name="tags"
        label="Tags"
        placeholder="travel, adventure, tips"
        required
      />

      {/* Read Time */}
      <CustomInput
        name="readTime"
        label="Read Time"
        placeholder="e.g. 5 min"
        required
      />

      {/* Rich Text Editor */}
      <div className="form-group">
        <DynamicRichTextEditor
          name="content"
          label="Blog Content"
          required={true}
          content={content}
          onChangeHandler={setContent}
        />
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

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/blogs")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isUpdating}>
          {isUpdating ? "Updating Blog..." : "Update Blog"}
        </Button>
      </div>
    </CustomForm>
  );
}
