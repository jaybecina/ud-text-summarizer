import { z } from "zod";

export const editSummarySchema = z.object({
  text: z.string().min(1, "Summary text is required"),
});

export type EditSummaryFormData = z.infer<typeof editSummarySchema>;
