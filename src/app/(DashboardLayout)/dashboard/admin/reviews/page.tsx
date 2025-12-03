"use client";

import ReviewDataTable from "@/components/admin/ReviewDataTable";
import ReviewModal from "@/components/admin/ReviewModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Eye, Plus, Star } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useReorderReviewsMutation,
} from "@/redux/api/features/review/reviewApi";
import { Review, ReviewDetailModalProps } from "@/types/review";

export default function ReviewsPage(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // RTK Query hooks
  const {
    data: reviewsResponse,
    isLoading,
    refetch,
  } = useGetReviewsQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
  });
  const [deleteReview] = useDeleteReviewMutation();
  const [reorderReviews] = useReorderReviewsMutation();

  // Use API data if available, fallback to empty array
  const reviews = reviewsResponse?.data || [];
  const pagination = reviewsResponse?.pagination;

  const stats = useMemo(() => {
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      totalReviews: pagination?.total || reviews.length,
      averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      pendingReviews: 0,
      approvedReviews: reviews.length,
    };
  }, [reviews, pagination]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // No need for client-side filtering - backend handles search
  const filteredReviews = reviews;

  const handleDeleteReview = async (reviewId: string): Promise<void> => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review");
    }
  };

  const handleReorderReviews = async (
    startIndex: number,
    endIndex: number
  ): Promise<void> => {
    try {
      const newReviews = [...reviews];
      const [movedReview] = newReviews.splice(startIndex, 1);
      if (movedReview) {
        newReviews.splice(endIndex, 0, movedReview);
        const reviewIds = newReviews.map((review) => review._id);
        await reorderReviews({ reviewIds }).unwrap();
        toast.success("Reviews reordered successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reorder reviews");
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleCreateReview = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalSuccess = () => {
    refetch(); // Refetch reviews data
    setEditingReview(null);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsCreating(false);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold lg:text-3xl">
            Review Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer reviews and feedback
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleCreateReview}
            className="flex items-center gap-2"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Add Review"}
          </Button>
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardDescription>
            • <span className="font-bold">Total Reviews</span>:{" "}
            {stats.totalReviews} •{" "}
            <span className="font-bold">Average Rating</span>:{" "}
            {stats.averageRating}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
            </div>
          ) : (
            <>
              <ReviewDataTable
                reviews={filteredReviews}
                onEdit={handleEditReview}
                onDelete={(review) => handleDeleteReview(review._id)}
                onReorder={handleReorderReviews}
                onView={handleViewReview}
                isDeleting={false}
              />
              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {filteredReviews.length} of {pagination.total}{" "}
                    reviews
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-1 text-sm">
                      Page {pagination.page || currentPage} of{" "}
                      {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= pagination.pages || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Review Detail Modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

      {/* Create Review Modal */}
      <ReviewModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsCreating(false);
        }}
        review={null}
        onSuccess={handleModalSuccess}
        onLoadingChange={setIsCreating}
      />

      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        review={editingReview}
        onSuccess={handleModalSuccess}
        onLoadingChange={() => {}}
      />
    </div>
  );
}

function ReviewDetailModal({
  review,
  onClose,
}: ReviewDetailModalProps): React.ReactElement {
  const renderStars = (rating: number): React.ReactElement[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Review Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={review.userProfileImg || "/placeholder.svg"}
                  alt={review.userName}
                />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{review.userName}</h3>
                <p className="text-muted-foreground text-sm">
                  {review.designation}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="mb-2 font-medium">Rating</h4>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="font-medium">{review.rating}/5</span>
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <h4 className="mb-2 font-medium">Review</h4>
              <p className="text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Date */}
            <div>
              <h4 className="mb-1 font-medium">Date</h4>
              <p className="text-muted-foreground">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
