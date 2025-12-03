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
import { VisaBooking } from "@/types/visaBooking";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  Trash2,
  Eye,
  Calendar,
  Users,
} from "lucide-react";
import React, { useState } from "react";

interface VisaBookingQueriesTableProps {
  queries: VisaBooking[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function VisaBookingQueriesTable({
  queries,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onStatusUpdate,
  onDelete,
}: VisaBookingQueriesTableProps): React.ReactElement {
  const [selectedQuery, setSelectedQuery] = useState<VisaBooking | null>(null);

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
      hour: "2-digit",
      minute: "2-digit",
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

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-gray-600">No visa bookings found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Visa Details</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query: any) => (
              <TableRow key={query._id}>
                <TableCell className="font-medium">{query.name}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{query.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{query.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Globe className="h-3 w-3" />
                      <span>{query.country}</span>
                    </div>
                    <p className="text-xs text-gray-600 capitalize">
                      {query.visaType}
                    </p>
                    {query.numberOfPersons && (
                      <p className="text-xs text-gray-500">
                        {query.numberOfPersons} person
                        {query.numberOfPersons > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      query.booking_type === "application"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {query.booking_type === "application"
                      ? "Application"
                      : "Query"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {query.booking_type === "application" ? (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-900">
                        {query.processingFee?.toLocaleString() || "N/A"} Tk
                      </p>
                      <Badge
                        className={
                          query.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : query.paymentStatus === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                        variant="outline"
                      >
                        {query.paymentStatus || "N/A"}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No Payment</span>
                  )}
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
                  {formatDate(query.createdAt)}
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
    </div>

      {/* Visa Booking Details Modal */}
      {selectedQuery && (
        <Dialog
          open={!!selectedQuery}
          onOpenChange={() => setSelectedQuery(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Visa Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this visa booking
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

              {/* Visa Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Visa Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Globe className="h-4 w-4" />
                      {selectedQuery.country}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Visa Type
                    </label>
                    <p className="text-gray-900 capitalize">
                      {selectedQuery.visaType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Type
                    </label>
                    <Badge
                      className={
                        selectedQuery.booking_type === "application"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {selectedQuery.booking_type === "application"
                        ? "Application"
                        : "Query"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Number of Persons
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Users className="h-4 w-4" />
                      {selectedQuery.numberOfPersons || 1} person
                      {(selectedQuery.numberOfPersons || 1) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {(selectedQuery as any).booking_type === "application" && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {(selectedQuery as any).applicationFee && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Application Fee
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice((selectedQuery as any).applicationFee)}
                        </p>
                      </div>
                    )}
                    {(selectedQuery as any).paymentStatus && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Payment Status
                        </label>
                        <Badge
                          className={getPaymentStatusBadgeColor(
                            (selectedQuery as any).paymentStatus
                          )}
                        >
                          {(selectedQuery as any).paymentStatus}
                        </Badge>
                      </div>
                    )}
                    {(selectedQuery as any).transactionId && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Transaction ID
                        </label>
                        <p className="font-mono text-sm text-gray-900">
                          {(selectedQuery as any).transactionId}
                        </p>
                      </div>
                    )}
                    {(selectedQuery as any).paymentGateway && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Payment Gateway
                        </label>
                        <p className="text-gray-900">
                          {(selectedQuery as any).paymentGateway || "SSLCommerz"}
                        </p>
                      </div>
                    )}
                    {(selectedQuery as any).paidAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Paid At
                        </label>
                        <p className="flex items-center gap-1 text-gray-900">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime((selectedQuery as any).paidAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SSLCommerz Details */}
              {(selectedQuery as any).sslcommerz?.bankTransactionId && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Payment Gateway Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Bank Transaction ID
                      </label>
                      <p className="font-mono text-sm text-gray-900">
                        {(selectedQuery as any).sslcommerz.bankTransactionId}
                      </p>
                    </div>
                    {(selectedQuery as any).sslcommerz.cardType && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Card Type
                        </label>
                        <p className="text-gray-900">
                          {(selectedQuery as any).sslcommerz.cardType}
                        </p>
                      </div>
                    )}
                    {(selectedQuery as any).sslcommerz.cardIssuer && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Card Issuer
                        </label>
                        <p className="text-gray-900">
                          {(selectedQuery as any).sslcommerz.cardIssuer}
                        </p>
                      </div>
                    )}
                    {(selectedQuery as any).sslcommerz.cardBrand && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Card Brand
                        </label>
                        <p className="text-gray-900">
                          {(selectedQuery as any).sslcommerz.cardBrand}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Booking Status Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Booking Status
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Current Status
                    </label>
                    <Badge
                      className={getStatusBadgeColor(selectedQuery.status)}
                    >
                      {selectedQuery.status}
                    </Badge>
                  </div>
                  {(selectedQuery as any).contactedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Contacted At
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime((selectedQuery as any).contactedAt)}
                      </p>
                    </div>
                  )}
                  {(selectedQuery as any).closedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Closed At
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime((selectedQuery as any).closedAt)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Date
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Calendar className="h-4 w-4" />
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
    </>
  );
}
