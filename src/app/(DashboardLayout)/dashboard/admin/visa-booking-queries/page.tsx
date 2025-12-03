"use client";

import VisaBookingQueriesClient from "@/DashboardComponents/Dashboard/VisaBookingQueries/VisaBookingQueriesClient";

export default function VisaBookingQueriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visa Bookings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer visa application requests
          </p>
        </div>
      </div>

      <VisaBookingQueriesClient />
    </div>
  );
}
