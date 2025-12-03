"use client";

import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Contact,
  useGetMyContactsQuery,
} from "@/redux/api/features/contact/contactApi";
import {
  Calendar,
  Eye,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's contacts
  const { data: contactsData, isLoading, error } = useGetMyContactsQuery();

  // Debug logging
  console.log("contactsData", contactsData);
  console.log("Contacts count:", contactsData?.data?.length || 0);
  console.log("Error:", error);

  const allContacts = contactsData?.data || [];

  // Filter data based on search term
  const filteredData = allContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate statistics
  const stats = {
    total: allContacts.length,
    thisMonth: allContacts.filter((c) => {
      const contactDate = new Date(c.createdAt);
      const now = new Date();
      return (
        contactDate.getMonth() === now.getMonth() &&
        contactDate.getFullYear() === now.getFullYear()
      );
    }).length,
    thisWeek: allContacts.filter((c) => {
      const contactDate = new Date(c.createdAt);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return contactDate >= weekAgo;
    }).length,
  };

  const contactColumns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (row: Contact) => (
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-4 w-4" />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (row: Contact) => (
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground h-4 w-4" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: (row: Contact) => (
        <div className="max-w-md">
          <p className="line-clamp-2 text-sm">
            {row.message.length > 100
              ? `${row.message.substring(0, 100)}...`
              : row.message}
          </p>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: Contact) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: Contact) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedContact(row)}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
        </div>
      ),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4 text-gray-600">Loading your contacts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status !== 401
    ) {
      toast.error("Failed to load contacts. Please try again.", {
        id: "contact-error",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Contacts"
        description="View your contact messages and inquiries"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.thisMonth}
            </div>
            <p className="text-muted-foreground text-xs">Messages this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.thisWeek}
            </div>
            <p className="text-muted-foreground text-xs">Messages this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Contact History</CardTitle>
              <CardDescription>
                {allContacts.length === 0
                  ? "You haven't sent any contact messages yet."
                  : "View and manage your contact messages"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={contactColumns}
            searchable={true}
            pagination={true}
            onSearch={setSearchTerm}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / 10)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <User className="h-4 w-4" />
                      {selectedContact.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Mail className="h-4 w-4" />
                      {selectedContact.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Phone className="h-4 w-4" />
                      {selectedContact.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <div className="mt-2 rounded-lg bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContact(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
