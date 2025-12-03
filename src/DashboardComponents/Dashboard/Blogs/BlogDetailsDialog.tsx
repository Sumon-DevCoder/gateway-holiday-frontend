"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Blog } from "@/types/blog";
import Image from "next/image";
import React from "react";

interface BlogDetailDialogProps {
  blog: Blog;
  onClose: () => void;
}

export default function BlogDetailDialog({
  blog,
  onClose,
}: BlogDetailDialogProps): React.ReactElement {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle>{blog.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={800}
              height={400}
              className="rounded-lg object-cover"
            />
            <div className="flex space-x-2">
              <Badge>{blog.category.name}</Badge>
              <Badge variant="outline">{blog.readTime} read</Badge>
              <Badge variant="outline">{blog.status}</Badge>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(blog.tags) ? blog.tags : [blog.tags]).map(
                (tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
