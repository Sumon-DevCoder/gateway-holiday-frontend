"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";
import { Home, Mail, Phone, RefreshCw, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VisaCancelledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const { data: companyInfoData } = useGetAllCompanyInfoQuery();
  const companyInfo = Array.isArray(companyInfoData?.data)
    ? companyInfoData?.data[0]
    : companyInfoData?.data;

  useEffect(() => {
    const txnId = searchParams.get("transactionId");
    const countryParam = searchParams.get("country");

    if (txnId) setTransactionId(txnId);
    if (countryParam) setCountry(countryParam);
  }, [searchParams]);

  const handleTryAgain = () => {
    router.push("/visa");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Cancelled Icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <XCircle className="h-12 w-12 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-gray-600">
            You have cancelled the visa application payment
          </p>
        </div>

        {/* Two Cards Side by Side */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Transaction Details Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold text-gray-800">
                Transaction Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {transactionId || "N/A"}
                  </span>
                </div>

                {country && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium text-gray-900">{country}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    Cancelled by User
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="border-blue-200 bg-blue-50 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-3 font-semibold text-blue-900">
                Application Status
              </h3>
              <p className="text-sm text-blue-800">
                No payment was processed. You can try again anytime to complete
                your visa application.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleTryAgain}
            className="flex-1 bg-blue-600 py-5 hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1 py-5 hover:bg-gray-50"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </div>

        {/* Support Contact */}
        {companyInfo && (
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <h3 className="mb-3 font-semibold text-gray-900">
                Questions About Visa?
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                If you have any questions about the visa process or need
                assistance, feel free to reach out:
              </p>
              <div className="space-y-2">
                {companyInfo.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                )}
                {companyInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function VisaCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-600"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <VisaCancelledContent />
    </Suspense>
  );
}
