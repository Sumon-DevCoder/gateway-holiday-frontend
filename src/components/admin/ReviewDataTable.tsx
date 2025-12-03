"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Review } from "@/types/review";
import { Edit, Eye, GripVertical, Star, Trash2 } from "lucide-react";
import { useState } from "react";

interface ReviewDataTableProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onView: (review: Review) => void;
  isDeleting?: boolean;
}

export default function ReviewDataTable({
  reviews,
  onEdit,
  onDelete,
  onReorder,
  onView,
  isDeleting = false,
}: ReviewDataTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const renderStars = (rating: number): React.ReactElement[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Order</TableHead>
            <TableHead className="w-20">User</TableHead>
            <TableHead className="w-32">Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead className="w-24">Date</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review, index) => (
            <TableRow
              key={review._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`cursor-move transition-colors ${
                draggedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.userProfileImg || "/placeholder.svg"}
                      alt={review.userName}
                    />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-foreground text-sm font-medium">
                      {review.userName}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {review.designation}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm font-medium">
                    {review.rating}/5
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="text-muted-foreground truncate text-sm">
                    {review.comment}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(review)}
                    className="h-8 w-8 p-0"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(review)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    title="Edit Review"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete Review"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this review? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(review)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
