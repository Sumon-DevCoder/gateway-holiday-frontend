"use client";

import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useGetMyVisaBookingsQuery } from "@/redux/api/features/visaBooking/visaBookingApi";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Plus,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VisaPage() {
  const router = useRouter();
  const { checkAuth } = useAuthCheck();

  // Check auth immediately when component loads
  const isAuthenticated = checkAuth("apply for visa");

  const [selectedVisa, setSelectedVisa] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingTypeFilter, setBookingTypeFilter] = useState<string>("all");

  // Fetch real data from API
  const { data: visaResponse, isLoading, error } = useGetMyVisaBookingsQuery();

  const visaApplications = visaResponse?.data || [];

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [bookingTypeFilter, searchTerm]);

  // Handle new application click
  const handleNewApplication = () => {
    // Double check if user is logged in
    if (!isAuthenticated) {
      return;
    }

    // Navigate to visa application form or open modal
    router.push("/visa");
  };

  // Handle view specific booking
  const handleViewBooking = (booking: any) => {
    router.push(`/dashboard/user/visa/${booking._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "contacted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "contacted":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const columns = [
    {
      header: "Country",
      accessorKey: "country",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{row.country}</span>
        </div>
      ),
    },
    {
      header: "Visa Type",
      accessorKey: "visaType",
      cell: (row: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4" />
            <span>{row.visaType}</span>
          </div>
          {row.numberOfPersons && (
            <span className="text-xs text-gray-500">
              {row.numberOfPersons} person{row.numberOfPersons > 1 ? "s" : ""}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Booking Type",
      accessorKey: "booking_type",
      cell: (row: any) => (
        <Badge
          className={
            row.booking_type === "application"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {row.booking_type === "application" ? "Application" : "Query"}
        </Badge>
      ),
    },
    {
      header: "Application Date",
      accessorKey: "createdAt",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <Badge className={getStatusColor(row.status)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(row.status)}
            {row.status}
          </div>
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewBooking(row)}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading visa applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load visa applications</p>
          <p className="mt-2 text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  // Filter data based on search term and booking type
  const filteredData = visaApplications.filter((visa: any) => {
    // Booking type filter
    const matchesBookingType =
      bookingTypeFilter === "all" || visa.booking_type === bookingTypeFilter;

    // Search filter
    const matchesSearch =
      visa.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.visaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesBookingType && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: visaApplications.length,
    pending: visaApplications.filter((v: any) => v.status === "pending").length,
    contacted: visaApplications.filter((v: any) => v.status === "contacted")
      .length,
    closed: visaApplications.filter((v: any) => v.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visa Applications"
        description="Track and manage your visa applications"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">
              All time applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-muted-foreground text-xs">Waiting for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.contacted}
            </div>
            <p className="text-muted-foreground text-xs">We've contacted you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.closed}
            </div>
            <p className="text-muted-foreground text-xs">
              Completed applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visa Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Visa Applications</CardTitle>
              <CardDescription>
                View and track your visa application status
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={bookingTypeFilter}
                onValueChange={setBookingTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleNewApplication}>
                <Plus className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={columns}
            searchable={true}
            pagination={true}
            onSearch={setSearchTerm}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / 10)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Visa Details Modal */}
      {selectedVisa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Visa Application Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVisa(null)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <p className="text-gray-900">{selectedVisa.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Visa Type
                    </label>
                    <p className="text-gray-900">{selectedVisa.visaType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Application Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedVisa.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedVisa.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedVisa.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedVisa.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Number of Persons
                    </label>
                    <p className="text-gray-900">
                      {selectedVisa.numberOfPersons || 1} person
                      {(selectedVisa.numberOfPersons || 1) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Badge className={getStatusColor(selectedVisa.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedVisa.status)}
                        {selectedVisa.status}
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVisa(null)}
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
