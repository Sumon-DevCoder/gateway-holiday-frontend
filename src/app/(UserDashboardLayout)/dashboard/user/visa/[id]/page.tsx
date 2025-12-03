"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyVisaBookingsQuery } from "@/redux/api/features/visaBooking/visaBookingApi";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VisaBookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: visaResponse, isLoading, error } = useGetMyVisaBookingsQuery();

  useEffect(() => {
    if (visaResponse?.data) {
      const foundBooking = visaResponse.data.find(
        (b: any) => b._id === params.id
      );
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        toast.error("Booking not found");
        router.push("/dashboard/user/visa");
      }
    }
    setLoading(false);
  }, [visaResponse, params.id, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">Failed to load booking details</p>
            <Button
              onClick={() => router.push("/dashboard/user/visa")}
              className="w-full"
            >
              Back to Visa Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/user/visa")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Visa Applications
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Visa Application Details
          </h1>
          <p className="text-gray-600">
            View and track your visa application status
          </p>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Visa Application Details
              <div className="flex gap-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.toUpperCase()}
                </Badge>
                {booking.paymentStatus &&
                  booking.paymentStatus.toLowerCase() !==
                    booking.status.toLowerCase() && (
                    <Badge
                      className={getPaymentStatusColor(booking.paymentStatus)}
                    >
                      Payment: {booking.paymentStatus.toUpperCase()}
                    </Badge>
                  )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Application Information */}
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-900">
                  Application Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Application ID
                    </h4>
                    <p className="font-mono text-gray-600">{booking._id}</p>
                  </div>
                  {booking.transactionId && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Transaction ID
                      </h4>
                      <p className="font-mono text-gray-600">
                        {booking.transactionId}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Booking Type
                    </h4>
                    <p className="text-gray-600">
                      <Badge
                        className={
                          booking.booking_type === "application"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {booking.booking_type === "application"
                          ? "Application"
                          : "Query"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Application Fee
                    </h4>
                    <p className="text-gray-600">
                      ৳{booking.applicationFee || booking.processingFee || 0}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Applied Date
                    </h4>
                    <p className="text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="mb-4 flex items-center border-b pb-2 text-lg font-semibold text-gray-900">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Full Name</h4>
                    <p className="text-gray-600">{booking.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="flex items-center text-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      {booking.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="flex items-center text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      {booking.phone}
                    </p>
                  </div>
                  {booking.nationality && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Nationality
                      </h4>
                      <p className="text-gray-600">{booking.nationality}</p>
                    </div>
                  )}
                  {booking.dateOfBirth && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Date of Birth
                      </h4>
                      <p className="text-gray-600">{booking.dateOfBirth}</p>
                    </div>
                  )}
                  {booking.passportNumber && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Passport Number
                      </h4>
                      <p className="font-mono text-gray-600">
                        {booking.passportNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Visa Information */}
              <div>
                <h3 className="mb-4 flex items-center border-b pb-2 text-lg font-semibold text-gray-900">
                  <MapPin className="mr-2 h-5 w-5" />
                  Visa Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Destination Country
                    </h4>
                    <p className="text-gray-600">{booking.country}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visa Type</h4>
                    <p className="text-gray-600">{booking.visaType}</p>
                  </div>
                  {booking.numberOfPersons && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Number of Persons
                      </h4>
                      <p className="flex items-center text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        {booking.numberOfPersons}
                      </p>
                    </div>
                  )}
                  {booking.purposeOfVisit && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-900">
                        Purpose of Visit
                      </h4>
                      <p className="text-gray-600">{booking.purposeOfVisit}</p>
                    </div>
                  )}
                  {booking.intendedArrivalDate && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Intended Arrival
                      </h4>
                      <p className="text-gray-600">
                        {booking.intendedArrivalDate}
                      </p>
                    </div>
                  )}
                  {booking.intendedDepartureDate && (
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Intended Departure
                      </h4>
                      <p className="text-gray-600">
                        {booking.intendedDepartureDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              {booking.booking_type === "application" && (
                <div>
                  <h3 className="mb-4 flex items-center border-b pb-2 text-lg font-semibold text-gray-900">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {booking.paymentMethod && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Payment Method
                        </h4>
                        <p className="text-gray-600">{booking.paymentMethod}</p>
                      </div>
                    )}
                    {booking.paymentGateway && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Payment Gateway
                        </h4>
                        <p className="text-gray-600">
                          {booking.paymentGateway}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.bankTransactionId && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Bank Transaction ID
                        </h4>
                        <p className="font-mono text-gray-600">
                          {booking.sslcommerz.bankTransactionId}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.cardType && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Card Type
                        </h4>
                        <p className="text-gray-600">
                          {booking.sslcommerz.cardType}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.cardBrand && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Card Brand
                        </h4>
                        <p className="text-gray-600">
                          {booking.sslcommerz.cardBrand}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.cardIssuer && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Card Issuer
                        </h4>
                        <p className="text-gray-600">
                          {booking.sslcommerz.cardIssuer}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.amount && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Paid Amount
                        </h4>
                        <p className="text-gray-600">
                          ৳{booking.sslcommerz.amount}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.currency && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Currency
                        </h4>
                        <p className="text-gray-600">
                          {booking.sslcommerz.currency}
                        </p>
                      </div>
                    )}
                    {booking.sslcommerz?.status && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-900">
                          Payment Status (Gateway)
                        </h4>
                        <p className="text-gray-600">
                          {booking.sslcommerz.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {(booking.paidAt ||
                booking.contactedAt ||
                booking.closedAt ||
                booking.updatedAt) && (
                <div>
                  <h3 className="mb-4 flex items-center border-b pb-2 text-lg font-semibold text-gray-900">
                    <Calendar className="mr-2 h-5 w-5" />
                    Important Dates
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Application Created
                      </h4>
                      <p className="text-gray-600">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {booking.updatedAt && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Last Updated
                        </h4>
                        <p className="text-gray-600">
                          {new Date(booking.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {booking.paidAt && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Payment Date
                        </h4>
                        <p className="text-gray-600">
                          {new Date(booking.paidAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {booking.contactedAt && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Contacted Date
                        </h4>
                        <p className="text-gray-600">
                          {new Date(booking.contactedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {booking.closedAt && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Closed Date
                        </h4>
                        <p className="text-gray-600">
                          {new Date(booking.closedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(booking.additionalInfo || booking.accommodationDetails) && (
                <div>
                  <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-900">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {booking.accommodationDetails && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Accommodation Details
                        </h4>
                        <p className="text-gray-600">
                          {booking.accommodationDetails}
                        </p>
                      </div>
                    )}
                    {booking.additionalInfo && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Additional Information
                        </h4>
                        <p className="text-gray-600">
                          {booking.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
