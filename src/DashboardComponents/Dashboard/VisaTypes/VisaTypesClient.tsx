"use client";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  IVisaType,
  useCreateVisaTypeMutation,
  useDeleteVisaTypeMutation,
  useGetAllVisaTypesQuery,
  useToggleVisaTypeStatusMutation,
  useUpdateVisaTypeMutation,
} from "@/redux/api/features/visaType/visaTypeApi";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function VisaTypesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisaType, setEditingVisaType] = useState<IVisaType | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visaTypeToDelete, setVisaTypeToDelete] = useState<IVisaType | null>(
    null
  );

  // RTK Query hooks
  const {
    data: visaTypesResponse,
    isLoading,
    error,
  } = useGetAllVisaTypesQuery({});
  const [createVisaType, { isLoading: isCreating }] =
    useCreateVisaTypeMutation();
  const [updateVisaType, { isLoading: isUpdating }] =
    useUpdateVisaTypeMutation();
  const [deleteVisaType, { isLoading: isDeleting }] =
    useDeleteVisaTypeMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleVisaTypeStatusMutation();

  const visaTypes = visaTypesResponse?.data || [];

  // Filter visa types based on search term
  const filteredVisaTypes = visaTypes.filter((visaType: IVisaType) =>
    visaType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: visaTypes.length,
    active: visaTypes.filter((vt: IVisaType) => vt.isActive).length,
    inactive: visaTypes.filter((vt: IVisaType) => !vt.isActive).length,
  };

  const handleCreate = () => {
    setEditingVisaType(null);
    setFormData({ name: "", isActive: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (visaType: IVisaType) => {
    setEditingVisaType(visaType);
    setFormData({
      name: visaType.name,
      isActive: visaType.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Visa type name is required");
      return;
    }

    try {
      if (editingVisaType) {
        await updateVisaType({
          id: editingVisaType._id,
          data: formData,
        }).unwrap();
        toast.success("Visa type updated successfully");
      } else {
        await createVisaType(formData).unwrap();
        toast.success("Visa type created successfully");
      }

      setIsDialogOpen(false);
      setFormData({ name: "", isActive: true });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save visa type");
    }
  };

  const handleDeleteClick = (visaType: IVisaType) => {
    setVisaTypeToDelete(visaType);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!visaTypeToDelete) return;

    try {
      await deleteVisaType(visaTypeToDelete._id).unwrap();
      toast.success("Visa type deleted successfully");
      setDeleteDialogOpen(false);
      setVisaTypeToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete visa type");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVisaTypeToDelete(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus({
        id,
        data: { isActive: !currentStatus },
      }).unwrap();
      toast.success(
        `Visa type ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Failed to load visa types</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-lg bg-blue-100 p-2 sm:p-3">
                <div className="h-5 w-5 rounded bg-blue-600 sm:h-6 sm:w-6"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Types
              </p>
              <p className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-lg bg-green-100 p-2 sm:p-3">
                <div className="h-5 w-5 rounded bg-green-600 sm:h-6 sm:w-6"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Active Types
              </p>
              <p className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-lg bg-gray-100 p-2 sm:p-3">
                <div className="h-5 w-5 rounded bg-gray-600 sm:h-6 sm:w-6"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Inactive Types
              </p>
              <p className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {stats.inactive}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search visa types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:w-auto sm:min-w-[300px]"
          />
        </div>

        <Button onClick={handleCreate} className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="xs:inline hidden">Add Visa Type</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </div>

      {/* Visa Types Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredVisaTypes.map((visaType: IVisaType) => (
                <tr key={visaType._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {visaType.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Switch
                        checked={visaType.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(visaType._id, visaType.isActive)
                        }
                        disabled={isToggling}
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {visaType.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {new Date(visaType.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(visaType)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(visaType)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="space-y-4 p-4">
            {filteredVisaTypes.map((visaType: IVisaType) => (
              <div
                key={visaType._id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {visaType.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Created:{" "}
                      {new Date(visaType.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(visaType)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(visaType)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch
                      checked={visaType.isActive}
                      onCheckedChange={() =>
                        handleToggleStatus(visaType._id, visaType.isActive)
                      }
                      disabled={isToggling}
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {visaType.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredVisaTypes.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No visa types found matching your search"
                : "No visa types found"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {editingVisaType ? "Edit Visa Type" : "Create New Visa Type"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Visa Type Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., tourist visa, business visa"
                required
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full gap-2 sm:w-auto"
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingVisaType ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the visa type &quot;
              {visaTypeToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
