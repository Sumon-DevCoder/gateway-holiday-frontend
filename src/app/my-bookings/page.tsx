"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, Lock } from "lucide-react";
import { useGetBookingByTransactionIdQuery } from "@/redux/api/features/booking/bookingApi";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [searchedTransactionId, setSearchedTransactionId] = useState("");

  // Only fetch when user clicks search
  const { data, isLoading, error } = useGetBookingByTransactionIdQuery(
    searchedTransactionId,
    {
      skip: !searchedTransactionId,
    }
  );

  const handleSearch = () => {
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID");
      return;
    }
    setSearchedTransactionId(transactionId.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Track Your Booking
          </h1>
          <p className="text-gray-600">
            Enter your transaction ID to view your booking details
          </p>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder="Enter your transaction ID (e.g., TXN123456...)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can find this in your confirmation email
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 md:w-auto"
                >
                  {isLoading ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Searching for your booking...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && searchedTransactionId && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h3 className="mb-2 text-lg font-semibold text-red-800">
                Booking Not Found
              </h3>
              <p className="mb-4 text-red-600">
                We couldn't find a booking with this transaction ID. Please
                check the ID and try again.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchedTransactionId("");
                  setTransactionId("");
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        {data?.success && data?.data && (
          <Card className="border-t-4 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-semibold text-gray-700">Status:</span>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      data.data.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {data.data.paymentStatus?.toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      data.data.bookingStatus === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {data.data.bookingStatus?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-800">
                  Customer Information
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{data.data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{data.data.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{data.data.phone}</p>
                  </div>
                </div>
              </div>

              {/* Tour Information */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-800">
                  Tour Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Tour Package</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {data.data.tourTitle}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-medium">{data.data.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{data.data.duration} Days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Fee</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(data.data.bookingFee)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Information */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-800">
                  Transaction Details
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-mono text-sm">{data.data._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-mono text-sm">
                      {data.data.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-medium">
                      {formatDate(data.data.createdAt)}
                    </p>
                  </div>
                  {data.data.paidAt && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium">
                        {formatDate(data.data.paidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Print Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Prompt */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-6 text-center">
            <Lock className="mx-auto mb-3 h-10 w-10 text-blue-600" />
            <h3 className="mb-2 text-lg font-semibold text-blue-800">
              Want to manage all your bookings?
            </h3>
            <p className="mb-4 text-blue-700">
              Create an account or login to view and manage all your bookings in
              one place
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/register")}
                variant="outline"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

