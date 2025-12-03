"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VisaBooking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  visaType: string;
  applicationFee: number;
  transactionId: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function VisaPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");

  const [booking, setBooking] = useState<VisaBooking | null>(null);
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

        const fullUrl = `${apiUrl}/visa-bookings/transaction/${transactionId}`;

        const response = await fetch(fullUrl);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.success) {
          setBooking(data.data);
          toast.success(
            "Payment successful! Your visa application has been submitted."
          );
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

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewApplication = () => {
    if (booking) {
      // Navigate to user dashboard visa booking module
      router.push(`/dashboard/user/visa/${booking._id}`);
    }
  };

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
              <Button onClick={handleGoHome} className="w-full">
                Go to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/visa")}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600">
            Your visa application has been submitted successfully.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {booking && (
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">Application Details</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="font-medium">Application ID:</span>
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
                  <p className="text-gray-600">{booking.email}</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p className="text-gray-600">{booking.phone}</p>
                </div>
                <div>
                  <span className="font-medium">Country:</span>
                  <p className="text-gray-600">{booking.country}</p>
                </div>
                <div>
                  <span className="font-medium">Visa Type:</span>
                  <p className="text-gray-600">{booking.visaType}</p>
                </div>
                <div>
                  <span className="font-medium">Application Fee:</span>
                  <p className="text-gray-600">৳{booking.applicationFee}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600 capitalize">{booking.status}</p>
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
              <li>• We will guide you through the visa application process</li>
              <li>• You can track your application status anytime</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleGoHome} className="flex-1">
              Go to Home
            </Button>
            <Button
              variant="outline"
              onClick={handleViewApplication}
              className="flex-1"
            >
              View in Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
