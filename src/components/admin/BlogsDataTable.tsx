import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Blog } from "@/types/blog";
import { Edit, Eye, FileText, GripVertical, MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BlogsDataTableProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onView: (blog: Blog) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
  enableReorder?: boolean;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export default function BlogsDataTable({
  blogs,
  onEdit,
  onDelete,
  onView,
  onReorder,
  onStatusUpdate,
  isDeleting = false,
  isReordering = false,
  enableReorder = true,
}: BlogsDataTableProps) {
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

  // Function to strip HTML tags and format content for display
  const formatContent = (content: string, maxLength: number = 80): string => {
    const strippedContent = content.replace(/<[^>]*>/g, "");
    const decodedContent = strippedContent
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    const cleanedContent = decodedContent.replace(/\s+/g, " ").trim();
    return cleanedContent.length > maxLength
      ? cleanedContent.substring(0, maxLength) + "..."
      : cleanedContent;
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead className="w-24">Image</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Read Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog, index) => (
            <TableRow
              key={blog._id}
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
                    className={`h-4 w-4 ${enableReorder ? "text-gray-400" : "text-gray-200"}`}
                  />
                  <span className="text-sm font-medium text-gray-500">
                    {blog.order !== undefined ? blog.order : index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative h-12 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={blog.coverImage || "/placeholder.svg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900">{blog.title}</span>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {formatContent(blog.content, 100)}
                  </p>
                  <Badge variant="secondary" className="w-fit">
                    {blog.category.name}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{blog.readTime}</span>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[blog.status.toLowerCase()]}>
                  {blog.status}
                </Badge>
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
                    <DropdownMenuItem onClick={() => onView(blog)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Blog
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(blog)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Blog
                    </DropdownMenuItem>
                    {blog.status.toLowerCase() === "draft" && onStatusUpdate && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(blog._id, "published")}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Publish Blog
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(blog)}
                      disabled={isDeleting}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Blog
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

