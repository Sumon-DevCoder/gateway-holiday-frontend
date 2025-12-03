"use client";
import { useGetAllAuthorizationsQuery } from "@/redux/api/features/authorization/authorizationApi";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Page = (): React.ReactElement => {
  // Fetch authorization images from API
  const {
    data: authorizationsResponse,
    isLoading,
    error,
  } = useGetAllAuthorizationsQuery();

  const authorizations = authorizationsResponse?.data || [];

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Handle image click for lightbox
  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="bg-purple-500/5">
        <div className="bg-opacity-50 relative z-40 block overflow-hidden py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6">
          <div className="relative mx-auto px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-16 lg:px-12 lg:pb-20 xl:max-w-screen-xl xl:px-8">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto text-center">
                <div className="mx-auto inline-flex rounded-full px-3 py-1 sm:px-4 sm:py-1.5">
                  <p className="text-2xl font-semibold tracking-wider text-purple-600 uppercase sm:text-3xl lg:text-4xl lg:tracking-widest">
                    Authorizations & Certifications
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                  Our official certifications and authorizations that
                  demonstrate our commitment to quality and compliance with
                  international standards.
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="mt-8 flex items-center justify-center sm:mt-12">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 sm:h-16 sm:w-16" />
                    <p className="text-sm font-medium text-gray-600 sm:text-base">
                      Loading certifications...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="mt-8 text-center sm:mt-12">
                  <div className="mx-auto max-w-md rounded-lg bg-red-50 p-6 shadow-lg sm:p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:h-16 sm:w-16">
                      <svg
                        className="h-6 w-6 text-red-500 sm:h-8 sm:w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-red-800 sm:text-xl lg:text-2xl">
                      Failed to Load Certifications
                    </h2>
                    <p className="text-sm text-red-600 sm:text-base">
                      Please try again later.
                    </p>
                  </div>
                </div>
              )}

              {/* Display Authorization Images from API */}
              {!isLoading && !error && authorizations.length > 0 && (
                <div className="mt-8 sm:mt-12">
                  <div
                    className={`grid gap-4 sm:gap-6 ${
                      authorizations.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : authorizations.length === 2
                          ? "mx-auto max-w-4xl grid-cols-1 justify-items-center sm:grid-cols-2"
                          : authorizations.length === 3
                            ? "mx-auto max-w-6xl grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {authorizations.map((auth, index) => (
                      <div
                        key={auth._id}
                        className={`group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          authorizations.length <= 3
                            ? "w-full max-w-sm sm:max-w-md"
                            : "w-full"
                        }`}
                        onClick={() => handleImageClick(index)}
                      >
                        {/* Image Container - Fixed Structure */}
                        <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-60 lg:h-64 xl:h-72">
                          <Image
                            src={auth.image}
                            alt={`Authorization Certificate ${index + 1}`}
                            fill
                            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            unoptimized
                            priority={index < 3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Data State */}
              {!isLoading && !error && authorizations.length === 0 && (
                <div className="mt-8 text-center sm:mt-12">
                  <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                      <svg
                        className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">
                      No Photos Available
                    </h2>
                    <p className="text-sm text-gray-600 sm:text-base">
                      Our official certifications and authorizations will be
                      displayed here once available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Full Screen Image View */}
      {authorizations.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={authorizations.map((auth) => ({
            src: auth.image,
            alt: "Authorization Certificate",
          }))}
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
        />
      )}
    </>
  );
};

export default Page;
