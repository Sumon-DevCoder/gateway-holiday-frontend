"use client";

import CompanyForm from "@/components/admin/CompanyForm";
import PageHeader from "@/components/admin/PageHeader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useCreateCompanyInfoMutation,
  useDeleteCompanyInfoMutation,
  useGetAllCompanyInfoQuery,
  useUpdateCompanyInfoMutation,
} from "@/redux/api/features/companyInfo/companyInfoApi";
import { CompanyInfoFormData } from "@/types/companyInfo";
import { Edit, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyPage() {
  // For admin page, we need direct access to API for mutations
  const {
    data: companyInfoResponse,
    isLoading,
    refetch,
  } = useGetAllCompanyInfoQuery();

  const [createCompanyInfo, { isLoading: isCreating }] =
    useCreateCompanyInfoMutation();
  const [updateCompanyInfo, { isLoading: isUpdating }] =
    useUpdateCompanyInfoMutation();
  const [deleteCompanyInfo, { isLoading: isDeleting }] =
    useDeleteCompanyInfoMutation();

  const companyInfo = Array.isArray(companyInfoResponse?.data)
    ? companyInfoResponse?.data?.[0]
    : companyInfoResponse?.data;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Prepare default values for form
  const getDefaultValues = () => {
    const dataToUse = editingCompany || companyInfo;
    if (dataToUse) {
      return {
        companyName: dataToUse.companyName || "",
        logo: dataToUse.logo || undefined, // Include logo for edit mode
        address: dataToUse.address || "",
        googleMapUrl: dataToUse.googleMapUrl || "",
        description: dataToUse.description || "",
        email:
          dataToUse.email && dataToUse.email.length > 0
            ? dataToUse.email
            : [""],
        phone:
          dataToUse.phone && dataToUse.phone.length > 0
            ? dataToUse.phone
            : [""],
        socialLinks: {
          facebook: dataToUse.socialLinks?.facebook || "",
          twitter: dataToUse.socialLinks?.twitter || "",
          instagram: dataToUse.socialLinks?.instagram || "",
          linkedin: dataToUse.socialLinks?.linkedin || "",
          youtube: dataToUse.socialLinks?.youtube || "",
          tiktok: dataToUse.socialLinks?.tiktok || "",
        },
        youtube_video: dataToUse.youtube_video || "",
        yearsOfExperience: dataToUse.yearsOfExperience || 0,
        customer_review:
          dataToUse.customer_review !== undefined &&
          dataToUse.customer_review !== null
            ? String(dataToUse.customer_review)
            : "",
        destinations:
          dataToUse.destinations !== undefined &&
          dataToUse.destinations !== null
            ? String(dataToUse.destinations)
            : "",
        openingHours: dataToUse.openingHours || "09:00 AM - 06:00 PM",
        close: dataToUse.close || "Friday",
      };
    }

    return {
      companyName: "",
      logo: undefined, // Explicitly set as undefined for create mode
      address: "",
      googleMapUrl: "",
      description: "",
      email: [""],
      phone: [""],
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
      },
      youtube_video: "",
      yearsOfExperience: 0,
      customer_review: "",
      destinations: "",
      openingHours: "09:00 AM - 06:00 PM",
      close: "Friday",
    };
  };

  const handleEdit = () => {
    setEditingCompany(companyInfo);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyInfo?._id) return;

    try {
      await deleteCompanyInfo(companyInfo._id).unwrap();
      toast.success("Company information deleted successfully");
      setShowDeleteDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to delete company information"
      );
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Information"
          description="Manage your company details and contact information"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Information"
        description="Manage your company details and contact information"
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {!companyInfo ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Company Information
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
              {/* <DialogHeader>
                <DialogTitle>Add Company Information</DialogTitle>
              </DialogHeader> */}
              <CustomForm
                hideSubmitUntilValid={true}
                onSubmit={async (data: CompanyInfoFormData) => {
                  try {
                    console.log("=== CREATE COMPANY INFO DEBUG ===");
                    console.log("Form data received:", data);
                    console.log("Logo value:", data.logo);
                    console.log("Logo type:", typeof data.logo);
                    console.log("Is File?:", data.logo instanceof File);

                    // Create FormData for file upload
                    const formData = new FormData();

                    // Add text fields
                    formData.append(
                      "companyName",
                      data.companyName?.trim() || ""
                    );
                    formData.append("address", data.address?.trim() || "");
                    formData.append(
                      "googleMapUrl",
                      data.googleMapUrl?.trim() || ""
                    );
                    formData.append(
                      "description",
                      data.description?.trim() || ""
                    );

                    // Add arrays as JSON strings
                    formData.append(
                      "email",
                      JSON.stringify(
                        data.email.filter(
                          (email: string) => email.trim() !== ""
                        )
                      )
                    );
                    formData.append(
                      "phone",
                      JSON.stringify(
                        data.phone.filter(
                          (phone: string) => phone.trim() !== ""
                        )
                      )
                    );
                    formData.append(
                      "socialLinks",
                      JSON.stringify(data.socialLinks)
                    );
                    formData.append(
                      "youtube_video",
                      data.youtube_video?.trim() || ""
                    );
                    formData.append(
                      "yearsOfExperience",
                      String(data.yearsOfExperience || 0)
                    );
                    formData.append(
                      "customer_review",
                      (data.customer_review || "").toString().trim()
                    );
                    formData.append(
                      "destinations",
                      (data.destinations || "").toString().trim()
                    );
                    formData.append(
                      "openingHours",
                      data.openingHours?.trim() || ""
                    );
                    formData.append("close", data.close || "Friday");

                    // Handle file uploads
                    if (data.logo && data.logo instanceof File) {
                      console.log("Appending logo file:", data.logo.name);
                      formData.append("logo", data.logo);
                    } else {
                      console.log("❌ No logo file to upload!");
                    }

                    // Log FormData contents
                    console.log("=== FormData Contents ===");
                    for (let [key, value] of formData.entries()) {
                      console.log(key, ":", value);
                    }
                    console.log("========================");

                    await createCompanyInfo(formData).unwrap();
                    toast.success("Company information created successfully");
                    handleCloseDialog();
                    refetch();
                  } catch (error: any) {
                    toast.error(
                      error?.data?.message ||
                        "Failed to save company information"
                    );
                  }
                }}
                defaultValues={getDefaultValues()}
              >
                <CompanyForm
                  companyInfo={editingCompany}
                  onCancel={handleCloseDialog}
                  isLoading={isCreating}
                />
              </CustomForm>
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleEdit} className="w-full sm:w-auto">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Information
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
                <CustomForm
                  hideSubmitUntilValid={true}
                  onSubmit={async (data: CompanyInfoFormData) => {
                    try {
                      // Create FormData for file upload
                      const formData = new FormData();

                      // Add text fields
                      formData.append(
                        "companyName",
                        data.companyName?.trim() || ""
                      );
                      formData.append("address", data.address?.trim() || "");
                      formData.append(
                        "googleMapUrl",
                        data.googleMapUrl?.trim() || ""
                      );
                      formData.append(
                        "description",
                        data.description?.trim() || ""
                      );

                      // Add arrays as JSON strings
                      formData.append(
                        "email",
                        JSON.stringify(
                          data.email.filter(
                            (email: string) => email.trim() !== ""
                          )
                        )
                      );
                      formData.append(
                        "phone",
                        JSON.stringify(
                          data.phone.filter(
                            (phone: string) => phone.trim() !== ""
                          )
                        )
                      );
                      formData.append(
                        "socialLinks",
                        JSON.stringify(data.socialLinks)
                      );
                      formData.append(
                        "youtube_video",
                        data.youtube_video?.trim() || ""
                      );
                      formData.append(
                        "yearsOfExperience",
                        String(data.yearsOfExperience || 0)
                      );
                      formData.append(
                        "customer_review",
                        (data.customer_review || "").toString().trim()
                      );
                      formData.append(
                        "destinations",
                        (data.destinations || "").toString().trim()
                      );
                      formData.append(
                        "openingHours",
                        data.openingHours?.trim() || ""
                      );
                      formData.append("close", data.close || "Friday");

                      // Handle file uploads
                      if (data.logo && data.logo instanceof File) {
                        // New file uploaded - this will replace the old logo
                        formData.append("logo", data.logo);
                      } else if (data.logo === null || data.logo === "") {
                        // User wants to remove logo
                        formData.append("logo", "");
                      } else {
                        // No new file uploaded - preserve existing logo by not sending logo field
                        // Don't append logo field to FormData to preserve existing
                      }

                      await updateCompanyInfo({
                        id: editingCompany._id,
                        data: formData,
                      }).unwrap();
                      toast.success("Company information updated successfully");
                      handleCloseDialog();
                      refetch();
                    } catch (error: any) {
                      toast.error(
                        error?.data?.message ||
                          "Failed to save company information"
                      );
                    }
                  }}
                  defaultValues={getDefaultValues()}
                >
                  <CompanyForm
                    companyInfo={editingCompany}
                    onCancel={handleCloseDialog}
                    isLoading={isUpdating}
                  />
                </CustomForm>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              company information from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Display Company Info */}
      {companyInfo && (
        <Card>
          <CardContent className="space-y-6 p-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-gray-600">Company Name</Label>
                  <p className="mt-1 break-words">
                    {companyInfo.companyName || "Not set"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Logo</Label>
                  {companyInfo.logo ? (
                    <div className="mt-1">
                      <img
                        src={companyInfo.logo}
                        alt="Company Logo"
                        className="h-16 w-auto object-contain"
                      />
                      <a
                        href={companyInfo.logo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm text-blue-600 hover:underline"
                      >
                        View Full Size
                      </a>
                    </div>
                  ) : (
                    <p className="mt-1">Not set</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-600">Address</Label>
                  <p className="mt-1 break-words">
                    {companyInfo.address || "Not set"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-600">Description</Label>
                  <p className="mt-1 break-words">
                    {companyInfo.description || "Not set"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-600">Google Maps URL</Label>
                  {companyInfo.googleMapUrl ? (
                    <a
                      href={companyInfo.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block break-all text-blue-600 hover:underline"
                    >
                      {companyInfo.googleMapUrl}
                    </a>
                  ) : (
                    <p className="mt-1">Not set</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-gray-600">Email</Label>
                  {companyInfo.email?.map((email: string, index: number) => (
                    <p key={index} className="mt-1 break-words">
                      {email}
                    </p>
                  ))}
                </div>
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  {companyInfo.phone?.map((phone: string, index: number) => (
                    <p key={index} className="mt-1 break-words">
                      {phone}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(companyInfo.socialLinks || {}).map(
                  ([platform, url]) =>
                    url && (
                      <div key={platform}>
                        <Label className="text-gray-600 capitalize">
                          {platform}
                        </Label>
                        <a
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block break-all text-blue-600 hover:underline"
                        >
                          {url as string}
                        </a>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* YouTube Video */}
            {companyInfo.youtube_video && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">YouTube Video</h3>
                <div>
                  <Label className="text-gray-600">Video URL</Label>
                  <a
                    href={companyInfo.youtube_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-blue-600 hover:underline"
                  >
                    {companyInfo.youtube_video}
                  </a>
                </div>
              </div>
            )}

            {/* Office Hours */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-medium">Years of Experience</span>
                  <span className="text-gray-600">
                    {companyInfo.yearsOfExperience || 0} years
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-medium">Happy Travelers</span>
                  <span className="text-gray-600">
                    {companyInfo.customer_review || "0"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-medium">Destinations</span>
                  <span className="text-gray-600">
                    {companyInfo.destinations || "50+"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-medium">Opening Hours</span>
                  <span className="text-gray-600">
                    {companyInfo.openingHours || "Not set"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-medium">Close Day</span>
                  <span className="text-gray-600">
                    {companyInfo.close || "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No data message */}
      {!companyInfo && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No company information available.</p>
            <p className="mt-2 text-sm text-gray-400">
              Click "Add Company Information" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
