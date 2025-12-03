"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITourCategory } from "@/types/tourCategory";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface TourCategoryFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
  initialData?: ITourCategory;
  isEdit?: boolean;
}

interface FormValues {
  category_name: string;
  description: string;
  img: FileList | null;
}

export default function TourCategoryForm({
  onSubmit,
  isLoading,
  initialData,
  isEdit = false,
}: TourCategoryFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.img || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      category_name: initialData?.category_name || "",
      description: initialData?.description || "",
      img: null,
    },
    mode: "onChange", // Add this to ensure form validation works properly
  });

  const imageFile = watch("img");
  const descriptionValue = watch("description");

  // Debug: Watch description changes
  useEffect(() => {}, [descriptionValue]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [imageFile]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("img", null);
  };

  const handleFormSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("category_name", data.category_name);
    // Always append description, even if empty
    formData.append("description", data.description || "");
    if (data.img && data.img.length > 0) {
      // Backend expects "image" not "img"
      formData.append("image", data.img[0]!);
    }

    // Log FormData contents

    await onSubmit(formData);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/admin/tour-categories")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit" : "Add"} Tour Category
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit ? "Update" : "Create a new"} tour category
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="category_name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category_name"
                {...register("category_name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Category name must be at least 2 characters",
                  },
                })}
                placeholder="e.g., Latest, Combo, Recommended"
              />
              {errors.category_name && (
                <p className="text-sm text-red-500">
                  {errors.category_name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Enter category description (optional)"
                    rows={4}
                  />
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="img">Category Image</Label>

              {imagePreview ? (
                <div className="relative inline-block">
                  <div className="relative h-48 w-48 overflow-hidden rounded-lg border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="img"
                    className="border-muted-foreground/25 hover:border-muted-foreground/50 flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                  >
                    <Upload className="text-muted-foreground h-8 w-8" />
                    <span className="text-muted-foreground mt-2 text-sm">
                      Upload Image
                    </span>
                  </label>
                  <Input
                    id="img"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("img")}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/admin/tour-categories")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
