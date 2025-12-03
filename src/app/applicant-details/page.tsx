"use client";
import Breadcrumb from "@/components/home/sections/BreadCrumb";
import countries from "@/data/countries.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CountryJsonData {
  id: number;
  countryName: { bn: string; en: string };
  visaTypes: {
    category: { bn: string; en: string };
    processingTypes: { bn: string; en: string }[];
  }[];
  processingFee: number;
  required_document: string;
}

const schema = z.object({
  country: z.string().nonempty("Country is required"),
  visa: z.string().nonempty("Visa type is required"),
  processingType: z.string().nonempty("Processing type is required"),
  email: z.string().email("Invalid email"),
  name: z.string().nonempty("Name is required"),
  phone: z.string().nonempty("Phone is required"),
  passport: z.string().nonempty("Passport number is required"),
});

type FormData = z.infer<typeof schema>;

const ApplicantDetails = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      visa: "",
      processingType: "",
      email: "",
      name: "",
      phone: "",
      passport: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedVisa = watch("visa");

  const currentCountry = countries.find(
    (c: CountryJsonData) =>
      c.countryName.en.toLowerCase() === selectedCountry.toLowerCase()
  );

  const currentVisa = currentCountry?.visaTypes.find(
    (visa) => visa.category.en.toLowerCase() === selectedVisa.toLowerCase()
  );

  const onSubmit = () => {
    toast.success("Form submitted successfully!"); // ✅ Sonner toast
    reset();
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home" }]}
        pageTitle="Applicant Details"
        backgroundImage="/path/to/your/bg.jpg"
      />
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mt-6 text-center text-4xl font-bold">
          Applicant Details
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col space-y-4"
        >
          {/* Country Select */}
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.countryName.en}>
                      {c.countryName.en}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Visa Type Select */}
          <Controller
            name="visa"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  disabled={!currentCountry}
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                >
                  <option value="">Select Visa Type</option>
                  {currentCountry?.visaTypes?.map((visa, idx) => (
                    <option key={idx} value={visa.category.en}>
                      {visa.category.en}
                    </option>
                  ))}
                </select>
                {errors.visa && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.visa.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Processing Type Select */}
          <Controller
            name="processingType"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  disabled={!currentVisa}
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                >
                  <option value="">Select Visa Processing Type</option>
                  {currentVisa?.processingTypes.map((type, idx) => (
                    <option key={idx} value={type.en}>
                      {type.en}
                    </option>
                  ))}
                </select>
                {errors.processingType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.processingType.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Email"
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Name"
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Phone No."
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Passport */}
          <Controller
            name="passport"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Passport No."
                  className="w-full cursor-pointer appearance-none rounded border-3 border-black px-6 py-3 text-center text-xl font-bold text-black outline-none"
                />
                {errors.passport && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.passport.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg border-3 border-black bg-purple-500 px-8 py-3 text-xl font-bold text-white transition-all hover:bg-purple-600 hover:text-black disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ApplicantDetails;
