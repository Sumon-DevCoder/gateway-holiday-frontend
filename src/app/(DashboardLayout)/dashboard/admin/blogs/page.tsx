"use client";

import { Button } from "@/components/ui/button";
import BlogsClient from "@/DashboardComponents/Dashboard/Blogs/BlogsClient";
import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      {/* Header Section with Title, Description, Search, Category & Buttons */}
      <div className="flex flex-col gap-6">
        {/* Top Row: Title/Description on left, Search/Category on right */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Title & Description */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Blog Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your blog posts, categories, and content moderation
            </p>
          </div>

          {/* Right: Search & Category Filter */}
          <div className="flex flex-col gap-3 lg:w-[400px]">
            <BlogsClient.SearchAndCategory
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          </div>
        </div>

        {/* Bottom Row: Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link href={"/dashboard/admin/blogs/categories"}>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </Button>
          </Link>
          <Link href={"/dashboard/admin/blogs/add-blog"}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Client-side logic */}
      <BlogsClient
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
    </div>
  );
}
