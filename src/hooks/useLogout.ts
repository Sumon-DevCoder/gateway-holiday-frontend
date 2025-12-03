import { useLogoutMutation } from "@/redux/api/features/user/userApi";
import { logout } from "@/redux/authSlice";
import { persistor, useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const handleLogout = async (): Promise<void> => {
    try {
      // Call logout API
      await logoutMutation({}).unwrap();

      // Clear Redux state
      dispatch(logout());

      // Clear persisted state
      await persistor.purge();

      // Clear auth-related data from storage
      if (typeof window !== "undefined") {
        // Remove specific auth items instead of clearing everything
        localStorage.removeItem("persist:root");
        localStorage.removeItem("persist:auth");
        sessionStorage.removeItem("persist:root");
        sessionStorage.removeItem("persist:auth");
      }

      // Show success message
      toast.success("Logout successful");

      // Navigate to home page using Next.js router
      router.push("/");
    } catch (error: any) {
      // Even if API call fails, still logout locally
      dispatch(logout());
      await persistor.purge();

      // Clear auth-related data from storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:root");
        localStorage.removeItem("persist:auth");
        sessionStorage.removeItem("persist:root");
        sessionStorage.removeItem("persist:auth");
      }

      toast.success("Logout successful");

      // Navigate to home page using Next.js router
      router.push("/");
    }
  };

  return {
    handleLogout,
    isLoading,
  };
};
