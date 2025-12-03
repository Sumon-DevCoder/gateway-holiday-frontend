/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGetCountriesWithToursQuery } from "@/redux/api/features/country/countryApi";
import { ITour, useGetToursQuery } from "@/redux/api/features/tour/tourApi";
import { useGetActiveTourCategoriesQuery } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { ArrowLeft, Clock, Filter, MapPin, Search, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function PackageDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState({
    category: "all",
    duration: [1, 30],
    price: [0, 300000],
    destinations: [] as string[],
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  // Fetch tours from API
  const { data: toursData, isLoading: toursLoading } = useGetToursQuery(
    {
      status: "PUBLISHED",
      ...(selectedCountry && { destination: selectedCountry }),
      ...(filters.category !== "all" && { category: filters.category }),
      ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      ...(filters.price?.[0] &&
        filters.price[0] > 0 && { minPrice: filters.price[0] }),
      ...(filters.price?.[1] &&
        filters.price[1] < 300000 && { maxPrice: filters.price[1] }),
    },
    {
      // Refetch when filters change
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch countries with published tours only (already filtered by backend)
  const { data: countriesData, isLoading: countriesLoading } =
    useGetCountriesWithToursQuery();

  // Fetch tour categories from API
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetActiveTourCategoriesQuery();

  const tours = toursData?.data || [];
  const countries = countriesData?.data || [];
  const categories = categoriesData?.data || [];

  // Combined loading state
  const isInitialLoading = countriesLoading || categoriesLoading;
  const isToursLoading = toursLoading;

  useEffect(() => {
    // Get category and country from URL params
    if (searchParams) {
      const categoryParam = searchParams.get("category") || "all";
      const country =
        searchParams.get("country") || searchParams.get("destination");

      // If category is a name (like "recommended" or "combo), find the category ID
      let categoryId = categoryParam;
      if (categoryParam !== "all" && categories.length > 0) {
        // Check if it's a category name (case-insensitive)
        const foundCategory = categories.find(
          (cat) =>
            cat.category_name.toLowerCase() === categoryParam.toLowerCase()
        );
        if (foundCategory) {
          categoryId = foundCategory._id;
        }
      }

      setFilters((prev) => ({ ...prev, category: categoryId }));

      // Set selected country if passed in URL
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [searchParams, categories]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort tours by duration, category, and price (client-side) - Memoized
  const filteredTours = useMemo(() => {
    const filtered = tours.filter((tour) => {
      const durationDays = tour.duration.days;
      const matchesDuration =
        durationDays >= (filters.duration?.[0] || 1) &&
        durationDays <= (filters.duration?.[1] || 30);

      // Filter by category if not "all"
      const matchesCategory =
        filters.category === "all" ||
        (typeof tour.category === "string"
          ? tour.category === filters.category
          : tour.category?._id === filters.category);

      return matchesDuration && matchesCategory;
    });

    // Sort tours based on sortBy value
    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => {
        const priceA = a.offer?.isActive
          ? a.offer.discountType === "flat"
            ? a.basePrice - (a.offer.flatDiscount || 0)
            : a.basePrice -
              (a.basePrice * (a.offer.discountPercentage || 0)) / 100
          : a.basePrice;
        const priceB = b.offer?.isActive
          ? b.offer.discountType === "flat"
            ? b.basePrice - (b.offer.flatDiscount || 0)
            : b.basePrice -
              (b.basePrice * (b.offer.discountPercentage || 0)) / 100
          : b.basePrice;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => {
        const priceA = a.offer?.isActive
          ? a.offer.discountType === "flat"
            ? a.basePrice - (a.offer.flatDiscount || 0)
            : a.basePrice -
              (a.basePrice * (a.offer.discountPercentage || 0)) / 100
          : a.basePrice;
        const priceB = b.offer?.isActive
          ? b.offer.discountType === "flat"
            ? b.basePrice - (b.offer.flatDiscount || 0)
            : b.basePrice -
              (b.basePrice * (b.offer.discountPercentage || 0)) / 100
          : b.basePrice;
        return priceB - priceA;
      });
    }

    return filtered;
  }, [tours, filters.duration, filters.category, sortBy]);

  // Generate country data dynamically from API - Memoized
  const dynamicCountryData = useMemo(() => {
    return (
      countries
        .map((country) => {
          // First filter tours by category if not "all"
          const categoryFilteredTours = tours.filter((tour) => {
            if (filters.category === "all") return true;

            const tourCategoryId =
              typeof tour.category === "string"
                ? tour.category
                : tour.category?._id;

            return tourCategoryId === filters.category;
          });

          // Then count tours for this country from the category-filtered tours
          const tourCount = categoryFilteredTours.filter((tour) => {
            const tourDestId =
              typeof tour.destination === "string"
                ? tour.destination
                : tour.destination?._id;
            return tourDestId === country._id;
          }).length;

          return {
            _id: country._id || "",
            name: country.name,
            image:
              country.imageUrl ||
              `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop`,
            packageCount: tourCount,
            description: `Explore amazing destinations in ${country.name}`,
          };
        })
        // Only show countries that have tours in the selected category
        .filter((country) => country.packageCount > 0)
    );
  }, [countries, tours, filters.category]);

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  const handleTourClick = useCallback(
    (tour: ITour) => {
      router.push(`/booking-details?id=${tour._id}`);
    },
    [router]
  );

  const handleCountrySelect = useCallback((countryId: string) => {
    setSelectedCountry(countryId);
  }, []);

  const handleBackToCountries = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleBackToPreviousPage = useCallback(() => {
    router.back();
  }, [router]);

  // Show loading state for initial data
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header Skeleton */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white/80 p-4 shadow-sm md:flex-row">
              <div className="h-11 w-full animate-pulse rounded-md bg-gray-200 md:w-48"></div>
              <div className="h-11 w-full animate-pulse rounded-md bg-gray-200 md:w-48"></div>
              <div className="h-11 w-full animate-pulse rounded-md bg-gray-200 md:w-48"></div>
            </div>
          </div>

          {/* Country Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border-0 bg-white/60 shadow-sm backdrop-blur-sm"
              >
                <div className="h-40 animate-pulse bg-gray-200"></div>
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show country selection view
  if (!selectedCountry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Back Button and Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Back Button - Left Side */}
            <div>
              <Button
                variant="outline"
                onClick={handleBackToPreviousPage}
                className="bg-white shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>

            {/* Filters Section - Right Side */}
            <div className="w-full md:w-auto">
              <div className="flex flex-col gap-3 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-sm md:flex-row">
                {/* Package Category Filter */}
                <div className="flex-1">
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Package Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Dropdown */}
                <div className="flex-1">
                  <Select
                    {...(selectedCountry && { value: selectedCountry })}
                    onValueChange={handleCountrySelect}
                  >
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {dynamicCountryData.map((country) => (
                        <SelectItem key={country._id} value={country._id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{country.name}</span>
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs"
                            >
                              {country.packageCount}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Country */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Search destinations..."
                      className="h-11 border-gray-200 bg-white pl-10"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Country Cards */}
          {dynamicCountryData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dynamicCountryData.map((country) => (
                <Card
                  key={country._id}
                  className="group cursor-pointer overflow-hidden border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  onClick={() => handleCountrySelect(country._id)}
                >
                  <div className="relative">
                    <div
                      className="h-40 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${country.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* Tour Count Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm">
                          <span className="text-xs font-semibold text-gray-800">
                            {country.packageCount} tours
                          </span>
                        </div>
                      </div>

                      {/* Country Name */}
                      <div className="absolute right-3 bottom-3 left-3">
                        <h3 className="mb-1 text-xl font-bold text-white drop-shadow-lg">
                          {country.name}
                        </h3>
                        <p className="text-xs text-white/90 drop-shadow-md">
                          {country.packageCount} packages available
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">Explore destinations</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium transition-all duration-200 group-hover:bg-blue-500 group-hover:text-white"
                      >
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white/60 p-8 text-center backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-gray-100 p-6">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                No Destinations Found
              </h3>
              <p className="mb-6 max-w-md text-gray-600">
                {filters.category !== "all"
                  ? "No countries available for the selected category. Try changing the category filter."
                  : searchQuery
                    ? `No countries match "${searchQuery}". Try a different search term.`
                    : "No destinations available at the moment. Please check back later."}
              </p>
              <div className="flex gap-3">
                {(filters.category !== "all" || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: "all" }));
                      setSearchQuery("");
                    }}
                    className="bg-white"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show packages view for selected country
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button and Country Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCountries}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Countries
          </Button>
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {dynamicCountryData.find((c) => c._id === selectedCountry)
                ?.name || ""}{" "}
              Travel Tours
            </h1>
            <p className="text-gray-600">
              Discover amazing destinations in{" "}
              {dynamicCountryData.find((c) => c._id === selectedCountry)
                ?.name || ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Package Type Filter */}
              <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Tour Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Duration Filter */}
              <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">
                        {filters.duration[0]} - {filters.duration[1]} days
                      </Label>
                      <Slider
                        value={filters.duration}
                        onValueChange={(value) =>
                          handleFilterChange("duration", value)
                        }
                        min={1}
                        max={30}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Price Range</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">
                        {formatPrice(filters.price?.[0] || 0)} -{" "}
                        {formatPrice(filters.price?.[1] || 300000)}
                      </Label>
                      <Slider
                        value={filters.price}
                        onValueChange={(value) =>
                          handleFilterChange("price", value)
                        }
                        min={0}
                        max={300000}
                        step={5000}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Package Display */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredTours.length} Tours Found in{" "}
                  {dynamicCountryData.find((c) => c._id === selectedCountry)
                    ?.name || ""}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tours Loading State */}
            {isToursLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border-0 bg-white/60 shadow-sm backdrop-blur-sm"
                  >
                    <div className="h-40 animate-pulse bg-gray-200"></div>
                    <div className="space-y-3 p-4">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="flex gap-2">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTours.map((tour) => {
                  // const categoryName =
                  //   typeof tour.category === "string"
                  //     ? "Regular"
                  //     : tour.category?.category_name || "Regular";
                  const destName =
                    typeof tour.destination === "string"
                      ? ""
                      : tour.destination?.name || "";
                  const finalPrice = tour.offer?.isActive
                    ? tour.offer.discountType === "flat"
                      ? tour.basePrice - (tour.offer.flatDiscount || 0)
                      : tour.basePrice -
                        (tour.basePrice *
                          (tour.offer.discountPercentage || 0)) /
                          100
                    : tour.basePrice;

                  return (
                    <Card
                      key={tour._id}
                      className="group cursor-pointer overflow-hidden border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => handleTourClick(tour)}
                    >
                      <div className="relative">
                        <div
                          className="h-40 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${tour.coverImageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          {/* Badges */}
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

                          {/* Price */}
                          <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm">
                            <div className="text-right">
                              <div className="text-primary text-sm font-bold">
                                {formatPrice(finalPrice)}
                              </div>
                              {tour.offer?.isActive && (
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(tour.basePrice)}
                                </div>
                              )}
                              <div className="mt-1 text-xs text-gray-600">
                                Booking: {tour.bookingFeePercentage || 20}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent>
                        <div className="mb-3">
                          <h3 className="group-hover:text-primary mb-1 text-lg font-bold text-gray-900 transition-colors">
                            {tour.title}
                          </h3>
                          <p className="mb-2 text-xs text-gray-500">
                            {destName}
                          </p>
                          <p className="line-clamp-2 text-xs text-gray-600">
                            {tour.highlights.slice(0, 2).join(" • ")}
                          </p>
                        </div>

                        <div className="mb-3">
                          <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {tour.duration.days}D/{tour.duration.nights}N
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Group</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {tour.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {tour.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{tour.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            {tour.code}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTourClick(tour);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 bg-blue-500 px-3 text-xs text-white hover:bg-blue-600"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isToursLoading && filteredTours.length === 0 && (
              <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl bg-white/60 p-8 text-center backdrop-blur-sm">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  No Tours Found
                </h3>
                <p className="mb-6 max-w-md text-gray-600">
                  No tours available in{" "}
                  <span className="font-semibold">
                    {dynamicCountryData.find((c) => c._id === selectedCountry)
                      ?.name || "this country"}
                  </span>{" "}
                  matching your selected filters. Try adjusting your search
                  criteria.
                </p>
                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Current Filters:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-left text-sm text-gray-600">
                    {filters.category !== "all" && (
                      <li>
                        • Category:{" "}
                        {categories.find((c) => c._id === filters.category)
                          ?.category_name || filters.category}
                      </li>
                    )}
                    <li>
                      • Duration: {filters.duration?.[0] || 1} -{" "}
                      {filters.duration?.[1] || 30} days
                    </li>
                    {((filters.price?.[0] || 0) > 0 ||
                      (filters.price?.[1] || 300000) < 300000) && (
                      <li>
                        • Price: {formatPrice(filters.price?.[0] || 0)} -{" "}
                        {formatPrice(filters.price?.[1] || 300000)}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        category: "all",
                        duration: [1, 30],
                        price: [0, 300000],
                        destinations: [],
                        dateFrom: undefined,
                        dateTo: undefined,
                      })
                    }
                    className="bg-white"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={handleBackToCountries}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Choose Another Country
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
