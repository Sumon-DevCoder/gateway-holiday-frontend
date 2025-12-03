"use client";

import PageHeader from "@/components/admin/PageHeader";
import DynamicRichTextEditor from "@/components/CustomFormComponents/DynamicRichTextEditor";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreatePolicyPageMutation,
  useDeletePolicyPageMutation,
  useGetAllPolicyPagesQuery,
  useUpdatePolicyPageMutation,
} from "@/redux/api/features/policy/policyApi";
import { IPolicyPage } from "@/types/policy";
import { Edit, Eye, FileText, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PoliciesPage() {
  // RTK Query hooks
  const {
    data: policiesResponse,
    isLoading,
    refetch,
  } = useGetAllPolicyPagesQuery();
  const [createPolicyPage, { isLoading: isCreating }] =
    useCreatePolicyPageMutation();
  const [updatePolicyPage, { isLoading: isUpdating }] =
    useUpdatePolicyPageMutation();
  const [deletePolicyPage, { isLoading: isDeleting }] =
    useDeletePolicyPageMutation();

  const policies = policiesResponse?.data || [];

  const [editingPolicy, setEditingPolicy] = useState<IPolicyPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<IPolicyPage | null>(
    null
  );
  const [viewingPolicy, setViewingPolicy] = useState<IPolicyPage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<
    "terms" | "privacy" | "refund"
  >("terms");

  const getPolicyTitle = (slug: string) => {
    switch (slug) {
      case "terms":
        return "Terms and Conditions";
      case "privacy":
        return "Privacy Policy";
      case "refund":
        return "Refund Policy";
      default:
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  };

  const getPolicyDescription = (slug: string) => {
    switch (slug) {
      case "terms":
        return "Legal terms and conditions for using our services";
      case "privacy":
        return "How we collect, use, and protect your personal information";
      case "refund":
        return "Cancellation and refund policies for bookings";
      default:
        return "Policy content and guidelines";
    }
  };

  const getPolicyIcon = (slug: string) => {
    switch (slug) {
      case "terms":
        return "📋";
      case "privacy":
        return "🔒";
      case "refund":
        return "💰";
      default:
        return "📄";
    }
  };

  const handleCreate = () => {
    setEditingPolicy(null);
    setContent("");
    setIsDialogOpen(true);
  };

  const handleEdit = (policy: IPolicyPage) => {
    setEditingPolicy(policy);
    setContent(policy.content);
    setSelectedSlug(policy.slug);
    setIsDialogOpen(true);
  };

  const handleView = (policy: IPolicyPage) => {
    setViewingPolicy(policy);
    setIsViewDialogOpen(true);
  };

  const handleSave = async () => {
    // Enhanced validation
    if (!content.trim()) {
      toast.error("Please enter policy content");
      return;
    }

    // Validate content length
    if (content.trim().length < 50) {
      toast.error("Policy content must be at least 50 characters long");
      return;
    }

    if (content.trim().length > 10000) {
      toast.error("Policy content must be less than 10,000 characters");
      return;
    }

    try {
      if (editingPolicy) {
        // Update existing policy
        await updatePolicyPage({
          id: editingPolicy._id,
          data: { content: content.trim() },
        }).unwrap();
        toast.success("Policy page updated successfully");
      } else {
        // Create new policy
        await createPolicyPage({
          slug: selectedSlug,
          content: content.trim(),
        }).unwrap();
        toast.success("Policy page created successfully");
      }
      // Only reset form and close dialog on success
      handleCloseDialog();
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${editingPolicy ? "update" : "create"} policy page`
      );
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleDeleteClick = (policy: IPolicyPage) => {
    setPolicyToDelete(policy);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!policyToDelete) return;

    try {
      await deletePolicyPage(policyToDelete._id).unwrap();
      toast.success("Policy page deleted successfully");
      setShowDeleteDialog(false);
      setPolicyToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete policy page");
      setShowDeleteDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPolicy(null);
    setContent("");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Policy Pages"
          description="Manage legal and policy pages content"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Policy Pages"
          description="Manage legal and policy pages content"
        />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </div>

      {/* Policy Cards */}
      {policies.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Policy Pages Yet
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Get started by creating your first policy page.
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <Card key={policy._id} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{getPolicyIcon(policy.slug)}</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {getPolicyTitle(policy.slug)}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {policy.slug}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  {getPolicyDescription(policy.slug)}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    Created: {new Date(policy.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Updated: {new Date(policy.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(policy)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(policy)}
                    disabled={isUpdating}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(policy)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong>
                {policyToDelete && getPolicyTitle(policyToDelete.slug)}
              </strong>{" "}
              policy page.
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {viewingPolicy && getPolicyTitle(viewingPolicy.slug)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {viewingPolicy && (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{viewingPolicy.slug}</Badge>
                  <span className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(viewingPolicy.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div
                  className="prose prose-sm max-w-none rounded-md border bg-gray-50 p-6"
                  dangerouslySetInnerHTML={{ __html: viewingPolicy.content }}
                />
              </>
            )}

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
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
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingPolicy
                ? `Edit ${getPolicyTitle(editingPolicy.slug)}`
                : "Create New Policy"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Slug selector - only for create */}
            {!editingPolicy && (
              <div className="space-y-2">
                <Label>Policy Type</Label>
                <Select
                  value={selectedSlug}
                  onValueChange={(value: "terms" | "privacy" | "refund") =>
                    setSelectedSlug(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terms">Terms and Conditions</SelectItem>
                    <SelectItem value="privacy">Privacy Policy</SelectItem>
                    <SelectItem value="refund">Refund Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <DynamicRichTextEditor
                name="content"
                label="Policy Content *"
                content={content}
                onChangeHandler={setContent}
                required
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Minimum 50 characters</span>
                <span>{content.length}/10,000 characters</span>
              </div>
              {content.length > 0 && content.length < 50 && (
                <p className="text-sm text-red-500">
                  Policy content must be at least 50 characters long
                </p>
              )}
              {content.length > 10000 && (
                <p className="text-sm text-red-500">
                  Policy content must be less than 10,000 characters
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isCreating ||
                  isUpdating ||
                  !content.trim() ||
                  content.trim().length < 50 ||
                  content.trim().length > 10000
                }
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingPolicy ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingPolicy ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
