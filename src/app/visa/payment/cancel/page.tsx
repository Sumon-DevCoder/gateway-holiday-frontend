"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VisaPaymentCancelPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  useEffect(() => {
    toast.info("Payment was cancelled");
  }, []);

  const handleTryAgain = () => {
    router.push("/visa");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="mx-auto mb-4 h-20 w-20 text-orange-500" />
          <CardTitle className="text-2xl text-orange-600">
            Payment Cancelled
          </CardTitle>
          <p className="text-gray-600">
            You cancelled the payment process. No charges have been made.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-800">Need help?</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• You can try the payment process again</li>
              <li>• Contact our support team for assistance</li>
              <li>• Check our FAQ section for common issues</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
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
