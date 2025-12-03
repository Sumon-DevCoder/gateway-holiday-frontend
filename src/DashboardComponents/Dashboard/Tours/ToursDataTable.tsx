"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITour } from "@/redux/api/features/tour/tourApi";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  GripVertical,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ToursDataTableProps {
  tours: ITour[];
  onView: (tour: ITour) => void;
  onEdit: (tour: ITour) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
  enableReorder?: boolean;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-red-100 text-red-800",
};

export default function ToursDataTable({
  tours,
  onView,
  onEdit,
  onStatusUpdate,
  onDelete,
  onReorder,
  isDeleting = false,
  isReordering = false,
  enableReorder = true,
}: ToursDataTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!enableReorder) return;
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    if (!enableReorder) return;
    setDraggedIndex(null);
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Tour</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.map((tour, index) => {
            const destinationName =
              typeof tour.destination === "object"
                ? tour?.destination?.name
                : "Unknown";

            const categoryName =
              typeof tour.category === "object"
                ? tour.category.category_name
                : "Unknown";

            // Generate color based on category name
            const getColorClass = (name: string) => {
              const lowerName = name.toLowerCase();
              if (lowerName.includes("recommend"))
                return "bg-yellow-100 text-yellow-800";
              if (lowerName.includes("latest") || lowerName.includes("new"))
                return "bg-blue-100 text-blue-800";
              if (lowerName.includes("combo") || lowerName.includes("package"))
                return "bg-purple-100 text-purple-800";
              if (lowerName.includes("popular") || lowerName.includes("trending"))
                return "bg-green-100 text-green-800";
              return "bg-gray-100 text-gray-800";
            };

            return (
              <TableRow
                key={tour._id}
                draggable={enableReorder && !isReordering}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`${
                  enableReorder ? "cursor-move" : "cursor-default"
                } transition-colors ${
                  draggedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GripVertical
                      className={`h-4 w-4 ${
                        enableReorder ? "text-gray-400" : "text-gray-200"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-500">
                      {tour.order !== undefined ? tour.order : index + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    {tour.coverImageUrl ? (
                      <Image
                        src={tour.coverImageUrl}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <MapPin className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{tour.title}</span>
                    <p className="text-xs text-gray-500">Code: {tour.code}</p>
                    <p className="text-xs text-blue-600">{destinationName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {tour.duration.days}D/{tour.duration.nights}N
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>৳{tour.basePrice.toLocaleString()}</span>
                    {tour?.offer?.isActive && (
                      <Badge className="ml-1 bg-red-100 text-xs text-red-800">
                        {tour?.offer?.discountType === "flat"
                          ? `৳${tour?.offer?.flatDiscount} OFF`
                          : `${tour.offer.discountPercentage}% OFF`}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getColorClass(categoryName)}>
                    {categoryName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[tour.status] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {tour.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {tour.createdAt
                    ? new Date(tour.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(tour)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(tour)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Tour
                      </DropdownMenuItem>
                      {tour.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(tour._id!, "PUBLISHED")}
                          className="text-green-600"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Publish Tour
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(tour._id!)}
                        disabled={isDeleting}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Tour
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

