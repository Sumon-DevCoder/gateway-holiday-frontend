"use client";

import CustomCheckbox from "@/components/CustomFormComponents/CustomCheckbox";
import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetCountriesQuery } from "@/redux/api/features/country/countryApi";
import {
  useGetTourByIdQuery,
  useUpdateTourMutation,
} from "@/redux/api/features/tour/tourApi";
import { useGetActiveTourCategoriesQuery } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ItineraryEditor from "./ItineraryEditor";

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
  destination: string;

  // Duration
  days: string;
  nights: string;

  // Category
  category: string;

  // Features
  tags?: string;
  highlights?: string;
  inclusion?: string;
  exclusion?: string;

  // Additional Details
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;

  // Images
  coverImage?: File;
  galleryImages?: File[];

  // Pricing
  basePrice: string;

  // Offer
  offerActive?: boolean;
  offerDiscountType?: string;
  offerFlatDiscount?: string;
  offerDiscountPercentage?: string;
  offerLabel?: string;

  // Status
  status: string;
}

interface EditTourFormProps {
  tourId: string;
}

// Component that handles form reset when tour data loads
function TourFormContent({
  tourResponse,
  countryOptions,
  categoryOptions,
  itinerary,
  setItinerary,
  isLoading,
  isUpdating,
  isCategoriesLoading,
}: {
  tourResponse: any;
  countryOptions: Option[];
  categoryOptions: Option[];
  itinerary: ItineraryDay[];
  setItinerary: (itinerary: ItineraryDay[]) => void;
  isLoading: boolean;
  isUpdating: boolean;
  isCategoriesLoading: boolean;
}) {
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Initialize form data when tour is loaded
  useEffect(() => {
    if (tourResponse?.data) {
      setItinerary(tourResponse.data.itinerary || []);
      setIsFormInitialized(true);
    }
  }, [tourResponse, setItinerary]);

  // Show loading state while form is being initialized
  if (!isFormInitialized && tourResponse?.data) {
    return (
      <div className="col-span-1 py-8 text-center md:col-span-2">
        <div className="text-lg">Loading form data...</div>
        <div className="mt-2 text-sm text-gray-500">
          Initializing form with tour data
        </div>
      </div>
    );
  }

  const tour = tourResponse?.data;

  return (
    <>
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
          key={`destination-${countryOptions.length}`}
          name="destination"
          label="Destination Country"
          options={countryOptions}
          required
          disabled={false}
          placeholder="Select a country"
        />
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
          key={`category-${tourResponse?.category || "initial"}`}
          name="category"
          label="Tour Category *"
          options={categoryOptions}
          required
          disabled={isCategoriesLoading}
          placeholder={
            isCategoriesLoading ? "Loading categories..." : "Select a category"
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
          key={`status-${tourResponse?.status}`}
          name="status"
          label="Status"
          options={[
            { label: "Draft", value: "DRAFT" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Archived", value: "ARCHIVED" },
          ]}
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

      {/* Offer (Optional) */}
      <div className="col-span-1 md:col-span-2">
        <Separator className="my-4" />
        <h3 className="mb-3 text-lg font-semibold">Offer (Optional)</h3>
      </div>

      <div className="col-span-1">
        <CustomCheckbox name="offerActive" label="Enable Offer" />
      </div>

      <div className="col-span-1">
        <CustomSelect
          name="offerDiscountType"
          label="Discount Type"
          options={[
            { label: "Flat Amount", value: "flat" },
            { label: "Percentage", value: "percentage" },
          ]}
        />
      </div>

      <div className="col-span-1">
        <CustomInput
          type="number"
          name="offerFlatDiscount"
          label="Flat Discount Amount"
          placeholder="5000"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used when Discount Type is "Flat Amount"
        </p>
      </div>

      <div className="col-span-1">
        <CustomInput
          type="number"
          name="offerDiscountPercentage"
          label="Discount Percentage"
          placeholder="20"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used when Discount Type is "Percentage" (0-100)
        </p>
      </div>

      <div className="col-span-1 md:col-span-2">
        <CustomInput
          name="offerLabel"
          label="Offer Label"
          placeholder="e.g., Eid Special, Flash Sale"
        />
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

      {/* Itinerary Editor */}
      <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />

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
        {tour?.coverImageUrl && (
          <div className="mt-2">
            <p className="mb-1 text-sm text-gray-600">Current cover image:</p>
            <img
              src={tour.coverImageUrl}
              alt="Current cover"
              className="h-20 w-32 rounded object-cover"
            />
          </div>
        )}
      </div>
      <div className="col-span-1">
        <CustomFileUploader
          name="galleryImages"
          label="Gallery Images"
          multiple
          accept={{ "image/*": [] }}
        />
        {tour && tour.galleryUrls && tour.galleryUrls.length > 0 ? (
          <div className="mt-2">
            <p className="mb-1 text-sm text-gray-600">
              Current gallery images ({tour.galleryUrls.length}):
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tour.galleryUrls.map((url: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="h-20 w-full rounded border object-cover"
                    onError={(_e) => {}}
                  />
                  <div className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded border bg-gray-50 p-3">
            <p className="mb-1 text-sm text-gray-500">
              No gallery images found
            </p>
            <p className="text-xs text-gray-400">
              This tour doesn't have any gallery images yet. You can upload some
              using the file uploader above.
            </p>
            <p className="mt-1 text-xs text-gray-300">
              Debug - Gallery URLs: {JSON.stringify(tour?.galleryUrls)}
            </p>
          </div>
        )}
      </div>

      <div className="col-span-1 md:col-span-2">
        <Button
          type="submit"
          disabled={isLoading || isUpdating}
          className="w-full"
        >
          {isLoading || isUpdating ? "Updating Tour..." : "Update Tour"}
        </Button>
      </div>
    </>
  );
}

export default function EditTourForm({
  tourId,
}: EditTourFormProps): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  // Validate tourId
  if (!tourId) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>Invalid tour ID</p>
      </div>
    );
  }

  // Fetch tour data
  const {
    data: tourResponse,
    isLoading: isTourLoading,
    error: tourError,
  } = useGetTourByIdQuery(tourId);

  // Fetch countries - fetch all countries for dropdown
  const {
    data: countriesResponse,
    isLoading: _isCountriesLoading,
    error: _countriesError,
  } = useGetCountriesQuery({ limit: 1000 });

  // Fetch tour categories
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetActiveTourCategoriesQuery();

  // Tour update mutation
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();

  // Create country options
  const countryOptions: Option[] = useMemo(() => {
    return (
      countriesResponse?.data?.map((country) => ({
        label: country.name,
        value: country._id || "",
      })) || []
    );
  }, [countriesResponse?.data]);

  // Create category options
  const categoryOptions: Option[] = useMemo(() => {
    return (
      categoriesData?.data?.map((category) => ({
        label: category.category_name,
        value: category._id || "",
      })) || []
    );
  }, [categoriesData?.data]);

  const handleSubmit = async (data: FormData): Promise<void> => {
    try {
      setIsLoading(true);

      // Validation
      if (!data.code.trim()) {
        toast.error("Tour code is required");
        return;
      }
      if (!data.title.trim()) {
        toast.error("Tour title is required");
        return;
      }
      if (!data.destination) {
        toast.error("Please select a destination country");
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
      if (!data.category) {
        toast.error("Category is required");
        return;
      }

      const form = new FormData();

      // Basic Info
      form.append("code", data.code.trim());
      form.append("title", data.title.trim());
      form.append("destination", data.destination);

      // Debug: Log the destination ID
      // Duration - send as JSON string
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

      // Offer - Always send offer data to properly update/clear it
      const offerData: any = {
        isActive: data.offerActive || false,
        discountType: data.offerDiscountType || "flat",
      };

      // Only include discount values if offer is active
      if (data.offerActive) {
        if (data.offerDiscountType === "flat" && data.offerFlatDiscount) {
          offerData.flatDiscount = Number(data.offerFlatDiscount);
        } else if (
          data.offerDiscountType === "percentage" &&
          data.offerDiscountPercentage
        ) {
          offerData.discountPercentage = Number(data.offerDiscountPercentage);
        }

        if (data.offerLabel?.trim()) {
          offerData.label = data.offerLabel.trim();
        }
      }

      form.append("offer", JSON.stringify(offerData));

      // Debug: Log offer data being sent

      // Itinerary
      if (itinerary && itinerary.length > 0) {
        const validItinerary = itinerary.filter(
          (day) => day.dayNo > 0 && day.title.trim()
        );

        if (validItinerary.length > 0) {
          form.append("itinerary", JSON.stringify(validItinerary));
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
      const result = await updateTour({ id: tourId, data: form }).unwrap();

      if (result) {
        toast.success("Tour updated successfully!");
        router.push("/dashboard/admin/tours");
      } else {
        toast.error("Failed to update tour");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update tour. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isTourLoading) {
    return <div className="py-8 text-center">Loading tour data...</div>;
  }

  if (tourError || !tourResponse) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>Error loading tour data</p>
        <p className="mt-2 text-sm text-gray-500">Tour ID: {tourId}</p>
        {tourError && (
          <p className="mt-1 text-sm text-gray-500">
            Error: {JSON.stringify(tourError)}
          </p>
        )}
      </div>
    );
  }

  const tour = tourResponse?.data;

  if (!tour) {
    return <div className="py-8 text-center">Tour data not found</div>;
  }

  return (
    <CustomForm
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      defaultValues={{
        code: tour.code || "",
        title: tour.title || "",
        destination:
          typeof tour.destination === "string"
            ? tour.destination
            : tour.destination?._id || "",
        days: tour.duration?.days?.toString() || "",
        nights: tour.duration?.nights?.toString() || "",
        category:
          typeof tour.category === "string"
            ? tour.category
            : tour.category?._id || "",
        tags: tour.tags?.join(", ") || "",
        highlights: tour.highlights?.join(", ") || "",
        inclusion: tour.inclusion?.join(", ") || "",
        exclusion: tour.exclusion?.join(", ") || "",
        visaRequirements: tour.visaRequirements || "",
        terms: tour.terms || "",
        otherDetails: tour.otherDetails || "",
        basePrice: tour.basePrice?.toString() || "",
        offerActive: tour.offer?.isActive || false,
        offerDiscountType: tour.offer?.discountType || "flat",
        offerFlatDiscount: tour.offer?.flatDiscount?.toString() || "",
        offerDiscountPercentage:
          tour.offer?.discountPercentage?.toString() || "",
        offerLabel: tour.offer?.label || "",
        status: tour.status || "DRAFT",
      }}
    >
      <TourFormContent
        tourResponse={tourResponse}
        countryOptions={countryOptions}
        categoryOptions={categoryOptions}
        itinerary={itinerary}
        setItinerary={setItinerary}
        isLoading={isLoading}
        isUpdating={isUpdating}
        isCategoriesLoading={isCategoriesLoading}
      />
    </CustomForm>
  );
}
