"use client";

import PageHeader from "@/components/admin/PageHeader";
import CategoriesClient from "@/DashboardComponents/Dashboard/Blogs/CategoriesClient";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Categories"
        description="Manage blog categories and content organization"
      />
      {/* Client-side logic with modal */}
      <CategoriesClient />
    </div>
  );
}
