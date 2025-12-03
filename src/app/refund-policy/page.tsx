"use client";

import { useGetPolicyPageBySlugQuery } from "@/redux/api/features/policy/policyApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefundPolicyPage() {
  const router = useRouter();

  // Fetch policy data from API
  const {
    data: policyResponse,
    isLoading,
    error,
  } = useGetPolicyPageBySlugQuery("refund");

  const policy = policyResponse?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
          <p className="mt-4 text-lg text-gray-600">Loading policy...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !policy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Policy Not Found
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            The refund policy hasn't been created yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render policy content
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          {/* Header */}
          <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-800">
            <span className="text-purple-600">Refund Policy</span>
          </h1>

          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-b border-gray-300"></div>

          {/* Content - Render HTML */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </div>
      </div>
    </div>
  );
}
