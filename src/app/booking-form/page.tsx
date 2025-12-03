/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { analytics } from "@/lib/analytics";
import { TravelPackage } from "@/lib/packageData";
import { useCreateBookingMutation } from "@/redux/api/features/booking/bookingApi";
import { useGetTourByIdQuery } from "@/redux/api/features/tour/tourApi";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  Plane,
  User,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth, authUser } = useAuthCheck();
  const [createBooking, { isLoading: isBookingSubmitting }] =
    useCreateBookingMutation();

  // Check auth immediately when component loads
  const isAuthenticated = checkAuth("complete your booking");

  const packageId = searchParams?.get("id");

  // Fetch tour data from API
  const {
    data: tourData,
    isLoading: isLoadingTour,
    error: tourError,
  } = useGetTourByIdQuery(packageId || "", {
    skip: !packageId,
  });

  const packageData = tourData?.data
    ? ({
        ...tourData.data,
        id: tourData.data._id,
        price:
          tourData.data.basePrice -
          (tourData.data.offer?.isActive
            ? tourData.data.offer.discountType === "flat"
              ? tourData.data.offer.flatDiscount || 0
              : (tourData.data.basePrice *
                  (tourData.data.offer.discountPercentage || 0)) /
                100
            : 0),
        bookingFee:
          (tourData.data.basePrice * tourData.data.bookingFeePercentage) / 100,
        image: tourData.data.coverImageUrl,
        duration: tourData.data.duration,
        validFrom: tourData.data.publishedAt
          ? new Date(tourData.data.publishedAt).toISOString().split("T")[0]
          : undefined,
        validTo: undefined,
      } as TravelPackage | null)
    : null;

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    persons: 1,
    message: "",
  });

  useEffect(() => {
    if (!packageId) {
      router.push("/package-details");
      return;
    }

    if (tourError) {
      router.push("/package-details");
      return;
    }

    if (packageData) {
      // Track package view when booking form loads
      analytics.trackPackageView(
        packageData.id || packageData._id,
        packageData.title,
        packageData.price || packageData.basePrice,
        "Travel Package"
      );
    }
  }, [packageId, tourError, packageData, router]);

  // Auto-fill user data when authUser is available
  useEffect(() => {
    if (authUser) {
      const user =
        typeof authUser === "string" ? JSON.parse(authUser) : authUser;
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [authUser]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double check if user is logged in
    if (!isAuthenticated || !packageData) {
      return;
    }

    // Validate minimum 2 persons
    if (formData.persons < 2) {
      toast.error("Sorry! Minimum 2 persons required for booking.");
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.travelDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Track booking start
    if (packageData) {
      analytics.trackBookingStart(
        packageData.id || packageData._id,
        packageData.title,
        packageData.price || packageData.basePrice,
        formData.persons
      );
    }

    try {
      const bookingPayload = {
        name: formData.name,
        ...(formData.email && { email: formData.email }),
        phone: formData.phone,
        travelDate: formData.travelDate,
        persons: formData.persons,
        ...(formData.message && { message: formData.message }),
        tourId: packageData.id || packageData._id,
        tourTitle: packageData.title,
        destination: packageData.destination,
        duration: packageData.duration,
        ...((packageData as any).validFrom && {
          validFrom: (packageData as any).validFrom,
        }),
        ...((packageData as any).validTo && {
          validTo: (packageData as any).validTo,
        }),
        bookingFee: packageData.bookingFee,
        // Add userId if user is authenticated
        ...(authUser && {
          userId: (authUser as any)._id || (authUser as any).id,
        }),
      };

      const result = await createBooking(bookingPayload).unwrap();

      if (result.success && result.data.paymentUrl) {
        // Track booking completion
        const totalAmount =
          (packageData.bookingFee ||
            (packageData.basePrice * packageData.bookingFeePercentage) / 100) *
          formData.persons;
        analytics.trackBooking(
          "Package Tour",
          result.data.bookingId || "pending",
          totalAmount,
          [
            {
              id: packageData.id || packageData._id,
              name: packageData.title,
              price: packageData.price || packageData.basePrice,
              quantity: formData.persons,
            },
          ]
        );

        toast.success(
          result.message || "Booking created! Redirecting to payment gateway..."
        );

        // Redirect to SSLCommerz payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        // Track booking failure
        analytics.trackEvent("booking_failed", {
          booking_type: "Package Tour",
          reason: "Payment URL not received",
        });
        toast.error("Payment URL not received. Please try again.");
      }
    } catch (error: any) {
      // Track booking error
      analytics.trackEvent("booking_failed", {
        booking_type: "Package Tour",
        error: error?.data?.message || error?.message || "Unknown error",
      });
      toast.error(
        error?.data?.message || "Failed to create booking. Please try again."
      );
    }
  };

  if (isLoadingTour || !packageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Package Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Package Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div
                      className="h-24 w-24 rounded-lg bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${packageData.image})` }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {packageData.title}
                      </h3>
                      <p className="text-gray-600">
                        {typeof packageData.destination === "string"
                          ? packageData.destination
                          : packageData.destination?.name || "N/A"}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {typeof packageData.duration === "string"
                            ? packageData.duration
                            : `${packageData.duration.days} days`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Group tour
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary text-2xl font-bold">
                        {formatPrice(
                          packageData.price || packageData.basePrice
                        )}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email Address (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                        placeholder="+880 1234567890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="travelDate">Travel Date *</Label>
                      <Input
                        id="travelDate"
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) =>
                          handleInputChange("travelDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="persons">
                        Number of Persons * (Min: 2)
                      </Label>
                      <Input
                        id="persons"
                        type="number"
                        min="2"
                        value={formData.persons}
                        onChange={(e) =>
                          handleInputChange(
                            "persons",
                            parseInt(e.target.value) || 1
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Special Requests (Optional)</Label>
                    <Input
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Any special requirements?"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      You will be redirected to SSLCommerz payment gateway to
                      complete your payment securely. Multiple payment options
                      are available including credit/debit cards, mobile
                      banking, and internet banking.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-blue-500 px-8 py-3 text-white hover:bg-blue-600"
                  disabled={isBookingSubmitting}
                >
                  {isBookingSubmitting ? (
                    <>
                      <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span className="font-medium">{packageData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">
                        {typeof packageData.duration === "string"
                          ? packageData.duration
                          : `${packageData.duration.days} days`}
                      </span>
                    </div>
                    {formData.persons > 0 && (
                      <div className="flex justify-between">
                        <span>Persons:</span>
                        <span className="font-medium">{formData.persons}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Booking Fee:</span>
                      <span className="font-medium">
                        {formatPrice(
                          packageData.bookingFee ||
                            (packageData.basePrice *
                              packageData.bookingFeePercentage) /
                              100
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Booking Fee:</span>
                      <span className="text-primary">
                        {formatPrice(
                          packageData.bookingFee ||
                            (packageData.basePrice *
                              packageData.bookingFeePercentage) /
                              100
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      * This is an advance booking fee. Final payment details
                      will be provided after confirmation.
                    </div>
                  </div>

                  <Separator />

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your booking is secure and protected. You will receive a
                      confirmation email within 24 hours.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
