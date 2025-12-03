"use client";

import PageHeader from "@/components/admin/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUploadProfileImageMutation } from "@/redux/api/features/user/userApi";
import { useCurrentUser } from "@/redux/authSlice";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ExternalLink,
  ImageIcon,
  Loader2,
  Mail,
  Phone,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ProfilePage() {
  const authUser = useSelector(useCurrentUser);

  // RTK Query hooks
  const [uploadProfileImage, { isLoading: isUploadingImage }] =
    useUploadProfileImageMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)", {
        description: "Supported formats: JPEG, PNG, GIF, WebP",
      });
      // Reset the input
      e.target.value = "";
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`Image size is ${fileSizeMB}MB`, {
        description: "Please select an image smaller than 2MB",
      });
      // Reset the input
      e.target.value = "";
      return;
    }

    // Show uploading toast
    const uploadingToast = toast.loading("Uploading profile image...", {
      description: "Please wait while we update your profile picture",
    });

    try {
      await uploadProfileImage(file).unwrap();
      toast.success("Profile image updated successfully!", {
        id: uploadingToast,
        description: "Your new profile picture is now visible",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload profile image", {
        id: uploadingToast,
        description:
          "Please try again or contact support if the problem persists",
      });
    } finally {
      // Reset the input so same file can be selected again
      e.target.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and account settings"
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <div className="group relative">
                  <Avatar className="group-hover:ring-primary/50 h-20 w-20 ring-2 ring-gray-200 transition-all group-hover:ring-4 sm:h-24 sm:w-24">
                    <AvatarImage src={authUser?.profileImg || ""} />
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {authUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full transition-all ${
                      isUploadingImage
                        ? "bg-black/70"
                        : "bg-black/50 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      disabled={isUploadingImage}
                      title="Click to upload new profile image"
                    />
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-1">
                        <Loader2 className="h-5 w-5 animate-spin text-white sm:h-6 sm:w-6" />
                        <span className="text-[10px] text-white sm:text-xs">
                          Uploading...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        <span className="text-[10px] text-white sm:text-xs">
                          Change
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Helper text */}
                <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs">
                  <ImageIcon className="mr-1 inline-block h-3 w-3" />
                  Click to change • Max 2MB
                </p>
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {authUser?.name || "User"}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {authUser?.email}
              </CardDescription>
              <div className="mt-2 flex justify-center">
                <Badge className={getStatusColor("active")}>Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <User className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Member since {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Last updated {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Account Activity
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your booking summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Total Bookings */}
                <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-900">0</p>
                    </div>
                  </div>
                </div>

                {/* Completed Tours */}
                <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Completed</p>
                      <p className="text-2xl font-bold text-green-900">0</p>
                    </div>
                  </div>
                </div>

                {/* Visa Queries */}
                <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-700">Visa Queries</p>
                      <p className="text-2xl font-bold text-purple-900">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your profile details from Google
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Full Name</span>
                </div>
                <span className="text-sm font-medium">
                  {authUser?.name || "Not provided"}
                </span>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email Address</span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium">
                    {authUser?.email || "Not provided"}
                  </span>
                  <Badge
                    variant="secondary"
                    className="flex w-fit items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Phone Number</span>
                </div>
                <span className="text-sm font-medium">
                  {authUser?.phone || "Not provided"}
                </span>
              </div>

              {/* Info Alert */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Your personal information is synced from your Google account.
                  Updates to your Google profile will reflect here
                  automatically.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Account Security
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your account is secured with Google
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Login Method */}
              <div className="space-y-2">
                <Label>Login Method</Label>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Google Sign-In</p>
                    <p className="text-xs text-gray-500">
                      Secure authentication via Google
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>

              {/* Security Info Alert */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">
                  Password & Security
                </AlertTitle>
                <AlertDescription className="text-blue-800">
                  Your password and security settings are managed by Google. To
                  update your password or enable two-factor authentication,
                  visit your{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium underline hover:text-blue-900"
                  >
                    Google Account Security Settings
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>

              {/* Account Created */}
              <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Account Created</span>
                </div>
                <span className="text-sm font-medium">
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
