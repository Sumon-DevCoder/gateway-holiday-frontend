"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICountryVisa } from "@/types/schemas";
import { Edit, Eye, Globe, GripVertical, Shield, Trash2 } from "lucide-react";
import { useState } from "react";

interface VisasDataTableProps {
  visas: ICountryVisa[];
  onView: (visa: ICountryVisa) => void;
  onEdit: (visa: ICountryVisa) => void;
  onDelete: (visa: ICountryVisa) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
  enableReorder?: boolean;
}

export default function VisasDataTable({
  visas,
  onView,
  onEdit,
  onDelete,
  onReorder,
  isDeleting = false,
  isReordering = false,
  enableReorder = true,
}: VisasDataTableProps) {
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
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Visa Types</TableHead>
            <TableHead>Processing Fee</TableHead>
            <TableHead>Processing Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <div className="py-8">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    No visa information available
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            visas.map((visa, index) => (
              <TableRow
                key={visa._id}
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
                      {visa.order !== undefined ? visa.order : index + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{visa.countryName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(visa.visaTypes || []).map((type, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {typeof type === "string"
                          ? type
                          : type?.name || "Unknown"}
                      </Badge>
                    ))}
                    {(!visa.visaTypes || visa.visaTypes.length === 0) && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-400"
                      >
                        No visa types
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {visa.processingFee ? (
                    <span className="font-semibold text-green-600">
                      {visa.processingFee.toLocaleString()} BDT
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {visa.processing_time ? (
                    <span className="text-sm text-blue-600">
                      {visa.processing_time}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={visa.isActive ? "default" : "secondary"}>
                    {visa.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(visa)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(visa)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(visa)}
                      disabled={isDeleting}
                      title="Delete"
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
  );
}
