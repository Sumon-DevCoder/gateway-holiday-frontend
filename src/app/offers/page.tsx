"use client";

import HeadingSection from "@/components/HeadingSection";
import { Button } from "@/components/ui/button";
import { useGetToursWithOffersQuery } from "@/redux/api/features/tour/tourApi";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

// Helper function to calculate discounted price
const calculateDiscountedPrice = (
  basePrice: number,
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
  }
): number => {
  if (!offer || !offer.isActive) return basePrice;

  if (offer.discountType === "flat" && offer.flatDiscount) {
    return Math.max(0, basePrice - offer.flatDiscount);
  }

  if (offer.discountType === "percentage" && offer.discountPercentage) {
    return Math.max(
      0,
      basePrice - (basePrice * offer.discountPercentage) / 100
    );
  }

  return basePrice;
};

export default function OffersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch all tours with offers from API
  const {
    data: offersData,
    isLoading,
    error,
  } = useGetToursWithOffersQuery({ limit: 100 });

  const offers = offersData?.data || [];

  // Pagination logic
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOfferClick = useCallback(
    (tourId: string | undefined) => {
      if (tourId) {
        router.push(`/booking-details?id=${tourId}`);
      }
    },
    [router]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Failed to load offers
            </h1>
            <p className="mb-6 text-gray-600">
              Please try again later or contact support.
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-primary hover:bg-primary/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <HeadingSection
            badgeText="exclusive deals"
            badgeIcon="🔥"
            title="All Exclusive Offers"
            subtitle={`Discover ${offers.length} amazing deals and special packages designed just for you`}
          />
        </div>

        {/* Offers Grid */}
        {currentOffers.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentOffers.map((tour, index) => {
              const discountedPrice = calculateDiscountedPrice(
                tour.basePrice,
                tour.offer
              );
              const destination =
                typeof tour.destination === "string" ? null : tour.destination;

              return (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="hover-lift shadow-travel-lg group relative cursor-pointer overflow-hidden rounded-xl"
                >
                  {/* Background Image */}
                  <div
                    className="relative h-64 bg-gray-300 bg-cover bg-center bg-no-repeat sm:h-72 md:h-80"
                    style={{
                      backgroundImage: tour.coverImageUrl
                        ? `url(${tour.coverImageUrl})`
                        : undefined,
                    }}
                  >
                    {/* Offer Badge */}
                    {tour.offer?.isActive && (
                      <div className="bg-accent absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white md:text-sm">
                        {tour.offer.discountType === "percentage"
                          ? `${tour.offer.discountPercentage}% OFF`
                          : "SPECIAL OFFER"}
                      </div>
                    )}

                    {/* Rating Badge */}
                    {(tour as any).rating && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{(tour as any).rating}</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white md:p-6 lg:p-8">
                      {/* Title */}
                      <h3 className="group-hover:text-accent mb-2 text-lg leading-tight font-bold transition-colors duration-300 sm:text-xl md:text-2xl">
                        {tour.title}
                      </h3>

                      {/* Subtitle - Destination & Duration */}
                      <h4 className="text-accent mb-3 text-sm leading-tight font-semibold sm:text-base md:mb-4 md:text-lg">
                        {destination?.name || "Amazing Destination"} •{" "}
                        {tour.duration?.days}D/{tour.duration?.nights}N
                      </h4>

                      {/* Duration & Group Size */}
                      <div className="mb-3 flex items-center gap-4 text-xs text-white/80 sm:text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Max {(tour as any).maxGroupSize || "N/A"}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-3 text-sm font-bold sm:text-base md:mb-4 md:text-lg">
                        <div className="flex items-center gap-2">
                          {tour.offer?.isActive && (
                            <span className="text-xs text-gray-300 line-through sm:text-sm">
                              ৳{tour.basePrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-white">
                            ৳{discountedPrice.toLocaleString()}
                          </span>
                        </div>
                        {tour.offer?.isActive && (
                          <span className="text-accent text-xs">
                            Save{" "}
                            {tour.offer.discountType === "percentage"
                              ? `${tour.offer.discountPercentage}%`
                              : `৳${tour.offer.flatDiscount?.toLocaleString()}`}
                          </span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full border-white/30 bg-white/20 text-xs text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-105 hover:border-white/50 hover:bg-white/30 sm:text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOfferClick(tour._id);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                    {/* Animated Elements */}
                    <div className="pointer-events-none absolute inset-0 opacity-20">
                      <div className="absolute top-2 right-2 h-12 w-12 animate-pulse rounded-full border-2 border-white md:top-4 md:right-4 md:h-20 md:w-20"></div>
                      <div className="absolute bottom-2 left-2 h-10 w-10 animate-pulse rounded-full border-2 border-white delay-1000 md:bottom-4 md:left-4 md:h-16 md:w-16"></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                No offers available
              </h3>
              <p className="text-gray-600">
                Check back later for new exclusive offers!
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border-primary text-primary hover:bg-primary hover:text-white"
                    }
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
