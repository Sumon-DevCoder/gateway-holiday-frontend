"use client";

import HeadingSection from "@/components/HeadingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetRecommendedToursQuery } from "@/redux/api/features/tour/tourApi";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface RecommendedSectionProps {
  className?: string;
}

export default function RecommendedSection({
  className = "",
}: RecommendedSectionProps) {
  const router = useRouter();

  // Fetch recommended tours
  const { data, isLoading } = useGetRecommendedToursQuery({ limit: 12 });
  const tours = data?.data || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // ✅ Smart duplication for infinite scroll (triple for smooth looping)
  const infiniteTours = useMemo(() => {
    return tours.length > slidesToShow ? [...tours, ...tours] : tours;
  }, [tours, slidesToShow]);

  const slideWidth = 100 / slidesToShow;

  // ✅ Responsive slide count
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else if (window.innerWidth < 1280) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // Start from middle for seamless scroll (only when infinite scroll is needed)
  useEffect(() => {
    if (tours.length > slidesToShow) {
      setCurrentIndex(tours.length);
    } else {
      setCurrentIndex(0);
    }
  }, [tours.length, slidesToShow]);

  // Handle seamless reset when reaching boundaries
  useEffect(() => {
    if (tours.length <= slidesToShow) return;

    if (currentIndex >= tours.length * 2) {
      // Reset to middle set without animation
      const timer = setTimeout(() => {
        setCurrentIndex(tours.length);
      }, 500); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
    if (currentIndex < tours.length) {
      // Reset to end of middle set without animation
      const timer = setTimeout(() => {
        setCurrentIndex(tours.length * 2 - 1);
      }, 500); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentIndex, tours.length, slidesToShow]);

  const nextSlide = useCallback(() => {
    if (tours.length <= slidesToShow) return; // Don't slide if not enough tours
    setCurrentIndex((prev) => prev + 1);
  }, [tours.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    if (tours.length <= slidesToShow) return; // Don't slide if not enough tours
    setCurrentIndex((prev) => prev - 1);
  }, [tours.length, slidesToShow]);

  // Manual navigation - pause auto-slide temporarily
  const handleManualNext = useCallback(() => {
    nextSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000); // Resume after 3 seconds
  }, [nextSlide]);

  const handleManualPrev = useCallback(() => {
    prevSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000); // Resume after 3 seconds
  }, [prevSlide]);

  // Handle drag start - pause auto-slide
  const handleDragStart = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  // Handle swipe gesture on mobile - simplified for smooth dragging
  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      if (tours.length <= slidesToShow) return; // Don't handle swipe if not enough tours

      const swipeThreshold = 50; // minimum swipe distance in pixels
      const swipeVelocity = 300; // minimum swipe velocity

      const dragDistance = Math.abs(info.offset.x);
      const dragVelocity = Math.abs(info.velocity.x);

      // Simple swipe detection - if dragged enough or fast enough, change slide
      if (dragDistance > swipeThreshold || dragVelocity > swipeVelocity) {
        // Swipe left (show next slide)
        if (info.offset.x < 0) {
          nextSlide();
        }
        // Swipe right (show previous slide)
        else if (info.offset.x > 0) {
          prevSlide();
        }
      }

      // Resume auto-slide after 3 seconds
      setTimeout(() => setIsUserInteracting(false), 3000);
    },
    [nextSlide, prevSlide, tours.length, slidesToShow]
  );

  // Calculate slider width for drag constraints
  useEffect(() => {
    const updateSliderWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth
        );
      }
    };

    updateSliderWidth();
    window.addEventListener("resize", updateSliderWidth);
    return () => window.removeEventListener("resize", updateSliderWidth);
  }, [tours.length, slidesToShow]);

  // ✅ Auto slide only when enough tours and user is not interacting
  useEffect(() => {
    if (tours.length <= slidesToShow || isUserInteracting) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, tours.length, slidesToShow, isUserInteracting]);

  // Tour click handler
  const handleTourClick = (tour: any) => {
    router.push(`/booking-details?id=${tour._id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className={`bg-white py-12 md:py-20 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading recommended tours...</p>
        </div>
      </section>
    );
  }

  // ✅ Don't render section if no tours available
  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <HeadingSection
          badgeText="recommended tours"
          badgeIcon="⭐"
          title="Recommended Tours"
          subtitle="Discover our handpicked tours that offer the best value and experiences"
        />

        {/* Desktop Navigation buttons - only if enough tours */}
        {tours.length > slidesToShow && (
          <div className="mb-6 hidden items-center justify-end gap-3 sm:flex">
            <Button
              size="lg"
              onClick={handleManualPrev}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-blue-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              onClick={handleManualNext}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* ✅ Carousel - no top/bottom gap */}
        <div className="relative -my-3 overflow-hidden" ref={sliderRef}>
          <motion.div
            className={`flex ${
              tours.length <= slidesToShow
                ? "justify-center"
                : slidesToShow === 1
                  ? "cursor-grab active:cursor-grabbing"
                  : ""
            }`}
            drag={slidesToShow === 1 ? "x" : false}
            dragConstraints={
              slidesToShow === 1 && sliderWidth > 0
                ? {
                    left: -sliderWidth,
                    right: 0,
                  }
                : slidesToShow === 1
                  ? false
                  : false
            }
            dragElastic={0.2}
            dragMomentum={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={{
              x:
                tours.length <= slidesToShow
                  ? 0
                  : `-${currentIndex * slideWidth}%`,
            }}
            transition={
              slidesToShow === 1
                ? {
                    type: "tween",
                    duration: 0.3,
                    ease: "easeOut",
                  }
                : {
                    duration: 0.5,
                    ease: "easeInOut",
                  }
            }
          >
            {infiniteTours.map((tour, index) => {
              const destName =
                typeof tour.destination === "string"
                  ? tour.destination
                  : tour.destination?.name || "Unknown Destination";

              const finalPrice = tour.offer?.isActive
                ? tour.offer.discountType === "percentage"
                  ? tour.basePrice -
                    (tour.basePrice * (tour.offer.discountPercentage || 0)) /
                      100
                  : tour.basePrice - (tour.offer.flatDiscount || 0)
                : tour.basePrice;

              return (
                <div
                  key={`${tour._id}-${index}`}
                  className="flex-shrink-0 px-3 py-0"
                  style={{ width: `${slideWidth}%` }}
                >
                  <Card
                    className="group flex h-full min-h-[420px] cursor-pointer flex-col overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    onClick={() => handleTourClick(tour)}
                  >
                    {/* Image Section - Fixed Height */}
                    <div className="relative h-40 shrink-0">
                      <div
                        className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${
                            tour.coverImageUrl ||
                            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
                          })`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <Badge className="bg-blue-500/90 text-white backdrop-blur-sm">
                            {destName}
                          </Badge>
                          {tour.offer?.isActive && (
                            <Badge className="bg-red-500/90 text-white backdrop-blur-sm">
                              {tour.offer.label || "Special Offer"}
                            </Badge>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ৳{finalPrice.toLocaleString()}
                            </div>
                            {tour.offer?.isActive && (
                              <div className="text-xs text-gray-500 line-through">
                                ৳{tour.basePrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-900">
                            {tour.duration.days}D/{tour.duration.nights}N
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Flexible with consistent spacing */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-2 line-clamp-2 min-h-14 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {tour.title}
                      </h3>

                      <div className="mb-3 flex items-center gap-1">
                        <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                        <span className="truncate text-sm text-gray-600">
                          {destName}
                        </span>
                      </div>

                      {tour.highlights && tour.highlights.length > 0 && (
                        <div className="mb-3 min-h-8">
                          <div className="flex flex-wrap gap-1">
                            {tour.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-blue-50 text-xs text-blue-700"
                                >
                                  {highlight}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* View Details - Always at bottom */}
                      <div className="mt-auto flex items-center justify-end pt-2">
                        <div className="text-sm font-semibold text-blue-600">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Navigation Buttons and View All Button - Side by side on mobile */}
        <motion.div
          className="mt-6 flex items-center justify-between gap-4 sm:mt-8 sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Mobile Navigation Buttons - Only visible on small screens */}
          {tours.length > 1 && (
            <div className="flex items-center gap-2 sm:hidden">
              <Button
                size="lg"
                onClick={handleManualPrev}
                className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg hover:bg-blue-600"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                size="lg"
                onClick={handleManualNext}
                className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg hover:bg-blue-600"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* View All Button */}
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-600 px-6 py-3 text-sm text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:text-white sm:px-8 sm:py-4 sm:text-base"
            onClick={() => router.push("/package-details?category=recommended")}
          >
            <span className="hidden sm:inline">View All Recommended Tours</span>
            <span className="sm:hidden">View All</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
