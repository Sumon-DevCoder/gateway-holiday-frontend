"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ITour } from "@/redux/api/features/tour/tourApi";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  Hotel,
  MapPin,
  Package,
  Percent,
  Tag,
  Utensils,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface TourDetailDialogProps {
  tour: ITour;
  onClose: () => void;
}

export default function TourDetailDialog({
  tour,
  onClose,
}: TourDetailDialogProps): React.ReactElement {
  const router = useRouter();

  // Debug: Log the tour object to see its structure
  const handleEditClick = () => {
    onClose(); // Close the dialog first
    router.push(`/dashboard/admin/tours/edit-tour/${tour._id}`);
  };

  return (
    <Dialog open={!!tour} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{tour.title}</span>
            <div className="flex space-x-2">
              <Badge className="bg-blue-100 text-blue-800">{tour.code}</Badge>
              <Badge
                className={
                  tour.status === "PUBLISHED"
                    ? "bg-green-100 text-green-800"
                    : tour.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {tour.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image */}
          {tour.coverImageUrl && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={tour.coverImageUrl}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="flex items-center font-semibold">
                <Calendar className="mr-2 h-4 w-4" />
                Duration
              </h3>
              <p className="text-sm text-gray-600">
                {tour.duration?.days || 0} Days / {tour.duration?.nights || 0}{" "}
                Nights
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center font-semibold">
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Base Price:</span> ৳
                  {tour.basePrice?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Booking Fee:</span>{" "}
                  {tour.bookingFeePercentage || 20}% (৳
                  {(
                    (tour.basePrice * (tour.bookingFeePercentage || 20)) /
                    100
                  ).toLocaleString()}
                  )
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center font-semibold">
                <MapPin className="mr-2 h-4 w-4" />
                Destination
              </h3>
              <p className="text-sm text-gray-600">
                {typeof tour.destination === "object"
                  ? tour.destination?.name || "N/A"
                  : tour.destination || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center font-semibold">
                <Package className="mr-2 h-4 w-4" />
                Category
              </h3>
              <p className="text-sm text-gray-600">
                {typeof tour.category === "object" &&
                tour.category?.category_name
                  ? tour.category.category_name
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Offer Information */}
          {tour.offer && tour.offer.isActive && (
            <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4">
              <h3 className="mb-3 flex items-center font-semibold text-red-700">
                <Percent className="mr-2 h-4 w-4" />
                Special Offer
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Discount Type</p>
                  <Badge className="bg-red-100 text-red-800">
                    {tour.offer.discountType === "flat"
                      ? "Flat Amount"
                      : "Percentage"}
                  </Badge>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-500">Discount Value</p>
                  <p className="text-lg font-bold text-red-600">
                    {tour.offer.discountType === "flat"
                      ? `৳${tour.offer.flatDiscount?.toLocaleString()}`
                      : `${tour.offer.discountPercentage}%`}
                  </p>
                </div>
                {tour.offer.label && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Offer Label</p>
                    <Badge className="bg-orange-100 text-orange-800">
                      {tour.offer.label}
                    </Badge>
                  </div>
                )}
              </div>
              {tour.offer.discountType === "flat" &&
                tour.offer.flatDiscount && (
                  <p className="mt-3 text-sm text-gray-600">
                    Final Price:{" "}
                    <span className="font-bold text-green-600">
                      ৳
                      {(
                        tour.basePrice - tour.offer.flatDiscount
                      ).toLocaleString()}
                    </span>
                  </p>
                )}
              {tour.offer.discountType === "percentage" &&
                tour.offer.discountPercentage && (
                  <p className="mt-3 text-sm text-gray-600">
                    Final Price:{" "}
                    <span className="font-bold text-green-600">
                      ৳
                      {(
                        tour.basePrice -
                        (tour.basePrice * tour.offer.discountPercentage) / 100
                      ).toLocaleString()}
                    </span>
                  </p>
                )}
            </div>
          )}

          {/* Dates Information */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
            {tour.publishedAt && (
              <div>
                <p className="mb-1 text-xs text-gray-500">Published Date</p>
                <p className="text-sm font-medium">
                  {new Date(tour.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {tour.createdAt && (
              <div>
                <p className="mb-1 text-xs text-gray-500">Created Date</p>
                <p className="text-sm font-medium">
                  {new Date(tour.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {tour.tags && tour.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="flex items-center font-semibold">
                <Tag className="mr-2 h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tour.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Highlights</h3>
              <ul className="space-y-1">
                {tour.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <CheckCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusion */}
          {tour.inclusion && tour.inclusion.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Inclusion</h3>
              <ul className="space-y-1">
                {tour.inclusion.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <CheckCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusion */}
          {tour.exclusion && tour.exclusion.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Exclusion</h3>
              <ul className="space-y-1">
                {tour.exclusion.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <XCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Itinerary</h3>
              <div className="space-y-4">
                {tour.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">
                      Day {day.dayNo}: {day.title}
                    </h4>
                    {day.blocks && day.blocks.length > 0 && (
                      <div className="space-y-3">
                        {day.blocks.map((block, blockIndex) => (
                          <div
                            key={blockIndex}
                            className="border-l-2 border-blue-200 py-1 pl-3"
                          >
                            <div className="flex flex-wrap items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {block.type}
                              </Badge>
                              {block.title && (
                                <span className="text-sm font-medium">
                                  {block.title}
                                </span>
                              )}
                              {block.subtitle && (
                                <span className="text-xs text-gray-500">
                                  • {block.subtitle}
                                </span>
                              )}
                              {block.timeFrom && block.timeTo && (
                                <span className="text-xs text-gray-400">
                                  🕐 {block.timeFrom} - {block.timeTo}
                                </span>
                              )}
                            </div>
                            {block.hotelName && (
                              <div className="mt-1 flex items-center text-sm text-gray-600">
                                <Hotel className="mr-1 h-3 w-3" />
                                <span>{block.hotelName}</span>
                              </div>
                            )}
                            {block.meals && (
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <Utensils className="mr-1 h-3 w-3" />
                                <span>
                                  {[
                                    block.meals.breakfast && "Breakfast",
                                    block.meals.lunch && "Lunch",
                                    block.meals.dinner && "Dinner",
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                            {block.description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {block.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {(tour.visaRequirements || tour.terms || tour.otherDetails) && (
            <div className="space-y-4">
              <h3 className="font-semibold">Additional Details</h3>
              {tour.visaRequirements && (
                <div>
                  <h4 className="text-sm font-medium">Visa Requirements</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {tour.visaRequirements}
                  </p>
                </div>
              )}
              {tour.terms && (
                <div>
                  <h4 className="text-sm font-medium">Terms & Conditions</h4>
                  <p className="mt-1 text-sm text-gray-600">{tour.terms}</p>
                </div>
              )}
              {tour.otherDetails && (
                <div>
                  <h4 className="text-sm font-medium">Other Details</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {tour.otherDetails}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Gallery Images */}
          {tour.galleryUrls && tour.galleryUrls.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Gallery</h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {tour.galleryUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-full overflow-hidden rounded-lg"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleEditClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
