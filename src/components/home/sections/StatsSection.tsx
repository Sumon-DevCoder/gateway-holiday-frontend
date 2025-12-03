"use client";

import { useEffect, useRef, useState } from "react";

interface StatsSectionProps {
  totalReviews?: number;
  averageRating?: number;
  destinations?: number;
}

const StatsSection = ({
  totalReviews = 0,
  averageRating = 0,
  destinations = 50,
}: StatsSectionProps) => {
  const AnimatedCounter = ({
    target,
    suffix = "",
    duration = 2000,
    isFloat = false,
  }: {
    target: number;
    suffix?: string;
    duration?: number;
    isFloat?: boolean;
  }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
      if (hasAnimated) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const startTime = Date.now();
            const startValue = 0;

            const updateCounter = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);

              const easeOutCubic = 1 - Math.pow(1 - progress, 3);
              const currentCount =
                startValue + (target - startValue) * easeOutCubic;

              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                setCount(target);
              }
            };

            requestAnimationFrame(updateCounter);

            observer.disconnect();
          }
        },
        {
          threshold: 0.5,
          rootMargin: "-50px 0px",
        }
      );

      if (counterRef.current) {
        observer.observe(counterRef.current);
        observerRef.current = observer;
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    const formatNumber = (num: number) => {
      if (isFloat) {
        return num.toFixed(1);
      }
      return Math.floor(num).toLocaleString();
    };

    return (
      <div
        ref={counterRef}
        className="mb-1 text-xl font-bold transition-all duration-300 sm:text-2xl lg:mb-2 lg:text-3xl"
      >
        {formatNumber(count)}
        {suffix}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-12 sm:py-16 lg:py-20">
      <div className="absolute top-5 left-5 h-12 w-12 animate-pulse rounded-full bg-orange-200 opacity-30 sm:h-16 sm:w-16 lg:h-20 lg:w-20"></div>
      <div className="absolute right-5 bottom-5 h-16 w-16 animate-pulse rounded-full bg-blue-200 opacity-20 delay-1000 sm:h-24 sm:w-24 lg:h-32 lg:w-32"></div>

      <div className="relative container mx-auto">
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 lg:text-4xl">
            Our Achievements
          </h2>
          <p className="text-lg text-gray-600">
            Numbers that speak for our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4 lg:gap-8">
          <div className="transform rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="text-orange-600">
              <AnimatedCounter
                target={totalReviews}
                suffix="+"
                duration={2500}
              />
            </div>
            <div className="text-xs text-gray-600 sm:text-sm">
              Happy Travelers
            </div>
          </div>
          <div className="transform rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="text-blue-600">
              <AnimatedCounter
                target={destinations}
                suffix="+"
                duration={2000}
              />
            </div>
            <div className="text-xs text-gray-600 sm:text-sm">Destinations</div>
          </div>
          <div className="transform rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="text-green-600">
              <AnimatedCounter
                target={averageRating}
                isFloat={true}
                duration={2200}
              />
            </div>
            <div className="text-xs text-gray-600 sm:text-sm">
              Average Rating
            </div>
          </div>
          <div className="transform rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-2xl lg:p-6">
            <div className="text-purple-600">
              <AnimatedCounter target={24} suffix="/7" duration={1800} />
            </div>
            <div className="text-xs text-gray-600 sm:text-sm">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
