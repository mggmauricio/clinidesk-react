"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthToggle from "./AuthToogle";
// Validação com Zod
const loginSchema = z.object({
    email: z.string().email("Digite um e-mail válido"), // Valida e-mail
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"), // Senha mínima de 6 caracteres
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [role, setRole] = useState("Profissional");

    // React Hook Form + Zod
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onChange", // Validação em tempo real
    });

    // Assiste os campos para ativar a label flutuante
    const emailValue = watch("email", "");
    const passwordValue = watch("password", "");

    // Envio do formulário
    const onSubmit = (data: LoginFormInputs) => {
        console.log("Dados enviados:", data);
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-center">Entrar no Sistema</h2>
            <p className="text-sm text-center text-gray-600 mb-4">
                Acesse o sistema de gerenciamento de clínicas de saúde
            </p>

            <AuthToggle onSelect={setRole} />

            {/* Formulário */}
            <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Campo de E-mail com Label Flutuante */}
                <div className="relative">
                    <input
                        type="email"
                        {...register("email")}
                        placeholder=" "
                        className={`w-full px-4 pt-4 pb-2 border rounded-lg focus:ring focus:ring-teal-500 ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    <label
                        className={`absolute left-4 top-2 text-sm text-gray-600 transition-all ${emailValue ? "text-xs -top-4 bg-white px-1" : "top-4"
                            }`}
                    >
                        Email
                    </label>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Campo de Senha com Label Flutuante */}
                <div className="relative">
                    <input
                        type="password"
                        {...register("password")}
                        placeholder=" "
                        className={`w-full px-4 pt-4 pb-2 border rounded-lg focus:ring focus:ring-teal-500 ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    <label
                        className={`absolute left-4 top-2 text-sm text-gray-600 transition-all ${passwordValue ? "text-xs -top-2 bg-white px-1" : "top-4"
                            }`}
                    >
                        Senha
                    </label>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Botão de Login */}
                <button
                    type="submit"
                    className="w-full py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700"
                >
                    Entrar
                </button>
            </form>

            {/* Link de recuperação de senha */}
            <div className="mt-4 text-center">
                <a href="#" className="text-sm text-teal-600 hover:underline">
                    Esqueceu sua senha? Recuperar acesso
                </a>
            </div>
        </div>
    );
}
