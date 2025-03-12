"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialInput } from "@/components/ui/material-input";
import { FaUser, FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
    username: z.string().min(1, "Nome de usuário é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        await login(data);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border border-border bg-card text-card-foreground">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <MaterialInput
                        label="Nome de Usuário"
                        {...register("username")}
                        startIcon={<FaUser />}
                        errorMessage={errors.username?.message}
                        required
                        variant="outlined"
                    />

                    <div className="relative">
                        <MaterialInput
                            label="Senha"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            startIcon={<FaLock />}
                            errorMessage={errors.password?.message}
                            required
                            variant="outlined"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <div className="text-destructive text-sm mt-2">{error}</div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
