"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useGetFaqStatsQuery,
  useToggleFaqStatusMutation,
  useUpdateFaqMutation,
} from "@/redux/api/features/faq/faqApi";
import { CreateFaqFormData, createFaqSchema } from "@/schema/faqSchema";
import { CreateFaqRequest, IFaq, UpdateFaqRequest } from "@/types/faq";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Eye, EyeOff, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function FaqsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<IFaq | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<IFaq | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateFaqFormData>({
    resolver: zodResolver(createFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      isActive: true,
    },
  });

  // API Queries
  const {
    data: faqsData,
    isLoading,
    refetch,
  } = useGetFaqsQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter !== "all" && { isActive: statusFilter === "active" }),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: statsData } = useGetFaqStatsQuery();

  // Mutations
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleFaqStatusMutation();

  const faqs = faqsData?.data || [];
  const pagination = faqsData?.pagination;

  // Handle form submission
  const handleSubmit = async (data: CreateFaqFormData) => {
    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          data: data as UpdateFaqRequest,
        }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        // Prepare payload - only include optional fields if they're defined
        const payload: CreateFaqRequest = {
          question: data.question,
          ...(data.answer && { answer: data.answer }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        };
        await createFaq(payload).unwrap();
        toast.success("FAQ created successfully");
      }

      // Only reset form and close dialog on success
      resetForm();
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      // Handle validation errors
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        const errorMessages = error.data.errors
          .map((err: any) => err.message)
          .join(", ");
        toast.error(errorMessages);
      } else {
        toast.error(
          error?.data?.message || error?.message || "Something went wrong"
        );
      }
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      await deleteFaq(faqToDelete._id).unwrap();
      toast.success("FAQ deleted successfully");
      setShowDeleteDialog(false);
      setFaqToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (faq: IFaq) => {
    try {
      await toggleStatus(faq._id).unwrap();
      toast.success(
        `FAQ ${faq.isActive ? "deactivated" : "activated"} successfully`
      );
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Reset form
  const resetForm = () => {
    reset();
    setEditingFaq(null);
  };

  // Handle edit
  const handleEdit = (faq: IFaq) => {
    setEditingFaq(faq);
    // Reset form with the FAQ data
    reset({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setIsDialogOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs Management"
        description="Manage frequently asked questions for your website"
      />

      {/* Stats Cards */}
      {statsData && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive FAQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.inactive}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>FAQs</CardTitle>
              <p className="text-muted-foreground text-sm">
                Manage your frequently asked questions
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  // Reset form when closing the dialog
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleFormSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="question">
                      Question <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="question"
                      placeholder="Enter the question (min 5 characters)"
                      {...register("question")}
                      className={errors.question ? "border-red-500" : ""}
                    />
                    {errors.question && (
                      <p className="text-sm text-red-500">
                        {errors.question.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      required={true}
                      placeholder="Enter the answer"
                      rows={4}
                      {...register("answer")}
                      className={errors.answer ? "border-red-500" : ""}
                    />
                    {errors.answer && (
                      <p className="text-sm text-red-500">
                        {errors.answer.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isActive">Status (Optional)</Label>
                    <Select
                      value={watch("isActive") ? "active" : "inactive"}
                      onValueChange={(value) =>
                        setValue("isActive", value === "active")
                      }
                    >
                      <SelectTrigger id="isActive">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating || isUpdating}>
                      {(isCreating || isUpdating) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingFaq ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <TableRow key={faq._id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{faq.question}</div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{faq.answer}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={faq.isActive ? "default" : "secondary"}>
                          {faq.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(faq)}
                            disabled={isToggling}
                          >
                            {faq.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFaqToDelete(faq);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              FAQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
