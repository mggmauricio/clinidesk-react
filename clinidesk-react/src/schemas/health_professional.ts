// src/schemas/health_professional.ts
import { z } from "zod";
import { validateCPF } from "@/validators/cpf";
import { emailSchema } from "@/validators/email";

// Schema com todos os campos e validações
export const HealthProfessionalSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  password_confirmation: z.string().min(1, "Confirmação de senha é obrigatória"),
  identification_document: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 dígitos")
    .refine(validateCPF, { message: "CPF inválido" }),
  full_name: z.string().min(2, "Nome completo obrigatório"),
  phone_number: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
  email: emailSchema,
  specialization: z.string().optional(),
  cnae: z.string().optional(),
  is_independent: z.boolean(),
  bot_phone: z.string().optional(),
  location_id: z.string().optional(),
  birth_date: z.string()
    .min(1, "Data de nascimento é obrigatória")
    .transform((date) => {
      // Se a data estiver no formato DD/MM/YYYY (formato brasileiro),
      // converte para o formato ISO YYYY-MM-DD para enviar ao backend
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
      }
      return date;
    })
    .refine(
      (date) => {
        // Validar formato de data (DD/MM/YYYY ou YYYY-MM-DD)
        return /^\d{2}\/\d{2}\/\d{4}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date);
      },
      { message: "Data de nascimento deve estar no formato DD/MM/YYYY" }
    )
    .refine(
      (date) => {
        // Verificar se é uma data válida
        let parsedDate;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          const [day, month, year] = date.split('/');
          parsedDate = new Date(`${year}-${month}-${day}`);
        } else {
          parsedDate = new Date(date);
        }
        return !isNaN(parsedDate.getTime());
      },
      { message: "Data de nascimento inválida" }
    )
    .refine(
      (date) => {
        // Verificar se a data não é futura
        const today = new Date();
        let parsedDate;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          const [day, month, year] = date.split('/');
          parsedDate = new Date(`${year}-${month}-${day}`);
        } else {
          parsedDate = new Date(date);
        }
        return parsedDate <= today;
      },
      { message: "Data de nascimento não pode ser no futuro" }
    ),
}).refine(
  (data) => data.password === data.password_confirmation,
  {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  }
);

export type HealthProfessionalFormInputs = z.infer<typeof HealthProfessionalSchema>;