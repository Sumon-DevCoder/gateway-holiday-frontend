"use client";

import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Contact,
  useDeleteContactMutation,
  useGetAllContactsQuery,
  useGetContactStatsQuery,
} from "@/redux/api/features/contact/contactApi";
import { RootState } from "@/redux/store";
import {
  AlertCircle,
  Calendar,
  Eye,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Redux RTK Query hooks
  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = useGetAllContactsQuery({
    page: currentPage,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(searchTerm && { search: searchTerm }),
  });

  const { data: statsData, isLoading: statsLoading } =
    useGetContactStatsQuery();

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  // Debug: Check token in Redux store
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Token debugging removed - using Redux store token instead
  }, [token]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle delete contact
  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await deleteContact(contactId).unwrap();

      // Clear selection if deleted contact was selected
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete contact");
    }
  };

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact);
    setIsReplyDialogOpen(true);
    setReplyMessage(`Dear ${contact.name},\n\nThank you for contacting us. `);
  };

  const handleSendReply = () => {
    // Enhanced validation for reply
    if (!replyMessage.trim()) {
      alert("Please enter a reply message");
      return;
    }

    if (replyMessage.trim().length < 10) {
      alert("Reply message must be at least 10 characters long");
      return;
    }

    if (replyMessage.trim().length > 1000) {
      alert("Reply message must be less than 1000 characters");
      return;
    }

    // Handle sending reply logic here
    setIsReplyDialogOpen(false);
    setReplyMessage("");
    setSelectedContact(null);
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

  const getRecentBadge = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return <Badge className="bg-green-100 text-green-800">Recent</Badge>;
    } else if (diffInHours < 72) {
      return <Badge className="bg-yellow-100 text-yellow-800">New</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Messages"
        description="Manage customer contact form submissions"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData?.data?.totalContacts || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  All time contacts
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData?.data?.todayContacts || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Contacts received today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData?.data?.weekContacts || 0}
                </div>
                <p className="text-muted-foreground text-xs">Last 7 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData?.data?.monthContacts || 0}
                </div>
                <p className="text-muted-foreground text-xs">Last 30 days</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>
                {(error as any)?.message || "Failed to fetch contacts"}
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
        {/* Contact List */}
        <div className="xl:col-span-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search contacts..."
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
                <p className="text-gray-500">Loading contacts...</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Cards */}
          {!isLoading && contactsData?.data && (
            <div className="space-y-3 sm:space-y-4">
              {contactsData.data.map((contact) => (
                <Card
                  key={contact._id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                            <h3 className="truncate font-semibold">
                              {contact.name}
                            </h3>
                          </div>
                          {getRecentBadge(contact.createdAt)}
                        </div>
                        <div className="mb-2 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-4">
                          <span className="flex min-w-0 items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{contact.phone}</span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(contact.createdAt)}
                            </span>
                          </span>
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-700">
                          {contact.message}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2 sm:ml-4 sm:flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">View</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(contact);
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">Reply</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact._id);
                          }}
                          disabled={isDeleting}
                          className="flex-1 text-red-600 hover:text-red-700 sm:flex-none"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
            (!contactsData?.data || contactsData.data.length === 0) && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {searchTerm ? "No contacts found" : "No contacts yet"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Contact messages will appear here when customers reach out"}
                  </p>
                </CardContent>
              </Card>
            )}

          {/* Pagination */}
          {!isLoading &&
            contactsData?.data &&
            contactsData.data.length > 0 &&
            contactsData.pagination.pages > 1 && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center text-sm text-gray-500 sm:text-left">
                  Showing {contactsData.data.length} of{" "}
                  {contactsData.pagination.total} contacts
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
                    Page {currentPage} of {contactsData.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === contactsData.pagination.pages}
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* Contact Details Sidebar */}
        <div className="xl:col-span-1">
          {selectedContact ? (
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="truncate">{selectedContact.name}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="truncate">{selectedContact.email}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="truncate">{selectedContact.phone}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="truncate">
                        {formatDate(selectedContact.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Message</h4>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm break-words text-gray-700">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-4">
              <CardContent className="p-6 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Select a contact to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      {isReplyDialogOpen && selectedContact && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              Reply to {selectedContact.name}
            </h3>
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Original Message:</strong>
              </p>
              <div className="rounded bg-gray-50 p-3 text-sm">
                {selectedContact.message}
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Reply Message *
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                rows={6}
                placeholder="Enter your reply message..."
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Minimum 10 characters</span>
                <span>{replyMessage.length}/1000 characters</span>
              </div>
              {replyMessage.length > 0 && replyMessage.length < 10 && (
                <p className="mt-1 text-sm text-red-500">
                  Message must be at least 10 characters long
                </p>
              )}
              {replyMessage.length > 1000 && (
                <p className="mt-1 text-sm text-red-500">
                  Message must be less than 1000 characters
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReplyDialogOpen(false);
                  setReplyMessage("");
                  setSelectedContact(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={
                  replyMessage.trim().length < 10 ||
                  replyMessage.trim().length > 1000
                }
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
