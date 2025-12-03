"use client";

import BannerForm from "@/components/admin/BannerForm";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
} from "@/redux/api/features/banner/bannerApi";
import { IBanner } from "@/types/schemas";
import { Edit, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BannersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<IBanner | null>(null);

  // RTK Query hooks
  const { data: bannersResponse, isLoading, error } = useGetAllBannersQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = bannersResponse?.data || [];

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (banner: IBanner) => {
    setBannerToDelete(banner);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete._id!).unwrap();
      toast.success("Banner deleted successfully");
      setDeleteConfirmOpen(false);
      setBannerToDelete(null);
    } catch (error) {
      toast.error("Failed to delete banner");
      }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setBannerToDelete(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Banner Management"
          description="Manage homepage and section banners"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Banner Management"
          description="Manage homepage and section banners"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-500">
              Failed to load banners. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Management"
        description="Manage homepage and section banners"
      />

      {/* Add Banner Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCloseDialog} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>
            <BannerForm
              banner={editingBanner || undefined}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Table - Desktop */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {banners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {banner.backgroundImage ? (
                          <div className="h-16 w-24 overflow-hidden rounded-lg">
                            <img
                              src={banner.backgroundImage}
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-200">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {banner.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">
                          {banner.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(banner.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(banner)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(banner)}
                            disabled={isDeleting}
                            className="h-8 w-8 p-0"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner Cards - Mobile */}
      <div className="lg:hidden">
        <div className="space-y-4">
          {banners.map((banner) => (
            <Card key={banner._id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Image */}
                  <div className="flex justify-center">
                    {banner.backgroundImage ? (
                      <div className="h-32 w-full max-w-xs overflow-hidden rounded-lg">
                        <img
                          src={banner.backgroundImage}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-32 w-full max-w-xs items-center justify-center rounded-lg bg-gray-200">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{banner.title}</h3>
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {banner.description}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        Created:{" "}
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Updated:{" "}
                        {new Date(banner.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      className="flex-1"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(banner)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {banners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Banners
            </h3>
            <p className="mb-4 text-gray-500">
              Get started by adding your first banner
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the banner "
              {bannerToDelete?.title}"? This action cannot be undone and will
              permanently remove the banner from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Banner"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
