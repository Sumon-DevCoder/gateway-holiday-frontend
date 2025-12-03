"use client";

import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState(true);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing using ref
    if (hasProcessedRef.current) {
      return;
    }

    const token = searchParams?.get("token");
    const userParam = searchParams?.get("user");
    const error = searchParams?.get("error");
    let redirect = searchParams?.get("redirect");

    // If no redirect in URL, check localStorage
    if (!redirect && typeof window !== "undefined") {
      redirect = localStorage.getItem("auth_redirect");
      // Clear it after reading
      if (redirect) {
        localStorage.removeItem("auth_redirect");
      }
    }

    if (error) {
      hasProcessedRef.current = true;
      toast.error("Google authentication failed. Please try again.");
      setProcessing(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (token && userParam) {
      try {
        hasProcessedRef.current = true;

        // Decode user data
        const user = JSON.parse(decodeURIComponent(userParam));

        // Store in Redux
        dispatch(setUser({ user, token }));

        toast.success("Successfully logged in with Google!");

        // Check sessionStorage for visa redirect first
        const visaRedirect = sessionStorage.getItem(
          "visa_redirect_after_login"
        );

        if (visaRedirect) {
          // Visa page redirect
          router.replace(visaRedirect);
        } else if (redirect) {
          // If redirect parameter exists, go to that page
          router.replace(redirect);
        } else {
          // Otherwise, use role-based default redirect
          if (user.role === "admin" || user.role === "super_admin") {
            router.replace("/dashboard/admin");
          } else if (user.role === "user") {
            router.replace("/dashboard/user");
          } else {
            router.replace("/");
          }
        }
      } catch (err) {
        hasProcessedRef.current = true;
        toast.error("Failed to process authentication data");
        setProcessing(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } else if (!hasProcessedRef.current) {
      // Only show error if we haven't processed successfully yet
      hasProcessedRef.current = true;
      toast.error("Authentication data missing");
      setProcessing(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-yellow-100">
      <div className="text-center">
        {processing ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-4 border-purple-600"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              Completing Google Sign In...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we redirect you
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Authentication Failed
            </h2>
            <p className="mt-2 text-gray-600">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-yellow-100">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-4 border-purple-600"></div>
            <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
