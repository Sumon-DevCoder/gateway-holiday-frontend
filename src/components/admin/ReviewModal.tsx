"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/features/review/reviewApi";
import { Review } from "@/types/review";
import { Star, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review?: Review | null;
  onSuccess: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  review,
  onSuccess,
  onLoadingChange,
}: ReviewModalProps) {
  const [formData, setFormData] = useState({
    userName: "",
    designation: "Traveller",
    rating: 5,
    comment: "",
  });

  const [userProfileImg, setUserProfileImg] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isEditing = !!review;

  // RTK Query mutations
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (review && isOpen) {
      setFormData({
        userName: review.userName,
        designation: review.designation,
        rating: review.rating,
        comment: review.comment,
      });
      setProfilePreview(review.userProfileImg || "");
    } else if (!review && isOpen) {
      // Reset form for new review
      setFormData({
        userName: "",
        designation: "Traveller",
        rating: 5,
        comment: "",
      });
      setUserProfileImg(null);
      setProfilePreview("");
    }

    // Reset loading states when modal opens/closes
    if (!isOpen) {
      setIsCreating(false);
      setIsUpdating(false);
    }
  }, [review, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) || 1 : value,
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserProfileImg(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setUserProfileImg(null);
    setProfilePreview("");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.userName.trim()) {
      toast.error("Please enter user name");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    // Validate user name length
    if (formData.userName.trim().length < 2) {
      toast.error("User name must be at least 2 characters long");
      return;
    }

    if (formData.userName.trim().length > 50) {
      toast.error("User name must be less than 50 characters");
      return;
    }

    // Validate designation length if provided
    if (formData.designation && formData.designation.trim().length > 100) {
      toast.error("Designation must be less than 100 characters");
      return;
    }

    // Validate comment length
    if (formData.comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters long");
      return;
    }

    if (formData.comment.trim().length > 500) {
      toast.error("Review comment must be less than 500 characters");
      return;
    }

    // Validate rating
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Rating must be between 1 and 5 stars");
      return;
    }

    try {
      // Set loading state
      if (isEditing) {
        setIsUpdating(true);
      } else {
        setIsCreating(true);
      }
      onLoadingChange?.(true);

      if (isEditing && review) {
        // For update, we need to send FormData differently
        const updateData = {
          userName: formData.userName.trim(),
          designation: formData.designation.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          userProfileImg: userProfileImg || undefined,
        };

        await updateReview({
          id: review._id,
          data: updateData as any,
        }).unwrap();
        toast.success("Review updated successfully");
      } else {
        // For create, use RTK Query mutation
        const createData = {
          userName: formData.userName.trim(),
          designation: formData.designation.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          userProfileImg: userProfileImg || undefined,
        };

        await createReview(createData as any).unwrap();
        toast.success("Review created successfully");
      }

      // Only reset form and close dialog on success
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save review"
      );
      // Don't close modal on error - keep user's input
    } finally {
      // Reset loading state
      setIsCreating(false);
      setIsUpdating(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Only close when manually closing (X button or outside click)
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Review" : "Create New Review"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the review information below."
              : "Add a new customer review with details and images."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="userName">User Name *</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter user name (2-50 characters)"
                required
                className={
                  formData.userName.length > 0 &&
                  (formData.userName.length < 2 ||
                    formData.userName.length > 50)
                    ? "border-red-500"
                    : ""
                }
              />
              <p className="text-xs text-gray-500">
                Name should be between 2-50 characters
              </p>
              {formData.userName.length > 0 && formData.userName.length < 2 && (
                <p className="text-sm text-red-500">
                  Name must be at least 2 characters long
                </p>
              )}
              {formData.userName.length > 50 && (
                <p className="text-sm text-red-500">
                  Name must be less than 50 characters
                </p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">Designation (Optional)</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter designation (max 100 characters)"
                className={
                  formData.designation.length > 100 ? "border-red-500" : ""
                }
              />
              <p className="text-xs text-gray-500">Maximum 100 characters</p>
              {formData.designation.length > 100 && (
                <p className="text-sm text-red-500">
                  Designation must be less than 100 characters
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating)}
              <span className="ml-2 text-sm font-medium">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Enter review comment (10-500 characters)"
              rows={4}
              required
              className={
                formData.comment.length > 0 &&
                (formData.comment.length < 10 || formData.comment.length > 500)
                  ? "border-red-500"
                  : ""
              }
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimum 10 characters</span>
              <span>{formData.comment.length}/500 characters</span>
            </div>
            {formData.comment.length > 0 && formData.comment.length < 10 && (
              <p className="text-sm text-red-500">
                Comment must be at least 10 characters long
              </p>
            )}
            {formData.comment.length > 500 && (
              <p className="text-sm text-red-500">
                Comment must be less than 500 characters
              </p>
            )}
          </div>

          {/* User Profile Image */}
          <div className="space-y-2">
            <Label>User Profile Image</Label>
            <div className="flex items-center space-x-4">
              {profilePreview && (
                <div className="relative">
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeProfileImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  id="profile-upload"
                />
                <Label
                  htmlFor="profile-upload"
                  className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Profile Image
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (isEditing ? isUpdating : isCreating)}
            >
              {isLoading || (isEditing ? isUpdating : isCreating)
                ? "Saving..."
                : isEditing
                  ? "Update Review"
                  : "Create Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
