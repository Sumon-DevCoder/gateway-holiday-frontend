import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TravelPackage } from "@/lib/packageData";
import { Calendar, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PackageBannerProps {
  packageData: TravelPackage;
}

export const PackageBanner: React.FC<PackageBannerProps> = ({
  packageData,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Combine cover image with gallery images
  const allImages = [
    packageData.image,
    ...(packageData.galleryImages || []),
  ].filter(Boolean);

  // Auto-slide functionality
  useEffect(() => {
    if (allImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 2000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [allImages.length, isPaused]);

  // Get duration values (handle both object and legacy format)
  const days =
    typeof packageData.duration === "object"
      ? packageData.duration.days
      : (packageData.duration as unknown as number) || 0;
  const nights =
    typeof packageData.duration === "object"
      ? packageData.duration.nights
      : (packageData as any).nights || 0;

  const durationText = nights > 0 ? `${days}D/${nights}N` : `${days} Days`;

  return (
    <Card className="overflow-hidden shadow-2xl">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="h-48 bg-cover bg-center bg-no-repeat transition-all duration-500 sm:h-64 md:h-80"
          style={{ backgroundImage: `url(${allImages[currentImageIndex]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Gallery Navigation - Only show if multiple images */}
          {allImages.length > 1 && (
            <>
              {/* Image Counter */}

              {/* Image Dots */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 sm:bottom-4 sm:gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all sm:h-2 ${
                      index === currentImageIndex
                        ? "w-6 bg-white sm:w-8"
                        : "w-1.5 bg-white/50 hover:bg-white/75 sm:w-2"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute right-3 bottom-4 left-3 text-white sm:right-4 sm:bottom-6 sm:left-4 md:right-8 md:bottom-8 md:left-8">
            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-3 sm:gap-2 md:mb-4">
              {packageData.categoryName && (
                <Badge className="flex items-center gap-1 bg-purple-500 px-2 py-1 text-xs text-white sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-lg">
                  <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  {packageData.categoryName}
                </Badge>
              )}
            </div>
            <h1 className="mb-1.5 line-clamp-2 text-xl font-bold sm:mb-2 sm:text-2xl md:mb-3 md:text-3xl lg:text-4xl">
              {packageData.title}
            </h1>
            <p className="mb-2 line-clamp-1 text-sm opacity-90 sm:mb-3 sm:text-base md:mb-4 md:text-lg lg:text-xl">
              {getDestinationName()}
            </p>
            {packageData.highlights && packageData.highlights.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3 md:mb-4 md:gap-4">
                {packageData.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-white/20 px-2 py-0.5 text-xs backdrop-blur-sm sm:px-3 sm:py-1 sm:text-sm md:px-4 md:py-1.5 md:text-base"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm md:gap-6 md:text-base lg:text-lg">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span>{durationText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
