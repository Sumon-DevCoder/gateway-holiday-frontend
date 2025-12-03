"use client";

// Prevent static generation to avoid suneditor module resolution issues
export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";
import PageHeader from "@/components/admin/PageHeader";

// Dynamically import RichTextEditor to avoid suneditor module resolution issues during build
const RichTextEditor = nextDynamic(
  () => import("@/components/CustomFormComponents/RichTextEditor"),
  { ssr: false }
);
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCreateLeadershipMutation,
  useDeleteLeadershipMutation,
  useGetLeadershipListQuery,
  useUpdateLeadershipMutation,
} from "@/redux/api/features/leadership/leadershipApi";
import {
  LeadershipFormData,
  leadershipFormSchema,
} from "@/schema/leadershipSchema";
import { ILeadership } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LeadershipPage() {
  const {
    data: leadershipResponse,
    isLoading,
    error,
    refetch,
  } = useGetLeadershipListQuery();
  const leadershipItems = leadershipResponse?.data ?? [];

  const [createLeadership, { isLoading: isCreating }] =
    useCreateLeadershipMutation();
  const [updateLeadership, { isLoading: isUpdating }] =
    useUpdateLeadershipMutation();
  const [deleteLeadership, { isLoading: isDeleting }] =
    useDeleteLeadershipMutation();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ILeadership | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<ILeadership | null>(null);

  const form = useForm<LeadershipFormData>({
    resolver: zodResolver(leadershipFormSchema),
    defaultValues: {
      name: "",
      designation: "",
      quote: "",
      isActive: true,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = form;

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    setSelectedImage(null);
    setImagePreview("");
    reset({
      name: "",
      designation: "",
      quote: "",
      isActive: true,
    });
  };

  const onSubmit = async (values: LeadershipFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("designation", values.designation.trim());
      formData.append("quote", values.quote);
      if (typeof values.isActive !== "undefined") {
        formData.append("isActive", String(values.isActive));
      }

      if (selectedImage) {
        formData.append("image", selectedImage);
      } else if (editingEntry?.image) {
        formData.append("image", editingEntry.image);
      }

      if (editingEntry) {
        await updateLeadership({
          id: editingEntry._id,
          formData,
        }).unwrap();
        toast.success("Leadership highlight updated successfully");
      } else {
        if (!selectedImage) {
          toast.error("Please upload a leadership image");
          return;
        }
        await createLeadership(formData).unwrap();
        toast.success("Leadership highlight created successfully");
      }

      handleDialogClose();
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message ??
          `Failed to ${editingEntry ? "update" : "create"} leadership highlight`
      );
    }
  };

  const handleEdit = (entry: ILeadership) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
    setValue("name", entry.name);
    setValue("designation", entry.designation);
    setValue("quote", entry.quote);
    setValue("isActive", entry.isActive);
    setSelectedImage(null);
    setImagePreview(entry.image);
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete?._id) return;

    try {
      await deleteLeadership({ id: entryToDelete._id }).unwrap();
      toast.success("Leadership highlight deleted successfully");
      setIsDeleteDialogOpen(false);
      setEntryToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Failed to delete leadership highlight"
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Highlight"
        description="Manage your leadership spotlight section content."
      />

      <div className="flex justify-end">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => !open && handleDialogClose()}
        >
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Leadership Highlight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] w-full max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry
                  ? "Edit Leadership Highlight"
                  : "Add Leadership Highlight"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter leader name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
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
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <span className="text-sm text-gray-600">
                        {field.value ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="quote"
                render={({ field }) => (
                  <div className="space-y-2">
                    <RichTextEditor
                      name="quote"
                      label="Leadership Quote"
                      required
                      content={field.value || ""}
                      onChangeHandler={field.onChange}
                    />
                    {errors.quote && (
                      <p className="text-sm text-red-500">
                        {errors.quote.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="image">
                  Leadership Image{" "}
                  {editingEntry ? (
                    "(optional)"
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleSelectImage}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full rounded-md object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full sm:w-auto"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingEntry
                      ? "Update Highlight"
                      : "Create Highlight"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading leadership highlights...</p>
          </div>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-3 py-12">
            <p className="text-red-500">
              Failed to load leadership highlights. Please try again.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            {leadershipItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                No leadership highlights found. Click &quot;Add Leadership
                Highlight&quot; to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {leadershipItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-2 md:flex-row md:gap-4">
                        <div className="md:w-48">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-40 w-full rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <Badge
                              variant={item.isActive ? "default" : "secondary"}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.designation}
                          </p>
                          <div className="text-sm text-gray-700">
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: item.quote }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Last updated:{" "}
                            {format(new Date(item.updatedAt), "PPP p")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setEntryToDelete(item);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete leadership highlight?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              selected leadership highlight.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntry}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
