"use client";

import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { analytics } from "@/lib/analytics";
import { TravelPackage } from "@/lib/packageData";
import { useCreateBookingMutation } from "@/redux/api/features/booking/bookingApi";
import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";
import { useCreateCustomTourQueryMutation } from "@/redux/api/features/customTourQuery/customTourQueryApi";
import jsPDF from "jspdf";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface BookingSidebarProps {
  packageData: TravelPackage;
}

interface CustomTourQueryFormData {
  name: string;
  email?: string;
  phone: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: string | boolean;
}

interface BookingFormData {
  name: string;
  email?: string;
  phone: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: boolean;
  message?: string;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  packageData,
}) => {
  // Helper function to get destination name (handle both string and object)
  const getDestinationName = () => {
    if (typeof packageData.destination === "string") {
      return packageData.destination;
    }
    if (
      typeof packageData.destination === "object" &&
      packageData.destination !== null &&
      "name" in packageData.destination
    ) {
      return packageData.destination.name;
    }
    return "Unknown";
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "query" | "booking" | null
  >(null);

  const [createCustomTourQuery, { isLoading: isSubmitting }] =
    useCreateCustomTourQueryMutation();
  const [createBooking, { isLoading: isBookingSubmitting }] =
    useCreateBookingMutation();

  // Auth check hook
  const { checkAuth, authUser } = useAuthCheck();

  // Store user data for auto-fill
  const [userDefaultData, setUserDefaultData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({ name: "", email: "", phone: "" });

  // Fetch company info for contact details
  const { data: companyInfoData } = useGetAllCompanyInfoQuery();

  // Extract company info
  const companyInfo = Array.isArray(companyInfoData?.data)
    ? companyInfoData?.data[0]
    : companyInfoData?.data;

  // Auto-fill user data when authUser is available
  useEffect(() => {
    if (authUser) {
      const user =
        typeof authUser === "string" ? JSON.parse(authUser) : authUser;
      setUserDefaultData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [authUser]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handler for Customize button - with auth check
  const handleCustomizeClick = () => {
    if (
      !checkAuth("submit a tour query", () => {
        // If not logged in, open login modal
        setIsLoginModalOpen(true);
        setPendingAction("query");
        return;
      })
    ) {
      return;
    }
    setIsModalOpen(true);
  };

  // Handler for Book Now button - with auth check
  const handleBookNowClick = () => {
    // Track button click
    analytics.trackButtonClick(
      "Book Now",
      `/booking-details?id=${packageData.id}`
    );

    if (
      !checkAuth("complete your booking", () => {
        // If not logged in, open login modal
        setIsLoginModalOpen(true);
        setPendingAction("booking");
        return;
      })
    ) {
      return;
    }
    setIsBookingModalOpen(true);
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    const API_URL =
      process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:5000/api";

    // Save current URL for redirect after login
    const currentUrl = window.location.href;
    sessionStorage.setItem("booking_redirect_after_login", currentUrl);
    sessionStorage.setItem("booking_pending_action", pendingAction || "");

    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  // Check if user just logged in and had a pending action
  useEffect(() => {
    const savedPendingAction = sessionStorage.getItem("booking_pending_action");

    if (savedPendingAction && authUser) {
      // User just logged in, open the appropriate modal
      if (savedPendingAction === "query") {
        setIsModalOpen(true);
      } else if (savedPendingAction === "booking") {
        setIsBookingModalOpen(true);
      }

      // Clear the pending action
      sessionStorage.removeItem("booking_pending_action");
      sessionStorage.removeItem("booking_redirect_after_login");
    }
  }, [authUser]);

  const handleCustomTourQuerySubmit = async (data: CustomTourQueryFormData) => {
    try {
      // Convert needsVisa from string to boolean if present
      const needsVisaValue =
        data.needsVisa !== undefined
          ? typeof data.needsVisa === "string"
            ? data.needsVisa === "true"
            : data.needsVisa === true
          : undefined;

      const result = await createCustomTourQuery({
        name: data.name,
        ...(data.email && data.email.trim() && { email: data.email.trim() }),
        phone: data.phone,
        travelDate: data.travelDate,
        persons: data.persons,
        ...(data.numberOfAdults !== undefined &&
          data.numberOfAdults !== null && {
            numberOfAdults: Number(data.numberOfAdults),
          }),
        ...(data.numberOfChildren !== undefined &&
          data.numberOfChildren !== null && {
            numberOfChildren: Number(data.numberOfChildren),
          }),
        ...(needsVisaValue !== undefined && { needsVisa: needsVisaValue }),
        tourId: packageData.id || packageData._id,
        tourTitle: packageData.title,
      }).unwrap();

      const successMessage =
        typeof result.message === "string"
          ? result.message
          : "Your query has been submitted successfully! We will contact you soon.";
      toast.success(successMessage);
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        typeof error?.data?.message === "string"
          ? error.data.message
          : typeof error?.message === "string"
            ? error.message
            : "Failed to submit query. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    // Validate minimum 2 persons first (before try-catch)
    if (data.persons < 2) {
      toast.error("Sorry! Minimum 2 persons required for booking.");
      throw new Error("Minimum 2 persons required");
    }

    try {
      const bookingPayload = {
        name: data.name,
        ...(data.email && { email: data.email }),
        phone: data.phone,
        travelDate: data.travelDate,
        persons: data.persons,
        ...(data.numberOfAdults !== undefined && {
          numberOfAdults: data.numberOfAdults,
        }),
        ...(data.numberOfChildren !== undefined && {
          numberOfChildren: data.numberOfChildren,
        }),
        ...(data.needsVisa !== undefined && { needsVisa: data.needsVisa }),
        ...(data.message && { message: data.message }),
        tourId: packageData.id,
        tourTitle: packageData.title,
        destination: getDestinationName(),
        duration: packageData.duration,
        ...((packageData as any).validFrom && {
          validFrom: (packageData as any).validFrom,
        }),
        ...((packageData as any).validTo && {
          validTo: (packageData as any).validTo,
        }),
        bookingFee:
          packageData.bookingFee ||
          (packageData.basePrice * packageData.bookingFeePercentage) / 100,
        // Add userId if user is authenticated
        ...(authUser && {
          userId: (authUser as any)._id || (authUser as any).id,
        }),
      };

      const result = await createBooking(bookingPayload).unwrap();

      if (result.success && result.data.paymentUrl) {
        const bookingMessage =
          typeof result.message === "string"
            ? result.message
            : "Booking created! Redirecting to payment gateway...";
        toast.success(bookingMessage);

        // Redirect to SSLCommerz payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error("Payment URL not received. Please try again.");
      }

      setIsBookingModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        typeof error?.data?.message === "string"
          ? error.data.message
          : typeof error?.message === "string"
            ? error.message
            : "Failed to create booking. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDownloadPackage = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Helper function to add new page if needed
      const checkPageBreak = (height: number) => {
        if (yPosition + height > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize = 10, isBold = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.5;

        lines.forEach((line: string) => {
          checkPageBreak(lineHeight);
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      };

      // Title
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("TOUR PACKAGE DETAILS", pageWidth / 2, 20, { align: "center" });
      yPosition = 40;
      doc.setTextColor(0, 0, 0);

      // Package Information
      addText(`Package Code: ${packageData.packageCode}`, 12, true);
      yPosition += 2;
      addText(`Tour Title: ${packageData.title}`, 12, true);
      yPosition += 2;
      addText(`Destination: ${getDestinationName()}`, 11);
      yPosition += 2;
      addText(`Duration: ${packageData.duration} Days`, 11);
      yPosition += 2;
      addText(
        `Price: ${formatPrice(packageData.price || packageData.basePrice)} per person`,
        11,
        true
      );
      if (packageData.originalPrice) {
        yPosition += 2;
        addText(
          `Original Price: ${formatPrice(packageData.originalPrice)}`,
          10
        );
      }
      yPosition += 2;
      if ((packageData as any).validFrom) {
        addText(`Valid From: ${(packageData as any).validFrom}`, 10);
      }
      yPosition += 2;
      if ((packageData as any).validTo) {
        addText(`Valid To: ${(packageData as any).validTo}`, 10);
      }
      yPosition += 8;

      // Highlights Section
      checkPageBreak(15);
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("HIGHLIGHTS", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      packageData.highlights.forEach((item, i) => {
        checkPageBreak(6);
        addText(`${i + 1}. ${item}`, 10);
        yPosition += 2;
      });
      yPosition += 5;

      // Itinerary Section
      checkPageBreak(15);
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("DETAILED ITINERARY", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      packageData.itinerary.forEach((day) => {
        checkPageBreak(10);
        addText(
          `Day ${day.dayNo}: ${day.title || getDestinationName()}`,
          11,
          true
        );
        yPosition += 2;

        // Handle new structure with blocks
        if (day.blocks && day.blocks.length > 0) {
          day.blocks.forEach((block) => {
            if (block.title) {
              addText(block.title, 10, true);
              yPosition += 1;
            }
            if (block.description) {
              addText(block.description, 9);
              yPosition += 1;
            }
            if (block.hotelName) {
              addText(`Accommodation: ${block.hotelName}`, 9);
              yPosition += 1;
            }
            if (block.meals) {
              const mealTypes = [];
              if (block.meals.breakfast) mealTypes.push("Breakfast");
              if (block.meals.lunch) mealTypes.push("Lunch");
              if (block.meals.dinner) mealTypes.push("Dinner");
              if (mealTypes.length > 0) {
                addText(`Meals: ${mealTypes.join(", ")}`, 9);
                yPosition += 1;
              }
            }
            yPosition += 1;
          });
        } else {
          // Fallback for legacy structure
          const legacyDay = day as any;
          if (legacyDay.activities && legacyDay.activities.length > 0) {
            addText("Activities:", 10, true);
            legacyDay.activities.forEach((activity: string, i: number) => {
              checkPageBreak(5);
              addText(`  ${i + 1}. ${activity}`, 9);
              yPosition += 1;
            });
            yPosition += 2;
          }

          if (legacyDay.accommodation) {
            addText(`Accommodation: ${legacyDay.accommodation}`, 9);
            yPosition += 2;
          }

          if (legacyDay.meals && legacyDay.meals.length > 0) {
            addText(`Meals: ${legacyDay.meals.join(", ")}`, 9);
            yPosition += 2;
          }
        }

        // Handle legacy transportation property
        const legacyDay = day as any;
        if (legacyDay.transportation) {
          addText(`Transportation: ${legacyDay.transportation}`, 9);
          yPosition += 2;
        }

        yPosition += 3;
      });

      // Inclusions
      checkPageBreak(15);
      doc.setFillColor(34, 197, 94);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("INCLUSIONS", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      (packageData.inclusions || packageData.inclusion || []).forEach(
        (item, i) => {
          checkPageBreak(6);
          addText(`${i + 1}. ${item}`, 10);
          yPosition += 2;
        }
      );
      yPosition += 5;

      // Exclusions
      checkPageBreak(15);
      doc.setFillColor(239, 68, 68);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EXCLUSIONS", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      (packageData.exclusions || packageData.exclusion || []).forEach(
        (item, i) => {
          checkPageBreak(6);
          addText(`${i + 1}. ${item}`, 10);
          yPosition += 2;
        }
      );
      yPosition += 5;

      // Visa Requirements
      checkPageBreak(15);
      doc.setFillColor(147, 51, 234);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("VISA REQUIREMENTS", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      if (packageData.visaRequirements) {
        if (typeof packageData.visaRequirements === "string") {
          addText(packageData.visaRequirements, 10);
        } else {
          const visaReq = packageData.visaRequirements as any;
          addText(
            `Visa Required: ${visaReq.required ? "Yes" : "No"}`,
            10,
            true
          );
          yPosition += 2;
          if (visaReq.processingTime) {
            addText(`Processing Time: ${visaReq.processingTime}`, 10);
          }
        }
      }
      yPosition += 2;
      if (
        packageData.visaRequirements &&
        typeof packageData.visaRequirements === "object"
      ) {
        const visaReq = packageData.visaRequirements as any;
        if (visaReq.applicationProcedure) {
          addText("Application Procedure:", 10, true);
          yPosition += 2;
          addText(visaReq.applicationProcedure, 9);
        }
      }
      yPosition += 5;

      // Contact Information
      checkPageBreak(15);
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CONTACT INFORMATION", margin + 2, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      if (packageData.otherDetails) {
        if (typeof packageData.otherDetails === "string") {
          addText(packageData.otherDetails, 10);
        } else {
          const otherDetails = packageData.otherDetails as any;
          if (otherDetails.contactInfo) {
            addText(`Phone: ${otherDetails.contactInfo}`, 10);
            yPosition += 2;
          }
          if (otherDetails.emergencyContact) {
            addText(`Emergency Contact: ${otherDetails.emergencyContact}`, 10);
          }
        }
      }
      yPosition += 5;

      // Terms and Conditions
      if (packageData.terms && packageData.terms.length > 0) {
        checkPageBreak(15);
        doc.setFillColor(37, 99, 235);
        doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("TERMS AND CONDITIONS", margin + 2, yPosition);
        yPosition += 8;
        doc.setTextColor(0, 0, 0);

        if (packageData.terms) {
          if (typeof packageData.terms === "string") {
            addText(packageData.terms, 10);
            yPosition += 2;
          } else if (Array.isArray(packageData.terms)) {
            (packageData.terms as string[]).forEach((term, i) => {
              checkPageBreak(6);
              addText(`${i + 1}. ${term}`, 10);
              yPosition += 2;
            });
          }
        }
        yPosition += 5;
      }

      // Special Notes
      if (
        packageData.otherDetails &&
        typeof packageData.otherDetails === "object" &&
        (packageData.otherDetails as any).specialNotes &&
        (packageData.otherDetails as any).specialNotes.length > 0
      ) {
        checkPageBreak(15);
        doc.setFillColor(234, 179, 8);
        doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SPECIAL NOTES", margin + 2, yPosition);
        yPosition += 8;
        doc.setTextColor(0, 0, 0);

        ((packageData.otherDetails as any).specialNotes as string[]).forEach(
          (note, i) => {
            checkPageBreak(6);
            addText(`${i + 1}. ${note}`, 10);
            yPosition += 2;
          }
        );
      }

      // Footer on last page
      doc.setFillColor(37, 99, 235);
      doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(
        "Thank you for choosing our travel services!",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Save PDF
      const fileName = `${packageData.packageCode}_${packageData.title
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "")}.pdf`;
      doc.save(fileName);

      toast.success("Package details PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download package details. Please try again.");
    }
  };

  return (
    <>
      {/* Google Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Login Required
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="mb-6 text-center text-gray-600">
              Please login with Google to continue
            </p>
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 sm:space-y-6">
        {/* Package Summary Card */}
        <Card className="border-t-4 border-blue-500">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 text-center">
              <div className="mb-2 text-xs text-gray-500 sm:text-sm">
                PACKAGE CODE: {packageData.packageCode}
              </div>
              <h3 className="mb-3 text-base font-bold text-blue-600 sm:mb-4 sm:text-lg">
                {packageData.title} Package
              </h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 sm:text-sm">
                  Package Starting Cost:
                </div>
                <div className="text-xs text-gray-500 line-through sm:text-sm">
                  {formatPrice(packageData.originalPrice || 0)}
                </div>
                <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                  {formatPrice(packageData.price || packageData.basePrice)}
                </div>
                <div className="text-xs text-gray-500 sm:text-sm">
                  Per Person
                </div>

                {/* Booking Fee Info */}
                {packageData.bookingFeePercentage && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-2 sm:p-3">
                    <div className="text-xs font-medium text-blue-700 sm:text-sm">
                      Advance Booking Fee
                    </div>
                    <div className="text-sm font-bold text-blue-600 sm:text-base">
                      {packageData.bookingFeePercentage}% (
                      {formatPrice(
                        ((packageData.price || packageData.basePrice) *
                          packageData.bookingFeePercentage) /
                          100
                      )}
                      )
                    </div>
                    <div className="text-xs text-gray-500">
                      To confirm your booking
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Button
                className="w-full bg-blue-500 py-4 text-base text-white hover:bg-blue-600 sm:py-6 sm:text-lg"
                onClick={handleBookNowClick}
              >
                Book Now
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
              <Button
                className="w-full bg-blue-500 text-sm text-white hover:bg-blue-600 sm:text-base"
                onClick={handleCustomizeClick}
              >
                Customize Tour Query
              </Button>
              <Button
                variant="outline"
                className="w-full border-yellow-400 text-sm text-blue-600 hover:bg-yellow-50 sm:text-base"
                onClick={handleDownloadPackage}
              >
                <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Download Package Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 rounded-lg bg-blue-500 p-2 text-center text-sm font-bold text-white sm:p-3 sm:text-base">
              Contact Us
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Phone Section */}
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm sm:gap-3 sm:p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-10 sm:w-10">
                  <Phone className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500">Call Us</div>
                  <a
                    href={`tel:${companyInfo?.phone?.[0] || (packageData.otherDetails && typeof packageData.otherDetails === "object" ? (packageData.otherDetails as any).contactInfo : "")}`}
                    className="text-sm font-semibold break-words text-blue-600 hover:text-blue-700 sm:text-base"
                  >
                    {companyInfo?.phone?.[0] ||
                      (packageData.otherDetails &&
                      typeof packageData.otherDetails === "object"
                        ? (packageData.otherDetails as any).contactInfo
                        : "")}
                  </a>
                </div>
              </div>

              {/* Email Section */}
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm sm:gap-3 sm:p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500 sm:h-10 sm:w-10">
                  <Mail className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500">Email Us</div>
                  <a
                    href={`mailto:${companyInfo?.email?.[0] || "info@example.com"}`}
                    className="text-sm font-semibold break-all text-blue-600 hover:text-blue-700 sm:text-base"
                  >
                    {companyInfo?.email?.[0] || "info@example.com"}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customize Tour Query Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="flex max-h-[calc(100vh-4rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
            <div className="p-6 pb-0">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Customize Tour Query</DialogTitle>
                <DialogDescription>
                  Please provide your information and we will contact you soon
                  to customize your tour package.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CustomForm<CustomTourQueryFormData>
                onSubmit={handleCustomTourQuerySubmit}
                defaultValues={{
                  name: userDefaultData.name,
                  email: userDefaultData.email,
                  phone: userDefaultData.phone,
                }}
              >
                <div className="space-y-4">
                  <CustomInput<CustomTourQueryFormData>
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="email"
                    type="email"
                    label="Email Address (Optional)"
                    placeholder="your@email.com"
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+880 1234567890"
                    required
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="travelDate"
                    type="date"
                    label="Travel Date"
                    placeholder="Select travel date"
                    required
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="persons"
                    type="number"
                    label="Number of Persons"
                    placeholder="Enter total number of persons"
                    required
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="numberOfAdults"
                    type="number"
                    label="Number of Adults (Optional)"
                    placeholder="Enter number of adults"
                  />

                  <CustomInput<CustomTourQueryFormData>
                    name="numberOfChildren"
                    type="number"
                    label="Number of Children (Optional)"
                    placeholder="Enter number of children"
                  />

                  <CustomSelect<CustomTourQueryFormData>
                    name="needsVisa"
                    label="Visa (Optional)"
                    placeholder="Select an option"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                </div>

                <DialogFooter className="mt-6 flex-shrink-0 pb-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </DialogFooter>
              </CustomForm>
            </div>
            <div className="h-6"></div>
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="flex max-h-[calc(100vh-4rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
            <div className="p-6 pb-0">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Book Now</DialogTitle>
                <DialogDescription>
                  Please fill in your details to proceed with the booking. We
                  will contact you shortly to confirm your reservation.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CustomForm<BookingFormData>
                onSubmit={handleBookingSubmit}
                defaultValues={{
                  name: userDefaultData.name,
                  email: userDefaultData.email,
                  phone: userDefaultData.phone,
                }}
              >
                <div className="space-y-4">
                  <CustomInput<BookingFormData>
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <CustomInput<BookingFormData>
                    name="email"
                    type="email"
                    label="Email Address (Optional)"
                    placeholder="your@email.com"
                  />

                  <CustomInput<BookingFormData>
                    name="phone"
                    type="tel"
                    label="Contact Number"
                    placeholder="+880 1234567890"
                    required
                  />

                  <CustomInput<BookingFormData>
                    name="travelDate"
                    type="date"
                    label="Travel Date"
                    placeholder="Select travel date"
                    required
                  />

                  <CustomInput<BookingFormData>
                    name="persons"
                    type="number"
                    label="Number of Persons"
                    placeholder="Minimum 2 persons required"
                    required
                  />
                  <p className="-mt-2 text-xs text-gray-500">
                    * Minimum 2 persons required for booking
                  </p>

                  <CustomInput<BookingFormData>
                    name="numberOfAdults"
                    type="number"
                    label="Number of Adults (Optional)"
                    placeholder="Enter number of adults"
                  />

                  <CustomInput<BookingFormData>
                    name="numberOfChildren"
                    type="number"
                    label="Number of Children (Optional)"
                    placeholder="Enter number of children"
                  />

                  <CustomSelect<BookingFormData>
                    name="needsVisa"
                    label="Visa (Optional)"
                    placeholder="Select an option"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Booking Fee (Advance Payment)
                    </label>
                    <input
                      type="text"
                      value={formatPrice(
                        packageData.bookingFee ||
                          (packageData.basePrice *
                            packageData.bookingFeePercentage) /
                            100
                      )}
                      readOnly
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
                    />
                    <p className="text-xs text-gray-500">
                      {packageData.bookingFeePercentage}% of total package cost
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-6 flex-shrink-0 pb-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                    disabled={isBookingSubmitting}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isBookingSubmitting}
                  >
                    {isBookingSubmitting ? "Submitting..." : " Pay Now"}
                  </Button>
                </DialogFooter>
              </CustomForm>
            </div>
            <div className="h-6"></div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
