"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/api/features/user/userApi";
import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

export function LoginForm({ onSuccess, redirectPath }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("admin");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Auto-fill credentials based on selected role
  const autoFillCredentials = (type: "admin" | "user") => {
    if (type === "admin") {
      // Admin credentials - update these with your actual admin credentials
      form.setValue(
        "email",
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com"
      );
      form.setValue(
        "password",
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
      );
    } else {
      // User credentials - update these with your test user credentials
      form.setValue(
        "email",
        process.env.NEXT_PUBLIC_USER_EMAIL || "user@example.com"
      );
      form.setValue(
        "password",
        process.env.NEXT_PUBLIC_USER_PASSWORD || "user@1234Strong"
      );
    }
  };

  // Handle role toggle and auto-fill
  const handleRoleToggle = (role: "admin" | "user") => {
    setSelectedRole(role);
    autoFillCredentials(role);
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(values).unwrap();
      if (response.success) {
        toast.success("Login successful!");
        dispatch(setUser({ user: response.user, token: response.token }));

        // Determine redirect path
        let finalRedirectPath = redirectPath;
        if (!finalRedirectPath) {
          // Default redirect based on role
          if (
            response.user.role === "admin" ||
            response.user.role === "super_admin"
          ) {
            finalRedirectPath = "/dashboard/admin";
          } else {
            finalRedirectPath = "/dashboard/user";
          }
        }

        // Close modal first if onSuccess callback exists
        if (onSuccess) {
          onSuccess();
        }

        // Then redirect (use replace to avoid adding to history)
        setTimeout(() => {
          router.replace(finalRedirectPath);
        }, 100);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to login. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Auto-fill Toggle Buttons */}
        <div className="relative flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => handleRoleToggle("admin")}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              selectedRole === "admin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleToggle("user")}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              selectedRole === "user"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            User
          </button>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-10 pl-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
