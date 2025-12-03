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
import { Booking } from "@/redux/api/features/booking/bookingApi";
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

interface TourBookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function TourBookingsTable({
  bookings,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onStatusUpdate,
  onDelete,
}: TourBookingsTableProps): React.ReactElement {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const getPaymentStatusBadgeColor = (status: string) => {
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

  const getBookingStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
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

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-gray-600">No tour bookings found.</p>
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
                <TableHead>Customer Info</TableHead>
                <TableHead>Tour Details</TableHead>
                <TableHead>Travel Info</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Booking Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{booking.name}</p>
                      <div className="space-y-0.5 text-sm">
                        {booking.email && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{booking.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-xs">
                      <p className="truncate font-medium text-gray-900">
                        {booking.tourTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.destination}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.duration} days
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-sm text-gray-600">
                      {booking.travelDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(booking.travelDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">
                          {booking.persons} persons
                        </span>
                      </div>
                      {(booking.numberOfAdults || booking.numberOfChildren) && (
                        <div className="text-xs text-gray-500">
                          {booking.numberOfAdults
                            ? `${booking.numberOfAdults} adults`
                            : ""}{" "}
                          {booking.numberOfChildren
                            ? `${booking.numberOfChildren} children`
                            : ""}
                        </div>
                      )}
                      {booking.needsVisa !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          {booking.needsVisa ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-400" />
                          )}
                          <span>
                            Visa:{" "}
                            {booking.needsVisa ? "Required" : "Not Required"}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {formatPrice(booking.bookingFee)}
                      </p>
                      <Badge
                        className={getPaymentStatusBadgeColor(
                          booking.paymentStatus
                        )}
                        variant="outline"
                      >
                        {booking.paymentStatus}
                      </Badge>
                      {booking.transactionId && (
                        <p className="text-xs text-gray-500">
                          TXN: {booking.transactionId.slice(-8)}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={booking.bookingStatus}
                      onValueChange={(value) =>
                        onStatusUpdate(booking._id || "", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge
                            className={getBookingStatusBadgeColor(
                              booking.bookingStatus
                            )}
                            variant="outline"
                          >
                            {booking.bookingStatus}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {formatDateTime(booking.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBookingToDelete(booking);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog
          open={!!selectedBooking}
          onOpenChange={() => setSelectedBooking(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking
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
                    <p className="text-gray-900">{selectedBooking.name}</p>
                  </div>
                  {selectedBooking.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Mail className="h-4 w-4" />
                        {selectedBooking.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Phone className="h-4 w-4" />
                      {selectedBooking.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tour Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Tour Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tour Title
                    </label>
                    <p className="text-gray-900">{selectedBooking.tourTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Destination
                    </label>
                    <p className="text-gray-900">
                      {selectedBooking.destination}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <p className="text-gray-900">
                      {selectedBooking.duration} days
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Valid Period
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedBooking.validFrom)} -{" "}
                      {formatDate(selectedBooking.validTo)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Travel Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {selectedBooking.travelDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Travel Date
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedBooking.travelDate)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Total Persons
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Users className="h-4 w-4" />
                      {selectedBooking.persons} persons
                    </p>
                  </div>
                  {selectedBooking.numberOfAdults !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Adults
                      </label>
                      <p className="text-gray-900">
                        {selectedBooking.numberOfAdults} adults
                      </p>
                    </div>
                  )}
                  {selectedBooking.numberOfChildren !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Children
                      </label>
                      <p className="text-gray-900">
                        {selectedBooking.numberOfChildren} children
                      </p>
                    </div>
                  )}
                  {selectedBooking.needsVisa !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Visa Requirement
                      </label>
                      <p className="flex items-center gap-1 text-gray-900">
                        {selectedBooking.needsVisa ? (
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

              {/* Payment Information */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Fee
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(selectedBooking.bookingFee)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Payment Status
                    </label>
                    <Badge
                      className={getPaymentStatusBadgeColor(
                        selectedBooking.paymentStatus
                      )}
                    >
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Transaction ID
                    </label>
                    <p className="font-mono text-sm text-gray-900">
                      {selectedBooking.transactionId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Payment Gateway
                    </label>
                    <p className="text-gray-900">
                      {selectedBooking.paymentGateway || "SSLCommerz"}
                    </p>
                  </div>
                  {selectedBooking.paidAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Paid At
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime(selectedBooking.paidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                      className={getBookingStatusBadgeColor(
                        selectedBooking.bookingStatus
                      )}
                    >
                      {selectedBooking.bookingStatus}
                    </Badge>
                  </div>
                  {selectedBooking.confirmedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Confirmed At
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime(selectedBooking.confirmedAt)}
                      </p>
                    </div>
                  )}
                  {selectedBooking.cancelledAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Cancelled At
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime(selectedBooking.cancelledAt)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Date
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(selectedBooking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SSLCommerz Details */}
              {selectedBooking.sslcommerz?.bankTransactionId && (
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
                        {selectedBooking.sslcommerz.bankTransactionId}
                      </p>
                    </div>
                    {selectedBooking.sslcommerz.cardType && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Card Type
                        </label>
                        <p className="text-gray-900">
                          {selectedBooking.sslcommerz.cardType}
                        </p>
                      </div>
                    )}
                    {selectedBooking.sslcommerz.cardIssuer && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Card Issuer
                        </label>
                        <p className="text-gray-900">
                          {selectedBooking.sslcommerz.cardIssuer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {bookingToDelete && (
            <div className="py-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">
                  Booking Details:
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  <span className="font-semibold">Customer:</span>{" "}
                  {bookingToDelete.name}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">Tour:</span>{" "}
                  {bookingToDelete.tourTitle}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {bookingToDelete.transactionId}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setBookingToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (bookingToDelete) {
                  onDelete(bookingToDelete._id);
                  setDeleteDialogOpen(false);
                  setBookingToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
