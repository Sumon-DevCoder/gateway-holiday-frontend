"use client";

import { Navbar } from "@/components/home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Eye,
  Filter,
  Globe,
  Grid3X3,
  Heart,
  List,
  MapPin,
  Plane,
  Search,
  Share2,
  Star,
  TrendingUp,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Country {
  id: string;
  name: string;
  image: string;
  packages: number;
  startingPrice: string;
  rating: number;
  reviews: number;
  popularDestinations: string[];
  isPopular?: boolean;
  isTrending?: boolean;
}

interface Package {
  id: string;
  title: string;
  country: string;
  image: string;
  duration: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  features: string[];
  category: "regular" | "combo" | "latest" | "recommended";
  discount?: number;
  isNew?: boolean;
  isPopular?: boolean;
}

// Mock data for countries
const countries: Country[] = [
  {
    id: "austria",
    name: "Austria",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
    packages: 24,
    startingPrice: "$1,299",
    rating: 4.8,
    reviews: 1247,
    popularDestinations: ["Vienna", "Salzburg", "Hallstatt", "Innsbruck"],
    isPopular: true,
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    packages: 18,
    startingPrice: "$899",
    rating: 4.6,
    reviews: 892,
    popularDestinations: ["Dhaka", "Chittagong", "Sylhet", "Cox's Bazar"],
  },
  {
    id: "belgium",
    name: "Belgium",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    packages: 31,
    startingPrice: "$1,499",
    rating: 4.7,
    reviews: 1567,
    popularDestinations: ["Brussels", "Bruges", "Ghent", "Antwerp"],
    isTrending: true,
  },
  {
    id: "china",
    name: "China",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
    packages: 45,
    startingPrice: "$1,799",
    rating: 4.9,
    reviews: 2156,
    popularDestinations: ["Beijing", "Shanghai", "Guilin", "Xi'an"],
    isPopular: true,
  },
  {
    id: "egypt",
    name: "Egypt",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop",
    packages: 28,
    startingPrice: "$1,199",
    rating: 4.5,
    reviews: 743,
    popularDestinations: ["Cairo", "Luxor", "Aswan", "Sharm El Sheikh"],
  },
  {
    id: "france",
    name: "France",
    image:
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
    packages: 52,
    startingPrice: "$1,899",
    rating: 4.8,
    reviews: 3245,
    popularDestinations: ["Paris", "Nice", "Lyon", "Marseille"],
    isPopular: true,
    isTrending: true,
  },
  {
    id: "germany",
    name: "Germany",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    packages: 38,
    startingPrice: "$1,599",
    rating: 4.7,
    reviews: 1892,
    popularDestinations: ["Berlin", "Munich", "Hamburg", "Cologne"],
  },
  {
    id: "italy",
    name: "Italy",
    image:
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    packages: 41,
    startingPrice: "$1,699",
    rating: 4.9,
    reviews: 2789,
    popularDestinations: ["Rome", "Florence", "Venice", "Milan"],
    isPopular: true,
  },
  {
    id: "japan",
    name: "Japan",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    packages: 35,
    startingPrice: "$2,299",
    rating: 4.9,
    reviews: 1567,
    popularDestinations: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
    isTrending: true,
  },
  {
    id: "malaysia",
    name: "Malaysia",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    packages: 22,
    startingPrice: "$1,099",
    rating: 4.6,
    reviews: 1123,
    popularDestinations: ["Kuala Lumpur", "Penang", "Langkawi", "Malacca"],
  },
  {
    id: "singapore",
    name: "Singapore",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop",
    packages: 19,
    startingPrice: "$1,399",
    rating: 4.8,
    reviews: 987,
    popularDestinations: ["Marina Bay", "Sentosa", "Chinatown", "Little India"],
  },
  {
    id: "thailand",
    name: "Thailand",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop",
    packages: 33,
    startingPrice: "$999",
    rating: 4.7,
    reviews: 2345,
    popularDestinations: ["Bangkok", "Phuket", "Chiang Mai", "Krabi"],
    isPopular: true,
  },
];

// Mock data for packages
const packages: Package[] = [
  {
    id: "pkg-1",
    title: "Bali Paradise Escape",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
    duration: "7 Days 6 Nights",
    price: "$1,299",
    originalPrice: "$1,599",
    rating: 4.8,
    reviews: 1247,
    features: [
      "5-Star Resort",
      "Airport Transfer",
      "Daily Breakfast",
      "Spa Session",
    ],
    category: "regular",
    discount: 19,
  },
  {
    id: "pkg-2",
    title: "Dubai Luxury Experience",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    duration: "5 Days 4 Nights",
    price: "$2,199",
    originalPrice: "$2,599",
    rating: 4.9,
    reviews: 892,
    features: [
      "Burj Khalifa Access",
      "Desert Safari",
      "Shopping Tour",
      "Luxury Hotel",
    ],
    category: "regular",
    discount: 15,
  },
  {
    id: "pkg-3",
    title: "Thailand Cultural Journey",
    country: "Thailand",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop",
    duration: "6 Days 5 Nights",
    price: "$899",
    originalPrice: "$1,199",
    rating: 4.7,
    reviews: 2156,
    features: [
      "Temple Tours",
      "Floating Market",
      "Thai Cooking Class",
      "Cultural Shows",
    ],
    category: "regular",
    discount: 25,
  },
  {
    id: "pkg-4",
    title: "Singapore City Explorer",
    country: "Singapore",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop",
    duration: "4 Days 3 Nights",
    price: "$1,499",
    originalPrice: "$1,799",
    rating: 4.6,
    reviews: 743,
    features: [
      "Marina Bay Sands",
      "Universal Studios",
      "Garden by the Bay",
      "City Tour",
    ],
    category: "regular",
    discount: 17,
  },
  {
    id: "pkg-5",
    title: "Europe Grand Tour",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    duration: "12 Days 11 Nights",
    price: "$4,999",
    originalPrice: "$6,299",
    rating: 4.9,
    reviews: 567,
    features: [
      "3 Countries",
      "First Class Train",
      "Guided Tours",
      "Premium Hotels",
    ],
    category: "combo",
    discount: 21,
    isPopular: true,
  },
  {
    id: "pkg-6",
    title: "Japan Cherry Blossom",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    duration: "9 Days 8 Nights",
    price: "$3,599",
    originalPrice: "$4,199",
    rating: 4.9,
    reviews: 156,
    features: [
      "Cherry Blossom Viewing",
      "Bullet Train",
      "Traditional Ryokan",
      "Cultural Tours",
    ],
    category: "latest",
    discount: 14,
    isNew: true,
  },
  {
    id: "pkg-7",
    title: "Maldives Overwater Villa",
    country: "Maldives",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    duration: "5 Days 4 Nights",
    price: "$2,999",
    originalPrice: "$3,599",
    rating: 4.9,
    reviews: 1876,
    features: [
      "Overwater Villa",
      "All-Inclusive",
      "Snorkeling",
      "Spa Treatments",
    ],
    category: "recommended",
    discount: 17,
    isPopular: true,
  },
  {
    id: "pkg-8",
    title: "Swiss Alps Adventure",
    country: "Switzerland",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    duration: "8 Days 7 Nights",
    price: "$3,799",
    originalPrice: "$4,299",
    rating: 4.8,
    reviews: 1123,
    features: [
      "Matterhorn Views",
      "Cable Car Rides",
      "Chocolate Factory",
      "Luxury Trains",
    ],
    category: "recommended",
    discount: 12,
    isPopular: true,
  },
];

export default function CountryPackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "rating" | "packages"
  >("name");

  // Get URL parameters
  const categoryFilter = searchParams?.get("category");
  const countriesFilter = searchParams?.get("countries");

  // Filter countries based on search term and URL parameters
  useEffect(() => {
    let filtered = countries;

    // Apply category filter if present
    if (categoryFilter) {
      // You can add category-specific filtering logic here
      // For now, we'll just show all countries
    }

    // Apply countries filter if present
    if (countriesFilter) {
      const filterCountries = countriesFilter.split(",").map((c) => c.trim());
      filtered = filtered.filter((country) =>
        filterCountries.some(
          (filterCountry) =>
            country.name.toLowerCase().includes(filterCountry.toLowerCase()) ||
            country.popularDestinations.some((dest) =>
              dest.toLowerCase().includes(filterCountry.toLowerCase())
            )
        )
      );
    }

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.popularDestinations.some((dest) =>
            dest.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredCountries(filtered);
  }, [searchTerm, categoryFilter, countriesFilter]);

  // Sort countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return (
          parseFloat(a.startingPrice.replace("$", "")) -
          parseFloat(b.startingPrice.replace("$", ""))
        );
      case "rating":
        return b.rating - a.rating;
      case "packages":
        return b.packages - a.packages;
      default:
        return 0;
    }
  });

  // Mock authentication state - in real app this would come from context
  const isLoggedIn = false;
  const userType = "user" as const;

  return (
    <div className="bg-background min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} userType={userType} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-primary flex items-center gap-2 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </motion.div>

          {/* Page Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {categoryFilter
                ? `${
                    categoryFilter.charAt(0).toUpperCase() +
                    categoryFilter.slice(1)
                  } Packages`
                : "Country-based Package Design"}
            </motion.h1>
            <motion.p
              className="mx-auto mb-8 max-w-3xl text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {categoryFilter && countriesFilter
                ? `Explore ${categoryFilter} packages for ${countriesFilter
                    .split(",")
                    .slice(0, 2)
                    .join(", ")}${
                    countriesFilter.split(",").length > 2 ? " and more" : ""
                  }. Find your perfect destination and discover incredible deals.`
                : "Explore amazing travel packages by country. Find your perfect destination and discover incredible deals."}
            </motion.p>

            {/* Active Filters */}
            {(categoryFilter || countriesFilter) && (
              <motion.div
                className="mb-8 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {categoryFilter && (
                  <Badge className="bg-primary px-4 py-2 text-white">
                    Category:{" "}
                    {categoryFilter.charAt(0).toUpperCase() +
                      categoryFilter.slice(1)}
                  </Badge>
                )}
                {countriesFilter && (
                  <Badge className="bg-secondary px-4 py-2 text-white">
                    Countries:{" "}
                    {countriesFilter.split(",").slice(0, 3).join(", ")}
                    {countriesFilter.split(",").length > 3 ? "..." : ""}
                  </Badge>
                )}
              </motion.div>
            )}

            {/* Search and Filter Bar */}
            <motion.div
              className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col items-center gap-4 md:flex-row">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search countries or destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:border-primary rounded-xl border-2 border-gray-200 py-3 pr-4 pl-10"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="focus:border-primary rounded-xl border-2 border-gray-200 px-4 py-3 outline-none"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="packages">Sort by Packages</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Countries Grid/List */}
          <motion.div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-6"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence>
              {sortedCountries.map((country, index) => (
                <motion.div
                  key={country.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <Card
                    className={`hover-lift shadow-travel-lg relative overflow-hidden border-0 transition-all duration-500 group-hover:shadow-2xl ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    {/* Country Image */}
                    <div
                      className={`relative overflow-hidden bg-cover bg-center bg-no-repeat ${
                        viewMode === "list" ? "h-48 w-1/3" : "h-64"
                      }`}
                      style={{ backgroundImage: `url(${country.image})` }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Special Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {country.isPopular && (
                          <Badge className="bg-orange-500 font-bold text-white">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            POPULAR
                          </Badge>
                        )}
                        {country.isTrending && (
                          <Badge className="bg-green-500 font-bold text-white">
                            <Globe className="mr-1 h-3 w-3" />
                            TRENDING
                          </Badge>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredCountry === country.id ? 1 : 0,
                        }}
                      >
                        <div className="flex gap-3">
                          <motion.button
                            className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Heart className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-semibold">
                          {country.rating}
                        </span>
                      </div>

                      {/* Packages Count */}
                      <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                        <Plane className="text-primary h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {country.packages}
                        </span>
                      </div>
                    </div>

                    <CardContent
                      className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      {/* Country Name */}
                      <div className="mb-4">
                        <h3 className="group-hover:text-primary mb-2 text-2xl font-bold text-gray-900 transition-colors">
                          {country.name}
                        </h3>
                        <div className="mb-3 flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {country.popularDestinations.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Price and Reviews */}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <span className="text-primary text-3xl font-bold">
                            {country.startingPrice}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            starting from
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="text-sm font-semibold">
                              {country.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({country.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Popular Destinations */}
                      <div className="mb-6">
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">
                          Popular Destinations:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {country.popularDestinations.map((dest, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-primary/20 text-primary hover:bg-primary/10 text-xs"
                            >
                              {dest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="gradient-travel-primary shadow-travel w-full text-white transition-transform duration-300 group-hover:scale-105 hover:opacity-90">
                        View Packages
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-600">
              Showing {sortedCountries.length} of {countries.length} countries
            </p>
          </motion.div>

          {/* Featured Packages Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Featured Packages
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Discover our most popular travel packages with amazing
                destinations and great value.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {packages.slice(0, 8).map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover-lift shadow-travel-lg relative overflow-hidden border-0 transition-all duration-500 group-hover:shadow-2xl">
                    {/* Package Image */}
                    <div
                      className="relative h-48 overflow-hidden bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Discount Badge */}
                      {pkg.discount && (
                        <div className="absolute top-4 left-4">
                          <Badge className="animate-pulse bg-red-500 font-bold text-white">
                            -{pkg.discount}%
                          </Badge>
                        </div>
                      )}

                      {/* Special Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {pkg.isNew && (
                          <Badge className="bg-green-500 font-bold text-white">
                            NEW
                          </Badge>
                        )}
                        {pkg.isPopular && (
                          <Badge className="bg-orange-500 font-bold text-white">
                            POPULAR
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-semibold">
                          {pkg.rating}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                        <Calendar className="text-primary h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {pkg.duration}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Title and Country */}
                      <div className="mb-4">
                        <h3 className="group-hover:text-primary mb-2 text-lg font-bold text-gray-900 transition-colors">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{pkg.country}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-primary text-xl font-bold">
                          {pkg.price}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {pkg.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="mb-4 space-y-1">
                        {pkg.features.slice(0, 2).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <div className="bg-primary mr-2 h-1.5 w-1.5 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Reviews */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(pkg.rating)
                                    ? "fill-current text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({pkg.reviews})
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button className="gradient-travel-primary shadow-travel w-full text-white transition-transform duration-300 group-hover:scale-105 hover:opacity-90">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* View All Packages Button */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary border-2 transition-all duration-300 hover:scale-105 hover:text-white"
              >
                View All Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
