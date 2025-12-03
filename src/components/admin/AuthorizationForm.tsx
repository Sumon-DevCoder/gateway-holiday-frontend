"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateAuthorizationMutation,
  useUpdateAuthorizationMutation,
} from "@/redux/api/features/authorization/authorizationApi";
import { IAuthorization } from "@/types/schemas";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AuthorizationFormProps {
  authorization?: IAuthorization;
  onCancel: () => void;
}

interface AuthorizationFormData {
  image: string;
}

export default function AuthorizationForm({
  authorization,
  onCancel,
}: AuthorizationFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    authorization?.image || null
  );

  const [createAuthorization, { isLoading: isCreating }] =
    useCreateAuthorizationMutation();
  const [updateAuthorization, { isLoading: isUpdating }] =
    useUpdateAuthorizationMutation();

  const { handleSubmit, setValue } = useForm<AuthorizationFormData>({
    defaultValues: {
      image: authorization?.image || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setImageFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear the URL input when file is selected
      setValue("image", "");
    }
  };

  const onSubmit = async () => {
    // Enhanced validation
    if (!imageFile && !authorization?.image) {
      toast.error("Please select an image file");
      return;
    }

    // For new authorizations, require a file
    if (!authorization && !imageFile) {
      toast.error("Please select an image file to create authorization");
      return;
    }

    // For updates without existing image, require a file
    if (authorization && !authorization.image && !imageFile) {
      toast.error("Please select an image file");
      return;
    }

    try {
      // Prepare data - only file upload, no URL
      const authorizationData = {
        image: "", // Will be set by backend after file upload
      };

      if (authorization?._id) {
        // Update existing authorization
        const updatePayload: any = {
          id: authorization._id,
          authorizationData,
        };
        if (imageFile) {
          updatePayload.imageFile = imageFile;
        }

        await updateAuthorization(updatePayload).unwrap();
        toast.success("Authorization updated successfully");
      } else {
        // Create new authorization
        await createAuthorization({
          authorizationData,
          imageFile: imageFile!,
        }).unwrap();
        toast.success("Authorization created successfully");
      }
      onCancel();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save authorization");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">
          Image <span className="text-red-500">*</span>
        </Label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-auto rounded border object-contain"
            />
          </div>
        )}

        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageChange}
          required
          className={
            !imageFile && !authorization?.image ? "border-red-500" : ""
          }
        />
        <p className="text-xs text-gray-500">
          Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
        </p>
        {!imageFile && !authorization?.image && (
          <p className="text-sm text-red-500">Please select an image file</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : authorization ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
