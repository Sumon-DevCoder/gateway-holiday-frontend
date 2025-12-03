/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomCheckbox from "@/components/CustomFormComponents/CustomCheckbox";
import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetCountriesQuery } from "@/redux/api/features/country/countryApi";
import { useCreateTourMutation } from "@/redux/api/features/tour/tourApi";
import { useGetActiveTourCategoriesQuery } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { ArrowLeft, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

interface Option {
  label: string;
  value: string;
}

interface MealData {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface ItineraryBlock {
  type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
  title?: string;
  subtitle?: string;
  description?: string;
  meals?: MealData;
  hotelName?: string;
  timeFrom?: string;
  timeTo?: string;
}

interface ItineraryDay {
  dayNo: number;
  title: string;
  blocks: ItineraryBlock[];
}

interface FormData {
  // Basic Info
  code: string;
  title: string;
  destination: string; // ObjectId reference to Country

  // Duration
  days: string;
  nights: string;

  // Category
  category: string;

  // Features
  tags?: string; // Will be converted to array
  highlights?: string; // Will be converted to array
  inclusion?: string; // Will be converted to array
  exclusion?: string; // Will be converted to array

  // Additional Details
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;

  // Images
  coverImage?: File;
  galleryImages?: File[];

  // Pricing
  basePrice: string;
  bookingFeePercentage: string;

  // Offer
  offerActive?: boolean;
  offerDiscountType?: string;
  offerFlatDiscount?: string;
  offerDiscountPercentage?: string;
  offerLabel?: string;

  // Itinerary
  itinerary?: ItineraryDay[];

  // Status
  status: string;
}

// 👉 Options
const statusOptions: Option[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

const discountTypeOptions: Option[] = [
  { label: "Flat Amount", value: "flat" },
  { label: "Percentage", value: "percentage" },
];

const itineraryBlockTypeOptions: Option[] = [
  { label: "Transfer", value: "TRANSFER" },
  { label: "Sightseeing", value: "SIGHTSEEING" },
  { label: "Meal", value: "MEAL" },
  { label: "Hotel", value: "HOTEL" },
  { label: "Note", value: "NOTE" },
];

export default function CreateTourPage(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [offerDiscountType, setOfferDiscountType] = useState<string>("flat");

  // Fetch countries from API - fetch all countries for dropdown
  const {
    data: countriesResponse,
    isLoading: isCountriesLoading,
    error: countriesError,
  } = useGetCountriesQuery({ limit: 1000 });

  // Fetch tour categories from API
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetActiveTourCategoriesQuery();

  // Tour creation mutation
  const [createTour, { isLoading: isCreatingTour }] = useCreateTourMutation();

  // Create country options from API data (memoized for performance)
  const countryOptions: Option[] = useMemo(() => {
    return (
      countriesResponse?.data?.map((country) => ({
        label: country.name,
        value: country._id || "",
      })) || []
    );
  }, [countriesResponse?.data]);

  // Create category options from API data (memoized for performance)
  const categoryOptions: Option[] = useMemo(() => {
    return (
      categoriesData?.data?.map((category) => ({
        label: category.category_name,
        value: category._id || "",
      })) || []
    );
  }, [categoriesData?.data]);

  // Helper function to update day numbers sequentially
  const updateDayNumbers = (itineraryData: ItineraryDay[]) => {
    return itineraryData.map((day, index) => ({
      ...day,
      dayNo: index + 1,
    }));
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    // Basic validation
    if (!data.title.trim()) {
      toast.error("Please enter a tour title");
      return;
    }

    if (!data.destination) {
      toast.error("Please select a destination");
      return;
    }

    if (!data.days || Number(data.days) < 1) {
      toast.error("Duration in days must be at least 1");
      return;
    }

    if (Number(data.nights) < 0) {
      toast.error("Duration in nights cannot be negative");
      return;
    }

    if (!data.basePrice || Number(data.basePrice) < 0) {
      toast.error("Base price must be a positive number");
      return;
    }

    if (
      !data.bookingFeePercentage ||
      Number(data.bookingFeePercentage) < 0 ||
      Number(data.bookingFeePercentage) > 100
    ) {
      toast.error("Booking fee percentage must be between 0 and 100");
      return;
    }

    if (!data.category) {
      toast.error("Category is required");
      return;
    }

    try {
      setIsLoading(true);

      // Additional validation
      if (!data.code.trim()) {
        toast.error("Tour code is required");
        return;
      }

      const form = new FormData();

      // Basic Info
      form.append("code", data.code.trim());
      form.append("title", data.title.trim());
      form.append("destination", data.destination);

      // Duration
      form.append(
        "duration",
        JSON.stringify({
          days: Number(data.days),
          nights: Number(data.nights),
        })
      );

      // Category
      form.append("category", data.category);

      // Convert string fields to arrays
      form.append(
        "tags",
        JSON.stringify(
          data.tags
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || []
        )
      );
      form.append(
        "highlights",
        JSON.stringify(
          data.highlights
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || []
        )
      );
      form.append(
        "inclusion",
        JSON.stringify(
          data.inclusion
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || []
        )
      );
      form.append(
        "exclusion",
        JSON.stringify(
          data.exclusion
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || []
        )
      );

      // Additional Details
      if (data.visaRequirements?.trim()) {
        form.append("visaRequirements", data.visaRequirements.trim());
      }
      if (data.terms?.trim()) {
        form.append("terms", data.terms.trim());
      }
      if (data.otherDetails?.trim()) {
        form.append("otherDetails", data.otherDetails.trim());
      }

      // Pricing
      form.append("basePrice", data.basePrice);
      form.append("bookingFeePercentage", data.bookingFeePercentage);

      // Offer - Always send offer data to properly update/clear it
      const offerData: any = {
        isActive: data.offerActive || false,
        discountType: offerDiscountType, // Use state instead of form data
      };

      // Only include discount values if offer is active
      if (data.offerActive) {
        if (offerDiscountType === "flat" && data.offerFlatDiscount) {
          offerData.flatDiscount = Number(data.offerFlatDiscount);
        } else if (
          offerDiscountType === "percentage" &&
          data.offerDiscountPercentage
        ) {
          offerData.discountPercentage = Number(data.offerDiscountPercentage);
        } else {
        }

        if (data.offerLabel?.trim()) {
          offerData.label = data.offerLabel.trim();
        }
      } else {
      }

      form.append("offer", JSON.stringify(offerData));
      // Itinerary
      if (itinerary && itinerary.length > 0) {
        const validItinerary = itinerary.filter(
          (day) => day.dayNo > 0 && day.title.trim()
        );

        // Check for sequential day numbers
        const sortedItinerary = validItinerary.sort(
          (a, b) => a.dayNo - b.dayNo
        );
        const hasSequentialDays = sortedItinerary.every(
          (day, index) => day.dayNo === index + 1
        );

        if (!hasSequentialDays) {
          toast.error("Itinerary days must be sequential (1, 2, 3, etc.)");
          return;
        }

        if (validItinerary.length > 0) {
          form.append("itinerary", JSON.stringify(sortedItinerary));
        }
      }

      // Status
      form.append("status", data.status);

      // File uploads
      if (data.coverImage) {
        form.append("coverImage", data.coverImage);
      }
      if (data.galleryImages && data.galleryImages.length > 0) {
        data.galleryImages.forEach((file) =>
          form.append("galleryImages", file)
        );
      }

      // API call
      const result = await createTour(form).unwrap();

      if (result.success) {
        toast.success(result.message || "Tour created successfully!");
        // Redirect to tours list using Next.js router (no full page reload)
        setTimeout(() => {
          router.push("/dashboard/admin/tours");
        }, 1500);
      } else {
        toast.error(result.message || "Failed to create tour");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to create tour. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/admin/tours">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tours
            </Button>
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">Add New Tour</h1>
        </div>
        <Link href="/dashboard/admin/tours">
          <Button variant="outline" size="sm">
            <List className="mr-2 h-4 w-4" />
            View All Tours
          </Button>
        </Link>
      </div>

      <CustomForm
        onSubmit={handleSubmit}
        defaultValues={{
          category: "regular",
          status: "DRAFT",
          bookingFeePercentage: "20",
          offerActive: false,
          offerDiscountType: "flat",
        }}
        hideSubmitUntilValid={true}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Basic Info */}
        <div className="col-span-1">
          <CustomInput
            name="code"
            label="Tour Code"
            required
            placeholder="e.g., TOUR-001"
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            name="title"
            label="Title"
            required
            placeholder="Tour title"
          />
        </div>
        <div className="col-span-1">
          <CustomSelect
            name="destination"
            label="Destination Country"
            options={countryOptions}
            required
            disabled={isCountriesLoading || !!countriesError}
            placeholder={
              isCountriesLoading
                ? "Loading countries..."
                : countriesError
                  ? "Error loading countries"
                  : "Select a country"
            }
          />
          {countriesError && (
            <p className="mt-1 text-xs text-red-500">
              Failed to load countries. Please refresh the page.
            </p>
          )}
          {!isCountriesLoading &&
            !countriesError &&
            countryOptions.length === 0 && (
              <p className="mt-1 text-xs text-yellow-600">
                No countries available. Please add countries first.
              </p>
            )}
        </div>

        {/* Duration */}
        <div className="col-span-1">
          <CustomInput
            type="number"
            name="days"
            label="Duration (Days)"
            required
            placeholder="10"
          />
        </div>
        <div className="col-span-1">
          <CustomInput
            type="number"
            name="nights"
            label="Duration (Nights)"
            required
            placeholder="9"
          />
        </div>

        {/* Category and Status */}
        <div className="col-span-1">
          <CustomSelect
            name="category"
            label="Tour Category *"
            options={categoryOptions}
            required
            disabled={isCategoriesLoading}
            placeholder={
              isCategoriesLoading
                ? "Loading categories..."
                : "Select a category"
            }
          />
          {isCategoriesLoading && (
            <p className="mt-1 text-xs text-gray-500">
              Loading tour categories...
            </p>
          )}
          {categoryOptions.length === 0 && !isCategoriesLoading && (
            <p className="mt-1 text-xs text-red-500">
              No tour categories available. Please create one first.
            </p>
          )}
        </div>
        <div className="col-span-1">
          <CustomSelect
            name="status"
            label="Status *"
            options={statusOptions}
            required
          />
        </div>

        {/* Tags and Highlights */}
        <div className="col-span-1">
          <CustomInput
            name="tags"
            label="Tags"
            placeholder="Adventure, Trekking, Himalayas"
          />
          <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
        </div>
        <div className="col-span-1">
          <CustomInput
            name="highlights"
            label="Highlights"
            placeholder="Mountain views, Local culture, Adventure activities"
          />
          <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
        </div>

        {/* Inclusion and Exclusion */}
        <div className="col-span-1">
          <CustomInput
            name="inclusion"
            label="Inclusion"
            placeholder="Accommodation, Meals, Transportation"
          />
          <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
        </div>
        <div className="col-span-1">
          <CustomInput
            name="exclusion"
            label="Exclusion"
            placeholder="Personal expenses, Insurance, Tips"
          />
          <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
        </div>

        <Separator className="col-span-1 mt-4 md:col-span-2" />

        {/* Pricing */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Pricing</h2>
        </div>

        <div className="col-span-1">
          <CustomInput
            type="number"
            name="basePrice"
            label="Base Price"
            required
            placeholder="50000"
          />
        </div>

        <div className="col-span-1">
          <CustomInput
            type="number"
            name="bookingFeePercentage"
            label="Booking Fee (%)"
            required
            placeholder="20"
          />
          <p className="mt-1 text-xs text-gray-500">
            Advance payment percentage (0-100%)
          </p>
        </div>

        {/* Offer (Optional) */}
        <div className="col-span-1 md:col-span-2">
          <Separator className="my-4" />
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Special Offer (Optional)
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Enable Offer Toggle */}
              <div className="col-span-1 md:col-span-2">
                <CustomCheckbox
                  name="offerActive"
                  label="Enable Special Offer"
                />
              </div>

              {/* Discount Type */}
              <div className="col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  value={offerDiscountType}
                  onChange={(e) => setOfferDiscountType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {discountTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Value - Conditional */}
              {offerDiscountType === "flat" && (
                <div className="col-span-1">
                  <CustomInput
                    type="number"
                    name="offerFlatDiscount"
                    label="Discount Amount (BDT)"
                    placeholder="5000"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Fixed amount to deduct from base price
                  </p>
                </div>
              )}

              {offerDiscountType === "percentage" && (
                <div className="col-span-1">
                  <CustomInput
                    type="number"
                    name="offerDiscountPercentage"
                    label="Discount Percentage (%)"
                    placeholder="20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Percentage off the base price (0-100)
                  </p>
                </div>
              )}

              {/* Offer Label */}
              <div className="col-span-1 md:col-span-2">
                <CustomInput
                  name="offerLabel"
                  label="Offer Label"
                  placeholder="e.g., Eid Special, Summer Sale, Flash Deal"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Promotional label to display with the offer
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="col-span-1 mt-4 md:col-span-2" />

        {/* Additional Details */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Additional Details</h2>
        </div>

        <div className="col-span-1 md:col-span-2">
          <CustomInput
            name="visaRequirements"
            label="Visa Requirements (Optional)"
            placeholder="Visa requirements and documentation needed"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <CustomInput
            name="terms"
            label="Terms & Conditions (Optional)"
            placeholder="Terms and conditions for this tour"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <CustomInput
            name="otherDetails"
            label="Other Details (Optional)"
            placeholder="Any other important details"
          />
        </div>

        <Separator className="col-span-1 mt-4 md:col-span-2" />

        {/* Itinerary */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Tour Itinerary</h2>
          <div className="space-y-6">
            {itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Day {day.dayNo}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newItinerary = itinerary.filter(
                        (_, i) => i !== dayIndex
                      );
                      setItinerary(updateDayNumbers(newItinerary));
                    }}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Remove Day
                  </button>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">
                    Day Title
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => {
                      const newItinerary = [...itinerary];
                      newItinerary[dayIndex] = {
                        ...day,
                        title: e.target.value,
                      };
                      setItinerary(newItinerary);
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Pick up from Airport & Transfer to Hotel"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Activities</h4>
                  {day.blocks.map((block, blockIndex) => (
                    <div
                      key={blockIndex}
                      className="grid grid-cols-1 gap-3 rounded border p-3 md:grid-cols-2"
                    >
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Type
                        </label>
                        <select
                          value={block.type}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                type: e.target.value as any,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                        >
                          {itineraryBlockTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                title: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                          placeholder="Tonle Sap"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={block.subtitle || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                subtitle: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                          placeholder="Pick & Drop"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Time From
                        </label>
                        <input
                          type="time"
                          value={block.timeFrom || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                timeFrom: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Time To
                        </label>
                        <input
                          type="time"
                          value={block.timeTo || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                timeTo: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Hotel Name (if applicable)
                        </label>
                        <input
                          type="text"
                          value={block.hotelName || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                hotelName: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                          placeholder="Grand Hotel"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1 block text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          value={block.description || ""}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks[blockIndex]) {
                              newItinerary[dayIndex].blocks[blockIndex] = {
                                ...block,
                                description: e.target.value,
                              };
                              setItinerary(newItinerary);
                            }
                          }}
                          className="w-full rounded-md border px-3 py-2"
                          rows={3}
                          placeholder="Detailed description of the activity"
                        />
                      </div>

                      {/* Meals for MEAL type blocks */}
                      {block.type === "MEAL" && (
                        <div className="col-span-1 md:col-span-2">
                          <label className="mb-2 block text-sm font-medium">
                            Meals Included
                          </label>
                          <div className="flex space-x-4">
                            {["breakfast", "lunch", "dinner"].map((meal) => (
                              <label key={meal} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    block.meals?.[meal as keyof MealData] ||
                                    false
                                  }
                                  onChange={(e) => {
                                    const newItinerary = [...itinerary];
                                    if (
                                      newItinerary[dayIndex]?.blocks[blockIndex]
                                    ) {
                                      newItinerary[dayIndex].blocks[
                                        blockIndex
                                      ] = {
                                        ...block,
                                        meals: {
                                          ...block.meals,
                                          [meal]: e.target.checked,
                                        } as MealData,
                                      };
                                      setItinerary(newItinerary);
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="capitalize">{meal}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="col-span-1 flex justify-end md:col-span-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newItinerary = [...itinerary];
                            if (newItinerary[dayIndex]?.blocks) {
                              newItinerary[dayIndex].blocks = newItinerary[
                                dayIndex
                              ].blocks.filter((_, i) => i !== blockIndex);
                              setItinerary(newItinerary);
                            }
                          }}
                          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                        >
                          Remove Activity
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const newItinerary = [...itinerary];
                      if (newItinerary[dayIndex]?.blocks) {
                        newItinerary[dayIndex].blocks = [
                          ...newItinerary[dayIndex].blocks,
                          {
                            type: "SIGHTSEEING",
                            title: "",
                            subtitle: "",
                            description: "",
                            timeFrom: "",
                            timeTo: "",
                          },
                        ];
                        setItinerary(newItinerary);
                      }
                    }}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newItinerary = [
                  ...itinerary,
                  {
                    dayNo: itinerary.length + 1,
                    title: "",
                    blocks: [],
                  },
                ];
                setItinerary(updateDayNumbers(newItinerary));
              }}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Add Day
            </button>
          </div>
        </div>

        <Separator className="col-span-1 mt-4 md:col-span-2" />

        {/* File Upload */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Images</h2>
        </div>

        <div className="col-span-1">
          <CustomFileUploader
            name="coverImage"
            label="Cover Image"
            accept={{ "image/*": [] }}
          />
        </div>
        <div className="col-span-1">
          <CustomFileUploader
            name="galleryImages"
            label="Gallery Images"
            multiple
            accept={{ "image/*": [] }}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Button
            type="submit"
            disabled={isLoading || isCreatingTour}
            className="w-full"
          >
            {isLoading || isCreatingTour ? "Creating Tour..." : "Create Tour"}
          </Button>
        </div>
      </CustomForm>
    </div>
  );
}
