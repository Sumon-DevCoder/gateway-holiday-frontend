"use client";

import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Newsletter,
  useDeleteNewsletterSubscriberMutation,
  useGetAllNewsletterSubscribersQuery,
  useGetNewsletterStatsQuery,
} from "@/redux/api/features/newsletter/newsletterApi";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Loader2,
  Mail,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function NewsletterPage() {
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Newsletter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<Newsletter | null>(null);

  // Redux RTK Query hooks
  const {
    data: subscribersData,
    isLoading,
    error,
    refetch,
  } = useGetAllNewsletterSubscribersQuery({
    page: currentPage,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(searchTerm && { search: searchTerm }),
  });

  const { data: statsData } = useGetNewsletterStatsQuery();

  const [deleteSubscriber, { isLoading: isDeleting }] =
    useDeleteNewsletterSubscriberMutation();

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Open delete modal
  const openDeleteModal = (subscriber: Newsletter) => {
    setSubscriberToDelete(subscriber);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSubscriberToDelete(null);
  };

  // Handle delete subscriber
  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      await deleteSubscriber(subscriberToDelete._id).unwrap();

      // Clear selection if deleted subscriber was selected
      if (selectedSubscriber?._id === subscriberToDelete._id) {
        setSelectedSubscriber(null);
      }

      closeDeleteModal();
    } catch (err: any) {
      alert(err.message || "Failed to delete subscriber");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter Subscribers"
        description="Manage your newsletter subscribers"
      />

      {/* Statistics Cards */}
      {statsData && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscribers
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.data.totalSubscribers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.data.todaySubscribers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.data.weekSubscribers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.data.monthSubscribers}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>
                {(error as any)?.message || "Failed to fetch subscribers"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        {/* Subscribers List */}
        <div className="xl:col-span-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
                <p className="text-gray-500">Loading subscribers...</p>
              </CardContent>
            </Card>
          )}

          {/* Subscriber Cards */}
          {!isLoading && subscribersData?.data && (
            <div className="space-y-3 sm:space-y-4">
              {subscribersData.data.map((subscriber) => (
                <Card
                  key={subscriber._id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => setSelectedSubscriber(subscriber)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                          <h3 className="truncate font-semibold">
                            {subscriber.email}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(subscriber.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(subscriber);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            (!subscribersData?.data || subscribersData.data.length === 0) && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {searchTerm ? "No subscribers found" : "No subscribers yet"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Newsletter subscribers will appear here"}
                  </p>
                </CardContent>
              </Card>
            )}

          {/* Pagination */}
          {!isLoading &&
            subscribersData?.data &&
            subscribersData.data.length > 0 &&
            subscribersData.pagination.pages > 1 && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center text-sm text-gray-500 sm:text-left">
                  Showing {subscribersData.data.length} of{" "}
                  {subscribersData.pagination.total} subscribers
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-1 sm:flex-none"
                  >
                    Previous
                  </Button>
                  <span className="px-2 text-sm text-gray-600">
                    Page {currentPage} of {subscribersData.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === subscribersData.pagination.pages}
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* Subscriber Details Sidebar */}
        <div className="xl:col-span-1">
          {selectedSubscriber ? (
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Subscriber Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Email Address</h4>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm break-words text-gray-700">
                      {selectedSubscriber.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Subscription Date
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {formatDate(selectedSubscriber.createdAt)}
                    </span>
                  </div>
                </div>

                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => openDeleteModal(selectedSubscriber)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Subscriber
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-4">
              <CardContent className="p-6 text-center">
                <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Select a subscriber to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to delete this subscriber?
            </DialogDescription>
          </DialogHeader>

          {subscriberToDelete && (
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-900">
                  {subscriberToDelete.email}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Subscribed: {formatDate(subscriberToDelete.createdAt)}</span>
              </div>
            </div>
          )}

          <DialogDescription className="text-sm text-gray-600">
            This action cannot be undone. The subscriber will be permanently
            removed from your newsletter list.
          </DialogDescription>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSubscriber}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
