"use client";

import { TeamMember } from "@/types/team";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface TeamSectionProps {
  teamMembers: TeamMember[];
  isLoading?: boolean;
  error?: any;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  isLoading = false,
  error,
}): React.ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const transformMemberForDisplay = (member: TeamMember) => ({
    id: member._id || "",
    name: member.name || "Team Member",
    role: member.designation || "Staff",
    imageUrl:
      member.image || "https://via.placeholder.com/400x400?text=Team+Member",
  });

  const displayTeam = (teamMembers || []).map(transformMemberForDisplay);
  const otherMembers = displayTeam.slice(2); // Members after first 2

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (otherMembers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % otherMembers.length);
  }, [otherMembers.length]);

  const prevSlide = useCallback(() => {
    if (otherMembers.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + otherMembers.length) % otherMembers.length
    );
  }, [otherMembers.length]);

  // Manual navigation - pause auto-slide temporarily
  const handleManualNext = useCallback(() => {
    nextSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000);
  }, [nextSlide]);

  const handleManualPrev = useCallback(() => {
    prevSlide();
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000);
  }, [prevSlide]);

  // Handle drag start - pause auto-slide
  const handleDragStart = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  // Handle swipe gesture - simplified for smooth dragging
  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      if (otherMembers.length === 0) return;

      const swipeThreshold = 50; // minimum swipe distance in pixels
      const swipeVelocity = 300; // minimum swipe velocity

      const dragDistance = Math.abs(info.offset.x);
      const dragVelocity = Math.abs(info.velocity.x);

      // Simple swipe detection - if dragged enough or fast enough, change slide
      if (dragDistance > swipeThreshold || dragVelocity > swipeVelocity) {
        if (info.offset.x < 0) {
          nextSlide();
        } else if (info.offset.x > 0) {
          prevSlide();
        }
      }

      // Resume auto-slide after 3 seconds
      setTimeout(() => setIsUserInteracting(false), 3000);
    },
    [nextSlide, prevSlide, otherMembers.length]
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
  }, [otherMembers.length]);

  // Auto-slide effect
  useEffect(() => {
    if (otherMembers.length === 0 || isUserInteracting) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [otherMembers.length, isUserInteracting, nextSlide]);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="text-blue-600">Team</span>
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">
              Loading team members...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="text-blue-600">Team</span>
          </h2>
          <p className="text-center text-lg text-red-500">
            Failed to load team members 😢
            <br />
            Please try again later!
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayTeam.length === 0) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="text-blue-600">Team</span>
          </h2>
          <p className="text-center text-lg text-gray-500">
            Oops! No team members found 😢
            <br />
            Please check back later!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-2">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
        <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
          Meet the <span className="text-blue-600">Team</span>
        </h2>

        {/* Highlighted Members */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {displayTeam.slice(0, 2).map((member, _i) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:gap-8">
                {/* Image Container */}
                <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transition-all duration-500 group-hover:border-blue-300 sm:h-44 sm:w-44">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 160px, 176px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Blue overlay on hover */}
                  <div className="absolute inset-0 bg-blue-600/0 transition-all duration-500 group-hover:bg-blue-600/10"></div>
                </div>

                {/* Content Container */}
                <div className="relative flex flex-1 flex-col justify-center text-center sm:text-left">
                  {/* Decorative corner element */}
                  <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-blue-50 opacity-50 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100"></div>

                  <div className="relative z-10">
                    <h3 className="mb-3 text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                      {member.name}
                    </h3>

                    <div className="mb-4 inline-block">
                      <p className="text-sm font-medium tracking-wide text-blue-600 uppercase">
                        {member.role}
                      </p>
                      <div className="mt-1.5 h-0.5 w-full bg-gradient-to-r from-blue-600 to-transparent"></div>
                    </div>

                    {/* Decorative quote or accent */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="h-px flex-1 bg-gray-200"></div>
                      <span className="text-xs">Team Member</span>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Team Members Carousel */}
        {otherMembers.length > 0 && (
          <div className="mt-12">
            {/* Mobile Slider */}
            <div className="overflow-hidden md:hidden" ref={sliderRef}>
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
                  x: `-${currentIndex * 100}%`,
                }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {otherMembers.map((member, index) => (
                  <div
                    key={`mobile-${member.id}-${index}`}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-300 hover:shadow-md">
                      <div className="relative mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-blue-100 shadow-lg">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mb-1 text-lg font-bold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-blue-600">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Navigation Buttons */}
            {otherMembers.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
                <button
                  onClick={handleManualPrev}
                  className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-600"
                >
                  <ChevronLeft className="mx-auto h-6 w-6" />
                </button>

                <button
                  onClick={handleManualNext}
                  className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-600"
                >
                  <ChevronRight className="mx-auto h-6 w-6" />
                </button>
              </div>
            )}

            {/* Desktop Grid */}
            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherMembers.map((member, index) => (
                <motion.div
                  key={`desktop-${member.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-blue-100 shadow-lg transition-all duration-500 group-hover:border-blue-300">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mb-1 text-base font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
