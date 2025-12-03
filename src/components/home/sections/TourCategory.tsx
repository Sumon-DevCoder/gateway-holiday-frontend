"use client";

import HeadingSection from "@/components/HeadingSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetActiveTourCategoriesQuery } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface PackageCardsSectionProps {
  className?: string;
}

export default function TourCategory({
  className = "",
}: PackageCardsSectionProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [desktopSlide, setDesktopSlide] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // Fetch tour categories from API
  const {
    data: tourCategoriesData,
    isLoading,
    error,
  } = useGetActiveTourCategoriesQuery();

  const tourCategories = tourCategoriesData?.data || [];

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      router.push(`/package-details?category=${categoryId}`);
    },
    [router]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % tourCategories.length);
  }, [tourCategories.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + tourCategories.length) % tourCategories.length
    );
  }, [tourCategories.length]);

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

  // Desktop navigation functions
  const nextDesktopSlide = useCallback(() => {
    const maxSlide = Math.max(0, tourCategories.length - 4);
    setDesktopSlide((prev) => Math.min(prev + 1, maxSlide));
  }, [tourCategories.length]);

  const prevDesktopSlide = useCallback(() => {
    setDesktopSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle drag start - pause auto-slide
  const handleDragStart = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  // Handle swipe gesture on mobile - simplified for smooth dragging
  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
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
    [nextSlide, prevSlide]
  );

  // Check if desktop navigation should be shown
  const showDesktopNavigation = tourCategories.length > 4;
  const maxSlide = Math.max(0, tourCategories.length - 4);
  const canGoNext = desktopSlide < maxSlide;
  const canGoPrev = desktopSlide > 0;

  // Reset desktop slide when categories change
  useEffect(() => {
    setDesktopSlide(0);
  }, [tourCategories.length]);

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
  }, [tourCategories.length]);

  // Auto-slide effect for mobile
  useEffect(() => {
    // Only auto-slide if:
    // 1. There are categories to show
    // 2. User is not currently interacting
    if (tourCategories.length === 0 || isUserInteracting) {
      return;
    }

    const autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(autoSlideInterval);
  }, [tourCategories.length, isUserInteracting, nextSlide]);

  // Loading state
  if (isLoading) {
    return (
      <section
        className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingSection
            badgeText=""
            badgeIcon=""
            title="Package Categories"
            subtitle="Choose your preferred travel style and explore amazing packages tailored to your preferences."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-lg bg-gray-200 sm:h-96"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingSection
            badgeText=""
            badgeIcon=""
            title="Package Categories"
            subtitle="Choose your preferred travel style and explore amazing packages tailored to your preferences."
          />
          <div className="py-8 text-center">
            <p className="text-gray-600">
              Failed to load tour categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-gradient-to-br from-slate-50 to-blue-50 py-10 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <HeadingSection
          badgeText=""
          badgeIcon=""
          title="Tour Categories"
          subtitle="Choose your preferred tour category and explore amazing destinations tailored to your travel style."
        />

        {/* Desktop Navigation Buttons - Only visible when there are more than 4 categories */}
        {showDesktopNavigation && (
          <div className="mb-6 hidden items-center justify-end gap-3 sm:flex">
            <Button
              size="lg"
              onClick={prevDesktopSlide}
              disabled={!canGoPrev}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-blue-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              onClick={nextDesktopSlide}
              disabled={!canGoNext}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600 disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Category Cards Grid */}
        <motion.div
          className="relative overflow-hidden sm:overflow-visible"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Mobile Slider */}
          <div className="sm:hidden" ref={sliderRef}>
            <motion.div
              className="flex cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={
                sliderWidth > 0
                  ? {
                      left: -sliderWidth,
                      right: 0,
                    }
                  : false
              }
              dragElastic={0.2}
              dragMomentum={true}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={{
                x: `-${currentSlide * 100}%`,
              }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {tourCategories.map((category: any) => (
                <motion.div
                  key={category._id}
                  className="w-full flex-shrink-0 px-2"
                  onClick={() => handleCategoryClick(category._id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="shadow-travel-lg relative h-56 cursor-pointer overflow-hidden border-0">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${category.img || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"})`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-xl leading-tight font-bold text-transparent">
                          {category.category_name}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-white/90">
                          {category.description ||
                            "Explore amazing destinations and create unforgettable memories"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Grid - Hidden on small screens */}
          <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {tourCategories
              .slice(desktopSlide, desktopSlide + 4)
              .map((category: any, index: number) => (
                <motion.div
                  key={category._id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * (desktopSlide + index),
                  }}
                  onClick={() => handleCategoryClick(category._id)}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="hover-lift shadow-travel-lg relative h-56 overflow-hidden border-0 transition-all duration-500 group-hover:shadow-2xl sm:h-64">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${category.img || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"})`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-all duration-500 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-lg leading-tight font-bold text-transparent sm:text-xl lg:text-2xl">
                          {category.category_name}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-white/90">
                          {category.description ||
                            "Explore amazing destinations and create unforgettable memories"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Mobile Navigation Buttons and View All Button - Side by side on mobile */}
        <motion.div
          className="mt-6 flex items-center justify-between gap-4 sm:mt-8 sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Mobile Navigation Buttons - Only visible on small screens */}
          {tourCategories.length > 1 && (
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
            onClick={() => router.push("/package-details")}
          >
            <span className="hidden sm:inline">View All Categories</span>
            <span className="sm:hidden">View All</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
