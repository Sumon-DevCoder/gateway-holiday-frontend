"use client";

import PageHeader from "@/components/admin/PageHeader";
import UpdateBlogForm from "@/DashboardComponents/Dashboard/Blogs/UpdateBlogForm";
import React from "react";

export default function UpdateBlogPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Blog"
        description="Edit and update your blog post"
      />
      <UpdateBlogForm />
    </div>
  );
}
