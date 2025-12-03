"use client";
import CounterInput from "@/components/shared/CounterInput";
// import RadioGroup from "@/components/shared/RadioGroup";
import { useQuerySubmit } from "@/hooks/useQuery";
import { analytics } from "@/lib/analytics";
import { accommodationOptions, yesNoOptions } from "@/lib/optionsData";
import { HajjUmrahFormData, hajjUmrahSchema } from "@/lib/validations/query";
import { useCurrentUser } from "@/redux/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

export default function HajjUmrahForm() {
  const { loading, submitQuery } = useQuerySubmit();
  const authUser = useSelector(useCurrentUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<HajjUmrahFormData>({
    resolver: zodResolver(hajjUmrahSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      startingDate: "",
      returnDate: "",
      airlineTicketCategory: "",
      makkahNights: 0,
      madinaNights: 0,
      maleAdults: 0,
      femaleAdults: 0,
      children: 0,
      accommodationType: "",
      foodsIncluded: "",
      guideRequired: "",
      privateTransportation: "",
      specialRequirements: "",
    },
  });

  const formData = watch();

  // Auto-fill from logged-in user
  useEffect(() => {
    if (!authUser) return;
    if (!formData.name && authUser.name) {
      setValue("name", authUser.name);
    }
    if (!formData.email && authUser.email) {
      setValue("email", authUser.email);
    }
    if (!formData.contactNumber && authUser.phone) {
      setValue("contactNumber", authUser.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const onSubmit = async (data: HajjUmrahFormData) => {
    try {
      await submitQuery(data, "hajj_umrah");
      
      // Track successful form submission
      analytics.trackFormSubmit("Hajj Umrah Query", true, {
        email: data.email,
        contact_number: data.contactNumber,
        accommodation_type: data.accommodationType,
        total_persons: (data.maleAdults || 0) + (data.femaleAdults || 0) + (data.children || 0),
      });
      
      reset();
    } catch (error: any) {
      // Track failed form submission
      analytics.trackFormSubmit("Hajj Umrah Query", false);
      analytics.trackError(
        error?.message || "Hajj Umrah query submission failed",
        "hajj_umrah_form"
      );
    }
  };

  return (
    <>
      <div className="mx-auto mb-8 rounded-md p-2 sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <div className="mx-auto max-w-7xl">
          <div className="mt-4 rounded-xl bg-purple-900 p-3 shadow-xl sm:mt-8 sm:p-4 lg:mt-12 lg:p-6 xl:mt-16 xl:p-8">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Hajj & Umrah Booking Form
              </h1>
              <p className="text-sm text-blue-100 sm:text-base">
                Fill out the details below to get your personalized quote
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                {/* Basic Information */}
                <div className="mb-4 px-2 sm:mb-6 sm:px-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none sm:px-4 sm:text-base"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-300 sm:text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-4 px-2 sm:mb-6 sm:px-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none sm:px-4 sm:text-base"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-300 sm:text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-4 px-2 sm:mb-6 sm:px-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("contactNumber")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none sm:px-4 sm:text-base"
                    placeholder="Enter your phone number"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-xs text-red-300 sm:text-sm">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="mb-4 px-2 sm:mb-6 sm:px-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Starting Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("startingDate")}
                      className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:px-4 sm:text-base"
                    />
                  </div>
                  {errors.startingDate && (
                    <p className="mt-1 text-xs text-red-300 sm:text-sm">
                      {errors.startingDate.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Return Date
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
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Airline Ticket Category
                  </label>
                  <select
                    {...register("airlineTicketCategory")}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  >
                    <option value="">Select an option</option>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first-class">First Class</option>
                  </select>
                  {errors.airlineTicketCategory && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.airlineTicketCategory.message}
                    </p>
                  )}
                </div>

                {/* Counter Fields */}
                <CounterInput
                  label="Nights Stay in Makkah"
                  field="makkahNights"
                  value={formData.makkahNights}
                  onChange={(newValue) => setValue("makkahNights", newValue)}
                />
                {errors.makkahNights && (
                  <div className="-mt-4 mb-2 px-3">
                    <p className="text-sm text-red-300">
                      {errors.makkahNights.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="Nights Stay in Madina"
                  field="madinaNights"
                  value={formData.madinaNights}
                  onChange={(newValue) => setValue("madinaNights", newValue)}
                />
                {errors.madinaNights && (
                  <div className="-mt-4 mb-2 px-3">
                    <p className="text-sm text-red-300">
                      {errors.madinaNights.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Male Adult(s)"
                  field="maleAdults"
                  value={formData.maleAdults}
                  onChange={(newValue) => setValue("maleAdults", newValue)}
                />
                {errors.maleAdults && (
                  <div className="-mt-4 mb-2 px-3">
                    <p className="text-sm text-red-300">
                      {errors.maleAdults.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Female Adult(s)"
                  field="femaleAdults"
                  value={formData.femaleAdults}
                  onChange={(newValue) => setValue("femaleAdults", newValue)}
                />
                {errors.femaleAdults && (
                  <div className="-mt-4 mb-2 px-3">
                    <p className="text-sm text-red-300">
                      {errors.femaleAdults.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Child(s)"
                  field="children"
                  value={formData.children}
                  onChange={(newValue) => setValue("children", newValue)}
                />
                {errors.children && (
                  <div className="-mt-4 mb-2 px-3">
                    <p className="text-sm text-red-300">
                      {errors.children.message}
                    </p>
                  </div>
                )}

                {/* Radio Groups - Inline without RadioGroup component */}
                <div className="md:col-span-2 xl:col-span-3">
                  <div className="mb-6 px-3">
                    <label className="mb-3 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                      Accommodation Type
                    </label>
                    <div className="item-center flex justify-start gap-5">
                      {accommodationOptions.map((option) => (
                        <label
                          key={option.value}
                          className="item-center bg-opacity-10 hover:bg-opacity-20 flex cursor-pointer justify-center transition-colors"
                        >
                          <input
                            type="radio"
                            {...register("accommodationType")}
                            value={option.value}
                            className="mt-0.5 mr-2 h-4 w-4 border-gray-300 text-purple-500 focus:ring-purple-300"
                          />
                          <span className="text-sm text-white">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.accommodationType && (
                      <p className="mt-1 text-sm text-red-300">
                        {errors.accommodationType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-3 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Foods Included
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="bg-opacity-10 hover:bg-opacity-20 flex cursor-pointer items-center transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("foodsIncluded")}
                          value={option.value}
                          className="mr-3 h-4 w-4 border-gray-300 text-purple-500 focus:ring-purple-300"
                        />
                        <span className="text-sm text-white">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.foodsIncluded && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.foodsIncluded.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-3 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Guide Required
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="bg-opacity-10 hover:bg-opacity-20 flex cursor-pointer items-center transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("guideRequired")}
                          value={option.value}
                          className="mr-3 h-4 w-4 border-gray-300 text-purple-500 focus:ring-purple-300"
                        />
                        <span className="text-sm text-white">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.guideRequired && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.guideRequired.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 px-3">
                  <label className="mb-3 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Private Transportation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="bg-opacity-10 hover:bg-opacity-20 flex cursor-pointer items-center transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("privateTransportation")}
                          value={option.value}
                          className="mr-3 h-4 w-4 border-gray-300 text-purple-500 focus:ring-purple-300"
                        />
                        <span className="text-sm text-white">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.privateTransportation && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.privateTransportation.message}
                    </p>
                  )}
                </div>

                {/* Special Requirements */}
                <div className="mb-6 px-3 md:col-span-2 xl:col-span-3">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                    Any other special requirements
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
