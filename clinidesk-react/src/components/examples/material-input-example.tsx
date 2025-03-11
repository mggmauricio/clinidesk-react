"use client";

import { useState } from "react";
import { MaterialInput } from "@/components/ui/material-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

export default function MaterialInputExample() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = "Nome é obrigatório";
        if (!formData.email) newErrors.email = "Email é obrigatório";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
        if (!formData.phone) newErrors.phone = "Telefone é obrigatório";
        if (!formData.password) newErrors.password = "Senha é obrigatória";
        else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert("Formulário enviado com sucesso!");
            console.log(formData);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Exemplo de Material Input</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <MaterialInput
                            label="Nome"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="default"
                            startIcon={<FaUser />}
                            errorMessage={errors.name}
                            required
                        />

                        <MaterialInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="filled"
                            startIcon={<FaEnvelope />}
                            errorMessage={errors.email}
                            required
                        />

                        <MaterialInput
                            label="Telefone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            variant="outlined"
                            startIcon={<FaPhone />}
                            errorMessage={errors.phone}
                            required
                        />

                        <MaterialInput
                            label="Senha"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            variant="default"
                            startIcon={<FaLock />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            }
                            errorMessage={errors.password}
                            helperText={!errors.password ? "Mínimo de 6 caracteres" : ""}
                            required
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full">Enviar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 