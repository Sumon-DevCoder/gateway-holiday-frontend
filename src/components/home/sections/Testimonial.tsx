"use client";

import HeadingSection from "@/components/HeadingSection";
import { useGetReviewsQuery } from "@/redux/api/features/review/reviewApi";
import { Review } from "@/types/review";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

interface TestimonialsSectionProps {
  reviewsData?: Review[];
}

const TestimonialsSection = ({ reviewsData }: TestimonialsSectionProps) => {
  // Fetch reviews from backend
  const { data: reviewsResponse, isLoading } = useGetReviewsQuery({});
  const reviews = reviewsResponse?.data || reviewsData || [];

  // Helper function to convert Cloudinary public ID to URL
  const getCloudinaryUrl = (publicId: string) => {
    if (!publicId) return "";
    if (publicId.startsWith("http")) return publicId;
    // Replace 'demo' with your actual Cloudinary cloud name
    return `https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill,g_face,f_auto/${publicId}`;
  };

  const testimonials = reviews.map((review) => ({
    id: review._id,
    rating: review.rating,
    text: review.comment,
    name: review.userName,
    role: review.designation,
    location: "",
    image: getCloudinaryUrl(review.userProfileImg || ""),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-base sm:text-lg ${
          index < rating ? "text-amber-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentIndex(index);
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 5000);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  // Manual navigation - pause auto-slide temporarily
  const handleManualNext = useCallback(() => {
    nextSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 5000);
  }, [nextSlide]);

  const handleManualPrev = useCallback(() => {
    prevSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 5000);
  }, [prevSlide]);

  // Handle drag start - pause auto-slide
  const handleDragStart = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  // Handle swipe gesture on mobile
  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      if (testimonials.length === 0) return;

      const swipeThreshold = 30; // minimum swipe distance in pixels
      const swipeVelocity = 200; // minimum swipe velocity

      const dragDistance = Math.abs(info.offset.x);
      const dragVelocity = Math.abs(info.velocity.x);

      // Only trigger slide change if user dragged significantly
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

      // Resume auto-slide after 5 seconds
      setTimeout(() => setIsUserInteracting(false), 5000);
    },
    [nextSlide, prevSlide, testimonials.length]
  );

  // Auto-slide only if there are reviews and user is not interacting
  useEffect(() => {
    if (!isAutoPlay || testimonials.length === 0 || isUserInteracting) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length, isUserInteracting]);

  const getDisplayedTestimonials = () => {
    const displayed = [];
    const maxCards = Math.min(3, testimonials.length); // Show max 3 or available reviews

    for (let i = 0; i < maxCards; i++) {
      const index = (currentIndex + i) % testimonials.length;
      displayed.push({ ...testimonials[index], displayIndex: i });
    }
    return displayed;
  };

  // Show loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-12 sm:py-16 lg:py-20">
        <div className="relative container mx-auto">
          <HeadingSection
            badgeText="Client Reviews & Testimonials"
            badgeIcon="✈️"
            title="What Our Travelers Say"
            subtitle="Discover why thousands of travelers trust Travio for their dream adventures around the world"
          />
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no reviews available
  if (testimonials.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-12 sm:py-16 lg:py-20">
        <div className="relative container mx-auto">
          <HeadingSection
            badgeText="Client Reviews & Testimonials"
            badgeIcon="✈️"
            title="What Our Travelers Say"
            subtitle="Discover why thousands of travelers trust Travio for their dream adventures around the world"
          />
          <div className="py-12 text-center">
            <p className="text-gray-500">No reviews available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-12 sm:py-16 lg:py-20">
      <div className="absolute top-5 left-5 h-12 w-12 animate-pulse rounded-full bg-orange-200 opacity-30 sm:h-16 sm:w-16 lg:h-20 lg:w-20"></div>
      <div className="absolute right-5 bottom-5 h-16 w-16 animate-pulse rounded-full bg-blue-200 opacity-20 delay-1000 sm:h-24 sm:w-24 lg:h-32 lg:w-32"></div>

      <div className="relative container mx-auto">
        <HeadingSection
          badgeText="Client Reviews & Testimonials"
          badgeIcon="✈️"
          title="What Our Travelers Say"
          subtitle="Discover why thousands of travelers trust Travio for their dream adventures around the world"
        />

        <div className="md:hidden">
          <motion.div
            className="relative"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className="cursor-grab rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-500 hover:shadow-2xl active:cursor-grabbing sm:rounded-3xl sm:p-8">
              <div className="mb-4 flex justify-center">
                {renderStars(testimonials[currentIndex]?.rating || 0)}
              </div>

              <p className="mb-6 text-center text-sm leading-relaxed text-gray-700 sm:mb-8 sm:text-base">
                {testimonials[currentIndex]?.text}
              </p>

              <div className="text-center">
                <div className="mb-3 flex justify-center sm:mb-4">
                  {testimonials[currentIndex]?.image ? (
                    <div className="relative">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover shadow-lg sm:h-20 sm:w-20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div
                        className="hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-orange-300 text-lg font-bold text-orange-600 shadow-lg sm:h-20 sm:w-20 sm:text-2xl"
                        style={{ display: "none" }}
                      >
                        {testimonials[currentIndex]?.name.charAt(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-orange-300 text-lg font-bold text-orange-600 shadow-lg sm:h-20 sm:w-20 sm:text-2xl">
                      {testimonials[currentIndex]?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h4 className="mb-1 text-base font-bold text-gray-900 sm:text-xl">
                  {testimonials[currentIndex]?.name}
                </h4>
                <p className="mb-1 text-sm font-medium text-orange-600 sm:text-base">
                  {testimonials[currentIndex]?.role}
                </p>
                {testimonials[currentIndex]?.location && (
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {testimonials[currentIndex]?.location}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleManualPrev}
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl sm:left-4 sm:p-3"
            >
              <svg
                className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleManualNext}
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl sm:right-4 sm:p-3"
            >
              <svg
                className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </motion.div>
        </div>

        <div className="hidden md:block">
          <div
            className={`mb-8 grid gap-6 lg:mb-12 lg:gap-8 ${
              getDisplayedTestimonials().length === 1
                ? "grid-cols-1 justify-center"
                : getDisplayedTestimonials().length === 2
                  ? "grid-cols-1 justify-center lg:grid-cols-2"
                  : "grid-cols-1 lg:grid-cols-3"
            }`}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {getDisplayedTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}`}
                className={`animate-fade-in transform rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:rounded-3xl lg:p-8`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="mb-4 flex justify-center lg:mb-6">
                  {renderStars(testimonial.rating || 0)}
                </div>

                <p className="mb-6 text-center text-sm leading-relaxed text-gray-700 lg:mb-8 lg:text-base">
                  {testimonial.text}
                </p>

                <div className="text-center">
                  <div className="mb-3 flex justify-center lg:mb-4">
                    {testimonial.image ? (
                      <div className="relative">
                        <Image
                          src={testimonial.image || ""}
                          alt={testimonial.name || ""}
                          width={64}
                          height={64}
                          className="h-12 w-12 rounded-full border-4 border-orange-200 object-cover shadow-lg lg:h-16 lg:w-16"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div
                          className="hidden h-12 w-12 items-center justify-center rounded-full border-4 border-orange-200 bg-gradient-to-br from-orange-200 to-orange-300 text-base font-bold text-orange-600 shadow-lg lg:h-16 lg:w-16 lg:text-xl"
                          style={{ display: "none" }}
                        >
                          {testimonial.name?.charAt(0)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-orange-200 bg-gradient-to-br from-orange-200 to-orange-300 text-base font-bold text-orange-600 shadow-lg lg:h-16 lg:w-16 lg:text-xl">
                        {testimonial.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <h4 className="mb-1 text-sm font-bold text-gray-900 lg:text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="mb-1 text-xs font-medium text-orange-600 lg:text-sm">
                    {testimonial.role}
                  </p>
                  {testimonial.location && (
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {testimonials.length > 1 && (
            <div className="mb-6 flex items-center justify-center space-x-4 lg:mb-8 lg:space-x-6">
              <button
                onClick={handleManualPrev}
                className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl lg:p-4"
              >
                <svg
                  className="h-5 w-5 text-blue-600 lg:h-6 lg:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleManualNext}
                className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl lg:p-4"
              >
                <svg
                  className="h-5 w-5 text-blue-600 lg:h-6 lg:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-2 lg:space-x-3">
          {testimonials.length > 0 &&
            testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "h-2 w-6 bg-gradient-to-r from-orange-500 to-orange-600 lg:h-3 lg:w-8"
                    : "h-2 w-2 bg-gray-300 hover:bg-gray-400 lg:h-3 lg:w-3"
                }`}
              />
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TestimonialsSection;
