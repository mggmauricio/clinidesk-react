import { z } from "zod";
import { validateCPF } from "@/validators/cpf";
import { emailSchema } from "@/validators/email";

export const HealthProfessionalSchema = z.object({
    identification_document: z
        .string()
        .min(11, "CPF deve ter 11 dígitos")
        .max(14, "CPF deve ter no máximo 14 dígitos")
        .refine(validateCPF, { message: "CPF inválido" }),

    full_name: z.string().min(2, "Nome completo obrigatório"),

    phone_number: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),

    email: emailSchema, // Agora obrigatório

    specialization: z.string().optional(),

    cnae: z.string().optional(),

    is_independent: z.boolean(),

    bot_phone: z.string().optional(),

    address: z.string().optional(), // Agora é opcional
});

export type HealthProfessionalFormInputs = z.infer<typeof HealthProfessionalSchema>;
