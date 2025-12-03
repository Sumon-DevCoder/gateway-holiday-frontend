import { z } from "zod";

export const createFaqSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must not exceed 500 characters")
    .trim(),
  answer: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateFaqFormData = z.infer<typeof createFaqSchema>;
