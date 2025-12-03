"use client";

import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CompanyImagesForm from "@/components/admin/CompanyImagesForm";
import PageHeader from "@/components/admin/PageHeader";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateCompanyImagesMutation,
  useDeleteCompanyImagesMutation,
  useDeleteSpecificImageMutation,
  useGetCompanyImagesQuery,
  useUpdateCompanyImagesMutation,
} from "@/redux/api/features/companyImages/companyImagesApi";
import { CompanyImagesFormData, ICompanyImages } from "@/types/companyImages";
import { Edit, Eye, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function CompanyImagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImages, setEditingImages] = useState<ICompanyImages | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<ICompanyImages | null>(
    null
  );

  // States for individual image deletion
  const [deleteSpecificDialogOpen, setDeleteSpecificDialogOpen] =
    useState(false);
  const [specificImageToDelete, setSpecificImageToDelete] = useState<{
    imageUrl: string;
    fieldType: "affiliation" | "paymentAccept";
    images: ICompanyImages;
  } | null>(null);

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<
    { src: string; alt: string }[]
  >([]);

  const {
    data: companyImagesResponse,
    isLoading,
    refetch,
  } = useGetCompanyImagesQuery();

  // Extract company images data properly
  const companyImages = Array.isArray(companyImagesResponse?.data)
    ? companyImagesResponse.data
    : companyImagesResponse?.data
      ? [companyImagesResponse.data]
      : [];

  const [createCompanyImages, { isLoading: isCreating }] =
    useCreateCompanyImagesMutation();
  const [updateCompanyImages, { isLoading: isUpdating }] =
    useUpdateCompanyImagesMutation();
  const [deleteCompanyImages, { isLoading: isDeleting }] =
    useDeleteCompanyImagesMutation();
  const [deleteSpecificImage, { isLoading: isDeletingSpecific }] =
    useDeleteSpecificImageMutation();

  const getDefaultValues = (): CompanyImagesFormData => {
    if (editingImages) {
      return {
        affiliation: editingImages.affiliation || [],
        paymentAccept: editingImages.paymentAccept || [],
      };
    }

    return {
      affiliation: [],
      paymentAccept: [],
    };
  };

  const handleEdit = (images: ICompanyImages) => {
    setEditingImages(images);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingImages(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingImages(null);
  };

  const handleDeleteClick = (images: ICompanyImages) => {
    setImagesToDelete(images);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imagesToDelete) return;

    try {
      await deleteCompanyImages(imagesToDelete._id).unwrap();
      toast.success("Company images deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setImagesToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete company images");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setImagesToDelete(null);
  };

  // Handle individual image deletion
  const handleDeleteSpecificImageClick = (
    imageUrl: string,
    fieldType: "affiliation" | "paymentAccept",
    images: ICompanyImages
  ) => {
    setSpecificImageToDelete({ imageUrl, fieldType, images });
    setDeleteSpecificDialogOpen(true);
  };

  const handleDeleteSpecificImageConfirm = async () => {
    if (!specificImageToDelete) return;

    try {
      await deleteSpecificImage({
        id: specificImageToDelete.images._id,
        fieldType: specificImageToDelete.fieldType,
        data: { imageUrl: specificImageToDelete.imageUrl },
      }).unwrap();
      toast.success(
        `${specificImageToDelete.fieldType} image deleted successfully`
      );
      refetch();
      setDeleteSpecificDialogOpen(false);
      setSpecificImageToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete image");
    }
  };

  const handleDeleteSpecificImageCancel = () => {
    setDeleteSpecificDialogOpen(false);
    setSpecificImageToDelete(null);
  };

  const handleViewImages = (
    images: ICompanyImages,
    type: "affiliation" | "paymentAccept"
  ) => {
    const imageArray =
      type === "affiliation" ? images.affiliation : images.paymentAccept;
    const lightboxData = imageArray.map((image, index) => ({
      src: image,
      alt: `${type} image ${index + 1}`,
    }));

    setLightboxImages(lightboxData);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Authority"
          description="Manage affiliation and payment accept images"
        />
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground mt-2">
              Loading company images...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Images"
        description="Manage affiliation and payment accept images"
      />

      <div className="flex items-center justify-between">
        {/* Only show Add Images button if no data exists */}
        {companyImages.length === 0 && (
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        )}

        {/* Show message when data exists */}
        {companyImages.length > 0 && (
          <div className="text-muted-foreground text-sm">
            Company images are already configured. You can edit or delete them
            below.
          </div>
        )}
      </div>

      {/* Dialog for Add/Edit - Always rendered so Edit button works */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
          <CustomForm
            onSubmit={async (data: CompanyImagesFormData) => {
              try {
                const formData = new FormData();

                // Handle affiliation files - separate new files from existing URLs
                const existingAffiliationUrls: string[] = [];
                const newAffiliationFiles: File[] = [];

                if (data.affiliation && Array.isArray(data.affiliation)) {
                  // Separate existing URLs from new files
                  data.affiliation.forEach((item: any) => {
                    if (item instanceof File) {
                      newAffiliationFiles.push(item);
                      formData.append("affiliation", item);
                    } else if (typeof item === "string" && item.trim() !== "") {
                      existingAffiliationUrls.push(item);
                    }
                  });
                }

                // Add existing URLs as separate form fields so backend knows which ones to keep
                existingAffiliationUrls.forEach((url, index) => {
                  formData.append(`affiliation[${index}]`, url);
                });

                // CRITICAL FIX: Always append affiliation field, even if empty
                // This ensures backend knows we want to update affiliation field
                if (
                  existingAffiliationUrls.length === 0 &&
                  newAffiliationFiles.length === 0
                ) {
                  formData.append("affiliation", ""); // Empty string to indicate no affiliation images
                }

                // Handle payment accept files - separate new files from existing URLs
                const existingPaymentUrls: string[] = [];
                const newPaymentFiles: File[] = [];

                if (data.paymentAccept && Array.isArray(data.paymentAccept)) {
                  // Separate existing URLs from new files
                  data.paymentAccept.forEach((item: any) => {
                    if (item instanceof File) {
                      newPaymentFiles.push(item);
                      formData.append("paymentAccept", item);
                    } else if (typeof item === "string" && item.trim() !== "") {
                      existingPaymentUrls.push(item);
                    }
                  });
                }

                // Add existing URLs as separate form fields so backend knows which ones to keep
                existingPaymentUrls.forEach((url, index) => {
                  formData.append(`paymentAccept[${index}]`, url);
                });

                // CRITICAL FIX: Always append paymentAccept field, even if empty
                // This ensures backend knows we want to update paymentAccept field
                if (
                  existingPaymentUrls.length === 0 &&
                  newPaymentFiles.length === 0
                ) {
                  formData.append("paymentAccept", ""); // Empty string to indicate no payment images
                }

                if (editingImages) {
                  await updateCompanyImages({
                    id: editingImages._id,
                    data: formData,
                  }).unwrap();
                  toast.success("Company images updated successfully");
                } else {
                  await createCompanyImages(formData).unwrap();
                  toast.success("Company images created successfully");
                }

                handleCloseDialog();
                refetch();
              } catch (error: any) {
                toast.error(
                  error?.data?.message || "Failed to save company images"
                );
              }
            }}
            defaultValues={getDefaultValues()}
          >
            <CompanyImagesForm
              companyImages={editingImages}
              onCancel={handleCloseDialog}
              isLoading={editingImages ? isUpdating : isCreating}
            />
          </CustomForm>
        </DialogContent>
      </Dialog>

      {companyImages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No Company Images</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Get started by adding your first set of company images.
            </p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Images
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliation Images</TableHead>
                        <TableHead>Payment Accept Images</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(companyImages) &&
                        companyImages.map((images: ICompanyImages) => (
                          <TableRow key={images._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="grid grid-cols-2 gap-1">
                                  {images.affiliation
                                    .slice(0, 4)
                                    .map((image: string, index: number) => (
                                      <div
                                        key={index}
                                        className="group relative h-12 w-12 cursor-pointer overflow-hidden rounded-md border"
                                        onClick={() =>
                                          handleViewImages(
                                            images,
                                            "affiliation"
                                          )
                                        }
                                      >
                                        <img
                                          src={image}
                                          alt={`Affiliation ${index + 1}`}
                                          className="h-full w-full object-cover"
                                        />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSpecificImageClick(
                                              image,
                                              "affiliation",
                                              images
                                            );
                                          }}
                                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                          title="Delete image"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-muted-foreground text-sm">
                                    {images.affiliation.length} images
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewImages(images, "affiliation")
                                    }
                                    className="h-6 w-6 p-0"
                                    title="View all affiliation images"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="grid grid-cols-2 gap-1">
                                  {images.paymentAccept
                                    .slice(0, 4)
                                    .map((image: string, index: number) => (
                                      <div
                                        key={index}
                                        className="group relative h-12 w-12 cursor-pointer overflow-hidden rounded-md border"
                                        onClick={() =>
                                          handleViewImages(
                                            images,
                                            "paymentAccept"
                                          )
                                        }
                                      >
                                        <img
                                          src={image}
                                          alt={`Payment ${index + 1}`}
                                          className="h-full w-full object-cover"
                                        />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSpecificImageClick(
                                              image,
                                              "paymentAccept",
                                              images
                                            );
                                          }}
                                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                          title="Delete image"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-muted-foreground text-sm">
                                    {images.paymentAccept.length} images
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleViewImages(images, "paymentAccept")
                                    }
                                    className="h-6 w-6 p-0"
                                    title="View all payment accept images"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(images.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(images)}
                                  className="h-8 w-8 p-0"
                                  title="Edit Images"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteClick(images)}
                                  disabled={isDeleting}
                                  className="h-8 w-8 p-0"
                                  title="Delete Images"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {companyImages.map((images: ICompanyImages) => (
                <Card key={images._id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Affiliation Images */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Affiliation Images ({images.affiliation.length})
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewImages(images, "affiliation")
                            }
                            className="h-6 w-6 p-0"
                            title="View all affiliation images"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {images.affiliation
                            .slice(0, 4)
                            .map((image: string, index: number) => (
                              <div
                                key={index}
                                className="group relative h-16 w-full cursor-pointer overflow-hidden rounded-md border"
                                onClick={() =>
                                  handleViewImages(images, "affiliation")
                                }
                              >
                                <img
                                  src={image}
                                  alt={`Affiliation ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSpecificImageClick(
                                      image,
                                      "affiliation",
                                      images
                                    );
                                  }}
                                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                  title="Delete image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Payment Accept Images */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Payment Images ({images.paymentAccept.length})
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewImages(images, "paymentAccept")
                            }
                            className="h-6 w-6 p-0"
                            title="View all payment accept images"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {images.paymentAccept
                            .slice(0, 4)
                            .map((image: string, index: number) => (
                              <div
                                key={index}
                                className="group relative h-16 w-full cursor-pointer overflow-hidden rounded-md border"
                                onClick={() =>
                                  handleViewImages(images, "paymentAccept")
                                }
                              >
                                <img
                                  src={image}
                                  alt={`Payment ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSpecificImageClick(
                                      image,
                                      "paymentAccept",
                                      images
                                    );
                                  }}
                                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                  title="Delete image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="text-muted-foreground text-sm">
                        Created:{" "}
                        {new Date(images.createdAt).toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(images)}
                          className="flex-1"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(images)}
                          disabled={isDeleting}
                          className="flex-1"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Lightbox for Full Screen Image View */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Images</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these company images? This action
              cannot be undone.
              {imagesToDelete && (
                <div className="mt-2 text-sm">
                  <div>
                    • {imagesToDelete.affiliation.length} affiliation image(s)
                  </div>
                  <div>
                    • {imagesToDelete.paymentAccept.length} payment accept
                    image(s)
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Specific Image Confirmation Dialog */}
      <AlertDialog
        open={deleteSpecificDialogOpen}
        onOpenChange={setDeleteSpecificDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this{" "}
              {specificImageToDelete?.fieldType} image? This action cannot be
              undone.
              {specificImageToDelete && (
                <div className="mt-2">
                  <img
                    src={specificImageToDelete.imageUrl}
                    alt="Image to delete"
                    className="h-20 w-20 rounded-md object-cover"
                  />
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteSpecificImageCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSpecificImageConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingSpecific}
            >
              {isDeletingSpecific ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
