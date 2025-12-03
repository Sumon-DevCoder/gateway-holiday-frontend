"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

interface TourBooking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  tourTitle: string;
  destination: string;
  travelDate: string;
  persons: number;
  bookingFee: number;
  transactionId: string;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId =
    searchParams.get("tran_id") || searchParams.get("transactionId");

  const [booking, setBooking] = useState<TourBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setError("Transaction ID not found");
      setLoading(false);
      return;
    }

    // Fetch booking details by transaction ID
    const fetchBooking = async () => {
      try {
        let apiUrl = process.env["NEXT_PUBLIC_API_URL"];

        // Check if API URL is defined
        if (!apiUrl) {
          throw new Error("API configuration error. Please contact support.");
        }

        const fullUrl = `${apiUrl}/bookings/transaction/${transactionId}`;

        const response = await fetch(fullUrl);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.success) {
          setBooking(data.data);
          toast.success("Payment successful! Your booking has been confirmed.");
        } else {
          throw new Error(data.message || "Failed to fetch booking details");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch booking details");
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <CardTitle className="text-red-600">
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/package")}
                className="w-full"
              >
                Browse Tours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-4xl border-t-4 border-green-500 shadow-xl">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
          <CardTitle className="text-2xl text-green-600">
            Payment Successful! 🎉
          </CardTitle>
          <p className="text-gray-600">
            Your booking has been confirmed. We've sent a confirmation email to
            your inbox.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {booking && (
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="font-medium">Booking ID:</span>
                  <p className="text-gray-600">{booking._id}</p>
                </div>
                <div>
                  <span className="font-medium">Transaction ID:</span>
                  <p className="font-mono text-gray-600">
                    {booking.transactionId}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Name:</span>
                  <p className="text-gray-600">{booking.name}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-gray-600">{booking.email || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p className="text-gray-600">{booking.phone}</p>
                </div>
                <div>
                  <span className="font-medium">Tour:</span>
                  <p className="text-gray-600">{booking.tourTitle}</p>
                </div>
                <div>
                  <span className="font-medium">Destination:</span>
                  <p className="text-gray-600">{booking.destination}</p>
                </div>
                <div>
                  <span className="font-medium">Travel Date:</span>
                  <p className="text-gray-600">
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Persons:</span>
                  <p className="text-gray-600">{booking.persons}</p>
                </div>
                <div>
                  <span className="font-medium">Booking Fee:</span>
                  <p className="text-gray-600">৳{booking.bookingFee}</p>
                </div>
                <div>
                  <span className="font-medium">Booking Status:</span>
                  <p className="text-gray-600 capitalize">
                    {booking.bookingStatus}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <p className="text-gray-600 capitalize">
                    {booking.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-800">
              What happens next?
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• You will receive a confirmation email shortly</li>
              <li>• Our team will contact you within 24 hours</li>
              <li>• Check your booking status in My Bookings</li>
              <li>• Contact support for any queries</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => router.push("/")}
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/user/tour")}
              className="flex-1"
            >
              View My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
