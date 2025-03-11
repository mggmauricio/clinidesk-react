"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { MaterialInput } from "@/components/ui/material-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaIdCard, FaBuilding } from "react-icons/fa";

// Schema de validação com Zod
const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    phone: z.string().min(14, "Telefone é obrigatório"),
    cpf: z.string().min(14, "CPF deve ter 11 dígitos"),
    company: z.string().optional(),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function MaterialInputWithHookForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            cpf: "",
            company: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        alert("Formulário enviado com sucesso!");
        console.log(data);
    };

    return (
        <div className="flex justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Material Input com React Hook Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <MaterialInput
                                    label="Nome Completo"
                                    startIcon={<FaUser />}
                                    errorMessage={errors.name?.message}
                                    variant="default"
                                    required
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <MaterialInput
                                    label="Email"
                                    type="email"
                                    startIcon={<FaEnvelope />}
                                    errorMessage={errors.email?.message}
                                    variant="filled"
                                    required
                                    {...field}
                                />
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <MaterialInput
                                        label="Telefone"
                                        startIcon={<FaPhone />}
                                        errorMessage={errors.phone?.message}
                                        variant="outlined"
                                        required
                                        mask="(XX) XXXXX-XXXX"
                                        replacement={{ X: /\d/ }}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <MaterialInput
                                        label="CPF"
                                        startIcon={<FaIdCard />}
                                        errorMessage={errors.cpf?.message}
                                        variant="outlined"
                                        required
                                        mask="XXX.XXX.XXX-XX"
                                        replacement={{ X: /\d/ }}
                                        {...field}
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                                <MaterialInput
                                    label="Empresa"
                                    startIcon={<FaBuilding />}
                                    variant="default"
                                    helperText="Opcional"
                                    {...field}
                                />
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <MaterialInput
                                        label="Senha"
                                        type={showPassword ? "text" : "password"}
                                        startIcon={<FaLock />}
                                        endIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="focus:outline-none"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        }
                                        errorMessage={errors.password?.message}
                                        helperText={!errors.password?.message ? "Mínimo de 6 caracteres" : ""}
                                        variant="default"
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <MaterialInput
                                        label="Confirmar Senha"
                                        type={showConfirmPassword ? "text" : "password"}
                                        startIcon={<FaLock />}
                                        endIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="focus:outline-none"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        }
                                        errorMessage={errors.confirmPassword?.message}
                                        variant="default"
                                        required
                                        {...field}
                                    />
                                )}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full">Cadastrar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 