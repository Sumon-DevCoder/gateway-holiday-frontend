// lib/validations/query.ts
import { z } from "zod";

export const packageTourSchema = z
  .object({
    name: z.string().min(2, "Name is required").trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .trim(),
    contactNumber: z
      .string()
      .min(10, "Contact number must be at least 10 digits")
      .trim(),
    startingDate: z.string().min(1, "Starting date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    visitingCountry: z.string().min(2, "Visiting country is required").trim(),
    persons: z
      .number()
      .min(1, "Number of persons is required")
      .max(100, "Maximum 100 persons allowed"),
    needsVisa: z.enum(["yes", "no"], {
      message: "Please specify if visa is needed",
    }),
    visitingCities: z.string().trim().optional().or(z.literal("")),
    airlineTicketCategory: z.string().optional().or(z.literal("")),
    specialRequirements: z.string().optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.returnDate) > new Date(data.startingDate), {
    message: "Return date must be after starting date",
    path: ["returnDate"],
  });

export const hajjUmrahSchema = z
  .object({
    name: z.string().min(2, "Name is required").trim(),
    email: z.string().email("Please enter a valid email address").trim(),
    contactNumber: z
      .string()
      .min(10, "Contact number must be at least 10 digits")
      .trim(),
    startingDate: z.string().min(1, "Starting date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    airlineTicketCategory: z
      .string()
      .min(1, "Please select an airline ticket category"),
    makkahNights: z.number().min(0, "Nights cannot be negative").max(365),
    madinaNights: z.number().min(0, "Nights cannot be negative").max(365),
    maleAdults: z.number().min(0, "Male adults cannot be negative").max(50),
    femaleAdults: z.number().min(0, "Female adults cannot be negative").max(50),
    children: z.number().min(0, "Children cannot be negative").max(20),
    accommodationType: z.string().min(1, "Please select accommodation type"),
    foodsIncluded: z.string().min(1, "Please select if foods are included"),
    guideRequired: z.string().min(1, "Please select if guide is required"),
    privateTransportation: z
      .string()
      .min(1, "Please select transportation preference"),
    specialRequirements: z.string(),
  })
  .refine((data) => new Date(data.returnDate) > new Date(data.startingDate), {
    message: "Return date must be after starting date",
    path: ["returnDate"],
  });

export type PackageTourFormData = z.infer<typeof packageTourSchema>;
export type HajjUmrahFormData = z.infer<typeof hajjUmrahSchema>;
