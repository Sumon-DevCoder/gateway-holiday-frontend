import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  designation: z
    .string()
    .min(1, "Designation is required")
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must not exceed 100 characters")
    .trim(),
  image: z.any().optional(),
});

export type CreateTeamMemberFormData = z.infer<typeof createTeamMemberSchema>;

