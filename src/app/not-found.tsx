"use client";

import { ArrowLeft, Home, MapPin, Plane, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="animate-pulse bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-9xl font-extrabold text-transparent md:text-[12rem]">
            404
          </h1>
        </div>

        {/* Icon Animation */}
        <div className="mb-6 flex justify-center gap-6">
          <MapPin
            className="h-10 w-10 animate-bounce text-blue-500 md:h-12 md:w-12"
            style={{ animationDelay: "0s" }}
          />
          <Plane
            className="h-10 w-10 animate-bounce text-cyan-500 md:h-12 md:w-12"
            style={{ animationDelay: "0.2s" }}
          />
          <Search
            className="h-10 w-10 animate-bounce text-blue-500 md:h-12 md:w-12"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Main Message */}
        <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-5xl">
          Oops! Lost in Travel?
        </h2>

        <p className="mb-3 text-lg text-gray-600 md:text-2xl">
          The page you're looking for has taken an unexpected detour!
        </p>

        <p className="mb-12 text-base text-gray-500 md:text-lg">
          It seems this destination doesn't exist on our travel map.
          <br className="hidden md:block" />
          Let's get you back on track to plan your next adventure.
        </p>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="flex w-full transform items-center gap-2 rounded-lg bg-gray-100 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-200 sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>

          {/* Home Button */}
          <Link
            href="/"
            className="flex w-full transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 sm:w-auto"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mb-8">
          <p className="mb-6 text-lg font-semibold text-gray-700 md:text-xl">
            Perhaps you were looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/package"
              className="rounded-full bg-blue-100 px-6 py-3 text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-200"
            >
              Tour Packages
            </Link>
            <Link
              href="/visa"
              className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-medium text-cyan-700 transition-all duration-200 hover:scale-105 hover:bg-cyan-200"
            >
              Visa Services
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full bg-green-100 px-6 py-3 text-sm font-medium text-green-700 transition-all duration-200 hover:scale-105 hover:bg-green-200"
            >
              Contact Us
            </Link>
            <Link
              href="/about-us"
              className="rounded-full bg-orange-100 px-6 py-3 text-sm font-medium text-orange-700 transition-all duration-200 hover:scale-105 hover:bg-orange-200"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* Company Branding */}
        <div className="mt-8">
          <p className="text-base text-gray-600 md:text-lg">
            <span className="font-bold text-blue-600">
              Gateway Holidays Ltd.
            </span>{" "}
            - Explore the World with Wonders
          </p>
        </div>
      </div>
    </div>
  );
}
