"use client";

import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useCreateImageMutation,
  useCreateSubCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteImageMutation,
  useDeleteSubCategoryMutation,
  useGetCategoriesQuery,
  useGetImagesQuery,
  useGetSubCategoriesQuery,
  useReorderCategoriesMutation,
  useReorderSubCategoriesMutation,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/redux/api/features/gallery/galleryApi";
import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Edit,
  Expand,
  FolderOpen,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function GalleryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);
  const [isEditSubCategoryDialogOpen, setIsEditSubCategoryDialogOpen] =
    useState(false);
  const [isImageViewDialogOpen, setIsImageViewDialogOpen] = useState(false);

  // Confirmation modal states
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: "category" | "subcategory" | "image" | null;
    id: string | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    description: "",
  });

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: null as File | null,
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    categoryId: "",
    image: null as File | null,
  });
  const [imageForm, setImageForm] = useState({
    image: null as File | null,
    categoryId: "",
    subCategoryId: "",
    altText: "",
  });

  // Edit form states
  const [editCategoryForm, setEditCategoryForm] = useState({
    id: "",
    name: "",
    image: null as File | null,
  });
  const [editSubCategoryForm, setEditSubCategoryForm] = useState({
    id: "",
    name: "",
    categoryId: "",
    image: null as File | null,
  });

  // Image view state
  const [selectedImage, _setSelectedImage] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // API hooks
  const { data: categoriesData } = useGetCategoriesQuery({});
  const { data: subCategoriesData } = useGetSubCategoriesQuery({});
  const { data: imagesData, isLoading: imagesLoading } = useGetImagesQuery({
    page: currentPage,
    limit: 12,
    ...(selectedCategory !== "all" && { categoryId: selectedCategory }),
    ...(selectedSubCategory !== "all" && {
      subCategoryId: selectedSubCategory,
    }),
  });

  // Mutations
  const [createCategory, { isLoading: createCategoryLoading }] =
    useCreateCategoryMutation();
  const [createSubCategory, { isLoading: createSubCategoryLoading }] =
    useCreateSubCategoryMutation();
  const [createImage, { isLoading: createImageLoading }] =
    useCreateImageMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();
  const [updateSubCategory, { isLoading: updateSubCategoryLoading }] =
    useUpdateSubCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [reorderCategories, { isLoading: isReorderingCategories }] =
    useReorderCategoriesMutation();
  const [reorderSubCategories, { isLoading: isReorderingSubCategories }] =
    useReorderSubCategoriesMutation();

  // Extract data from API responses - memoize to prevent infinite loops
  const categoriesRaw = useMemo(
    () => categoriesData?.data || [],
    [categoriesData?.data]
  );
  const subCategoriesRaw = useMemo(
    () => subCategoriesData?.data || [],
    [subCategoriesData?.data]
  );
  const images = useMemo(() => imagesData?.data || [], [imagesData?.data]);
  const imagesPagination = imagesData?.pagination;

  // State for managing order
  const [categoriesOrder, setCategoriesOrder] = useState<ICategory[]>([]);
  const [subCategoriesOrder, setSubCategoriesOrder] = useState<ISubCategory[]>(
    []
  );
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<
    number | null
  >(null);
  const [draggedSubCategoryIndex, setDraggedSubCategoryIndex] = useState<
    number | null
  >(null);

  // Refs to track previous data to prevent infinite loops
  const prevCategoriesRef = useRef<string>("");
  const prevSubCategoriesRef = useRef<string>("");

  // Sort categories and subcategories by order
  useEffect(() => {
    const categoriesKey = JSON.stringify(
      categoriesRaw.map((c) => ({ id: c._id, order: c.order, name: c.name }))
    );

    if (prevCategoriesRef.current !== categoriesKey) {
      prevCategoriesRef.current = categoriesKey;

      if (categoriesRaw.length > 0) {
        const sortedCategories = [...categoriesRaw].sort((a, b) => {
          const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
          if (orderA === orderB) {
            return (a.name || "").localeCompare(b.name || "");
          }
          return orderA - orderB;
        });
        setCategoriesOrder(sortedCategories);
      } else {
        setCategoriesOrder([]);
      }
    }
  }, [categoriesRaw]);

  useEffect(() => {
    const subCategoriesKey = JSON.stringify(
      subCategoriesRaw.map((s) => ({
        id: s._id,
        order: s.order,
        name: s.name,
        categoryId: s.categoryId,
      }))
    );

    if (prevSubCategoriesRef.current !== subCategoriesKey) {
      prevSubCategoriesRef.current = subCategoriesKey;

      if (subCategoriesRaw.length > 0) {
        const sortedSubCategories = [...subCategoriesRaw].sort((a, b) => {
          const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
          if (orderA === orderB) {
            return (a.name || "").localeCompare(b.name || "");
          }
          return orderA - orderB;
        });
        setSubCategoriesOrder(sortedSubCategories);
      } else {
        setSubCategoriesOrder([]);
      }
    }
  }, [subCategoriesRaw]);

  // Use ordered arrays
  const categories = categoriesOrder;
  const subCategories = subCategoriesOrder;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory]);

  // Filter images - backend handles category/subcategory filtering, but we still need to handle "none" case
  const filteredImages = images.filter((image) => {
    // Handle "none" subcategory case (images without subcategory)
    if (selectedSubCategory === "none") {
      return !image.subCategoryId || image.subCategoryId === "";
    }
    return true;
  });

  const getSubCategoriesForCategory = (categoryId: string) => {
    if (categoryId === "all") {
      return subCategories;
    }
    return subCategories.filter((sub) => sub.categoryId === categoryId);
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "Unknown";
    return categories.find((cat) => cat._id === categoryId)?.name || "Unknown";
  };

  const getSubCategoryName = (subCategoryId: string | undefined) => {
    if (!subCategoryId) return "General";
    return (
      subCategories.find((sub) => sub._id === subCategoryId)?.name || "Unknown"
    );
  };

  const getImageCategoryName = (image: IImage) => {
    const subCategory = image.subCategoryId
      ? subCategories.find((sub) => sub._id === image.subCategoryId)
      : undefined;
    const categoryId = subCategory ? subCategory.categoryId : image.categoryId;
    return categoryId ? getCategoryName(categoryId) : "Unknown";
  };

  const getImageSubCategoryName = (image: IImage) => {
    if (!image.subCategoryId) {
      return "General";
    }
    return getSubCategoryName(image.subCategoryId);
  };

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!categoryForm.image) {
      toast.error("Please select a category image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name.trim());
      formData.append("image", categoryForm.image);

      await createCategory(formData).unwrap();
      toast.success("Category created successfully");
      // Only reset form and close dialog on success
      setCategoryForm({ name: "", image: null });
      setIsCategoryDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create category");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEditCategory = (category: any) => {
    setEditCategoryForm({
      id: category._id,
      name: category.name,
      image: null,
    });
    setIsEditCategoryDialogOpen(true);
  };

  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editCategoryForm.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editCategoryForm.name.trim());
      if (editCategoryForm.image) {
        formData.append("image", editCategoryForm.image);
      }

      await updateCategory({
        id: editCategoryForm.id,
        data: formData,
      }).unwrap();
      toast.success("Category updated successfully");
      // Only reset form and close dialog on success
      setEditCategoryForm({ id: "", name: "", image: null });
      setIsEditCategoryDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update category");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  // SubCategory handlers
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subCategoryForm.name.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    if (!subCategoryForm.categoryId) {
      toast.error("Please select a parent category");
      return;
    }

    if (!subCategoryForm.image) {
      toast.error("Please select a subcategory image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", subCategoryForm.name.trim());
      formData.append("categoryId", subCategoryForm.categoryId);
      formData.append("image", subCategoryForm.image);

      await createSubCategory(formData).unwrap();
      toast.success("Subcategory created successfully");
      // Only reset form and close dialog on success
      setSubCategoryForm({ name: "", categoryId: "", image: null });
      setIsSubCategoryDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create subcategory");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEditSubCategory = (subCategory: any) => {
    setEditSubCategoryForm({
      id: subCategory._id,
      name: subCategory.name,
      categoryId: subCategory.categoryId,
      image: null,
    });
    setIsEditSubCategoryDialogOpen(true);
  };

  const handleEditSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSubCategoryForm.name.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    if (!editSubCategoryForm.categoryId) {
      toast.error("Please select a parent category");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editSubCategoryForm.name.trim());
      formData.append("categoryId", editSubCategoryForm.categoryId);
      if (editSubCategoryForm.image) {
        formData.append("image", editSubCategoryForm.image);
      }

      await updateSubCategory({
        id: editSubCategoryForm.id,
        data: formData,
      }).unwrap();
      toast.success("Subcategory updated successfully");
      // Only reset form and close dialog on success
      setEditSubCategoryForm({ id: "", name: "", categoryId: "", image: null });
      setIsEditSubCategoryDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update subcategory");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  // Image handlers
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageForm.image) {
      toast.error("Please select an image file");
      return;
    }

    if (!imageForm.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      const payload: {
        image: File;
        categoryId: string;
        subCategoryId?: string;
        altText?: string;
      } = {
        image: imageForm.image,
        categoryId: imageForm.categoryId,
      };

      if (imageForm.subCategoryId) {
        payload.subCategoryId = imageForm.subCategoryId;
      }

      if (imageForm.altText.trim()) {
        payload.altText = imageForm.altText.trim();
      }

      await createImage(payload).unwrap();
      toast.success("Image uploaded successfully");
      // Only reset form and close dialog on success
      setImageForm({
        image: null,
        categoryId: "",
        subCategoryId: "",
        altText: "",
      });
      setIsImageDialogOpen(false);
    } catch (error) {
      toast.error("Failed to upload image");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleImageDelete = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: "image",
      id,
      title: "Delete Image",
      description:
        "Are you sure you want to delete this image? This action cannot be undone.",
    });
  };

  const handleImageFullView = (image: any) => {
    const imageIndex = filteredImages.findIndex((img) => img._id === image._id);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handleCategoryDelete = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: "category",
      id,
      title: "Delete Category",
      description:
        "Are you sure you want to delete this category? This will also delete all associated subcategories and images. This action cannot be undone.",
    });
  };

  const handleSubCategoryDelete = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: "subcategory",
      id,
      title: "Delete Subcategory",
      description:
        "Are you sure you want to delete this subcategory? This will also delete all associated images. This action cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.id || !deleteConfirmation.type) return;

    try {
      switch (deleteConfirmation.type) {
        case "image":
          await deleteImage(deleteConfirmation.id).unwrap();
          toast.success("Image deleted successfully");
          break;
        case "category":
          await deleteCategory(deleteConfirmation.id).unwrap();
          toast.success(
            "Category and all associated subcategories and images deleted successfully"
          );
          break;
        case "subcategory":
          await deleteSubCategory(deleteConfirmation.id).unwrap();
          toast.success(
            "Subcategory and all associated images deleted successfully"
          );
          break;
      }
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        `Failed to delete ${deleteConfirmation.type}`;
      toast.error(errorMessage);
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        type: null,
        id: null,
        title: "",
        description: "",
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      type: null,
      id: null,
      title: "",
      description: "",
    });
  };

  // Category drag handlers
  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCategoryIndex !== null && draggedCategoryIndex !== dropIndex) {
      const previousOrder = categoriesOrder;
      const updatedOrder = [...categoriesOrder];
      const [movedCategory] = updatedOrder.splice(draggedCategoryIndex, 1);

      if (!movedCategory) {
        return;
      }

      updatedOrder.splice(dropIndex, 0, movedCategory);
      setCategoriesOrder(updatedOrder);

      try {
        const categoryIds = updatedOrder
          .map((category) => category._id)
          .filter((id): id is string => Boolean(id));

        if (categoryIds.length !== updatedOrder.length) {
          throw new Error("Some categories are missing identifiers.");
        }

        await reorderCategories({ categoryIds }).unwrap();
        toast.success("Category order updated successfully");
      } catch (error: any) {
        setCategoriesOrder([...previousOrder]);
        toast.error(
          error?.data?.message ||
            "Failed to update category order. Please try again."
        );
      }
    }
    setDraggedCategoryIndex(null);
  };

  const handleCategoryDragEnd = () => {
    setDraggedCategoryIndex(null);
  };

  // SubCategory drag handlers
  const handleSubCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSubCategoryIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSubCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSubCategoryDrop = async (
    e: React.DragEvent,
    dropIndex: number
  ) => {
    e.preventDefault();
    if (
      draggedSubCategoryIndex !== null &&
      draggedSubCategoryIndex !== dropIndex
    ) {
      const previousOrder = subCategoriesOrder;
      const updatedOrder = [...subCategoriesOrder];
      const [movedSubCategory] = updatedOrder.splice(
        draggedSubCategoryIndex,
        1
      );

      if (!movedSubCategory) {
        return;
      }

      updatedOrder.splice(dropIndex, 0, movedSubCategory);
      setSubCategoriesOrder(updatedOrder);

      try {
        const subCategoryIds = updatedOrder
          .map((subCategory) => subCategory._id)
          .filter((id): id is string => Boolean(id));

        if (subCategoryIds.length !== updatedOrder.length) {
          throw new Error("Some subcategories are missing identifiers.");
        }

        await reorderSubCategories({ subCategoryIds }).unwrap();
        toast.success("Subcategory order updated successfully");
      } catch (error: any) {
        setSubCategoriesOrder([...previousOrder]);
        toast.error(
          error?.data?.message ||
            "Failed to update subcategory order. Please try again."
        );
      }
    }
    setDraggedSubCategoryIndex(null);
  };

  const handleSubCategoryDragEnd = () => {
    setDraggedSubCategoryIndex(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery Management"
        description="Organize images in categories and subcategories"
      />

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id || ""}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSubCategory}
            onValueChange={setSelectedSubCategory}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              <SelectItem value="none">No Subcategory</SelectItem>
              {getSubCategoriesForCategory(selectedCategory).map(
                (subCategory) => (
                  <SelectItem
                    key={subCategory._id}
                    value={subCategory._id || ""}
                  >
                    {subCategory.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setCategoryForm({ name: "", image: null })}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name *</Label>
                  <Input
                    id="categoryName"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    className={
                      !categoryForm.name.trim() ? "border-red-500" : ""
                    }
                    required
                  />
                  {!categoryForm.name.trim() && (
                    <p className="text-sm text-red-500">
                      Please enter a category name
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryImage">Category Image *</Label>
                  <Input
                    id="categoryImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file type
                        const allowedTypes = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          toast.error(
                            "Please select a valid image file (JPEG, PNG, GIF, WebP)"
                          );
                          return;
                        }

                        // Validate file size (5MB limit)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size must be less than 5MB");
                          return;
                        }

                        setCategoryForm({ ...categoryForm, image: file });
                      }
                    }}
                  />
                  {categoryForm.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {categoryForm.image.name} (
                        {(categoryForm.image.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createCategoryLoading ||
                      !categoryForm.name.trim() ||
                      !categoryForm.image
                    }
                  >
                    {createCategoryLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Category"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isSubCategoryDialogOpen}
            onOpenChange={setIsSubCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() =>
                  setSubCategoryForm({ name: "", categoryId: "", image: null })
                }
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subCategoryName">Subcategory Name *</Label>
                  <Input
                    id="subCategoryName"
                    value={subCategoryForm.name}
                    onChange={(e) =>
                      setSubCategoryForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter subcategory name"
                    className={
                      !subCategoryForm.name.trim() ? "border-red-500" : ""
                    }
                    required
                  />
                  {!subCategoryForm.name.trim() && (
                    <p className="text-sm text-red-500">
                      Please enter a subcategory name
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentCategory">Parent Category *</Label>
                  <Select
                    value={subCategoryForm.categoryId}
                    onValueChange={(value) =>
                      setSubCategoryForm((prev) => ({
                        ...prev,
                        categoryId: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger
                      className={
                        !subCategoryForm.categoryId ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No categories available. Please create a category
                          first.
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category._id || ""}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {!subCategoryForm.categoryId && (
                    <p className="text-sm text-red-500">
                      Please select a parent category
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subCategoryImage">Subcategory Image *</Label>
                  <Input
                    id="subCategoryImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file type
                        const allowedTypes = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          toast.error(
                            "Please select a valid image file (JPEG, PNG, GIF, WebP)"
                          );
                          return;
                        }

                        // Validate file size (5MB limit)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size must be less than 5MB");
                          return;
                        }

                        setSubCategoryForm({ ...subCategoryForm, image: file });
                      }
                    }}
                  />
                  {subCategoryForm.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {subCategoryForm.image.name} (
                        {(subCategoryForm.image.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSubCategoryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createSubCategoryLoading ||
                      !subCategoryForm.name.trim() ||
                      !subCategoryForm.categoryId ||
                      !subCategoryForm.image
                    }
                  >
                    {createSubCategoryLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Subcategory"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() =>
                  setImageForm({
                    image: null,
                    categoryId: "",
                    subCategoryId: "",
                    altText: "",
                  })
                }
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Image</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleImageSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Select Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    required
                  />
                  {imageForm.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {imageForm.image.name} (
                        {(imageForm.image.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altText">Alt Text (Optional)</Label>
                  <Input
                    id="altText"
                    value={imageForm.altText}
                    onChange={(e) =>
                      setImageForm((prev) => ({
                        ...prev,
                        altText: e.target.value,
                      }))
                    }
                    placeholder="Enter alt text for accessibility"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageCategory">Category *</Label>
                  <Select
                    value={imageForm.categoryId}
                    onValueChange={(value) =>
                      setImageForm((prev) => ({
                        ...prev,
                        categoryId: value,
                        subCategoryId: "",
                      }))
                    }
                    required
                  >
                    <SelectTrigger
                      className={!imageForm.categoryId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No categories available. Please create a category
                          first.
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category._id || ""}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {!imageForm.categoryId && (
                    <p className="text-sm text-red-500">
                      Please select a category
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageSubCategory">
                    Subcategory{" "}
                    <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Select
                    value={imageForm.subCategoryId}
                    onValueChange={(value) =>
                      setImageForm((prev) => ({
                        ...prev,
                        subCategoryId: value,
                      }))
                    }
                    disabled={!imageForm.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageForm.categoryId ? (
                        getSubCategoriesForCategory(imageForm.categoryId)
                          .length > 0 ? (
                          getSubCategoriesForCategory(imageForm.categoryId).map(
                            (subCategory) => (
                              <SelectItem
                                key={subCategory._id}
                                value={subCategory._id || ""}
                              >
                                {subCategory.name}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No subcategories available under this category.
                          </div>
                        )
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          Select a category first to choose a subcategory.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsImageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createImageLoading ||
                      !imageForm.image ||
                      !imageForm.categoryId
                    }
                  >
                    {createImageLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Image"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditCategoryDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Only reset when manually closing (not on error)
            setEditCategoryForm({ id: "", name: "", image: null });
            setIsEditCategoryDialogOpen(false);
          } else {
            setIsEditCategoryDialogOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Category Name *</Label>
              <Input
                id="editCategoryName"
                value={editCategoryForm.name}
                onChange={(e) =>
                  setEditCategoryForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter category name"
                className={
                  !editCategoryForm.name.trim() ? "border-red-500" : ""
                }
                required
              />
              {!editCategoryForm.name.trim() && (
                <p className="text-sm text-red-500">
                  Please enter a category name
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategoryImage">Category Image *</Label>
              <Input
                id="editCategoryImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file type
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/gif",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      toast.error(
                        "Please select a valid image file (JPEG, PNG, GIF, WebP)"
                      );
                      return;
                    }

                    // Validate file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("Image size must be less than 5MB");
                      return;
                    }

                    setEditCategoryForm({ ...editCategoryForm, image: file });
                  }
                }}
              />
              {editCategoryForm.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected: {editCategoryForm.image.name} (
                    {(editCategoryForm.image.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateCategoryLoading || !editCategoryForm.name.trim()
                }
              >
                {updateCategoryLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit SubCategory Dialog */}
      <Dialog
        open={isEditSubCategoryDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Only reset when manually closing (not on error)
            setEditSubCategoryForm({
              id: "",
              name: "",
              categoryId: "",
              image: null,
            });
            setIsEditSubCategoryDialogOpen(false);
          } else {
            setIsEditSubCategoryDialogOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editSubCategoryName">Subcategory Name *</Label>
              <Input
                id="editSubCategoryName"
                value={editSubCategoryForm.name}
                onChange={(e) =>
                  setEditSubCategoryForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter subcategory name"
                className={
                  !editSubCategoryForm.name.trim() ? "border-red-500" : ""
                }
                required
              />
              {!editSubCategoryForm.name.trim() && (
                <p className="text-sm text-red-500">
                  Please enter a subcategory name
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="editParentCategory">Parent Category *</Label>
              <Select
                value={editSubCategoryForm.categoryId}
                onValueChange={(value) =>
                  setEditSubCategoryForm((prev) => ({
                    ...prev,
                    categoryId: value,
                  }))
                }
                required
              >
                <SelectTrigger
                  className={
                    !editSubCategoryForm.categoryId ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      No categories available.
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id || ""}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!editSubCategoryForm.categoryId && (
                <p className="text-sm text-red-500">
                  Please select a parent category
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSubCategoryImage">Subcategory Image *</Label>
              <Input
                id="editSubCategoryImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file type
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/gif",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      toast.error(
                        "Please select a valid image file (JPEG, PNG, GIF, WebP)"
                      );
                      return;
                    }

                    // Validate file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("Image size must be less than 5MB");
                      return;
                    }

                    setEditSubCategoryForm({
                      ...editSubCategoryForm,
                      image: file,
                    });
                  }
                }}
              />
              {editSubCategoryForm.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected: {editSubCategoryForm.image.name} (
                    {(editSubCategoryForm.image.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditSubCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateSubCategoryLoading ||
                  !editSubCategoryForm.name.trim() ||
                  !editSubCategoryForm.categoryId
                }
              >
                {updateSubCategoryLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Subcategory"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog
        open={isImageViewDialogOpen}
        onOpenChange={setIsImageViewDialogOpen}
      >
        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-4xl flex-col overflow-hidden sm:w-full">
          <DialogHeader className="shrink-0">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {selectedImage && (
              <div className="space-y-4">
                <div className="relative max-h-[50vh] overflow-hidden rounded-lg border">
                  <img
                    src={selectedImage.url}
                    alt="Gallery image"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Image URL</Label>
                    <div className="max-h-20 overflow-y-auto rounded border bg-gray-50 p-2">
                      <p className="text-xs break-all text-gray-600">
                        {selectedImage.url}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Badge variant="outline">
                      {getImageCategoryName(selectedImage)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subcategory</Label>
                    <p className="text-sm font-medium">
                      {getImageSubCategoryName(selectedImage)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Image ID</Label>
                    <div className="max-h-16 overflow-y-auto rounded border bg-gray-50 p-2">
                      <p className="font-mono text-xs break-all text-gray-600">
                        {selectedImage._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsImageViewDialogOpen(false);
                handleImageFullView(selectedImage);
              }}
            >
              <Expand className="mr-2 h-4 w-4" />
              Full Screen View
            </Button>
            <Button onClick={() => setIsImageViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subcategories Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FolderOpen className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          No categories found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, index) => (
                    <TableRow
                      key={category._id}
                      draggable={!isReorderingCategories}
                      onDragStart={(e) => handleCategoryDragStart(e, index)}
                      onDragOver={handleCategoryDragOver}
                      onDrop={(e) => handleCategoryDrop(e, index)}
                      onDragEnd={handleCategoryDragEnd}
                      className={`cursor-move transition-colors ${
                        draggedCategoryIndex === index
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">
                            {category.order !== undefined
                              ? category.order
                              : index + 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative h-12 w-16 overflow-hidden rounded-md border sm:h-16 sm:w-24">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <FolderOpen className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {
                            subCategories.filter(
                              (sub) => sub.categoryId === category._id
                            ).length
                          }{" "}
                          subcategories
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0"
                            title="Edit Category"
                            disabled={isReorderingCategories}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCategoryDelete(category._id!)}
                            className="h-8 w-8 p-0"
                            title="Delete Category"
                            disabled={isReorderingCategories}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Subcategories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subcategories</h3>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead>Images Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Camera className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          No subcategories found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  subCategories.map((subCategory, index) => (
                    <TableRow
                      key={subCategory._id}
                      draggable={!isReorderingSubCategories}
                      onDragStart={(e) => handleSubCategoryDragStart(e, index)}
                      onDragOver={handleSubCategoryDragOver}
                      onDrop={(e) => handleSubCategoryDrop(e, index)}
                      onDragEnd={handleSubCategoryDragEnd}
                      className={`cursor-move transition-colors ${
                        draggedSubCategoryIndex === index
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">
                            {subCategory.order !== undefined
                              ? subCategory.order
                              : index + 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative h-12 w-16 overflow-hidden rounded-md border sm:h-16 sm:w-24">
                          {subCategory.image ? (
                            <img
                              src={subCategory.image}
                              alt={subCategory.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {subCategory.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(subCategory.categoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {
                            images.filter(
                              (img) => img.subCategoryId === subCategory._id
                            ).length
                          }{" "}
                          images
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSubCategory(subCategory)}
                            className="h-8 w-8 p-0"
                            title="Edit Subcategory"
                            disabled={isReorderingSubCategories}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleSubCategoryDelete(subCategory._id!)
                            }
                            className="h-8 w-8 p-0"
                            title="Delete Subcategory"
                            disabled={isReorderingSubCategories}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Gallery Images Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Gallery Images</h3>
        </div>

        {imagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredImages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Camera className="h-8 w-8 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                {selectedCategory === "all" &&
                                selectedSubCategory === "all"
                                  ? "No images in gallery"
                                  : "No images match your current filter"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredImages.map((image) => (
                          <TableRow key={image._id}>
                            <TableCell>
                              <div className="relative h-12 w-16 overflow-hidden rounded-md border sm:h-16 sm:w-24">
                                <img
                                  src={image.url}
                                  alt={`Gallery image ${image._id}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {getImageCategoryName(image)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">
                                {getImageSubCategoryName(image)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleImageFullView(image)}
                                  className="h-8 w-8 p-0"
                                  title="Full Screen View"
                                >
                                  <Expand className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleImageDelete(image._id!)}
                                  className="h-8 w-8 p-0"
                                  title="Delete Image"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {filteredImages.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Camera className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No Images Found
                    </h3>
                    <p className="text-gray-500">
                      {selectedCategory === "all" &&
                      selectedSubCategory === "all"
                        ? "No images in gallery"
                        : "No images match your current filter"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredImages.map((image) => (
                    <Card key={image._id}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Image */}
                          <div className="flex justify-center">
                            <div className="relative h-48 w-full max-w-xs overflow-hidden rounded-md border">
                              <img
                                src={image.url}
                                alt={`Gallery image ${image._id}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getImageCategoryName(image)}
                              </Badge>
                              <span className="text-sm font-medium">
                                {getImageSubCategoryName(image)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageFullView(image)}
                              className="flex-1"
                            >
                              <Expand className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleImageDelete(image._id!)}
                              className="flex-1"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Empty State */}
      {!imagesLoading && filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Images Found
            </h3>
            <p className="mb-4 text-gray-500">
              {selectedCategory === "all" && selectedSubCategory === "all"
                ? "Get started by adding images to your gallery"
                : "No images match your current filter selection"}
            </p>
            <Button
              onClick={() => setIsImageDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {imagesPagination && imagesPagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredImages.length} of {imagesPagination.total} images
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1 || imagesLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="flex items-center px-3 py-1 text-sm">
              Page {imagesPagination.page || currentPage} of{" "}
              {imagesPagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                currentPage >= imagesPagination.totalPages || imagesLoading
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox for Full Screen Image View */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={filteredImages.map((image) => ({
          src: image.url,
          alt: `Gallery image ${image._id}`,
        }))}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
