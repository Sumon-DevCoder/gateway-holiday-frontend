"use client";

import AuthorizationForm from "@/components/admin/AuthorizationForm";
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
  useDeleteAuthorizationMutation,
  useGetAllAuthorizationsQuery,
} from "@/redux/api/features/authorization/authorizationApi";
import { IAuthorization } from "@/types/schemas";
import { Edit, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthorizationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthorization, setEditingAuthorization] =
    useState<IAuthorization | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [authorizationToDelete, setAuthorizationToDelete] =
    useState<IAuthorization | null>(null);

  // RTK Query hooks
  const {
    data: authorizationsResponse,
    isLoading,
    error,
  } = useGetAllAuthorizationsQuery();
  const [deleteAuthorization, { isLoading: isDeleting }] =
    useDeleteAuthorizationMutation();

  const authorizations = authorizationsResponse?.data || [];

  const handleEdit = (authorization: IAuthorization) => {
    setEditingAuthorization(authorization);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (authorization: IAuthorization) => {
    setAuthorizationToDelete(authorization);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!authorizationToDelete) return;

    try {
      await deleteAuthorization(authorizationToDelete._id!).unwrap();
      toast.success("Authorization deleted successfully");
      setDeleteConfirmOpen(false);
      setAuthorizationToDelete(null);
    } catch (error) {
      toast.error("Failed to delete authorization");
      }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setAuthorizationToDelete(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAuthorization(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Authorization Management"
          description="Manage authorization images"
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
          title="Authorization Management"
          description="Manage authorization images"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-500">
              Failed to load authorizations. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorization Management"
        description="Manage authorization images"
      />

      {/* Add Authorization Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Authorization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAuthorization
                  ? "Edit Authorization"
                  : "Add New Authorization"}
              </DialogTitle>
            </DialogHeader>
            <AuthorizationForm
              {...(editingAuthorization && {
                authorization: editingAuthorization,
              })}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Authorization Table */}
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
                {authorizations.map((authorization) => (
                  <tr key={authorization._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {authorization.image ? (
                        <div className="h-16 w-24 overflow-hidden rounded-lg">
                          <img
                            src={authorization.image}
                            alt="Authorization"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-200">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {authorization.createdAt
                        ? new Date(authorization.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {authorization.updatedAt
                        ? new Date(authorization.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(authorization)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(authorization)}
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

      {/* Empty State */}
      {authorizations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Authorizations
            </h3>
            <p className="mb-4 text-gray-500">
              Get started by adding your first authorization image
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Authorization
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Authorization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this authorization image? This
              action cannot be undone and will permanently remove the
              authorization from the system.
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
                "Delete Authorization"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
