"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomTextarea from "@/components/CustomFormComponents/CustomTextarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/api/features/banner/bannerApi";
import { IBanner } from "@/types/schemas";
import { Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Form data type
type BannerFormData = {
  title: string;
  description: string;
  backgroundImage: File | string | null;
};

interface BannerFormProps {
  banner?: IBanner | undefined;
  onCancel: () => void;
}

export default function BannerForm({ banner, onCancel }: BannerFormProps) {
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // RTK Query mutations
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const isLoading = isCreating || isUpdating;

  // Initialize existing image when editing
  useEffect(() => {
    if (banner?.backgroundImage) {
      setExistingImage(banner.backgroundImage);
    } else {
      setExistingImage(null);
    }
  }, [banner]);

  // Handle form submission
  const handleSubmit = async (data: BannerFormData) => {
    const title = data.title.trim();
    const description = data.description.trim();

    // Determine image sources
    const isNewFile = data.backgroundImage instanceof File;
    const formImageUrl =
      typeof data.backgroundImage === "string"
        ? data.backgroundImage.trim()
        : "";
    const existingImageUrl = formImageUrl || existingImage || "";

    // Enhanced validation
    if (!title) {
      toast.error("Please enter a banner title");
      return;
    }

    if (!description) {
      toast.error("Please enter a banner description");
      return;
    }

    if (!isNewFile && !existingImageUrl) {
      toast.error("Please select a background image");
      return;
    }

    // Validate title length
    if (title.length < 3) {
      toast.error("Title must be at least 3 characters long");
      return;
    }

    if (title.length > 100) {
      toast.error("Title must be less than 100 characters");
      return;
    }

    // Validate description length
    if (description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (description.length > 500) {
      toast.error("Description must be less than 500 characters");
      return;
    }

    const bannerData: {
      title: string;
      description: string;
      backgroundImage?: string;
    } = {
      title,
      description,
    };

    if (!isNewFile && existingImageUrl) {
      bannerData.backgroundImage = existingImageUrl;
    }

    try {
      if (banner) {
        await updateBanner({
          id: banner._id!,
          bannerData,
          ...(isNewFile
            ? {
                imageFile: data.backgroundImage as File,
              }
            : {}),
        }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner({
          bannerData,
          ...(isNewFile
            ? {
                imageFile: data.backgroundImage as File,
              }
            : {}),
        }).unwrap();
        toast.success("Banner created successfully");
      }

      onCancel();
    } catch (error) {
      toast.error(
        banner ? "Failed to update banner" : "Failed to create banner"
      );
    }
  };

  // Default values for form
  const defaultValues: BannerFormData = {
    title: banner?.title || "",
    description: banner?.description || "",
    backgroundImage: null,
  };

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="w-full space-y-6 rounded-xl bg-gray-50 p-6 shadow-lg md:p-10"
    >
      {/* Title Field */}
      <div className="space-y-2">
        <CustomInput
          name="title"
          label="Banner Title *"
          placeholder="Enter banner title (3-100 characters)"
          required
        />
        <p className="text-xs text-gray-500">
          Title should be between 3-100 characters
        </p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <CustomTextarea
          name="description"
          label="Banner Description *"
          placeholder="Enter banner description (10-500 characters)"
          rows={4}
          required
        />
        <p className="text-xs text-gray-500">
          Description should be between 10-500 characters
        </p>
      </div>

      {/* Background Image */}
      <div className="space-y-2">
        <CustomFileUploader
          name="backgroundImage"
          label="Background Image *"
          multiple={false}
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
          }}
          required={!existingImage}
        />
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {existingImage
              ? "Upload a new image to replace the current one"
              : "Please select a background image"}
          </p>
          <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
            <p className="mb-1 font-semibold">📐 Recommended Image Size:</p>
            <ul className="ml-2 list-inside list-disc space-y-0.5">
              <li>
                <span className="font-bold">Optimal:</span> 1920 x 1080 pixels
                (16:9 ratio)
              </li>
              <li>
                <span className="font-bold">Alternative:</span> 1920 x 800
                pixels
              </li>
              <li>
                <span className="font-bold">Minimum:</span> 1600 x 900 pixels
              </li>
            </ul>
            <p className="mt-2 text-blue-700">
              💡 <span className="font-bold">Tip:</span> Keep important content
              centered as images may be cropped on smaller screens
            </p>
          </div>
        </div>
      </div>

      {/* Existing Image Display */}
      {existingImage && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Image</Label>
          <div className="group relative inline-block">
            <Image
              src={existingImage}
              alt="Existing image"
              width={200}
              height={150}
              className="h-32 w-48 rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setExistingImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {banner ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {banner ? "Update Banner" : "Create Banner"}
            </>
          )}
        </Button>
      </div>
    </CustomForm>
  );
}
