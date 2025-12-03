"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function BookingCancelledContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <Card className="w-full max-w-lg border-t-4 border-yellow-500 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="h-20 w-20 text-yellow-500" />
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-800">
            Payment Cancelled
          </h1>

          <p className="mb-6 text-lg text-gray-600">
            You have cancelled the payment. Your booking was not completed. You
            can try booking again whenever you're ready.
          </p>

          {transactionId && (
            <div className="mb-8 rounded-lg bg-gray-50 p-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Transaction ID:
                </span>
                <span className="font-mono text-sm text-gray-900">
                  {transactionId}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => router.back()}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Have questions? Contact our support team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingCancelledPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingCancelledContent />
    </Suspense>
  );
}

