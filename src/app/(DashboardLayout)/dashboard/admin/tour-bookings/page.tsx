"use client";

import TourBookingsClient from "@/DashboardComponents/Dashboard/TourBookings/TourBookingsClient";

export default function TourBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Bookings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all tour bookings and reservations
          </p>
        </div>
      </div>

      <TourBookingsClient />
    </div>
  );
}
