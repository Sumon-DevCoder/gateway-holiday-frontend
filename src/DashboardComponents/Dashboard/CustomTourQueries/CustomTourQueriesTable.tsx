"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ICustomTourQuery } from "@/redux/api/features/customTourQuery/customTourQueryApi";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

interface CustomTourQueriesTableProps {
  queries: ICustomTourQuery[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomTourQueriesTable({
  queries,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onStatusUpdate,
  onDelete,
}: CustomTourQueriesTableProps): React.ReactElement {
  const [selectedQuery, setSelectedQuery] = useState<ICustomTourQuery | null>(
    null
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-gray-600">No custom tour queries found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Tour Details</TableHead>
              <TableHead>Travel Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query._id}>
                <TableCell className="font-medium">{query.name}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {query.email && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{query.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{query.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {query.tourTitle || "Not specified"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm text-gray-600">
                    {query.travelDate && (
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(query.travelDate).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Persons:</span>{" "}
                      {query.persons || "N/A"}
                    </div>
                    {(query.numberOfAdults || query.numberOfChildren) && (
                      <div className="text-xs">
                        {query.numberOfAdults
                          ? `Adults: ${query.numberOfAdults}`
                          : ""}{" "}
                        {query.numberOfChildren
                          ? `Children: ${query.numberOfChildren}`
                          : ""}
                      </div>
                    )}
                    {query.needsVisa !== undefined && (
                      <div className="text-xs">
                        <span className="font-medium">Visa:</span>{" "}
                        {query.needsVisa ? "Yes" : "No"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={query.status}
                    onValueChange={(value) =>
                      onStatusUpdate(query._id || "", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge
                          className={getStatusBadgeColor(query.status)}
                          variant="outline"
                        >
                          {query.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDateTime(query.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuery(query)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(query._id || "")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <Dialog
          open={!!selectedQuery}
          onOpenChange={() => setSelectedQuery(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Custom Tour Query Details</DialogTitle>
              <DialogDescription>
                Complete information about this tour query
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="text-gray-900">{selectedQuery.name}</p>
                  </div>
                  {selectedQuery.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Mail className="h-4 w-4" />
                        {selectedQuery.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Phone className="h-4 w-4" />
                      {selectedQuery.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tour Information */}
              {selectedQuery.tourTitle && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Tour Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Tour Title
                      </label>
                      <p className="text-gray-900">{selectedQuery.tourTitle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Travel Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Travel Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedQuery.travelDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Travel Date
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedQuery.travelDate)}
                      </p>
                    </div>
                  )}
                  {selectedQuery.persons !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Total Persons
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Users className="h-4 w-4" />
                        {selectedQuery.persons} persons
                      </p>
                    </div>
                  )}
                  {selectedQuery.numberOfAdults !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Adults
                      </label>
                      <p className="text-gray-900">
                        {selectedQuery.numberOfAdults} adults
                      </p>
                    </div>
                  )}
                  {selectedQuery.numberOfChildren !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Children
                      </label>
                      <p className="text-gray-900">
                        {selectedQuery.numberOfChildren} children
                      </p>
                    </div>
                  )}
                  {selectedQuery.needsVisa !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Visa Requirement
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        {selectedQuery.needsVisa ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Required</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Not Required</span>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Query Status Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Query Status
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Current Status
                    </label>
                    <Badge
                      className={getStatusBadgeColor(selectedQuery.status)}
                      variant="outline"
                    >
                      {selectedQuery.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Submitted At
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(selectedQuery.createdAt)}
                    </p>
                  </div>
                  {selectedQuery.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime(selectedQuery.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
