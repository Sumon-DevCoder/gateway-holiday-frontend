"use client";

import BlogsDataTable from "@/components/admin/BlogsDataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogCategoriesQuery,
  useReorderBlogsMutation,
  useUpdateBlogStatusMutation,
} from "@/redux/api/blogApi";
import { TQueryParam } from "@/types";
import { Blog } from "@/types/blog";
import {
  Edit3,
  FileText,
  Filter,
  FolderOpen,
  Search,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import BlogDetailDialog from "./BlogDetailsDialog";

interface BlogsClientProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

// Separate Search and Category component
export function SearchAndCategory({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}: BlogsClientProps) {
  const { data: categoriesData } = useGetBlogCategoriesQuery({});
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  return (
    <>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="h-10">
          <FolderOpen className="mr-2 h-4 w-4" />
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category: any) => (
            <SelectItem key={category._id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

export default function BlogsClient({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}: BlogsClientProps): React.ReactElement {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [blogsOrder, setBlogsOrder] = useState<Blog[]>([]);

  // Check if reordering should be disabled (when filters or search are active)
  const isReorderDisabled =
    searchTerm.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  // ✅ API Query Parameters - fetch all blogs for reordering when no filters
  const queryParams: TQueryParam[] = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: isReorderDisabled ? "10" : "1000" },
    ...(searchTerm ? [{ name: "searchTerm", value: searchTerm }] : []),
    ...(statusFilter && statusFilter !== "all"
      ? [{ name: "status", value: statusFilter }]
      : []),
    ...(categoryFilter && categoryFilter !== "all"
      ? [{ name: "category", value: categoryFilter }]
      : []),
  ];

  // ✅ API Calls
  const {
    data: blogsData,
    error,
    refetch: refetchBlogs,
  } = useGetAllBlogsQuery(queryParams);
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updateBlogStatus] = useUpdateBlogStatusMutation();
  const [reorderBlogs, { isLoading: isReordering }] = useReorderBlogsMutation();

  // ✅ Extract data from API response based on your actual structure
  const blogs = Array.isArray(blogsData?.data) ? blogsData.data : [];
  const pagination = blogsData?.pagination || {};

  // Sort blogs by order
  useEffect(() => {
    if (blogsData?.data) {
      const sortedBlogs = [...blogsData.data].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return orderA - orderB;
      });
      setBlogsOrder(sortedBlogs);
    } else {
      setBlogsOrder([]);
    }
  }, [blogsData?.data]);

  // ✅ Calculate stats from the blogs data
  const stats = {
    total: pagination.total || blogs.length,
    published: blogs.filter((blog: Blog) => blog.status === "published").length,
    pending: blogs.filter((blog: Blog) => blog.status === "pending").length,
    draft: blogs.filter((blog: Blog) => blog.status === "draft").length,
  };

  const totalPages = pagination.pages || 1;

  // ✅ Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleStatusUpdate = async (
    id: string,
    status: string
  ): Promise<void> => {
    try {
      await updateBlogStatus({
        id,
        status,
      }).unwrap();
      toast.success(`Blog marked as ${status}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update blog status");
    }
  };

  // Create proper handler for onView to fix type mismatch
  const handleView = (blog: Blog): void => {
    setSelectedBlog(blog);
  };

  // Handle edit action - navigate to update page with blog data
  const handleEdit = (blog: Blog): void => {
    // Store blog data in localStorage for the update page to use
    localStorage.setItem("editingBlog", JSON.stringify(blog));
    router.push("/dashboard/admin/blogs/update");
  };

  // Handle reorder blogs
  const handleReorder = async (startIndex: number, endIndex: number) => {
    if (isReorderDisabled) {
      toast.error("Reordering is disabled while filters or search are active.");
      return;
    }

    const previousOrder = blogsOrder;
    const updatedOrder = [...blogsOrder];
    const [movedBlog] = updatedOrder.splice(startIndex, 1);

    if (!movedBlog) {
      return;
    }

    updatedOrder.splice(endIndex, 0, movedBlog);
    setBlogsOrder(updatedOrder);

    try {
      const blogIds = updatedOrder
        .map((blog) => blog._id)
        .filter((id): id is string => Boolean(id));

      if (blogIds.length !== updatedOrder.length) {
        throw new Error("Some blogs are missing identifiers.");
      }

      await reorderBlogs({ blogIds } as { blogIds: string[] }).unwrap();
      toast.success("Blog order updated successfully");
      refetchBlogs();
    } catch (error: any) {
      setBlogsOrder([...previousOrder]);
      toast.error(
        error?.data?.message || "Failed to update blog order. Please try again."
      );
    }
  };

  // Handle delete with Blog object
  const handleDeleteBlog = async (blog: Blog): Promise<void> => {
    try {
      await deleteBlog(blog._id).unwrap();
      toast.success("Blog deleted successfully");
      refetchBlogs();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete blog");
    }
  };

  // ✅ Handle error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Failed to load blogs. Please try again.</p>
      </div>
    );
  }

  // ✅ Safety check to ensure blogs is an array
  if (!Array.isArray(blogs)) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">
          Error: Invalid data format received from API.
        </p>
        <p className="mt-2 text-sm text-gray-500">Check console for details.</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Blogs
                </p>
                <p className="mt-2 text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Published
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Drafts
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Edit3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Section */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}
            className="text-muted-foreground hover:text-foreground text-sm underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Blog Table */}
      <BlogsDataTable
        blogs={blogsOrder}
        onEdit={handleEdit}
        onDelete={handleDeleteBlog}
        onView={handleView}
        onReorder={handleReorder}
        onStatusUpdate={handleStatusUpdate}
        isDeleting={isDeleting}
        isReordering={isReordering}
        enableReorder={!isReorderDisabled}
      />

      {isReorderDisabled && blogsOrder.length > 0 && (
        <Card>
          <CardContent className="border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
            Drag-and-drop ordering is available only when viewing all blogs
            without filters or search. Clear filters to reorder.
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {blogsOrder.length} of {pagination.total} blogs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 py-1 text-sm">
              Page {pagination.page || currentPage} of{" "}
              {pagination.pages || totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= (pagination.pages || totalPages)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Blog Detail Dialog */}
      {selectedBlog && (
        <BlogDetailDialog
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </>
  );
}

// Attach SearchAndCategory as a static property
BlogsClient.SearchAndCategory = SearchAndCategory;
