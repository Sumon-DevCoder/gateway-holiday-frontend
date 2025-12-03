"use client";

import CustomTourQueriesClient from "@/DashboardComponents/Dashboard/CustomTourQueries/CustomTourQueriesClient";

export default function CustomTourQueriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Custom Tour Queries
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer tour customization requests
          </p>
        </div>
      </div>

      <CustomTourQueriesClient />
    </div>
  );
}
