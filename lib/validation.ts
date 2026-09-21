import { z } from "zod";

export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo")
    .max(120),
  email: z.string().trim().email("Email inválido").max(160),
  planSlug: z.string().trim().min(1, "Elegí un plan"),
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
