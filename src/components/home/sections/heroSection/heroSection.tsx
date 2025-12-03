"use client";

import { Button } from "@/components/ui/button";
import { useGetAllBannersQuery } from "@/redux/api/features/banner/bannerApi";
import { IBanner } from "@/types/schemas";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import SearchForm from "./SearchForm";

interface HeroSectionProps {
  className?: string;
  bannerData?: IBanner[];
}

export default function HeroSection({
  className = "",
  bannerData,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch banners from API
  const { data: bannersResponse, isLoading, error } = useGetAllBannersQuery();
  const banners = bannersResponse?.data || [];

  // Use API data if no bannerData prop is provided
  const displayBanners = bannerData || banners;

  // Preload images to prevent blank screen
  const preloadImage = useCallback((src: string, isFirst = false) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, src]));
        if (isFirst) {
          // Hide loader when first image loads
          setTimeout(() => setIsInitialLoading(false), 300);
        }
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Preload all banner images
  useEffect(() => {
    if (displayBanners && displayBanners.length > 0) {
      displayBanners.forEach((banner, index) => {
        if (banner.backgroundImage) {
          // First image gets priority
          preloadImage(banner.backgroundImage, index === 0);
        }
      });
    }
  }, [displayBanners, preloadImage]);

  // Auto-rotate carousel
  useEffect(() => {
    if (
      !displayBanners ||
      displayBanners.length === 0 ||
      displayBanners.length === 1
    )
      return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex((prev) => {
          const next = (prev + 1) % displayBanners.length;
          setPrevImageIndex(prev);
          return next;
        });
        setTimeout(() => setIsTransitioning(false), 800);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [displayBanners, isTransitioning]);

  const nextImage = () => {
    if (!displayBanners || displayBanners.length === 0 || isTransitioning)
      return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => {
      const next = (prev + 1) % displayBanners.length;
      setPrevImageIndex(prev);
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevImage = () => {
    if (!displayBanners || displayBanners.length === 0 || isTransitioning)
      return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => {
      const next = (prev - 1 + displayBanners.length) % displayBanners.length;
      setPrevImageIndex(prev);
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section
        className={`relative flex items-center justify-center overflow-hidden px-10 lg:h-[60vh] ${className}`}
      >
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <h2 className="text-2xl font-bold">Loading banners...</h2>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section
        className={`relative flex items-center justify-center overflow-hidden px-10 lg:h-[60vh] ${className}`}
      >
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Failed to load banners</h2>
          <p className="text-white/70">Please try again later</p>
        </div>
      </section>
    );
  }

  // Show no data state
  if (!displayBanners || displayBanners.length === 0) {
    return (
      <section
        className={`relative flex items-center justify-center overflow-hidden px-10 lg:h-[60vh] ${className}`}
      >
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">No banners available</h2>
          <p className="text-white/70">
            Please add some banners from admin panel
          </p>
        </div>
      </section>
    );
  }

  const currentBanner = displayBanners[currentImageIndex];
  const prevBanner = displayBanners[prevImageIndex];

  // Check if current and previous images are loaded
  const isCurrentImageLoaded =
    currentBanner?.backgroundImage &&
    loadedImages.has(currentBanner.backgroundImage);
  const isPrevImageLoaded =
    prevBanner?.backgroundImage && loadedImages.has(prevBanner.backgroundImage);

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden px-10 lg:h-[70vh] ${className}`}
    >
      {/* Loading Overlay with Shimmer Effect */}
      {isInitialLoading && (
        <div className="absolute inset-0 z-30 bg-gray-900">
          {/* Shimmer Animation */}
          <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_100%]"></div>

          {/* Loading Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            {/* Spinner */}
            <div className="mb-6 h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"></div>

            {/* Loading Text */}
            <h2 className="mb-2 text-2xl font-bold text-white">
              Loading Experience...
            </h2>
            <p className="text-white/70">
              Please wait while we prepare your journey
            </p>

            {/* Dots Animation */}
            <div className="mt-4 flex space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Background Carousel */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="relative h-full w-full">
          {/* Previous Image - Fading out */}
          {isTransitioning && prevImageIndex !== currentImageIndex && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${prevBanner?.backgroundImage})`,
                  backgroundColor: isPrevImageLoaded
                    ? "transparent"
                    : "#1f2937",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
                <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-b from-black/70 to-transparent sm:h-24"></div>
              </div>
            </motion.div>
          )}

          {/* Current Image - Fading in */}
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: isTransitioning ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentBanner?.backgroundImage})`,
                backgroundColor: isCurrentImageLoaded
                  ? "transparent"
                  : "#1f2937",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
              <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-b from-black/70 to-transparent sm:h-24"></div>

              <div className="absolute inset-0 hidden opacity-20 lg:block">
                <div className="animate-float absolute top-20 left-10 h-8 w-4 rotate-12 transform rounded-sm bg-white/20 backdrop-blur-sm"></div>
                <div className="animate-float-delayed absolute top-32 right-20 h-10 w-3 -rotate-6 transform rounded-sm bg-white/20 backdrop-blur-sm"></div>
                <div className="animate-float-delayed absolute right-10 bottom-20 h-6 w-6 rounded-t-lg bg-white/20 backdrop-blur-sm"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {displayBanners.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 transform rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 sm:block"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 z-20 hidden -translate-y-1/2 transform rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 sm:block"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 transform space-x-1.5">
              {displayBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning && index !== currentImageIndex) {
                      setIsTransitioning(true);
                      setPrevImageIndex(currentImageIndex);
                      setCurrentImageIndex(index);
                      setTimeout(() => setIsTransitioning(false), 800);
                    }
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "scale-110 bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content - EXACT SAME DESIGN */}
      <div className="relative z-10 container mx-auto px-3 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h1 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`title-${currentImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                  className="block text-white"
                >
                  {currentBanner?.title.toUpperCase()}
                </motion.span>
              </AnimatePresence>
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="mx-auto mb-4 max-w-md px-2 text-sm text-white/90 sm:mb-6 sm:px-0 sm:text-base md:text-lg lg:mx-0"
              >
                {currentBanner?.description}
              </motion.p>
            </AnimatePresence>
            <Link href="/package-details">
              <Button
                size="default"
                className="shadow-travel-lg hover-lift w-full cursor-pointer bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:opacity-90 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                Get Started
                <ArrowRightLeft className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <SearchForm />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 transform items-center space-x-1 sm:hidden">
        <div className="h-0.5 w-6 rounded-full bg-white/30"></div>
      </div>
    </section>
  );
}
