import { useCurrentUser } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const authUser = useSelector(useCurrentUser);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const toastShownRef = useRef(false);

  // Force re-render when auth state changes
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [authUser]);

  const checkAuth = (
    action: string = "perform this action",
    onUnauthorized?: () => void
  ) => {
    // Double check with localStorage as fallback
    let localAuthUser = null;
    if (typeof window !== "undefined") {
      try {
        const persistAuth = localStorage.getItem("persist:auth");
        if (persistAuth) {
          const parsed = JSON.parse(persistAuth);
          localAuthUser = parsed.user !== "null" ? parsed.user : null;
        }
      } catch (e) {}
    }

    const isAuthenticated = authUser || localAuthUser;

    if (!isAuthenticated) {
      // Only show toast once per session
      if (!toastShownRef.current) {
        toast.error(`Please login to ${action}`);
        toastShownRef.current = true;
        // Reset after 3 seconds
        setTimeout(() => {
          toastShownRef.current = false;
        }, 3000);
      }

      // If custom callback provided, use it; otherwise redirect to login
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Get current pathname to redirect back after login
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "/";
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return false;
    }

    return true;
  };

  const checkAuthWithLoading = async (
    action: string = "perform this action"
  ) => {
    setIsChecking(true);

    // Small delay to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isAuthenticated = checkAuth(action);
    setIsChecking(false);

    return isAuthenticated;
  };

  return {
    authUser,
    checkAuth,
    checkAuthWithLoading,
    isChecking,
    forceUpdate,
  };
};
