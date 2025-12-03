"use client";

import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { TQueryParam } from "@/types";
import { Blog as BlogType } from "@/types/blog";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export const Blog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Helper function to strip HTML tags and get plain text
  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Always fetch page 1 with high limit since we're doing client-side pagination
  const queryParams: TQueryParam[] = [
    { name: "page", value: "1" }, // Always fetch page 1 for client-side pagination
    { name: "limit", value: "1000" }, // Fetch all blogs for client-side filtering and pagination
    { name: "status", value: "published" }, // Only show published blogs
  ];

  // Fetch blogs from API
  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetAllBlogsQuery(queryParams);

  // Extract blogs from API response
  const allBlogs = Array.isArray(blogsData?.data) ? blogsData.data : [];

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allBlogs.map((blog: BlogType) => blog.category.name))
    ) as string[];
    return uniqueCategories;
  }, [allBlogs]);

  // Filter blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog: BlogType) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || blog.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allBlogs, searchQuery, selectedCategory]);

  // Pagination for filtered results
  const blogsPerPage = 12;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Ensure currentPage doesn't exceed totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 lg:px-8 xl:max-w-[90rem]">
      <div className="container mx-auto px-4">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs by title or content..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full rounded-full border border-gray-300 py-3 pr-12 pl-12 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  title="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all md:px-6 md:text-sm ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 shadow hover:bg-gray-50"
              }`}
            >
              All Categories ({allBlogs.length})
            </button>
            {categories.map((category) => {
              const count = allBlogs.filter(
                (blog: BlogType) => blog.category.name === category
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all md:px-6 md:text-sm ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 shadow hover:bg-gray-50"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-lg"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="mb-2 h-4 rounded bg-gray-300"></div>
                  <div className="mb-4 h-4 w-3/4 rounded bg-gray-300"></div>
                  <div className="mb-2 h-3 rounded bg-gray-300"></div>
                  <div className="mb-4 h-3 w-1/2 rounded bg-gray-300"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 rounded bg-gray-300"></div>
                    <div className="h-4 w-16 rounded bg-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <p className="mb-4 text-lg text-red-500">Failed to load blogs</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        )}

        {/* Magazine Style Blog Grid */}
        {!isLoading && !error && paginatedBlogs.length > 0 && (
          <div className="space-y-8 md:space-y-12">
            {/* First Row - Large Blog */}
            {paginatedBlogs.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                <div className="lg:col-span-1">
                  <Link href={`/blog/${paginatedBlogs[0]?._id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                      <div className="relative h-64 md:h-80">
                        <Image
                          src={
                            paginatedBlogs[0]?.coverImage ||
                            "/placeholder-blog.jpg"
                          }
                          alt={paginatedBlogs[0]?.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                          <span className="mb-2 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold">
                            {paginatedBlogs[0]?.category.name}
                          </span>
                          <h3 className="mb-2 line-clamp-2 text-xl font-bold md:text-2xl">
                            {paginatedBlogs[0]?.title}
                          </h3>
                          <p className="line-clamp-2 text-sm opacity-90">
                            {stripHtml(
                              paginatedBlogs[0]?.content || ""
                            ).substring(0, 150)}
                            ...
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Second Column - Two Medium Blogs */}
                <div className="space-y-4 md:space-y-6">
                  {paginatedBlogs.slice(1, 3).map((blog: BlogType) => (
                    <Link key={blog._id} href={`/blog/${blog._id}`}>
                      <div className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:mb-6">
                        <div className="flex h-32 md:h-36">
                          <div className="relative h-full w-24 flex-shrink-0 md:w-32">
                            <Image
                              src={blog.coverImage || "/placeholder-blog.jpg"}
                              alt={blog.title}
                              width={128}
                              height={128}
                              className="h-full w-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="flex-1 p-3 md:p-4">
                            <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                              {blog.category.name}
                            </span>
                            <h4 className="mb-2 line-clamp-2 text-base font-bold md:text-lg">
                              {blog.title}
                            </h4>
                            <p className="line-clamp-2 text-xs text-gray-600 md:text-sm">
                              {stripHtml(blog.content).substring(0, 40)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Second Row - Three Small Blogs */}
            {paginatedBlogs.length > 3 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {paginatedBlogs.slice(3, 6).map((blog: BlogType) => (
                  <Link key={blog._id} href={`/blog/${blog._id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-40 md:h-48">
                        <Image
                          src={blog.coverImage || "/placeholder-blog.jpg"}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                          <span className="mb-1 inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold">
                            {blog.category.name}
                          </span>
                          <h4 className="line-clamp-2 text-lg font-bold">
                            {blog.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Third Row - Mixed Layout */}
            {paginatedBlogs.length > 6 && (
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
                {/* Large Blog */}
                <div className="lg:col-span-2">
                  <Link href={`/blog/${paginatedBlogs[6]?._id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-56 md:h-64">
                        <Image
                          src={
                            paginatedBlogs[6]?.coverImage ||
                            "/placeholder-blog.jpg"
                          }
                          alt={paginatedBlogs[6]?.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                          <span className="mb-2 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold">
                            {paginatedBlogs[6]?.category.name}
                          </span>
                          <h3 className="mb-2 line-clamp-2 text-xl font-bold">
                            {paginatedBlogs[6]?.title}
                          </h3>
                          <p className="line-clamp-2 text-sm opacity-90">
                            {stripHtml(
                              paginatedBlogs[6]?.content || ""
                            ).substring(0, 120)}
                            ...
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Two Small Blogs */}
                <div className="space-y-4 md:space-y-6 lg:col-span-2">
                  {paginatedBlogs.slice(7, 9).map((blog: BlogType) => (
                    <Link key={blog._id} href={`/blog/${blog._id}`}>
                      <div className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:mb-6">
                        <div className="flex">
                          <div className="relative h-28 w-24 flex-shrink-0">
                            <Image
                              src={blog.coverImage || "/placeholder-blog.jpg"}
                              alt={blog.title}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="flex-1 p-3">
                            <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                              {blog.category.name}
                            </span>
                            <h4 className="line-clamp-2 text-sm font-bold">
                              {blog.title}
                            </h4>
                            <p className="line-clamp-2 text-xs text-gray-600">
                              {stripHtml(blog.content).substring(0, 80)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Remaining Blogs in Grid */}
            {paginatedBlogs.length > 9 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {paginatedBlogs.slice(9).map((blog: BlogType) => (
                  <Link key={blog._id} href={`/blog/${blog._id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-40 md:h-48">
                        <Image
                          src={blog.coverImage || "/placeholder-blog.jpg"}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                          <span className="mb-1 inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold">
                            {blog.category.name}
                          </span>
                          <h4 className="line-clamp-2 text-lg font-bold">
                            {blog.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Blogs State */}
        {!isLoading && !error && paginatedBlogs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">
              {searchQuery || selectedCategory !== "all"
                ? "No blogs found matching your filters"
                : filteredBlogs.length === 0
                  ? "No published blogs available"
                  : "No blogs found on this page"}
            </p>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or category filter"
                : filteredBlogs.length === 0
                  ? "Check back later for new content"
                  : "Please go back to previous pages"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredBlogs.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredBlogs.length)} of{" "}
              {filteredBlogs.length} articles
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 shadow hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-2 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNumber = page as number;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-700 shadow hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 shadow hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
