"use client";

import CountriesDataTable from "@/components/admin/CountriesDataTable";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCountryMutation,
  useCreateCountryWithImagesMutation,
  useDeleteCountryMutation,
  useGetCountriesQuery,
  useReorderCountriesMutation,
  useUpdateCountryMutation,
  useUpdateCountryWithImagesMutation,
} from "@/redux/api/features/country/countryApi";
import { useGetToursQuery } from "@/redux/api/features/tour/tourApi";
import { useGetAllVisasQuery } from "@/redux/api/features/visa/visaApi";
import {
  CreateCountryFormData,
  createCountrySchema,
} from "@/schema/countrySchema";
import { CreateCountryData, ICountry } from "@/types/country";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  Globe,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import countries from "world-countries";

// Transform world-countries data for dropdown
const countryOptions = countries.map((country, index) => ({
  id: index + 1,
  name: country.name.common,
}));

// Searchable Country Dropdown Component
const SearchableCountryDropdown = ({
  value,
  onValueChange,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredCountries = countryOptions.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedCountry = countryOptions.find(
    (country) => country.name === value
  );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedCountry ? selectedCountry.name : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Search className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  No countries found.
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => {
                        onValueChange(country.name);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100"
                    >
                      {country.name}
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
};

export default function CountriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "top" | "regular">(
    "all"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<ICountry | null>(null);
  const [editingCountry, setEditingCountry] = useState<ICountry | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [countriesOrder, setCountriesOrder] = useState<ICountry[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [nameInputMode, setNameInputMode] = useState<"select" | "manual">(
    "select"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCountryFormData>({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      isTop: false,
    },
  });

  // RTK Query hooks
  const {
    data: countriesResponse,
    isLoading: isLoadingCountries,
    error: countriesError,
    refetch: refetchCountries,
  } = useGetCountriesQuery({
    page: currentPage,
    limit: 1000,
    ...(searchTerm && { search: searchTerm }),
    ...(filterStatus === "top" && { isTop: true }),
    ...(filterStatus === "regular" && { isTop: false }),
  });

  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [createCountryWithImages, { isLoading: isCreatingWithImages }] =
    useCreateCountryWithImagesMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();
  const [updateCountryWithImages, { isLoading: isUpdatingWithImages }] =
    useUpdateCountryWithImagesMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();
  const [reorderCountries, { isLoading: isReordering }] =
    useReorderCountriesMutation();

  // Fetch visas to calculate count per country
  const { data: visasResponse } = useGetAllVisasQuery({ page: 1, limit: 1000 });
  const visas = visasResponse?.data || [];

  // Fetch tours to calculate count per country
  const { data: toursResponse } = useGetToursQuery({
    limit: 1000,
    status: "PUBLISHED",
  });
  const tours = toursResponse?.data || [];

  // Calculate visa count per country
  const getVisaCount = (countryName: string) => {
    return visas.filter(
      (visa) =>
        visa.countryName.toLowerCase() === countryName.toLowerCase() &&
        visa.isActive
    ).length;
  };

  // Calculate tour count per country
  const getTourCount = (countryId: string) => {
    return tours.filter((tour) => {
      // Handle both populated and unpopulated destination
      if (typeof tour.destination === "string") {
        return tour.destination === countryId;
      } else if (tour.destination && typeof tour.destination === "object") {
        return tour.destination._id === countryId;
      }
      return false;
    }).length;
  };

  const pagination = countriesResponse?.pagination;
  useEffect(() => {
    if (countriesResponse?.data) {
      const sortedCountries = [...countriesResponse.data].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return (a.name || "").localeCompare(b.name || "");
        }
        return orderA - orderB;
      });
      setCountriesOrder(sortedCountries);
    } else {
      setCountriesOrder([]);
    }
  }, [countriesResponse?.data]);

  const isReorderDisabled =
    searchTerm.trim().length > 0 || filterStatus !== "all";

  const handleSubmit = async (data: CreateCountryFormData) => {
    // For new countries, require an image
    if (!editingCountry && !selectedFile) {
      toast.error("Please select an image for the country");
      return;
    }

    try {
      if (selectedFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("name", data.name);
        formDataToSend.append("image", selectedFile);
        formDataToSend.append("isTop", String(data.isTop || false));

        if (editingCountry) {
          // Update existing country with new image
          await updateCountryWithImages({
            id: editingCountry._id!,
            data: formDataToSend,
          }).unwrap();
          toast.success("Country updated successfully");
        } else {
          // Create new country with image
          await createCountryWithImages(formDataToSend).unwrap();
          toast.success("Country created successfully");
        }
      } else {
        // No new image selected
        if (editingCountry) {
          // Update existing country without new image - keep existing image
          const updateData = {
            name: data.name,
            imageUrl: editingCountry.imageUrl || "", // Keep existing image
            ...(data.isTop !== undefined && { isTop: data.isTop }),
          };
          await updateCountry({
            id: editingCountry._id!,
            data: updateData,
          }).unwrap();
          toast.success("Country updated successfully");
        } else {
          // Create new country without image
          const createData: CreateCountryData = {
            name: data.name,
            ...(data.isTop !== undefined && { isTop: data.isTop }),
          };
          await createCountry(createData).unwrap();
          toast.success("Country created successfully");
        }
      }

      // Only reset form and close dialog on success
      setIsDialogOpen(false);
      resetForm();
      refetchCountries();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save country");
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEdit = (country: ICountry) => {
    setEditingCountry(country);
    setValue("name", country.name);
    setValue("imageUrl", country.imageUrl || "");
    setValue("isTop", country.isTop || false);
    // Check if country name exists in package list
    const existsInPackage = countryOptions.some(
      (c) => c.name.toLowerCase() === country.name.toLowerCase()
    );
    setNameInputMode(existsInPackage ? "select" : "manual");
    // Clear selected file and preview when editing
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (country: ICountry) => {
    setCountryToDelete(country);
    setIsDeleteDialogOpen(true);
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    if (isReorderDisabled) {
      toast.error("Reordering is disabled while filters or search are active.");
      return;
    }

    const previousOrder = countriesOrder;
    const updatedOrder = [...countriesOrder];
    const [movedCountry] = updatedOrder.splice(startIndex, 1);

    if (!movedCountry) {
      return;
    }

    updatedOrder.splice(endIndex, 0, movedCountry);
    setCountriesOrder(updatedOrder);

    try {
      const countryIds = updatedOrder
        .map((country) => country._id)
        .filter((id): id is string => Boolean(id));

      if (countryIds.length !== updatedOrder.length) {
        throw new Error("Some countries are missing identifiers.");
      }

      await reorderCountries({ countryIds }).unwrap();
      toast.success("Country order updated successfully");
      refetchCountries();
    } catch (error: any) {
      setCountriesOrder([...previousOrder]);
      toast.error(
        error?.data?.message ||
          "Failed to update country order. Please try again."
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!countryToDelete) return;

    // Check if country has associated visas
    const visaCount = getVisaCount(countryToDelete.name);
    if (visaCount > 0) {
      toast.error(
        `Cannot delete country. There are ${visaCount} visa(s) associated with this country. Please delete the visas first.`
      );
      return;
    }

    try {
      await deleteCountry(countryToDelete._id!).unwrap();
      toast.success("Country deleted successfully");
      refetchCountries();
      setIsDeleteDialogOpen(false);
      setCountryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete country");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setCountryToDelete(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingCountry(null);
    reset();
    setSelectedFile(null);
    setPreviewUrl("");
    setNameInputMode("select");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (value: "all" | "top" | "regular") => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Image upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image file must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoadingCountries) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Countries Management"
          description="Manage countries and their images"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (countriesError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Countries Management"
          description="Manage countries and their images"
        />
        <div className="py-8 text-center">
          <p className="text-red-600">Failed to load countries</p>
          <Button onClick={() => refetchCountries()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Countries Management"
        description="Manage countries and their images"
      />

      {/* Search and Actions */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdown */}
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              handleFilterChange(value as "all" | "top" | "regular")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="top">Top Countries</SelectItem>
              <SelectItem value="regular">Regular Countries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Only reset when manually closing (not on error)
              resetForm();
              setIsDialogOpen(false);
            } else {
              setIsDialogOpen(open);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? "Edit Country" : "Add New Country"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleFormSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Country Name Section */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">
                  Country Name <span className="text-red-500">*</span>
                </Label>

                {/* Input Mode Selection */}
                <div className="flex gap-4 rounded-lg border p-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="nameInputMode"
                      value="select"
                      checked={nameInputMode === "select"}
                      onChange={(e) => {
                        setNameInputMode("select");
                        if (e.target.checked) {
                          setValue("name", "");
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">
                      Select from List
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="nameInputMode"
                      value="manual"
                      checked={nameInputMode === "manual"}
                      onChange={(e) => {
                        setNameInputMode("manual");
                        if (e.target.checked) {
                          setValue("name", "");
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Type Manually</span>
                  </label>
                </div>

                {/* Conditional Input Field */}
                {nameInputMode === "select" ? (
                  <>
                    <SearchableCountryDropdown
                      value={watch("name")}
                      onValueChange={(value) => setValue("name", value)}
                      placeholder="Select a country"
                    />
                    <p className="text-xs text-gray-500">
                      Choose from 249+ countries worldwide
                    </p>
                  </>
                ) : (
                  <>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter country name manually"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Type any country name that is not available in the list
                    </p>
                  </>
                )}

                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Top Country Toggle */}
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  id="isTop"
                  {...register("isTop")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="isTop"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Mark as Top Country
                  </Label>
                  <p className="text-xs text-gray-500">
                    Featured countries will be highlighted and prioritized in
                    listings
                  </p>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  {editingCountry
                    ? "Upload New Image (Optional)"
                    : "Upload Image"}
                </Label>

                {/* File Input */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {editingCountry
                      ? "Select New Image (Max 5MB)"
                      : "Select Image (Max 5MB)"}
                  </Button>

                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove Selected Image
                    </Button>
                  )}
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Selected Image</Label>
                    <div className="relative inline-block">
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute right-0 bottom-0 left-0 truncate rounded-b bg-black/50 px-1 text-xs text-white">
                        {selectedFile?.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Image for Edit Mode */}
                {editingCountry && editingCountry.imageUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Current Image</Label>
                    <div className="relative inline-block">
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                        <Image
                          src={editingCountry.imageUrl}
                          alt="Current"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {selectedFile ? (
                      <p className="text-sm text-amber-600">
                        ⚠️ New image will replace current image
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Upload new image above to replace current one
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isCreating ||
                    isUpdating ||
                    isCreatingWithImages ||
                    isUpdatingWithImages
                  }
                >
                  {isCreating ||
                  isUpdating ||
                  isCreatingWithImages ||
                  isUpdatingWithImages ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isCreating ||
                  isUpdating ||
                  isCreatingWithImages ||
                  isUpdatingWithImages
                    ? "Saving..."
                    : editingCountry
                      ? "Update Country"
                      : "Create Country"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Country
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                      {countryToDelete?.name}
                    </span>
                    ?
                  </p>
                  {countryToDelete &&
                    getVisaCount(countryToDelete.name) > 0 && (
                      <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
                        ⚠️ Warning: This country has{" "}
                        {getVisaCount(countryToDelete.name)} associated visa(s).
                        Deletion will be prevented.
                      </p>
                    )}
                  <p className="mt-1 text-xs text-red-600">
                    This action cannot be undone. All data related to this
                    country will be permanently deleted.
                  </p>
                </div>
              </div>

              {countryToDelete?.imageUrl && (
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="mb-2 text-xs font-medium text-gray-700">
                    Current Image:
                  </p>
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                    <Image
                      src={countryToDelete.imageUrl}
                      alt={countryToDelete.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Country
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Countries Display - Table Only */}
      <CountriesDataTable
        countries={countriesOrder}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onReorder={handleReorder}
        isDeleting={isDeleting}
        isReordering={isReordering}
        enableReorder={!isReorderDisabled}
        getTourCount={getTourCount}
        getVisaCount={getVisaCount}
      />

      {isReorderDisabled && countriesOrder.length > 0 && (
        <Card>
          <CardContent className="border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
            Drag-and-drop ordering is available only when viewing all countries
            without filters or search. Clear filters to reorder.
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {countriesOrder.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Countries Found
            </h3>
            <p className="mb-4 text-gray-500">
              {searchTerm
                ? "No countries match your search criteria"
                : "Get started by adding your first country"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {countriesOrder.length} of {pagination.total} countries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.prev!)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.next!)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
