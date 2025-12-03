"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ITour } from "@/redux/api/features/tour/tourApi";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface ToursTableProps {
  tours: ITour[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (tour: ITour) => void;
  onEdit: (tour: ITour) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onCategoryUpdate?: (id: string, category: string) => void; // Optional now - category managed via edit form
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-red-100 text-red-800",
};

export default function ToursTable({
  tours,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onStatusUpdate,
  onDelete,
}: ToursTableProps): React.ReactElement {
  const columns = [
    {
      header: "Tour",
      accessorKey: "title",
      cell: (tour: ITour) => {
        const destinationName =
          typeof tour.destination === "object"
            ? tour?.destination?.name
            : "Unknown";

        return (
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              {tour.coverImageUrl ? (
                <Image
                  src={tour?.coverImageUrl}
                  alt={tour?.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <MapPin className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">{tour.title}</h3>
              <p className="text-xs text-gray-500">Code: {tour.code}</p>
              <p className="text-xs text-blue-600">{destinationName}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: (tour: ITour) => (
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>
            {tour.duration.days}D/{tour.duration.nights}N
          </span>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "basePrice",
      cell: (tour: ITour) => (
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
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (tour: ITour) => {
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
          <Badge className={getColorClass(categoryName)}>{categoryName}</Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (tour: ITour) => (
        <Badge
          className={statusColors[tour.status] || "bg-gray-100 text-gray-800"}
        >
          {tour.status}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (tour: ITour) => (
        <span className="text-sm text-gray-500">
          {tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      className: "w-[70px]",
      cell: (tour: ITour) => (
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
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Tour
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={tours}
      columns={columns}
      loading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
