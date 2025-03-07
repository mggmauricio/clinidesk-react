"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfessionalFormInputs, HealthProfessionalSchema } from "@/models/user";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../ui/maked-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";

export default function RegisterProfessionalSteps() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfessionalFormInputs>({
        resolver: zodResolver(HealthProfessionalSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ProfessionalFormInputs) => {
        setIsSubmitting(true);
        try {
            console.log("Dados do Profissional:", data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            alert("Cadastro realizado com sucesso!");
            setCurrentStep(1);
        } catch (error) {
            setErrorMessage("Erro ao cadastrar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex">
            <Card className="w-full max-w-3xl shadow-2xl border border-border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {currentStep === 1 && (
                            <>
                                {/* Passo 1: Informações Básicas */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-lg font-bold">CPF</Label>
                                        <MaskedInput mask="XXX.XXX.XXX-XX" replacement={{ X: /\d/ }} {...register("identification_document")} error={errors.identification_document?.message} />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-lg font-bold">Nome Completo</Label>
                                        <Input {...register("full_name")} placeholder="Digite seu nome completo" className="text-lg px-4 py-3" />
                                        {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-lg font-bold">Telefone</Label>
                                        <MaskedInput mask="(XX) XXXXX-XXXX" replacement={{ X: /\d/ }} {...register("phone_number")} error={errors.phone_number?.message} />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-lg font-bold">E-mail (Opcional)</Label>
                                        <Input {...register("email")} placeholder="Digite seu e-mail" className="text-lg px-4 py-3" />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setCurrentStep(2)} className="w-auto text-lg font-semibold py-3 px-6">
                                        Próximo
                                    </Button>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                {/* Passo 2: Informações Profissionais */}
                                <div className="space-y-3">
                                    <Label className="text-lg font-bold">Especialização</Label>
                                    <Input {...register("specialization")} placeholder="Digite sua especialização" className="text-lg px-4 py-3" />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-lg font-bold">CNAE (Opcional)</Label>
                                    <Input {...register("cnae")} placeholder="Digite o CNAE" className="text-lg px-4 py-3" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch id="is_independent" checked={watch("is_independent")} onCheckedChange={(checked) => setValue("is_independent", checked)} />
                                    <Label htmlFor="is_independent" className="text-lg font-bold">Sou profissional independente</Label>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-lg font-bold">Telefone do Bot (Opcional)</Label>
                                    <MaskedInput mask="(XX) XXXXX-XXXX" replacement={{ X: /\d/ }} {...register("bot_phone")} error={errors.bot_phone?.message} />
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" onClick={() => setCurrentStep(1)} className="w-auto text-lg font-semibold py-3 px-6">
                                        Voltar
                                    </Button>
                                    <Button type="submit" className="w-auto text-lg font-semibold py-3 px-6 transition hover:bg-primary-dark">
                                        {isSubmitting ? "Enviando..." : "Criar Conta"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Alerta de erro ao cadastrar */}
            {errorMessage && (
                <AlertDialog open={!!errorMessage}>
                    <AlertDialogTrigger asChild>
                        <span className="hidden"></span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <h2 className="text-xl font-semibold text-red-600">Erro no Cadastro</h2>
                        </AlertDialogHeader>
                        <p className="text-md text-gray-600">{errorMessage}</p>
                        <AlertDialogFooter>
                            <Button onClick={() => setErrorMessage("")} className="bg-red-600 text-white hover:bg-red-700">
                                Fechar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
