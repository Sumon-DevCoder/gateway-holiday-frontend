"use client";

import { Blog as BlogType } from "@/types/blog";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  blog: BlogType;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to process tags
  const processTags = (tags: string[] | string): string[] => {
    if (!tags) return [];

    if (Array.isArray(tags)) {
      // If it's an array, check if it contains comma-separated strings
      const allTags: string[] = [];
      tags.forEach((tag) => {
        if (typeof tag === "string" && tag.includes(",")) {
          // Split comma-separated string and add individual tags
          allTags.push(
            ...tag
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t.length > 0)
          );
        } else if (typeof tag === "string" && tag.trim().length > 0) {
          // Add individual tag
          allTags.push(tag.trim());
        }
      });
      return allTags;
    }

    if (typeof tags === "string") {
      // Split by comma and clean up each tag
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    return [];
  };

  return (
    <Link href={`/blog/${blog._id}`} className="block">
      <div className="flex h-[32rem] w-full transform cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image and Status */}
        <div className="relative h-1/2 w-full overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
              <Calendar size={12} />
              {formatDate(blog.createdAt)}
            </div>
            {blog.status === "draft" && (
              <div className="rounded-full bg-yellow-500/90 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                Draft
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-1/2 w-full flex-col justify-between p-6">
          <div>
            <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span>{blog.category.name}</span>
              </div>
            </div>

            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:text-purple-600">
              {blog.title}
            </h3>

            <p className="mb-4 line-clamp-2 text-gray-600">
              {blog.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
            </p>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-1">
              {processTags(blog.tags)
                .slice(0, 3)
                .map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              {processTags(blog.tags).length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{processTags(blog.tags).length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto flex w-full items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-purple-600 transition-colors duration-300 hover:text-purple-700">
              Read More
              <ArrowRight size={16} />
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
