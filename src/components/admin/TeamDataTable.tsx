"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITeam } from "@/types/schemas";
import { Edit, Eye, GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TeamDataTableProps {
  teamMembers: ITeam[];
  onEdit: (member: ITeam) => void;
  onDelete: (member: ITeam) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isDeleting?: boolean;
}

export default function TeamDataTable({
  teamMembers,
  onEdit,
  onDelete,
  onReorder,
  isDeleting = false,
}: TeamDataTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewMember, setPreviewMember] = useState<ITeam | null>(null);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member, index) => (
              <TableRow
                key={member._id}
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
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        onError={() => {
                          }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-xs font-bold text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      ID: {member._id?.slice(-6)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {member.designation}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(member.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMember(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(member)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
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

      {/* Preview Dialog */}
      <Dialog
        open={!!previewMember}
        onOpenChange={() => setPreviewMember(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
          </DialogHeader>
          {previewMember && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                  {previewMember.image ? (
                    <Image
                      src={previewMember.image}
                      alt={previewMember.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-xl font-bold text-white">
                        {previewMember.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {previewMember.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {previewMember.designation}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Added: {formatDate(previewMember.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
