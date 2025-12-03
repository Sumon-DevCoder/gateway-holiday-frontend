"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Blog } from "@/types/blog";
import { Edit, Eye, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface BlogsTableProps {
  blogs: Blog[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export default function BlogsTable({
  blogs,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onStatusUpdate,
  onDelete,
}: BlogsTableProps): React.ReactElement {
  // Function to strip HTML tags and format content for display
  const formatContent = (content: string, maxLength: number = 80): string => {
    // Remove HTML tags
    const strippedContent = content.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const decodedContent = strippedContent
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Clean up extra whitespace
    const cleanedContent = decodedContent.replace(/\s+/g, " ").trim();

    // Truncate if too long
    return cleanedContent.length > maxLength
      ? cleanedContent.substring(0, maxLength) + "..."
      : cleanedContent;
  };
  const columns = [
    {
      header: "Post",
      accessorKey: "title",
      cell: (blog: Blog) => (
        <div className="flex items-center space-x-3">
          <Image
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            width={64}
            height={48}
            className="h-12 w-16 rounded object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{blog.title}</p>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {formatContent(blog.content, 100)}
            </p>
            <Badge variant="secondary">{blog.category.name}</Badge>
          </div>
        </div>
      ),
    },
    {
      header: "Read Time",
      accessorKey: "readTime",
      cell: (blog: Blog) => <span>{blog.readTime}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (blog: Blog) => (
        <Badge className={statusColors[blog.status.toLowerCase()]}>
          {blog.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (blog: Blog) => (
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" onClick={() => onView(blog)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onEdit(blog)}>
            <Edit className="h-4 w-4" />
          </Button>
          {blog.status.toLowerCase() === "draft" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onStatusUpdate(blog._id, "published")}
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600"
            onClick={() => onDelete(blog._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={blogs}
      columns={columns}
      loading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
