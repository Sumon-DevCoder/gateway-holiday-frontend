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
import { useSignUpMutation } from "@/redux/api/features/user/userApi";
import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { signupSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

export function RegisterForm({ onSuccess, redirectPath }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Reset form when component mounts to ensure no auto-fill
  useEffect(() => {
    form.reset({
      name: "",
      email: "",
      password: "",
    });
  }, [form]);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const response = await signUp(values).unwrap();
      if (response.success) {
        toast.success("Registration successful!");
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
      toast.error(
        error?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    autoComplete="off"
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
                    autoComplete="off"
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
                    placeholder="Enter your password (min 6 characters)"
                    className="pr-10 pl-10"
                    autoComplete="new-password"
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
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
