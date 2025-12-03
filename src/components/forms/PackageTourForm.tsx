"use client";
import { useQuerySubmit } from "@/hooks/useQuery";
import { analytics } from "@/lib/analytics";
import {
  PackageTourFormData,
  packageTourSchema,
} from "@/lib/validations/query";
import { useCurrentUser } from "@/redux/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

export default function PackageTourForm() {
  const { loading, submitQuery } = useQuerySubmit();
  const authUser = useSelector(useCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
    reset,
    setValue,
    getValues,
  } = useForm<PackageTourFormData>({
    resolver: zodResolver(packageTourSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      startingDate: "",
      returnDate: "",
      visitingCountry: "",
      persons: 1,
      needsVisa: "no",
      visitingCities: "",
      airlineTicketCategory: "",
      specialRequirements: "",
    },
  });

  //   const formData = watch();

  // Auto-fill from logged-in user
  useEffect(() => {
    if (!authUser) return;
    const { name, email, contactNumber } = getValues();
    if (!name && authUser.name) {
      setValue("name", authUser.name);
    }
    if (!email && authUser.email) {
      setValue("email", authUser.email);
    }
    if (!contactNumber && authUser.phone) {
      setValue("contactNumber", authUser.phone);
    }
  }, [authUser, getValues, setValue]);

  const onSubmit = async (data: PackageTourFormData) => {
    try {
      await submitQuery(data, "package_tour");
      
      // Track successful form submission
      analytics.trackFormSubmit("Package Tour Query", true, {
        email: data.email,
        contact_number: data.contactNumber,
        visiting_country: data.visitingCountry,
        persons: data.persons,
        needs_visa: data.needsVisa,
      });
      
      reset();
    } catch (error: any) {
      // Track failed form submission
      analytics.trackFormSubmit("Package Tour Query", false);
      analytics.trackError(
        error?.message || "Package Tour query submission failed",
        "package_tour_form"
      );
    }
  };

  return (
    <>
      <div className="mx-auto mb-8 rounded-md p-2 md:max-w-2xl lg:max-w-4xl">
        <div className="mx-auto max-w-7xl">
          <div className="mt-8 rounded-xl bg-purple-900 p-4 shadow-xl sm:mt-12 sm:p-6 lg:mt-24 lg:p-8">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Package Tour Booking Form
              </h1>
              <p className="text-sm text-blue-100 sm:text-base">
                Fill out the details below to get your personalized quote
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                {/* Basic Information */}
                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("contactNumber")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Starting Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("startingDate")}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  {errors.startingDate && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.startingDate.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Return Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("returnDate")}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  {errors.returnDate && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.returnDate.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Airline Ticket Category{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    {...register("airlineTicketCategory")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  >
                    <option value="">Select an option</option>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first_class">First Class</option>
                  </select>
                  {errors.airlineTicketCategory && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.airlineTicketCategory.message}
                    </p>
                  )}
                </div>

                {/* Destination Fields */}
                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Visiting Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("visitingCountry")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter visiting country"
                  />
                  {errors.visitingCountry && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.visitingCountry.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Visiting Cities{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    {...register("visitingCities")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter visiting cities"
                  />
                  {errors.visitingCities && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.visitingCities.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Number of Persons <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("persons", { valueAsNumber: true })}
                    min="1"
                    max="100"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter number of persons"
                  />
                  {errors.persons && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.persons.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Visa Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("needsVisa")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  {errors.needsVisa && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.needsVisa.message}
                    </p>
                  )}
                </div>

                {/* Special Requirements */}
                <div className="mb-6 px-3 md:col-span-2 xl:col-span-3">
                  <label className="mb-2 block text-xs font-bold text-white sm:text-sm">
                    Special Requirements{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={8}
                    {...register("specialRequirements")}
                    className="block w-full resize-none rounded-lg border border-gray-300 bg-white p-4 text-sm text-gray-700 placeholder:text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Please specify your requirements..."
                  />
                  {errors.specialRequirements && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.specialRequirements.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-4 px-3 md:col-span-2 xl:col-span-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full transform rounded-lg bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-purple-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? "Submitting..." : "Send Query"}
                  </button>
                  {/* <p className="text-blue-100 text-xs sm:text-sm mt-2">
                    We&apos;ll get back to you within 24 hours with a detailed
                    quote
                  </p> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
