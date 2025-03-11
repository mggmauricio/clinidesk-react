import { z } from "zod";

export const LocationSchema = z.object({
  zip_code: z.string().min(8, "CEP inválido"),
  address: z.string().min(5, "Endereço inválido"),
  number: z.string().min(1, "Número obrigatório"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido"),
  country: z.string().default("Brasil"),
  complement: z.string().optional(),
});

export type LocationFormInputs = z.infer<typeof LocationSchema>;