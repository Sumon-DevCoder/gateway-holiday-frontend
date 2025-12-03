import { z } from "zod";

// Dynamic visa types - will be fetched from API
export type VisaType = string;

export const createVisaSchema = z.object({
  countryName: z
    .string()
    .min(1, "Country name is required")
    .max(100, "Country name must be less than 100 characters")
    .trim(),
  visaTypes: z
    .array(z.string())
    .min(1, "At least one visa type is required")
    .max(3, "Maximum 3 visa types allowed"),
  processingFee: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Number(val)),
      "Processing fee must be a valid number"
    ),
  processing_time: z
    .string()
    .min(1, "Processing time is required")
    .max(100, "Processing time must be less than 100 characters")
    .trim()
    .optional(),
  required_document: z.string().optional(),
});

export type CreateVisaFormData = z.infer<typeof createVisaSchema>;
