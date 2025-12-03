import { z } from "zod";

export const leadershipFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(120, { message: "Name cannot exceed 120 characters" }),
  designation: z
    .string()
    .trim()
    .min(1, { message: "Designation is required" })
    .max(150, { message: "Designation cannot exceed 150 characters" }),
  quote: z
    .string()
    .trim()
    .min(1, { message: "Quote is required" })
    .max(4000, { message: "Quote cannot exceed 4000 characters" }),
  isActive: z.boolean().optional(),
});

export type LeadershipFormData = z.infer<typeof leadershipFormSchema>;


