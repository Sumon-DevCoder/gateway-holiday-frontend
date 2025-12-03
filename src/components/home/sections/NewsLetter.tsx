"use client";

import { useSubscribeNewsletterMutation } from "@/redux/api/features/newsletter/newsletterApi";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await subscribeNewsletter({ email }).unwrap();

      setIsSubmitted(true);
      toast.success(response.message || "Successfully subscribed!");

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-16">
      {/* Main Container */}
      <div className="w-full max-w-4xl">
        {/* Newsletter Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          {/* Content */}
          <div className="space-y-6 text-center">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
                Subscribe to Our Newsletter
              </h2>

              <p className="mx-auto max-w-2xl text-sm text-gray-600 md:text-base">
                Get the latest travel deals, destination guides, and insider
                tips delivered straight to your inbox
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  disabled={isLoading || isSubmitted}
                />

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isSubmitted || !email}
                  className={`rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
                    isSubmitted
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } ${isLoading ? "cursor-not-allowed opacity-70" : ""} ${
                    !email && !isSubmitted
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : isSubmitted ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>Subscribed!</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Weekly Updates</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Exclusive Deals</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
