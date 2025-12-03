"use client";

import PageHeader from "@/components/admin/PageHeader";
import VisasDataTable from "@/components/admin/VisasDataTable";
import DynamicRichTextEditor from "@/components/CustomFormComponents/DynamicRichTextEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useGetCountriesQuery } from "@/redux/api/features/country/countryApi";
import {
  useCreateVisaMutation,
  useDeleteVisaMutation,
  useGetAllVisasQuery,
  useReorderVisasMutation,
  useUpdateVisaMutation,
} from "@/redux/api/features/visa/visaApi";
import { useGetActiveVisaTypesQuery } from "@/redux/api/features/visaType/visaTypeApi";
import { CreateVisaFormData, createVisaSchema } from "@/schema/visaSchema";
import { ICountryVisa } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  FileText,
  Globe,
  Loader2,
  Plus,
  Save,
  Search,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Searchable Country Dropdown Component
const SearchableCountryDropdown = ({
  value,
  countryId,
  onValueChange,
  placeholder,
}: {
  value: string;
  countryId?: string;
  onValueChange: (countryName: string, countryId: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch countries from backend
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountriesQuery({
      page: 1,
      limit: 1000, // Get all countries
    });

  const countryOptions = countriesResponse?.data || [];

  const filteredCountries = countryOptions.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedCountry = countryOptions.find(
    (country) => country._id === countryId || country.name === value
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
              {isLoadingCountries ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                  Loading countries...
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Search className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  No countries found.
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country._id}
                      type="button"
                      onClick={() => {
                        onValueChange(country.name, country._id!);
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

// Dynamic visa types - will be fetched from API

export default function VisaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // RTK Query hooks
  const {
    data: visasResponse,
    isLoading,
    error,
    refetch: refetchVisas,
  } = useGetAllVisasQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
  });
  const { data: visaTypesResponse, isLoading: isLoadingVisaTypes } =
    useGetActiveVisaTypesQuery();
  const [createVisa, { isLoading: isCreating }] = useCreateVisaMutation();
  const [updateVisa, { isLoading: isUpdating }] = useUpdateVisaMutation();
  const [deleteVisa, { isLoading: isDeleting }] = useDeleteVisaMutation();
  const [reorderVisas, { isLoading: isReordering }] = useReorderVisasMutation();

  const visas = visasResponse?.data || [];
  const pagination = visasResponse?.pagination;
  const dynamicVisaTypes = Array.isArray(visaTypesResponse)
    ? visaTypesResponse
    : [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<ICountryVisa | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visaToDelete, setVisaToDelete] = useState<ICountryVisa | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<ICountryVisa | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [visasOrder, setVisasOrder] = useState<ICountryVisa[]>([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateVisaFormData>({
    resolver: zodResolver(createVisaSchema),
    defaultValues: {
      countryName: "",
      visaTypes: [],
      processingFee: "",
      processing_time: "",
      required_document: "",
    },
  });

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Sort visas by order
  useEffect(() => {
    if (visas.length > 0) {
      const sortedVisas = [...visas].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA === orderB) {
          return (a.countryName || "").localeCompare(b.countryName || "");
        }
        return orderA - orderB;
      });
      setVisasOrder(sortedVisas);
    } else {
      setVisasOrder([]);
    }
  }, [visas]);

  // Filter visas based on status (search is handled by backend)
  const filteredVisas = visasOrder.filter((visa) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && visa.isActive) ||
      (statusFilter === "inactive" && !visa.isActive);
    return matchesStatus;
  });

  const isReorderDisabled =
    searchTerm.trim().length > 0 || statusFilter !== "all";

  // Calculate stats - use pagination total if available, otherwise use current page data
  const stats = {
    total: pagination?.total || visas.length,
    active: visas.filter((v) => v.isActive).length,
    inactive: visas.filter((v) => !v.isActive).length,
    avgFee:
      visas.length > 0
        ? Math.round(
            visas.reduce((sum, v) => sum + (v.processingFee || 0), 0) /
              visas.length
          )
        : 0,
  };

  const handleSubmit = async (data: CreateVisaFormData) => {
    try {
      const visaData: any = {
        countryName: data.countryName.trim(), // Always send countryName as required by backend validation
        visaTypes: data.visaTypes,
        isActive: true,
      };

      if (data.processingFee) {
        visaData.processingFee = parseFloat(data.processingFee);
      }

      if (data.processing_time) {
        visaData.processing_time = data.processing_time.trim();
      }

      if (data.required_document) {
        visaData.required_document = data.required_document;
      }

      if (editingVisa) {
        // Update existing visa
        await updateVisa({
          id: editingVisa._id!,
          visaData,
        }).unwrap();
        toast.success("Visa information updated successfully");
      } else {
        // Create new visa
        await createVisa(visaData).unwrap();
        toast.success("Visa information created successfully");
      }

      // Only reset form and close dialog on success
      handleCloseDialog();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (editingVisa
            ? "Failed to update visa information"
            : "Failed to create visa information")
      );
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEdit = (visa: ICountryVisa) => {
    setEditingVisa(visa);
    setValue("countryName", visa.countryName);
    setValue(
      "visaTypes",
      visa.visaTypes && visa.visaTypes.length > 0
        ? visa.visaTypes.map((type) =>
            typeof type === "string" ? type : type.name
          )
        : []
    );
    setValue("processingFee", visa.processingFee?.toString() || "");
    setValue("processing_time", visa.processing_time || "");
    setValue("required_document", visa.required_document || "");
    // Reset country selection
    setSelectedCountryId("");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (visa: ICountryVisa) => {
    setVisaToDelete(visa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!visaToDelete) return;

    try {
      await deleteVisa(visaToDelete._id!).unwrap();
      toast.success("Visa information deleted successfully");
      setDeleteDialogOpen(false);
      setVisaToDelete(null);
    } catch (error) {
      toast.error("Failed to delete visa information");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVisaToDelete(null);
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    if (isReorderDisabled) {
      toast.error("Reordering is disabled while filters or search are active.");
      return;
    }

    const previousOrder = visasOrder;
    const updatedOrder = [...visasOrder];
    const [movedVisa] = updatedOrder.splice(startIndex, 1);

    if (!movedVisa) {
      return;
    }

    updatedOrder.splice(endIndex, 0, movedVisa);
    setVisasOrder(updatedOrder);

    try {
      const visaIds = updatedOrder
        .map((visa) => visa._id)
        .filter((id): id is string => Boolean(id));

      if (visaIds.length !== updatedOrder.length) {
        throw new Error("Some visas are missing identifiers.");
      }

      await reorderVisas({ visaIds }).unwrap();
      toast.success("Visa order updated successfully");
      refetchVisas();
    } catch (error: any) {
      setVisasOrder([...previousOrder]);
      toast.error(
        error?.data?.message || "Failed to update visa order. Please try again."
      );
    }
  };

  const handleViewDetails = (visa: ICountryVisa) => {
    setSelectedVisa(visa);
    setViewDetailsOpen(true);
  };

  const handleAddNew = () => {
    setEditingVisa(null);
    setSelectedCountryId("");
    reset();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVisa(null);
    setSelectedCountryId("");
    reset();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Visa Information"
          description="Manage visa requirements and processing information for different countries"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Visa Information"
          description="Manage visa requirements and processing information for different countries"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-500">
              Failed to load visa information. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visa Information"
        description="Manage visa requirements and processing information for different countries"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Visas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">{stats.active}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Visas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Processing Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div className="text-2xl font-bold">
                {stats.avgFee.toLocaleString()}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">BDT</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card with Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Visa Information</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Manage visa requirements for different countries
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  // Only reset when manually closing (not on error)
                  handleCloseDialog();
                } else {
                  setIsDialogOpen(open);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visa Info
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingVisa
                      ? "Edit Visa Information"
                      : "Add New Visa Information"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleFormSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="countryName">
                      Select Country <span className="text-red-500">*</span>
                    </Label>
                    <SearchableCountryDropdown
                      value={watch("countryName")}
                      countryId={selectedCountryId}
                      onValueChange={(countryName, countryId) => {
                        setValue("countryName", countryName);
                        setSelectedCountryId(countryId);
                      }}
                      placeholder="Search and select a country"
                    />
                    {errors.countryName && (
                      <p className="text-sm text-red-500">
                        {errors.countryName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Visa Types <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {isLoadingVisaTypes ? (
                        <div className="col-span-full flex items-center justify-center py-4">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-500">
                            Loading visa types...
                          </span>
                        </div>
                      ) : dynamicVisaTypes.length === 0 ? (
                        <div className="col-span-full py-4 text-center text-sm text-gray-500">
                          No visa types available
                        </div>
                      ) : (
                        dynamicVisaTypes.map((visaType) => (
                          <div
                            key={
                              typeof visaType === "string"
                                ? visaType
                                : visaType._id
                            }
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={
                                typeof visaType === "string"
                                  ? visaType
                                  : visaType._id
                              }
                              checked={
                                watch("visaTypes")?.includes(
                                  typeof visaType === "string"
                                    ? visaType
                                    : visaType.name
                                ) || false
                              }
                              onChange={(e) => {
                                const currentTypes = watch("visaTypes") || [];
                                const typeValue =
                                  typeof visaType === "string"
                                    ? visaType
                                    : visaType.name;
                                if (e.target.checked) {
                                  if (!currentTypes.includes(typeValue)) {
                                    setValue("visaTypes", [
                                      ...currentTypes,
                                      typeValue,
                                    ]);
                                  }
                                } else {
                                  setValue(
                                    "visaTypes",
                                    currentTypes.filter(
                                      (type) => type !== typeValue
                                    )
                                  );
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={
                                typeof visaType === "string"
                                  ? visaType
                                  : visaType._id
                              }
                              className="cursor-pointer text-sm font-medium text-gray-700 capitalize"
                            >
                              {typeof visaType === "string"
                                ? visaType
                                : visaType.name}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {errors.visaTypes && (
                      <p className="text-sm text-red-500">
                        {errors.visaTypes.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingFee">
                      Processing Fee (BDT) (Optional)
                    </Label>
                    <Input
                      id="processingFee"
                      type="number"
                      placeholder="Enter processing fee"
                      {...register("processingFee")}
                      className={errors.processingFee ? "border-red-500" : ""}
                    />
                    {errors.processingFee && (
                      <p className="text-sm text-red-500">
                        {errors.processingFee.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processing_time">
                      Processing Time (Optional)
                    </Label>
                    <Input
                      id="processing_time"
                      type="text"
                      placeholder="e.g., 7-10 business days"
                      {...register("processing_time")}
                      className={errors.processing_time ? "border-red-500" : ""}
                    />
                    {errors.processing_time && (
                      <p className="text-sm text-red-500">
                        {errors.processing_time.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="required_document">
                      Required Documents (Optional)
                    </Label>
                    <DynamicRichTextEditor
                      name="required_document"
                      label=""
                      content={watch("required_document") || ""}
                      onChangeHandler={(content) =>
                        setValue("required_document", content)
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isCreating || isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating || isUpdating}>
                      {isCreating || isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingVisa ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingVisa ? "Update" : "Add"} Visa Info
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <VisasDataTable
            visas={filteredVisas}
            onView={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onReorder={handleReorder}
            isDeleting={isDeleting}
            isReordering={isReordering}
            enableReorder={!isReorderDisabled}
          />

          {isReorderDisabled && filteredVisas.length > 0 && (
            <Card>
              <CardContent className="border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
                Drag-and-drop ordering is available only when viewing all visas
                without filters or search. Clear filters to reorder.
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredVisas.length} of {pagination.total} visas
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="flex items-center px-3 py-1 text-sm">
                  Page {pagination.page || currentPage} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage >= pagination.pages || isLoading
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              {selectedVisa?.countryName}
            </DialogTitle>
          </DialogHeader>
          {selectedVisa && (
            <div className="space-y-6">
              {/* Visa Types */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Shield className="h-4 w-4" />
                  Visa Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedVisa.visaTypes || []).map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {typeof type === "string"
                        ? type
                        : type?.name || "Unknown"}
                    </Badge>
                  ))}
                  {(!selectedVisa.visaTypes ||
                    selectedVisa.visaTypes.length === 0) && (
                    <Badge
                      variant="secondary"
                      className="text-sm text-gray-400"
                    >
                      No visa types
                    </Badge>
                  )}
                </div>
              </div>

              {/* Processing Fee */}
              {selectedVisa.processingFee && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign className="h-4 w-4" />
                    Processing Fee
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedVisa.processingFee.toLocaleString()} BDT
                  </p>
                </div>
              )}

              {/* Processing Time */}
              {selectedVisa.processing_time && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="h-4 w-4" />
                    Processing Time
                  </h3>
                  <p className="text-lg font-medium text-blue-600">
                    {selectedVisa.processing_time}
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {selectedVisa.required_document && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" />
                    Required Documents
                  </h3>
                  <div
                    className="prose max-w-none rounded-lg border bg-gray-50 p-4 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: selectedVisa.required_document,
                    }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(selectedVisa.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">
                      {new Date(selectedVisa.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      variant={selectedVisa.isActive ? "default" : "secondary"}
                    >
                      {selectedVisa.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setViewDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setViewDetailsOpen(false);
                    handleEdit(selectedVisa);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              visa information for <strong>{visaToDelete?.countryName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
