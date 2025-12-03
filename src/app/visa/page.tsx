"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { cn } from "@/lib/utils";
import { useGetCountriesWithVisasQuery } from "@/redux/api/features/country/countryApi";
import {
  useGetAllVisasQuery,
  useGetVisaByCountryNameQuery,
} from "@/redux/api/features/visa/visaApi";
import {
  useCreateVisaApplicationMutation,
  useCreateVisaBookingMutation,
} from "@/redux/api/features/visaBooking/visaBookingApi";
// import { useGetActiveVisaTypesQuery } from "@/redux/api/features/visaType/visaTypeApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Loader2, MapPin, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Currency {
  name: string;
  symbol: string;
}

interface CountryData {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  area: number;
  population: number;
  timezones: string[];
  languages: { [key: string]: string };
  currencies: { [key: string]: Currency };
  flags: {
    png: string;
    svg: string;
  };
}

// Visa Application Form Schema (email is optional)
const visaApplicationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  visaType: z.string().min(1, "Visa type is required *"),
  name: z
    .string()
    .min(1, "Name is required *")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")), // Optional for both query and application
  phone: z
    .string()
    .min(1, "Phone number is required *")
    .min(10, "Phone number must be at least 10 digits"),
  numberOfPersons: z
    .union([z.number().int().min(1).max(20), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Number of persons is required",
    })
    .transform((val) => val as number),
});

type VisaApplicationFormData = z.input<typeof visaApplicationSchema>;

// Enhanced Dropdown Component
function EnhancedDropdown({
  value,
  onValueChange,
  placeholder,
  countries,
  isLoading,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  countries: any[];
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Transform country data for dropdown (already filtered by backend)
  const countryOptions =
    countries?.map((country: any, index: number) => ({
      id: country._id || String(index + 1),
      en: country.name,
    })) || [];

  const filteredOptions = countryOptions.filter((option: any) =>
    option.en.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOption = countryOptions.find(
    (option: any) => option.en === value
  );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between rounded-lg border bg-white py-3 pr-3 pl-10 text-left font-normal shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
              "border-gray-200",
              !selectedOption && "text-gray-500",
              open && "border-blue-500 shadow-md"
            )}
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">
                {selectedOption ? selectedOption.en : placeholder}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          side="bottom"
        >
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-10 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  Loading countries...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Search className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  {searchValue
                    ? "No countries found with visa information."
                    : "No countries with visa information available."}
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onValueChange(option.en);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-blue-50 hover:shadow-sm",
                        value === option.en &&
                          "bg-blue-50 shadow-sm ring-1 ring-blue-200"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 flex-shrink-0 text-blue-600 transition-opacity",
                          value === option.en ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {option.en}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const CountryInfo: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countryName, setCountryName] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [queryType, setQueryType] = useState<"query" | "application">("query");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");

  // Auth check hook
  const { checkAuth, authUser } = useAuthCheck();

  // Fetch countries with active visas only (already filtered by backend)
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountriesWithVisasQuery();

  // Fetch all visas to show visa count on cards
  const { data: allVisasResponse } = useGetAllVisasQuery({
    page: 1,
    limit: 1000,
  });

  // Fetch active visa types for dynamic loading
  // const { data: visaTypesResponse } = useGetActiveVisaTypesQuery();

  const allCountries = countriesResponse?.data || [];
  const allVisas = allVisasResponse?.data || [];

  // Simple search filtering (backend already filtered by active visas)
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Get visa count for a country
  const getVisaCount = (countryName: string) => {
    return allVisas.filter(
      (visa) =>
        visa.countryName.toLowerCase() === countryName.toLowerCase() &&
        visa.isActive
    ).length;
  };

  // RTK Query mutations
  const [createVisaBooking, { isLoading: isCreatingQuery }] =
    useCreateVisaBookingMutation();
  const [createVisaApplication, { isLoading: isCreatingApplication }] =
    useCreateVisaApplicationMutation();

  const isCreating = isCreatingQuery || isCreatingApplication;

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VisaApplicationFormData>({
    resolver: zodResolver(visaApplicationSchema),
  });

  // Fetch visa data only for selected country from URL
  const {
    data: visaResponse,
    isLoading: isVisaLoading,
    isFetching: isVisaFetching,
    error: visaError,
  } = useGetVisaByCountryNameQuery(countryName, {
    skip: !countryName, // Only fetch when country is available
    refetchOnMountOrArgChange: true, // Always refetch when country changes
  });

  // Only show backend data if no error and data exists
  // Important: visaResponse.data can be null even on success response
  const backendVisaData =
    !visaError && visaResponse?.data ? visaResponse.data : null;

  // Fetch country data from RestCountries API
  const fetchCountryData = useCallback(async (country: string) => {
    if (!country) {
      setError("Please select a country");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
      if (!res.ok) throw new Error("Country not found");

      const data = await res.json();
      const raw = data[0];

      // Set country data in English
      setCountryData(raw);
    } catch (err) {
      setError("Failed to fetch country information");
      setCountryData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch country data from URL parameter
  useEffect(() => {
    const countryFromUrl = searchParams.get("country");
    if (countryFromUrl && countryFromUrl.trim() !== "") {
      // Clear previous data when URL changes
      setCountryData(null);
      setError("");

      // Set new country
      setCountryName(countryFromUrl);
      setSelectedCountry(countryFromUrl);

      // Auto-fetch country data from RestCountries API
      fetchCountryData(countryFromUrl);
    }
  }, [searchParams, fetchCountryData]);

  const handleSearch = useCallback(() => {
    if (selectedCountry && selectedCountry.trim() !== "") {
      // Clear previous data first
      setCountryData(null);
      setError("");
      setCountryName(selectedCountry);

      // Update URL with selected country (will trigger useEffect)
      router.push(`/visa?country=${encodeURIComponent(selectedCountry)}`);
    }
  }, [selectedCountry, router]);

  // Handle country card click
  const handleCountryCardClick = (countryName: string) => {
    // Clear previous data
    setCountryData(null);
    setError("");
    setSelectedCountry(countryName);
    setCountryName(countryName);

    // Update URL and trigger data fetch
    router.push(`/visa?country=${encodeURIComponent(countryName)}`);
  };

  const handleQueryClick = () => {
    // Check auth before opening modal
    if (
      !checkAuth("submit a visa query", () => {
        // If not logged in, open login modal
        setIsLoginModalOpen(true);
        // Save the action to perform after login
        setQueryType("query");
        return;
      })
    ) {
      return;
    }

    // Pre-fill country field and open modal for query
    if (countryData?.name?.common) {
      setValue("country", countryData.name.common);
    }
    setQueryType("query");
    setIsModalOpen(true);
  };

  const handleApplyClick = () => {
    // Check auth before opening modal
    if (
      !checkAuth("apply for visa", () => {
        // If not logged in, open login modal
        setIsLoginModalOpen(true);
        // Save the action to perform after login
        setQueryType("application");
        return;
      })
    ) {
      return;
    }

    // Pre-fill country field and open modal for application
    if (countryData?.name?.common) {
      setValue("country", countryData.name.common);
    }
    setQueryType("application");
    setIsModalOpen(true);
  };

  const handleGoogleLogin = () => {
    const API_URL = process.env["NEXT_PUBLIC_API_URL"];
    // Save current page URL to redirect back after login
    const currentUrl = window.location.href;
    sessionStorage.setItem("visa_redirect_after_login", currentUrl);
    sessionStorage.setItem("visa_pending_action", queryType); // Save current action (query or application)
    if (countryData?.name?.common) {
      sessionStorage.setItem("visa_country", countryData.name.common);
    }
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  // Auto-fill form with user data when modal opens
  useEffect(() => {
    if (isModalOpen && authUser) {
      const user =
        typeof authUser === "string" ? JSON.parse(authUser) : authUser;

      // Auto-fill name, email from logged in user
      if (user.name) {
        setValue("name", user.name);
      }
      if (user.email) {
        setValue("email", user.email);
      }
      // Phone would need to be in user profile if available
      if (user.phone) {
        setValue("phone", user.phone);
      }
    }
  }, [isModalOpen, authUser, setValue]);

  // Check if user just logged in and had a pending action
  useEffect(() => {
    const pendingAction = sessionStorage.getItem("visa_pending_action");
    const savedCountry = sessionStorage.getItem("visa_country");

    if (pendingAction && authUser) {
      // User just logged in, open the modal for query or application
      if (savedCountry) {
        setValue("country", savedCountry);
      }
      setQueryType(pendingAction as "query" | "application");
      setIsModalOpen(true);

      // Clear the pending action
      sessionStorage.removeItem("visa_pending_action");
      sessionStorage.removeItem("visa_country");
      sessionStorage.removeItem("visa_redirect_after_login");
    }
  }, [authUser, setValue]);

  const onSubmitApplication = async (data: VisaApplicationFormData) => {
    try {
      if (queryType === "query") {
        // Simple query submission (no payment)
        const queryData = {
          ...data,
          booking_type: "query" as const,
          numberOfPersons: data.numberOfPersons || 1,
          // Add userId if user is logged in
          ...(authUser && {
            userId:
              typeof authUser === "string"
                ? JSON.parse(authUser)._id
                : authUser._id,
          }),
        };
        const result = await createVisaBooking(queryData).unwrap();

        toast.success(
          result.message || "Your visa query has been submitted successfully!"
        );

        setIsModalOpen(false);
        reset({
          country: countryData?.name?.common || "",
          visaType: "",
          name: "",
          email: "",
          phone: "",
        });
      } else {
        // Application with payment
        if (!backendVisaData?.processingFee) {
          toast.error("Processing fee information not available");
          return;
        }

        const applicationData: any = {
          country: data.country,
          visaType: data.visaType,
          booking_type: "application" as const,
          name: data.name,
          phone: data.phone,
          numberOfPersons: data.numberOfPersons || 1,
          processingFee: backendVisaData.processingFee,
          ...(data.email && { email: data.email }),
          // Add userId if user is logged in
          ...(authUser && {
            userId:
              typeof authUser === "string"
                ? JSON.parse(authUser)._id
                : authUser._id,
          }),
        };

        const result = await createVisaApplication(applicationData).unwrap();

        if (result.success && result.data) {
          if (result.data.paymentUrl) {
            toast.success("Redirecting to payment gateway...");
            // Redirect to payment
            window.location.href = result.data.paymentUrl;
          } else {
            toast.success(
              "Application submitted successfully! We will contact you soon."
            );
          }
        } else {
          toast.error("Payment URL not received. Please try again.");
        }

        setIsModalOpen(false);
        reset({
          country: countryData?.name?.common || "",
          visaType: "",
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to submit ${queryType}. Please try again.`
      );
    }
  };

  return (
    <>
      {/* Google Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Login Required
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="mb-6 text-center text-gray-600">
              Please login with Google to continue
            </p>
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visa Application Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
          {/* Fixed Header */}
          <div className="border-b bg-white px-6 py-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                <div className="rounded-lg bg-blue-50 p-2">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                {queryType === "query"
                  ? "Visa Query Form"
                  : "Visa Application Form"}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 max-h-[calc(90vh-200px)] overflow-y-auto px-6 py-6">
            <form
              onSubmit={handleFormSubmit(onSubmitApplication)}
              className="space-y-5"
            >
              {/* Grid Layout for Fields */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Country Field (Auto-filled, Disabled) */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("country")}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-600 focus:outline-none"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Visa Type Dropdown */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Visa Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register("visaType")}
                      className={cn(
                        "w-full appearance-none rounded-lg border bg-white px-4 py-2.5 pr-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
                        errors.visaType
                          ? "border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <option value="">Select visa type</option>
                      {backendVisaData?.visaTypes.map((type, idx) => (
                        <option
                          key={idx}
                          value={typeof type === "string" ? type : type.name}
                          className="capitalize"
                        >
                          {typeof type === "string" ? type : type.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.visaType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.visaType.message}
                    </p>
                  )}
                </div>

                {/* Name Field */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Enter your full name"
                    className={cn(
                      "w-full rounded-lg border bg-white px-4 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address{" "}
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="example@email.com"
                    className={cn(
                      "w-full rounded-lg border bg-white px-4 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={cn(
                      "w-full rounded-lg border bg-white px-4 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Number of Persons Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Persons <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="numberOfPersons"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        max="20"
                        placeholder="Enter number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            // Allow empty value temporarily while typing
                            field.onChange(undefined);
                          } else {
                            const numValue = Number(value);
                            if (
                              !isNaN(numValue) &&
                              numValue >= 1 &&
                              numValue <= 20
                            ) {
                              field.onChange(numValue);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          // Validate on blur but don't set default value
                          const value = e.target.value;
                          if (value !== "" && Number(value) < 1) {
                            field.onChange(undefined);
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border bg-white px-4 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
                          errors.numberOfPersons
                            ? "border-red-500"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      />
                    )}
                  />
                  {errors.numberOfPersons && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.numberOfPersons.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset({
                      country: countryData?.name?.common || "",
                      visaType: "",
                      name: "",
                      email: "",
                      phone: "",
                    });
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:order-2"
                >
                  {isCreating
                    ? "Submitting..."
                    : queryType === "query"
                      ? "Submit Query"
                      : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6">
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Back Button - Show when country is selected */}
          {countryName && (
            <div className="mb-4 px-2 sm:px-0">
              <button
                onClick={() => {
                  setCountryName("");
                  setSelectedCountry("");
                  setCountryData(null);
                  setError("");
                  router.push("/visa");
                }}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md sm:px-4"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                <span className="hidden sm:inline">Back to Countries</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          )}

          {/* Country Info Section */}
          {countryName && (
            <div
              className="relative mb-4 overflow-hidden rounded-xl p-4 text-white sm:mb-6 sm:rounded-2xl sm:p-6"
              style={{
                backgroundImage: `url('/map-image.jpg')`, // Replace with your image path
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay to keep text readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-blue-900/80"></div>

              {/* Content */}
              <div className="relative z-10">
                {loading ? (
                  <p className="text-sm sm:text-base">Loading...</p>
                ) : error ? (
                  <p className="text-sm text-red-400 sm:text-base">{error}</p>
                ) : countryData ? (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="space-y-2 text-base font-thin sm:space-y-3 sm:text-lg md:text-xl">
                      <p>
                        <span className="font-bold">Country Name:</span>{" "}
                        {countryData.name?.common}
                      </p>
                      <p className="flex items-center">
                        <span className="font-bold">Country Flag:</span>{" "}
                        <Image
                          src={countryData.flags?.png}
                          alt={countryData.name?.common}
                          width={32}
                          height={24}
                          className="ml-2 inline-block h-4 w-6"
                        />
                      </p>
                      <p>
                        <span className="font-bold">Capital:</span>{" "}
                        {countryData.capital?.join(", ")}
                      </p>
                      <p>
                        <span className="font-bold">Area:</span>{" "}
                        {countryData.area?.toLocaleString()} sq km
                      </p>
                    </div>
                    <div className="space-y-2 text-base font-thin sm:space-y-3 sm:text-lg md:text-xl">
                      <p>
                        <span className="font-bold">Population:</span>{" "}
                        {countryData.population?.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-bold">Time Zone:</span>{" "}
                        <span className="break-words">
                          {countryData.timezones?.join(", ")}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Official Languages:</span>{" "}
                        <span className="break-words">
                          {Object.values(countryData.languages || {}).join(
                            ", "
                          )}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Currency:</span>{" "}
                        <span className="break-words">
                          {Object.values(countryData.currencies || {})
                            .map((c) => `${c.name} (${c.symbol})`)
                            .join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 sm:text-base">
                    No data yet. Please search a country.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Countries Cards - Show when no country selected */}
          {!countryName && !loading && !isLoadingCountries && (
            <div className="mb-6 px-2 sm:mb-8 sm:px-0">
              <div className="mb-4 text-center sm:mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Select a Country for Visa Information
                </h2>
                <p className="text-sm text-gray-600 sm:text-base">
                  Choose from our available destinations
                </p>
              </div>

              {/* Search Bar for Countries */}
              <div className="mx-auto mb-4 max-w-2xl sm:mb-6">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none sm:rounded-xl sm:py-3 sm:pr-12 sm:pl-12 sm:text-base"
                  />
                  {countrySearchTerm && (
                    <button
                      onClick={() => setCountrySearchTerm("")}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 sm:right-4"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-center text-xs text-gray-500 sm:text-sm">
                  Found {filteredCountries.length} of {allCountries.length}{" "}
                  countries
                </p>
              </div>

              {/* Countries Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCountries.map((country) => {
                  const visaCount = getVisaCount(country.name);
                  const hasVisa = visaCount > 0;

                  return (
                    <div
                      key={country._id}
                      onClick={() => handleCountryCardClick(country.name)}
                      className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:shadow-xl sm:rounded-xl ${
                        hasVisa
                          ? "border-blue-200 bg-white hover:border-blue-400"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {/* Country Image */}
                      <div className="relative h-48 w-full overflow-hidden sm:h-56">
                        {country.imageUrl ? (
                          <Image
                            src={country.imageUrl}
                            alt={country.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                            <MapPin className="h-16 w-16 text-blue-400" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                        {/* Country Name Overlay */}
                        <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-4">
                          <h3 className="text-lg font-bold text-white drop-shadow-lg sm:text-xl">
                            {country.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading State for Countries */}
              {isLoadingCountries && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">Loading countries...</p>
                </div>
              )}

              {/* Empty State - No countries found */}
              {!isLoadingCountries && filteredCountries.length === 0 && (
                <div className="rounded-lg bg-gray-50 py-12 text-center">
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
                  <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                    {countrySearchTerm
                      ? "No Countries Found"
                      : "No Visa Information Available"}
                  </h3>
                  <p className="px-4 text-xs text-gray-500 sm:text-sm">
                    {countrySearchTerm
                      ? `No countries with visa information match "${countrySearchTerm}"`
                      : "No countries have visa information available yet. Please check back later or contact us."}
                  </p>
                  {countrySearchTerm && (
                    <button
                      onClick={() => setCountrySearchTerm("")}
                      className="mt-4 text-xs text-blue-600 hover:text-blue-700 sm:text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Select Country & Visa Types - Show only when country is selected */}
          {countryName && (
            <div className="grid grid-cols-1 gap-4 px-2 sm:gap-6 sm:px-0 lg:grid-cols-2">
              {/* Left: Available Visa Types or Message */}
              {backendVisaData ? (
                <div className="rounded-lg bg-blue-50 p-3 shadow-md sm:p-4">
                  <h3 className="mb-2 text-base font-semibold text-blue-700 sm:mb-3 sm:text-lg">
                    Available Visa Types:
                  </h3>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {backendVisaData.visaTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 capitalize shadow-sm sm:px-4 sm:py-2 sm:text-base"
                      >
                        {typeof type === "string"
                          ? type
                          : type?.name || "Unknown"}
                      </span>
                    ))}
                  </div>

                  {/* Processing Time Info */}
                  {backendVisaData.processing_time && (
                    <div className="mt-3 border-t border-blue-200 pt-3">
                      <div className="mb-1 flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-blue-700">
                          Processing Time
                        </p>
                      </div>
                      <p className="text-base font-bold text-blue-600">
                        {backendVisaData.processing_time}
                      </p>
                    </div>
                  )}
                </div>
              ) : countryName && !isVisaLoading && !isVisaFetching ? (
                /* No visa data found message */
                <div className="rounded-lg bg-orange-50 p-4 text-center shadow-md sm:p-6">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 sm:mb-4 sm:h-12 sm:w-12">
                    <svg
                      className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">
                    Visa Information Not Available
                  </h3>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    We currently don&apos;t have visa information for{" "}
                    <span className="font-semibold">
                      {countryData?.name?.common || countryName}
                    </span>
                    .
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500 sm:mt-2 sm:text-xs">
                    Please contact us or try another country.
                  </p>
                </div>
              ) : (
                /* Empty state - no country selected */
                <div className="flex items-center justify-center rounded-lg bg-blue-50 p-4 text-center shadow-md sm:p-6">
                  <p className="text-sm text-gray-500 sm:text-base">
                    Select a country to view visa information 👉
                  </p>
                </div>
              )}

              {/* Right: Country Search Section */}
              <div className="rounded-lg bg-blue-50 p-3 shadow-md sm:p-4">
                <h3 className="mb-2 text-base font-semibold text-blue-700 sm:mb-3 sm:text-lg">
                  Select Country:
                </h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <EnhancedDropdown
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                    placeholder="Select destination country"
                    countries={allCountries}
                    isLoading={isLoadingCountries}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!selectedCountry || loading || isVisaLoading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
                  >
                    {loading || isVisaLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          Search Visa Information
                        </span>
                        <span className="sm:hidden">Search Visa</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show documents and payment sections only if backend data exists */}
          {backendVisaData && countryName && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 px-2 sm:mt-6 sm:gap-6 sm:px-0 md:mt-8 lg:grid-cols-3">
                {/* Left: Required Documents */}
                <div className="lg:col-span-2">
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 shadow-lg sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-4 border-b border-blue-200 pb-3 sm:mb-6 sm:pb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                          <svg
                            className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
                            {countryData ? countryData.name?.common : "Country"}{" "}
                            Visa
                          </h2>
                          <p className="text-xs text-gray-600 sm:text-sm">
                            Required Documents
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents List */}
                    {backendVisaData.required_document && (
                      <div className="mb-6">
                        <div
                          className="prose prose-sm md:prose-base max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: backendVisaData.required_document,
                          }}
                        />
                      </div>
                    )}

                    {/* Important Note */}
                    <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 shadow-sm">
                      <div className="flex gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-semibold text-amber-800">
                            Important Note:
                          </p>
                          <p className="mt-1 text-sm text-amber-700">
                            All scanned documents must be in color copy. Black &
                            White documents are not accepted.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons & Payment Info */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Visa Action Buttons Card */}
                  <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-lg sm:p-6">
                    <div className="mb-3 text-center sm:mb-4">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white sm:mb-3 sm:h-12 sm:w-12">
                        <svg
                          className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-white sm:text-lg">
                        Choose Your Action
                      </h3>
                      <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                        <span className="hidden sm:inline">
                          Query for information or apply with payment
                        </span>
                        <span className="sm:hidden">Query or Apply</span>
                      </p>
                    </div>

                    {/* Two Buttons Side by Side */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3">
                      <button
                        onClick={handleQueryClick}
                        className="rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg sm:px-4 sm:py-3 sm:text-base"
                      >
                        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                          <svg
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Query</span>
                        </div>
                      </button>

                      <button
                        onClick={handleApplyClick}
                        className="rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg sm:px-4 sm:py-3 sm:text-base"
                      >
                        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                          <svg
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Apply</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Info Card */}
                  <div className="rounded-lg bg-white p-4 shadow-lg sm:p-6">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <svg
                        className="h-4 w-4 text-green-600 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                        Payment Info
                      </h3>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 sm:p-4">
                      <p className="text-xs text-gray-600 sm:text-sm">
                        Processing Fee
                      </p>
                      <p className="mt-1 text-2xl font-bold text-green-600 sm:text-3xl">
                        {backendVisaData.processingFee?.toLocaleString() ||
                          "N/A"}{" "}
                        <span className="text-lg sm:text-xl">Tk</span>
                      </p>
                    </div>

                    {/* Processing Time */}
                    {backendVisaData.processing_time && (
                      <div className="mt-3 rounded-lg bg-blue-50 p-3 sm:mt-4 sm:p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-xs font-medium text-gray-600 sm:text-sm">
                            Processing Time
                          </p>
                        </div>
                        <p className="text-lg font-bold text-blue-600 sm:text-xl">
                          {backendVisaData.processing_time}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 rounded-lg bg-gray-50 p-2.5 sm:mt-4 sm:p-3">
                      <p className="text-[10px] text-gray-600 sm:text-xs">
                        💳 Multiple payment methods available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Wrap with Suspense for useSearchParams
export default function VisaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <CountryInfo />
    </Suspense>
  );
}
