"use client";

import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { TQueryParam } from "@/types";
import { Blog as BlogType } from "@/types/blog";
import { Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface BlogDetailProps {
  blog: BlogType;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch all published blogs for sidebar
  const queryParams: TQueryParam[] = [
    { name: "page", value: "1" },
    { name: "limit", value: "50" },
    { name: "status", value: "published" },
  ];

  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetAllBlogsQuery(queryParams);
  const allBlogs = Array.isArray(blogsData?.data) ? blogsData.data : [];

  // Filtered posts for recent posts sidebar
  const filteredPosts = useMemo(() => {
    if (!blog?._id) return []; // Safety check to prevent error

    return allBlogs.filter((post: any) => {
      // Handle both string and array formats for tags
      const tagsArray = post.tags
        ? Array.isArray(post.tags)
          ? post.tags
          : post.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
        : [];

      // If no search query, match all
      if (!searchQuery || searchQuery.trim() === "") {
        const matchesCategory =
          selectedCategory === "all" || post.category.name === selectedCategory;
        return matchesCategory && post._id !== blog._id;
      }

      // Search in title, content, and tags
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tagsArray.some((tag: any) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || post.category.name === selectedCategory;

      return matchesSearch && matchesCategory && post._id !== blog._id;
    });
  }, [searchQuery, selectedCategory, blog?._id, allBlogs]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Add safety check for blog object
  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {blog.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                {/* Blog Content */}
                <div
                  className="prose mb-6 max-w-none leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Social Share */}
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      Share On:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {/* Facebook */}
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          // Check if localhost
                          if (
                            url.includes("localhost") ||
                            url.includes("127.0.0.1")
                          ) {
                            alert(
                              "Facebook doesn't allow sharing localhost URLs. Please test this on a deployed website.\n\nURL to share: " +
                                url
                            );
                            return;
                          }

                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                            "_blank",
                            "width=600,height=400"
                          );
                        }}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        title="Share on Facebook"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>

                      {/* Twitter */}
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          const text = blog.title;
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                            "_blank",
                            "width=600,height=400"
                          );
                        }}
                        className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                        title="Share on Twitter"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </button>

                      {/* LinkedIn */}
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                            "_blank",
                            "width=600,height=400"
                          );
                        }}
                        className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
                        title="Share on LinkedIn"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          const text = blog.title;
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
                            "_blank"
                          );
                        }}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        title="Share on WhatsApp"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Loading State for Sidebar */}
            {isLoading ? (
              <>
                {/* Search Skeleton */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-12 w-full animate-pulse rounded-md bg-gray-200"></div>
                </div>

                {/* Categories Skeleton */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-4 flex-1 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Posts Skeleton */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : error ? (
              /* Error State for Sidebar */
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="py-8 text-center">
                  <p className="mb-2 text-sm font-semibold text-red-500">
                    Failed to load sidebar content
                  </p>
                  <p className="text-xs text-gray-500">
                    Please refresh the page to try again
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold underline">
                    Search From Blog
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search blogs by title, content, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          // Already filtering automatically
                        }
                      }}
                      className="w-full rounded-md border border-gray-300 py-3 pr-12 pl-4 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {}}
                      className="absolute top-2 right-2 rounded bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
                      title="Search"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                  {searchQuery && (
                    <p className="mt-2 text-xs text-gray-500">
                      Found {filteredPosts.length} result
                      {filteredPosts.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Post Categories */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold underline">
                    Post Categories
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="all"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="all"
                        className="flex-1 cursor-pointer text-sm text-gray-700 hover:text-purple-600"
                      >
                        All Categories ({allBlogs.length})
                      </label>
                    </div>
                    {Array.from(
                      new Set(allBlogs.map((blog: any) => blog.category.name))
                    ).map((categoryName) => {
                      const count = allBlogs.filter(
                        (blog: any) => blog.category.name === categoryName
                      ).length;
                      return (
                        <div
                          key={categoryName as string}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            id={categoryName as string}
                            name="category"
                            checked={selectedCategory === categoryName}
                            onChange={() =>
                              setSelectedCategory(categoryName as string)
                            }
                            className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor={categoryName as string}
                            className="flex-1 cursor-pointer text-sm text-gray-700 hover:text-purple-600"
                          >
                            {categoryName} ({count})
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold underline">
                    {searchQuery ? "Search Results" : "Recent Posts"}
                  </h3>
                  {filteredPosts.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-500">
                        {searchQuery
                          ? "No blogs found matching your search."
                          : "No other blogs available."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPosts.slice(0, 5).map((post: any) => (
                        <Link
                          key={post._id}
                          href={`/blog/${post._id}`}
                          className="block"
                        >
                          <div className="flex cursor-pointer gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50">
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                sizes="64px"
                                className="rounded object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="mb-1 text-xs text-purple-600">
                                {formatDate(post.createdAt)}
                              </p>
                              <h4 className="mb-1 line-clamp-2 text-sm leading-tight font-medium text-gray-900 transition-colors duration-200 hover:text-purple-600">
                                {post.title}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
