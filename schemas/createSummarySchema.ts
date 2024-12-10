import { z } from "zod";

export const createSummarySchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type CreateSummaryFormData = z.infer<typeof createSummarySchema>;
