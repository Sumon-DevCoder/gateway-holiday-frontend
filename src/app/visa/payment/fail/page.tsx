"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VisaPaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const transactionId = searchParams.get("tran_id");

  const [errorMessage, setErrorMessage] = useState<string>("Payment failed");

  useEffect(() => {
    // Set appropriate error message based on error type
    switch (error) {
      case "no_transaction_id":
        setErrorMessage("Transaction ID not found. Please try again.");
        break;
      case "verification_failed":
        setErrorMessage("Payment verification failed. Please contact support.");
        break;
      case "processing_error":
        setErrorMessage("An error occurred while processing your payment.");
        break;
      case "payment_failed":
        setErrorMessage("Your payment was not successful. Please try again.");
        break;
      default:
        setErrorMessage("Payment failed. Please try again.");
    }

    toast.error("Payment failed");
  }, [error]);

  const handleTryAgain = () => {
    router.push("/visa");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality
    // For now, just show an alert
    alert(
      "Please contact our support team at support@gatewayholidays.com or call +880-1234-567890"
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
          <CardTitle className="text-2xl text-red-600">
            Payment Failed
          </CardTitle>
          <p className="text-gray-600">{errorMessage}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {transactionId && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold">Transaction Details</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Transaction ID:</span>{" "}
                {transactionId}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-yellow-50 p-4">
            <h4 className="mb-2 font-semibold text-yellow-800">
              What can you do?
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Check your payment method and try again</li>
              <li>• Ensure you have sufficient balance</li>
              <li>• Contact your bank if the issue persists</li>
              <li>• Contact our support team for assistance</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleContactSupport}
              className="w-full"
            >
              Contact Support
            </Button>
            <Button variant="ghost" onClick={handleGoHome} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
