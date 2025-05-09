import { z } from "zod";
import { EVENT_CATEGORIES } from "@/constants/categories";

export const createEventSchema = z.object({
  title: z.string()
    .min(1, { message: "Título é obrigatório" })
    .max(100, { message: "Título deve ter menos de 100 caracteres" }),
  description: z.string()
    .min(1, { message: "Descrição é obrigatória" })
    .max(500, { message: "Descrição deve ter menos de 500 caracteres" }),
  location: z.string()
    .min(1, { message: "Local é obrigatório" }),
  date: z.string()
    .min(1, { message: "Data é obrigatória" }),
  image: z.string().optional(),
  category: z.enum(EVENT_CATEGORIES).nullable().optional()
});

export type CreateEventInput = z.infer<typeof createEventSchema>; 