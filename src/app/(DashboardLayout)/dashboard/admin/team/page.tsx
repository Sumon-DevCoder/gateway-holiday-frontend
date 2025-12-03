"use client";

import PageHeader from "@/components/admin/PageHeader";
import TeamDataTable from "@/components/admin/TeamDataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useGetTeamMembersQuery,
  useReorderTeamMembersMutation,
  useUpdateTeamMemberMutation,
} from "@/redux/api/features/team/teamApi";
import {
  CreateTeamMemberFormData,
  createTeamMemberSchema,
} from "@/schema/teamSchema";
import { ITeam } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TeamPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query hooks
  const {
    data: teamResponse,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useGetTeamMembersQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
  });

  // Extract team members and pagination from response
  const teamMembers = teamResponse?.data || [];
  const pagination = teamResponse?.pagination;

  const [createTeamMember, { isLoading: isCreating }] =
    useCreateTeamMemberMutation();
  const [updateTeamMember, { isLoading: isUpdating }] =
    useUpdateTeamMemberMutation();
  const [deleteTeamMember, { isLoading: isDeleting }] =
    useDeleteTeamMemberMutation();
  const [reorderTeamMembers, { isLoading: isReordering }] =
    useReorderTeamMembersMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ITeam | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ITeam | null>(null);
  const [teamMembersOrder, setTeamMembersOrder] = useState<ITeam[]>([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTeamMemberFormData>({
    resolver: zodResolver(createTeamMemberSchema),
    defaultValues: {
      name: "",
      designation: "",
    },
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Update order when team members change
  useEffect(() => {
    if (teamResponse?.data) {
      setTeamMembersOrder(teamResponse.data);
    }
  }, [teamResponse?.data]);

  const handleSubmit = async (data: CreateTeamMemberFormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name.trim());
      formDataToSend.append("designation", data.designation.trim());

      // Only append image if one is selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (editingMember) {
        // Update existing member
        await updateTeamMember({
          id: editingMember._id!,
          formData: formDataToSend,
        }).unwrap();
        toast.success("Team member updated successfully!");
      } else {
        // Create new member
        await createTeamMember(formDataToSend).unwrap();
        toast.success("Team member added successfully!");
      }

      // Only reset form and close dialog on success
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save team member");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEdit = (member: ITeam) => {
    setEditingMember(member);
    setValue("name", member.name);
    setValue("designation", member.designation);
    setSelectedImage(null);
    setImagePreview(member.image);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (member: ITeam) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      await deleteTeamMember(memberToDelete._id!).unwrap();
      toast.success("Team member deleted successfully!");
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete team member");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    const newOrder = [...teamMembersOrder];
    const [removed] = newOrder.splice(startIndex, 1);
    if (removed) {
      newOrder.splice(endIndex, 0, removed);
      setTeamMembersOrder(newOrder);

      // Save the new order to the backend
      try {
        const teamIds = newOrder
          .map((member) => member._id)
          .filter((id): id is string => !!id); // Filter out undefined IDs

        if (teamIds.length === 0) {
          throw new Error("No valid team IDs found");
        }

        await reorderTeamMembers({ teamIds }).unwrap();
        toast.success("Team member order saved successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to save team order");
        // Revert the local state on error
        setTeamMembersOrder(teamMembers);
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    reset();
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage your team members and their information"
      />

      {/* Add Team Member Button */}
      <div className="flex justify-end">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Only reset when manually closing (not on error)
              handleCloseDialog();
            } else {
              setIsDialogOpen(open);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleFormSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter team member name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  placeholder="Enter designation"
                  {...register("designation")}
                  className={errors.designation ? "border-red-500" : ""}
                />
                {errors.designation && (
                  <p className="text-sm text-red-500">
                    {errors.designation.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {!imagePreview && editingMember && (
                  <div className="mt-2">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200">
                      <Image
                        src={editingMember.image}
                        alt="Current"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingMember
                      ? "Update"
                      : "Add"}{" "}
                  Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoadingMembers && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-gray-500">Loading team members...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {membersError && (
        <div className="py-8 text-center">
          <p className="mb-4 text-red-500">Failed to load team members</p>
          <Button onClick={() => refetchMembers()} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Stats */}
      {!isLoadingMembers && !membersError && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="mr-3 h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="mr-3 h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="mr-3 h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recently Added
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      teamMembers.filter((member: ITeam) => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return new Date(member.createdAt) > oneWeekAgo;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Members DataTable */}
      {!isLoadingMembers && !membersError && teamMembersOrder.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="flex flex-1 items-center gap-4 sm:justify-end">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {pagination?.total || teamMembersOrder.length} members
                </p>
              </div>
            </div>
            <TeamDataTable
              teamMembers={teamMembersOrder}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onReorder={handleReorder}
              isDeleting={isDeleting || isReordering}
            />
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {teamMembersOrder.length} of {pagination.total} members
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoadingMembers}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="flex items-center px-3 py-1 text-sm">
                    Page {pagination.page || currentPage} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage >= pagination.pages || isLoadingMembers
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoadingMembers && !membersError && teamMembersOrder.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Team Members
            </h3>
            <p className="mb-4 text-gray-500">
              Get started by adding your first team member
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Team Member
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2 text-sm text-gray-600">
              Are you sure you want to delete this team member?
            </p>
            {memberToDelete && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="font-medium text-gray-900">
                  {memberToDelete.name}
                </p>
                <p className="text-sm text-gray-500">
                  {memberToDelete.designation}
                </p>
              </div>
            )}
            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
