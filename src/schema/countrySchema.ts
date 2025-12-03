import { z } from "zod";

export const createCountrySchema = z.object({
  name: z
    .string()
    .min(1, "Country name is required")
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must not exceed 100 characters")
    .trim(),
  imageUrl: z.string().optional(),
  isTop: z.boolean().optional(),
});

export type CreateCountryFormData = z.infer<typeof createCountrySchema>;

