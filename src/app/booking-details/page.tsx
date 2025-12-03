"use client";

import {
  BookingSidebar,
  BookingTabs,
  PackageBanner,
  TabContent,
} from "@/components/booking";
import { analytics } from "@/lib/analytics";
import { TravelPackage } from "@/lib/packageData";
import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";
import { useGetTourByIdQuery } from "@/redux/api/features/tour/tourApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const tourId = searchParams?.get("id");

  // Fetch tour data from API
  const {
    data: tourData,
    isLoading,
    error,
  } = useGetTourByIdQuery(tourId || "", {
    skip: !tourId,
  });

  // Fetch company info for contact details
  const { data: companyInfoData } = useGetAllCompanyInfoQuery();

  useEffect(() => {
    if (tourData?.data) {
      // Convert tour data to package format for existing components
      const tour = tourData.data;
      const destination =
        typeof tour.destination === "string" ? null : tour.destination;

      const convertedPackage: TravelPackage = {
        // Core fields matching backend schema
        _id: tour._id || "",
        code: tour.code,
        title: tour.title,
        destination:
          typeof tour.destination === "object" && tour.destination
            ? tour.destination
            : destination?.name || "Unknown",
        duration: {
          days: tour.duration.days,
          nights: tour.duration.nights,
        },
        category:
          typeof tour.category === "object" && tour.category
            ? tour.category
            : tour.category || "",
        tags: tour.tags || [],
        highlights: tour.highlights || [],
        inclusion: tour.inclusion || [],
        exclusion: tour.exclusion || [],
        ...(tour.visaRequirements && {
          visaRequirements: tour.visaRequirements,
        }),
        ...(tour.terms && { terms: tour.terms }),
        ...(tour.otherDetails && { otherDetails: tour.otherDetails }),
        ...(tour.coverImageUrl && { coverImageUrl: tour.coverImageUrl }),
        ...(tour.coverImageId && { coverImageId: tour.coverImageId }),
        galleryUrls: tour.galleryUrls || [],
        galleryIds: tour.galleryIds || [],
        basePrice: tour.basePrice,
        bookingFeePercentage: tour.bookingFeePercentage || 20,
        ...(tour.offer ? { offer: tour.offer } : {}),
        itinerary: tour.itinerary || [], // ItineraryDay[] format
        status: tour.status || "DRAFT",
        ...(tour.publishedAt && { publishedAt: tour.publishedAt }),
        ...(tour.order !== undefined && { order: tour.order }),

        // Legacy/computed fields for backward compatibility
        id: tour._id || "",
        price: tour.offer?.isActive
          ? tour.offer.discountType === "flat"
            ? tour.basePrice - (tour.offer.flatDiscount || 0)
            : tour.basePrice -
              (tour.basePrice * (tour.offer.discountPercentage || 0)) / 100
          : tour.basePrice,
        originalPrice: tour.basePrice,
        image:
          tour.coverImageUrl ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        galleryImages: tour.galleryUrls || [],
        ...(typeof tour.category === "object" && tour.category
          ? { categoryName: tour.category.category_name }
          : {}),
        inclusions: tour.inclusion || [],
        exclusions: tour.exclusion || [],
        packageCode: tour.code,
        country:
          typeof tour.destination === "object" && tour.destination
            ? tour.destination.name
            : destination?.name || "Unknown",
        rating: 4.5,
        reviewCount: 0,
        isRecommended: false,
        bookingFee: (tour.basePrice * tour.bookingFeePercentage) / 100,
      };
      setPackageData(convertedPackage);

      // Track package view
      const packageId = convertedPackage.id || convertedPackage._id;
      if (packageId) {
        analytics.trackPackageView(
          packageId,
          convertedPackage.title,
          convertedPackage.price || convertedPackage.basePrice,
          convertedPackage.categoryName || "Travel Package"
        );
      }
    } else if (!isLoading && !tourId) {
      // No tour ID provided, show error or redirect
      router.push("/");
    }
  }, [tourData, isLoading, tourId, searchParams, companyInfoData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || (!packageData && !isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Package not found</p>
          <button
            onClick={() => router.push("/package-details")}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  // Note: Country cards data is commented out as it's not currently being used
  // This can be uncommented and used when needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Country Cards Section - First */}
        {/* <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Europe 13 Days Group Tour
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryCards.map((country, index) => (
              <CountryCard key={index} country={country} />
            ))}
          </div>
        </div> */}

        {/* Package Banner Image - Second */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <PackageBanner packageData={packageData} />
        </div>

        {/* Main Content with Tabs and Sidebar */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <BookingTabs activeTab={activeTab} onTabChange={setActiveTab}>
              <TabContent activeTab={activeTab} packageData={packageData} />
            </BookingTabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar packageData={packageData} />
          </div>
        </div>
      </div>
    </div>
  );
}
