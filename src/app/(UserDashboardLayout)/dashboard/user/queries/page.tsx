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
import { useGetMyQueriesQuery } from "@/redux/api/features/queries/queriesApi";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  MessageSquare,
  Plus,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function QueriesPage() {
  const router = useRouter();
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQueryOptions, setShowQueryOptions] = useState(false);

  // API hooks
  const { data: queriesData, isLoading, error } = useGetMyQueriesQuery();

  // Navigation functions
  const handleUmrahQuery = () => {
    router.push("/query/umrah");
  };

  const handlePackageTourQuery = () => {
    router.push("/query/package-tour");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "reviewed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "reviewed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "contacted":
        return <MessageSquare className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getFormTypeColor = (formType: string) => {
    switch (formType?.toLowerCase()) {
      case "hajj_umrah":
        return "bg-green-100 text-green-800";
      case "package_tour":
        return "bg-purple-100 text-purple-800";
      case "group_ticket":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "Query Details",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <MessageSquare className="text-muted-foreground h-4 w-4" />
          <div>
            <div className="font-medium">{row.name || "N/A"}</div>
            <div className="text-muted-foreground text-sm">
              {row.specialRequirements && row.specialRequirements.length > 50
                ? `${row.specialRequirements.substring(0, 50)}...`
                : row.specialRequirements || "No special requirements"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "formType",
      cell: (row: any) => (
        <Badge className={getFormTypeColor(row.formType)}>
          {row.formType.charAt(0).toUpperCase() + row.formType.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Date",
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedQuery(row)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  // Get queries from API
  const allQueries = queriesData?.data || [];

  // Filter data based on search term
  const filteredData = allQueries.filter(
    (query: any) =>
      query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.specialRequirements
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      query.formType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.visitingCountry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: allQueries.length,
    reviewed: allQueries.filter((q: any) => q.status === "reviewed").length,
    pending: allQueries.filter((q: any) => q.status === "pending").length,
    contacted: allQueries.filter((q: any) => q.status === "contacted").length,
    closed: allQueries.filter((q: any) => q.status === "closed").length,
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4 text-gray-600">Loading your queries...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    // Only show toast if it's not an authentication error (401)
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status !== 401
    ) {
      toast.error("Failed to load queries. Please try again.", {
        id: "queries-error",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Queries"
        description="View and manage your support requests"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All time queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.reviewed}
            </div>
            <p className="text-muted-foreground text-xs">
              Successfully reviewed
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
            <p className="text-muted-foreground text-xs">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.contacted}
            </div>
            <p className="text-muted-foreground text-xs">Contacted queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.closed}
            </div>
            <p className="text-muted-foreground text-xs">Closed queries</p>
          </CardContent>
        </Card>
      </div>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Queries</CardTitle>
              <CardDescription>
                View and track your support requests
              </CardDescription>
            </div>
            <Button onClick={() => setShowQueryOptions(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Query
            </Button>
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

      {/* Query Options Modal */}
      {showQueryOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-2 backdrop-blur-sm sm:p-4">
          <div className="mx-2 w-full max-w-sm rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md sm:mx-0 sm:max-w-md">
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Select Query Type
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQueryOptions(false)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    onClick={handleUmrahQuery}
                    className="h-auto w-full justify-start p-3 sm:p-4"
                    variant="outline"
                  >
                    <div className="text-left">
                      <div className="text-sm font-semibold sm:text-base">
                        Hajj & Umrah Query
                      </div>
                      <div className="text-xs text-gray-600 sm:text-sm">
                        Submit queries related to Hajj and Umrah packages
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={handlePackageTourQuery}
                    className="h-auto w-full justify-start p-3 sm:p-4"
                    variant="outline"
                  >
                    <div className="text-left">
                      <div className="text-sm font-semibold sm:text-base">
                        Package Tour Query
                      </div>
                      <div className="text-xs text-gray-600 sm:text-sm">
                        Submit queries related to tour packages and travel
                        services
                      </div>
                    </div>
                  </Button>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowQueryOptions(false)}
                    className="text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Query Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuery(null)}
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
                    <p className="text-gray-900">
                      {selectedQuery.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-gray-900">
                      {selectedQuery.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <p className="text-gray-900">
                      {selectedQuery.contactNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Form Type
                    </label>
                    <Badge className={getFormTypeColor(selectedQuery.formType)}>
                      {selectedQuery.formType?.charAt(0).toUpperCase() +
                        selectedQuery.formType?.slice(1) || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Badge className={getStatusColor(selectedQuery.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedQuery.status)}
                        {selectedQuery.status || "N/A"}
                      </div>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Created Date
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {selectedQuery.createdAt
                        ? new Date(selectedQuery.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {selectedQuery.specialRequirements && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Special Requirements
                    </label>
                    <div className="mt-2 rounded-lg bg-gray-50 p-4">
                      <p className="text-gray-900">
                        {selectedQuery.specialRequirements}
                      </p>
                    </div>
                  </div>
                )}

                {selectedQuery.visitingCountry && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Visiting Country
                    </label>
                    <div className="mt-2 rounded-lg bg-blue-50 p-4">
                      <p className="text-gray-900">
                        {selectedQuery.visitingCountry}
                      </p>
                    </div>
                  </div>
                )}

                {selectedQuery.visitingCities && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Visiting Cities
                    </label>
                    <div className="mt-2 rounded-lg bg-blue-50 p-4">
                      <p className="text-gray-900">
                        {selectedQuery.visitingCities}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedQuery(null)}
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
