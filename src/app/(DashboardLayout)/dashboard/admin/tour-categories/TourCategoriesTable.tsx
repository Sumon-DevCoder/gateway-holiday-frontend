"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITourCategory } from "@/types/tourCategory";
import { Edit, GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TourCategoriesTableProps {
  data: ITourCategory[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
  isDeleting: boolean;
  isReordering?: boolean;
  enableReorder?: boolean;
}

export default function TourCategoriesTable({
  data,
  isLoading,
  pagination,
  currentPage,
  onPageChange,
  onDelete,
  onReorder,
  isDeleting,
  isReordering = false,
  enableReorder = true,
}: TourCategoriesTableProps) {
  const router = useRouter();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!enableReorder || !onReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableReorder || !onReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!enableReorder || !onReorder) return;
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    if (!enableReorder || !onReorder) return;
    setDraggedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No tour categories found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category, index) => (
              <TableRow
                key={category._id}
                className={`h-16 ${
                  enableReorder ? "cursor-move" : "cursor-default"
                } transition-colors ${
                  draggedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                draggable={enableReorder && !isReordering && !!onReorder}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GripVertical
                      className={`h-4 w-4 ${
                        enableReorder ? "text-gray-400" : "text-gray-200"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-500">
                      {category.order !== undefined
                        ? category.order
                        : index + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {category.img ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={category.img}
                        alt={category.category_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
                      <span className="text-muted-foreground text-xs">
                        No image
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {category.category_name}
                </TableCell>
                <TableCell className="max-w-xs">
                  {category.description ? (
                    <div
                      className="group relative max-w-xs cursor-pointer"
                      title={category.description}
                    >
                      <p className="text-muted-foreground group-hover:text-foreground line-clamp-2 text-sm leading-relaxed transition-colors">
                        {category.description}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/dashboard/admin/tour-categories/edit/${category._id}`
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(category._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
