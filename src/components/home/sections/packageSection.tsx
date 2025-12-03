"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Users, ArrowRight } from "lucide-react";

interface PackageSectionProps {
  className?: string;
}

const packageCategories = [
  { id: "regular", label: "Regular Package" },
  { id: "combo", label: "Combo Package" },
  { id: "latest", label: "Latest Package" },
  { id: "recommended", label: "Recommended" },
];

const packages = {
  regular: [
    {
      id: 1,
      title: "Regular Package",
      destinations: ["Thailand", "Malaysia", "Singapore"],
      duration: "7 Days / 6 Nights",
      price: "$1,299",
      originalPrice: "$1,599",
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "5-Star Hotels",
        "All Meals Included",
        "City Tours",
        "Airport Transfer",
      ],
    },
    {
      id: 2,
      title: "Regular Package",
      destinations: ["Dubai", "Abu Dhabi"],
      duration: "5 Days / 4 Nights",
      price: "$1,199",
      originalPrice: "$1,399",
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Luxury Hotels", "Desert Safari", "City Tours", "Shopping"],
    },
    {
      id: 3,
      title: "Regular Package",
      destinations: ["Turkey", "Istanbul"],
      duration: "6 Days / 5 Nights",
      price: "$1,499",
      originalPrice: "$1,799",
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Historic Sites",
        "Bosphorus Cruise",
        "Turkish Bath",
        "Local Cuisine",
      ],
    },
  ],
  combo: [
    {
      id: 4,
      title: "Combo Package",
      destinations: ["Paris", "London"],
      duration: "10 Days / 9 Nights",
      price: "$2,499",
      originalPrice: "$2,999",
      rating: 4.9,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Eiffel Tower", "Big Ben", "Louvre Museum", "Thames Cruise"],
    },
    {
      id: 5,
      title: "Combo Package",
      destinations: ["Japan", "South Korea"],
      duration: "12 Days / 11 Nights",
      price: "$3,299",
      originalPrice: "$3,799",
      rating: 4.8,
      reviews: 167,
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Tokyo City",
        "Seoul Palace",
        "Cherry Blossoms",
        "K-Pop Experience",
      ],
    },
    {
      id: 6,
      title: "Combo Package",
      destinations: ["Italy", "Switzerland"],
      duration: "14 Days / 13 Nights",
      price: "$3,899",
      originalPrice: "$4,499",
      rating: 4.9,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Rome Colosseum",
        "Swiss Alps",
        "Venice Gondola",
        "Matterhorn",
      ],
    },
  ],
  latest: [
    {
      id: 7,
      title: "Latest Package",
      destinations: ["Iceland", "Norway"],
      duration: "8 Days / 7 Nights",
      price: "$2,799",
      originalPrice: "$3,199",
      rating: 4.8,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Northern Lights",
        "Blue Lagoon",
        "Fjords Cruise",
        "Aurora Hunting",
      ],
    },
    {
      id: 8,
      title: "Latest Package",
      destinations: ["New Zealand"],
      duration: "10 Days / 9 Nights",
      price: "$2,999",
      originalPrice: "$3,499",
      rating: 4.9,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Milford Sound", "Hobbiton", "Queenstown", "Glacier Hiking"],
    },
    {
      id: 9,
      title: "Latest Package",
      destinations: ["Morocco", "Spain"],
      duration: "9 Days / 8 Nights",
      price: "$2,199",
      originalPrice: "$2,599",
      rating: 4.7,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Marrakech Souks",
        "Sahara Desert",
        "Barcelona",
        "Flamenco Show",
      ],
    },
  ],
  recommended: [
    {
      id: 10,
      title: "Recommended Package",
      destinations: ["Maldives"],
      duration: "6 Days / 5 Nights",
      price: "$2,899",
      originalPrice: "$3,299",
      rating: 4.9,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Overwater Villa",
        "Snorkeling",
        "Sunset Cruise",
        "Spa Treatment",
      ],
    },
    {
      id: 11,
      title: "Recommended Package",
      destinations: ["Bali", "Indonesia"],
      duration: "8 Days / 7 Nights",
      price: "$1,799",
      originalPrice: "$2,099",
      rating: 4.8,
      reviews: 312,
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Ubud Rice Terraces",
        "Beach Resorts",
        "Temple Tours",
        "Volcano Hiking",
      ],
    },
    {
      id: 12,
      title: "Recommended Package",
      destinations: ["Greece", "Santorini"],
      duration: "7 Days / 6 Nights",
      price: "$2,399",
      originalPrice: "$2,799",
      rating: 4.9,
      reviews: 198,
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Santorini Sunset",
        "Acropolis",
        "Island Hopping",
        "Greek Cuisine",
      ],
    },
  ],
};

export default function PackageSection({
  className = "",
}: PackageSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof packages>("regular");

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-travel mb-4 animate-fade-in">
            Gateway Package
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full animate-shimmer"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <Tabs
            value={activeCategory}
            onValueChange={(value) =>
              setActiveCategory(value as keyof typeof packages)
            }
            className="w-full max-w-2xl"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 rounded-full p-2">
              {packageCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-full  font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages[activeCategory].map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover-lift shadow-travel-lg border-0 group">
                {/* Package Image */}
                <div
                  className="h-48 relative overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full animate-pulse delay-1000"></div>
                  </div>

                  {/* Package Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-sm text-primary font-semibold"
                    >
                      {pkg.title}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{pkg.rating}</span>
                  </div>

                  {/* Destinations */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-gray-800">
                          {pkg.destinations.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {pkg.reviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button className="w-full gradient-travel-primary text-white hover:opacity-90 shadow-travel group-hover:scale-105 transition-transform duration-300">
                    Book Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover-lift"
          >
            View All Packages
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
