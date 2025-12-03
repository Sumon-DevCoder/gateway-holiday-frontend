"use client";

import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteQueryMutation,
  useGetQueriesQuery,
  useGetQueryStatsQuery,
  useUpdateQueryMutation,
} from "@/redux/api/features/queries/queriesApi";
import { IQuery, QueryStatus } from "@/types/queries";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plane,
  Star,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QueriesPage() {
  const [selectedQuery, setSelectedQuery] = useState<IQuery | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formTypeFilter, setFormTypeFilter] = useState<string>("all");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Sync currentPage with filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: currentPage }));
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, formTypeFilter]);

  // Fetch queries data
  const {
    data: queriesData,
    isLoading: queriesLoading,
    error: queriesError,
    refetch: refetchQueries,
  } = useGetQueriesQuery({
    ...filters,
    ...(activeTab !== "all" && { status: activeTab as QueryStatus }),
    ...(formTypeFilter !== "all" && { formType: formTypeFilter as any }),
  });

  // Fetch query statistics
  const { data: _statsData } = useGetQueryStatsQuery();

  // Update query mutation
  const [updateQuery, { isLoading: _updateLoading }] = useUpdateQueryMutation();

  // Delete query mutation
  const [deleteQuery, { isLoading: deleteLoading }] = useDeleteQueryMutation();

  const queries = queriesData?.data || [];
  const pagination = queriesData?.pagination;
  // const stats = statsData; // Unused for now

  // Filter queries based on form type for tab counts
  const formTypeFilteredQueries =
    formTypeFilter === "all"
      ? queries
      : queries.filter((query) => query.formType === formTypeFilter);

  // Filter queries based on form type and status for display
  const filteredQueries = queries.filter((query) => {
    const matchesFormType =
      formTypeFilter === "all" || query.formType === formTypeFilter;
    const matchesStatus = activeTab === "all" || query.status === activeTab;
    return matchesFormType && matchesStatus;
  });

  // Handle status update
  const handleStatusUpdate = async (queryId: string, newStatus: string) => {
    try {
      setUpdatingStatusId(queryId);

      // Validate status value
      const validStatuses = ["pending", "reviewed", "contacted", "closed"];
      if (!validStatuses.includes(newStatus)) {
        throw new Error("Invalid status value");
      }

      await updateQuery({
        id: queryId,
        data: { status: newStatus as QueryStatus },
      }).unwrap();

      toast.success(`Query status updated to ${newStatus} successfully`);
      refetchQueries();

      // Update selected query if it's the one being updated
      if (selectedQuery?._id === queryId) {
        setSelectedQuery((prev) =>
          prev ? { ...prev, status: newStatus as QueryStatus } : null
        );
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update query status"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle delete query
  const handleDeleteQuery = async (queryId: string) => {
    try {
      await deleteQuery(queryId).unwrap();
      toast.success("Query deleted successfully");
      refetchQueries();
      setDeleteConfirmId(null);
      // Clear selected query if it was deleted
      if (selectedQuery?._id === queryId) {
        setSelectedQuery(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete query");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "contacted":
        return <MessageSquare className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getFormTypeIcon = (formType: string) => {
    switch (formType) {
      case "package_tour":
        return <MapPin className="h-4 w-4" />;
      case "hajj_umrah":
        return <Star className="h-4 w-4" />;
      case "group_ticket":
        return <Plane className="h-4 w-4" />;
      default:
        return <ClipboardList className="h-4 w-4" />;
    }
  };

  // Group form type filtered queries by status for tab counts
  const groupedQueries = formTypeFilteredQueries.reduce(
    (acc, query) => {
      if (!acc[query.status]) {
        acc[query.status] = [];
      }
      acc[query.status]?.push(query);
      return acc;
    },
    {} as Record<string, IQuery[]>
  );

  // Get counts from form type filtered queries
  const getTabCount = (status: string) => {
    if (status === "all") {
      return formTypeFilteredQueries.length;
    }
    return groupedQueries[status]?.length || 0;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Query Management"
        description="Manage customer queries and inquiries"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by:
            </span>
          </div>

          <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Form Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Form Types</SelectItem>
              <SelectItem value="hajj_umrah">Hajj & Umrah</SelectItem>
              <SelectItem value="package_tour">Package Tour</SelectItem>
              <SelectItem value="group_ticket">Group Ticket</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.limit.toString()}
            onValueChange={(value) => {
              setFilters((prev) => ({ ...prev, limit: parseInt(value) }));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formTypeFilter !== "all" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormTypeFilter("all")}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Query List */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({getTabCount("pending")})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({getTabCount("reviewed")})
              </TabsTrigger>
              <TabsTrigger value="contacted">
                Contacted ({getTabCount("contacted")})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed ({getTabCount("closed")})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {queriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  <span>Loading queries...</span>
                </div>
              ) : queriesError ? (
                <div className="py-8 text-center">
                  <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <p className="mb-4 text-red-600">Failed to load queries</p>
                  <Button onClick={() => refetchQueries()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="py-8 text-center">
                  <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No queries found</p>
                </div>
              ) : (
                filteredQueries.map((query) => (
                  <Card
                    key={query._id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setSelectedQuery(query)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            {getFormTypeIcon(query.formType)}
                            <h3 className="font-semibold">{query.name}</h3>
                            <Badge className={getStatusColor(query.status)}>
                              {getStatusIcon(query.status)}
                              <span className="ml-1 capitalize">
                                {query.status}
                              </span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {query.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {query.contactNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                query.startingDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {query.formType.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuery(query);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(query._id);
                            }}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Individual status tabs */}
            {["pending", "reviewed", "contacted", "closed"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {queriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>Loading queries...</span>
                  </div>
                ) : queriesError ? (
                  <div className="py-8 text-center">
                    <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                    <p className="mb-4 text-red-600">Failed to load queries</p>
                    <Button onClick={() => refetchQueries()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : filteredQueries.length === 0 ? (
                  <div className="py-8 text-center">
                    <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No {status} queries found</p>
                  </div>
                ) : (
                  filteredQueries.map((query) => (
                    <Card
                      key={query._id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => setSelectedQuery(query)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              {getFormTypeIcon(query.formType)}
                              <h3 className="font-semibold">{query.name}</h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {query.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {query.email}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {query.contactNumber}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuery(query);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(query._id);
                              }}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    {Math.min(
                      (pagination.page - 1) * pagination.limit + 1,
                      pagination.total
                    )}{" "}
                    to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} queries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || queriesLoading}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pagination.pages, prev + 1)
                        )
                      }
                      disabled={
                        currentPage === pagination.pages || queriesLoading
                      }
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Query Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedQuery ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getFormTypeIcon(selectedQuery.formType)}
                  Query Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedQuery.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedQuery.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedQuery.contactNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Travel Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        From:{" "}
                        {new Date(
                          selectedQuery.startingDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        To:{" "}
                        {new Date(
                          selectedQuery.returnDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedQuery.airlineTicketCategory && (
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-gray-500" />
                        <span>
                          Class: {selectedQuery.airlineTicketCategory}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedQuery.formType === "package_tour" && (
                  <div>
                    <h4 className="mb-2 font-semibold">Package Tour Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Country: {selectedQuery.visitingCountry}</span>
                      </div>
                      {selectedQuery.visitingCities && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>Cities: {selectedQuery.visitingCities}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Persons: {selectedQuery.persons || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <span>
                          Visa Required:{" "}
                          {selectedQuery.needsVisa ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuery.formType === "hajj_umrah" && (
                  <div>
                    <h4 className="mb-2 font-semibold">Hajj/Umrah Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          Makkah Nights: {selectedQuery.nightsStayMakkah}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          Madinah Nights: {selectedQuery.nightsStayMadinah}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          Adults: {selectedQuery.maleAdults}M,{" "}
                          {selectedQuery.femaleAdults}F
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-500" />
                        <span>
                          Accommodation: {selectedQuery.accommodationType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuery.formType === "group_ticket" && (
                  <div>
                    <h4 className="mb-2 font-semibold">Group Ticket Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          Total Passengers:{" "}
                          {selectedQuery.totalPassengers || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuery.specialRequirements && (
                  <div>
                    <h4 className="mb-2 font-semibold">Special Requirements</h4>
                    <p className="text-sm text-gray-600">
                      {selectedQuery.specialRequirements}
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={
                        selectedQuery.status === "pending"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "pending")
                      }
                      disabled={updatingStatusId === selectedQuery._id}
                    >
                      {updatingStatusId === selectedQuery._id ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedQuery.status === "reviewed"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "reviewed")
                      }
                      disabled={updatingStatusId === selectedQuery._id}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedQuery.status === "contacted"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "contacted")
                      }
                      disabled={updatingStatusId === selectedQuery._id}
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Contacted
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedQuery.status === "closed"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "closed")
                      }
                      disabled={updatingStatusId === selectedQuery._id}
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Closed
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteConfirmId(selectedQuery._id)}
                    disabled={deleteLoading}
                    className="w-full"
                  >
                    {deleteLoading ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-3 w-3" />
                    )}
                    Delete Query
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Select a query to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Query
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this query? This will permanently
              remove the query from the system.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteQuery(deleteConfirmId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
