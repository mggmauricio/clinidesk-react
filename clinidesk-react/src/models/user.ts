import { z } from "zod";

/* =======================
   FUNÇÕES DE VALIDAÇÃO
======================= */

// ✅ Validação de CPF
export function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
}

// ✅ Validação de CNPJ
export function validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const calcDigits = (cnpj: string, positions: number[]): number => {
        return positions.reduce((sum, pos, i) => sum + parseInt(cnpj[i]) * pos, 0) % 11;
    };

    const firstDigit = calcDigits(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) < 2 ? 0 : 11 - calcDigits(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    if (firstDigit !== parseInt(cnpj.charAt(12))) return false;

    const secondDigit = calcDigits(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) < 2 ? 0 : 11 - calcDigits(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return secondDigit === parseInt(cnpj.charAt(13));
}

// ✅ Esquema de validação de email
export const emailSchema = z.string().email("Email inválido");

/* =======================
   ZOD SCHEMAS
======================= */

// 🎯 Schema para validar dados do Profissional de Saúde
export const HealthProfessionalSchema = z.object({
    identification_document: z
        .string()
        .min(11, "CPF deve ter 11 dígitos")
        .max(14, "CPF deve ter no máximo 14 dígitos")
        .refine(validateCPF, { message: "CPF inválido" }),

    full_name: z.string().min(2, "Nome completo obrigatório"),

    phone_number: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),

    email: emailSchema.optional(),

    specialization: z.string().optional(),

    cnae: z.string().optional(),

    is_independent: z.boolean(),

    bot_phone: z.string().optional(),
});

// 🎯 Schema para validar dados da Clínica
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

// 🎯 Tipos inferidos do Zod para reutilização
export type ClinicFormInputs = z.infer<typeof ClinicSchema>;
export type ProfessionalFormInputs = z.infer<typeof HealthProfessionalSchema>;
