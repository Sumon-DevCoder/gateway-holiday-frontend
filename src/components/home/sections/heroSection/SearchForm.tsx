"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  useGetCountriesWithToursQuery,
  useGetCountriesWithVisasQuery,
} from "@/redux/api/features/country/countryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Car,
  Check,
  ChevronDown,
  FileText,
  MapPin,
  Plane,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema - make fields optional since we validate based on active tab
const searchFormSchema = z.object({
  // Tour - country ID from database
  countryId: z.string().optional(),

  // Visa - country name
  visaCountry: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchFormSchema>;

// Enhanced Dropdown Component
interface EnhancedDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { id: number | string; en: string; bn?: string }[];
  error?: string | undefined;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  useNameAsValue?: boolean; // If true, use 'en' name instead of 'id' as value
}

function EnhancedDropdown({
  value,
  onValueChange,
  placeholder,
  options,
  error,
  disabled = false,
  className,
  isLoading = false,
  useNameAsValue = false,
}: EnhancedDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.en.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOption = options.find((option) =>
    useNameAsValue
      ? option.en === value
      : option.id === value || option.en === value
  );

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between rounded-lg border bg-white py-3 pr-2 pl-3 text-left font-normal shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:pr-3 sm:pl-10",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200",
              !selectedOption && "text-gray-500",
              open && "border-blue-500 shadow-md"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <MapPin className="hidden h-4 w-4 flex-shrink-0 text-gray-400 sm:block" />
              <span className="truncate text-sm sm:text-base">
                {selectedOption ? selectedOption.en : placeholder}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "ml-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 sm:ml-2",
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
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-10 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Search className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  No {placeholder.toLowerCase()} found.
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onValueChange(
                          useNameAsValue ? option.en : String(option.id)
                        );
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-blue-50 hover:shadow-sm",
                        (useNameAsValue
                          ? value === option.en
                          : value === String(option.id) ||
                            value === option.en) &&
                          "bg-blue-50 shadow-sm ring-1 ring-blue-200"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 flex-shrink-0 text-blue-600 transition-opacity",
                          useNameAsValue
                            ? value === option.en
                              ? "opacity-100"
                              : "opacity-0"
                            : value === String(option.id) || value === option.en
                              ? "opacity-100"
                              : "opacity-0"
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function SearchForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "tour" | "visa" | "hotel" | "ride"
  >("tour");

  // Fetch countries with published tours
  const { data: tourCountriesData, isLoading: isLoadingTourCountries } =
    useGetCountriesWithToursQuery();

  // Fetch countries with active visas
  const { data: visaCountriesData, isLoading: isLoadingVisaCountries } =
    useGetCountriesWithVisasQuery();

  // Transform tour countries for dropdown
  const tourCountryOptions =
    tourCountriesData?.data?.map((country) => ({
      id: country._id || "",
      en: country.name,
    })) || [];

  // Transform visa countries for dropdown
  const visaCountryOptions =
    visaCountriesData?.data?.map((country) => ({
      id: country._id || "",
      en: country.name,
    })) || [];

  // React Hook Form setup
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      countryId: "",
      visaCountry: "",
    },
  });

  // Clear errors when switching tabs
  useEffect(() => {
    form.clearErrors();
  }, [activeTab, form]);

  // Form submission handler
  const onSubmit = (data: SearchFormData) => {
    // Handle navigation based on active tab
    if (activeTab === "visa") {
      if (data.visaCountry && data.visaCountry.trim() !== "") {
        // Track search event
        const selectedCountry = visaCountryOptions.find(
          (c) => c.id === data.visaCountry
        );
        analytics.trackSearch(
          selectedCountry?.en || data.visaCountry,
          "visa"
        );
        
        // Navigate to visa page with country name
        router.push(`/visa?country=${encodeURIComponent(data.visaCountry)}`);
      } else {
        form.setError("visaCountry", {
          type: "manual",
          message: "Please select a country",
        });
      }
    } else if (activeTab === "tour") {
      if (data.countryId && data.countryId.trim() !== "") {
        // Track search event
        const selectedCountry = tourCountryOptions.find(
          (c) => c.id === data.countryId
        );
        analytics.trackSearch(
          selectedCountry?.en || data.countryId,
          "package"
        );
        
        // Navigate to package-details page with country ID
        router.push(`/package-details?country=${data.countryId}`);
      } else {
        form.setError("countryId", {
          type: "manual",
          message: "Please select a country",
        });
      }
    }
  };

  const tabs = [
    { id: "tour" as const, label: "Tour", icon: Plane },
    { id: "visa" as const, label: "Visa", icon: FileText },
    { id: "hotel" as const, label: "Hotel", icon: Building2 },
    { id: "ride" as const, label: "Transport", icon: Car },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl rounded-lg bg-white p-4 shadow-lg sm:rounded-2xl sm:p-6 sm:shadow-2xl">
      {/* Tabs */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "tour" | "visa" | "hotel" | "ride")
          }
          className="mb-4 sm:mb-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs sm:flex-row sm:gap-2 sm:py-3 sm:text-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tour Tab */}
          <TabsContent value="tour" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Country <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 sm:gap-3">
                <Controller
                  name="countryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <EnhancedDropdown
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select country"
                      options={tourCountryOptions}
                      error={fieldState.error?.message}
                      isLoading={isLoadingTourCountries}
                      className="flex-1"
                    />
                  )}
                />
                <Button
                  type="submit"
                  className="h-[35px] flex-shrink-0 rounded-lg bg-blue-600 px-4 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl sm:px-6"
                >
                  <Search className="h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Visa Tab */}
          <TabsContent value="visa" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Country <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 sm:gap-3">
                <Controller
                  name="visaCountry"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <EnhancedDropdown
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select country"
                      options={visaCountryOptions}
                      error={fieldState.error?.message}
                      useNameAsValue={true}
                      isLoading={isLoadingVisaCountries}
                      className="flex-1"
                    />
                  )}
                />
                <Button
                  type="submit"
                  className="h-[35px] flex-shrink-0 rounded-lg bg-blue-600 px-4 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl sm:px-6"
                >
                  <Search className="h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Hotel Tab - UI Only */}
          <TabsContent value="hotel" className="space-y-4">
            <div className="flex items-center justify-center text-center">
              <div className="text-gray-500">
                <h3 className="mt-3 text-lg font-semibold">Hotel Booking</h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </div>
          </TabsContent>

          {/* Transport Tab - UI Only */}
          <TabsContent value="ride" className="space-y-4">
            <div className="flex items-center justify-center text-center">
              <div className="text-gray-500">
                <h3 className="mt-3 text-lg font-semibold">
                  Transport Services
                </h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
