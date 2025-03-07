import { z } from "zod";
import { validateCNPJ } from "@/validators/cnpj";
import { emailSchema } from "@/validators/email";

export const ClinicSchema = z.object({
    trade_name: z.string().min(2, "Nome fantasia obrigatório"),
    legal_name: z.string().min(2, "Razão social obrigatória"),

    cnpj: z
        .string()
        .min(14, "CNPJ deve ter 14 dígitos")
        .max(18, "CNPJ deve ter no máximo 18 dígitos")
        .refine(validateCNPJ, { message: "CNPJ inválido" }),

    address: z.string().min(5, "Endereço obrigatório"),
    zip_code: z.string().min(8, "CEP deve ter no mínimo 8 caracteres"),
    phone_number: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
    bot_phone: z.string().optional(),
});

export type ClinicFormInputs = z.infer<typeof ClinicSchema>;
