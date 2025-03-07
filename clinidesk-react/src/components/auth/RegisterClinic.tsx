"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClinicFormInputs, ClinicSchema } from "@/models/user";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../ui/maked-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useViaCep } from "@/hooks/useViaCep";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

export default function RegisterClinicSteps() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorDialog, setErrorDialog] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ClinicFormInputs>({
        resolver: zodResolver(ClinicSchema),
        mode: "onChange",
        defaultValues: {
            address: "",
            zip_code: "",
            phone_number: "",
            bot_phone: "",
        },
    });

    const cepValue = watch("zip_code") || "";
    const numeroValue = watch("numero") || "";
    const semNumero = watch("sem_numero");

    const { address, loading, error } = useViaCep(cepValue);

    useEffect(() => {
        if (address) {
            const numero = semNumero ? "S/N" : numeroValue;
            const fullAddress = `${address.logradouro}, ${numero} - ${address.bairro}, ${address.localidade} - ${address.uf}`;
            setValue("address", fullAddress, { shouldValidate: true });
        }
    }, [address, semNumero, numeroValue, setValue]);

    const onSubmit = async (data: ClinicFormInputs) => {
        setIsSubmitting(true);
        try {
            console.log("🟢 Dados da clínica enviados:", data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            alert("✅ Cadastro realizado com sucesso!");
            setCurrentStep(1);
        } catch (error) {
            setErrorDialog("Erro ao cadastrar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex">
            <Card className="w-full max-w-2xl shadow-2xl border border-border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {currentStep === 1 && (
                            <>
                                {/* Step 1: Dados Básicos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-lg font-bold">Nome Fantasia</Label>
                                        <Input {...register("trade_name")} placeholder="Digite seu nome fantasia" className="text-lg px-4 py-2" />
                                        {errors.trade_name && <p className="text-red-500 text-sm">{errors.trade_name.message}</p>}
                                    </div>

                                    <div>
                                        <Label className="text-lg font-bold">Razão Social</Label>
                                        <Input {...register("legal_name")} placeholder="Digite sua razão social" className="text-lg px-4 py-2" />
                                        {errors.legal_name && <p className="text-red-500 text-sm">{errors.legal_name.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-lg font-bold">CNPJ</Label>
                                        <MaskedInput mask="XX.XXX.XXX/XXXX-XX" replacement={{ X: /\d/ }} {...register("cnpj")} error={errors.cnpj?.message} />
                                    </div>

                                    <div>
                                        <Label className="text-lg font-bold">Telefone</Label>
                                        <MaskedInput mask="(XX) XXXXX-XXXX" replacement={{ X: /\d/ }} {...register("phone_number")} error={errors.phone_number?.message} />
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
                                {/* Step 2: Endereço */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">CEP</Label>
                                    <MaskedInput mask="XXXXX-XXX" replacement={{ X: /\d/ }} {...register("zip_code")} error={errors.zip_code?.message} />
                                    {loading && <p className="text-primary">Buscando endereço...</p>}
                                    {error && <p className="text-red-500">{error}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-lg font-bold">Endereço</Label>
                                        <Input {...register("address")} placeholder="Endereço" className="text-lg px-4 py-2" disabled />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-full">
                                            <Label className="text-lg font-bold">Número</Label>
                                            <Input {...register("numero")} placeholder="Número" className="text-lg px-4 py-2" disabled={semNumero} />
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <input type="checkbox" id="sem_numero" className="h-5 w-5" {...register("sem_numero")} />
                                            <Label htmlFor="sem_numero" className="ml-2 text-lg font-bold">S/N</Label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Complemento (Opcional)</Label>
                                    <Input {...register("complemento")} placeholder="Complemento" className="text-lg px-4 py-2" />
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" onClick={() => setCurrentStep(1)} className="w-auto text-lg font-semibold py-3 px-6">
                                        Voltar
                                    </Button>
                                    <Button type="submit" className="w-auto text-lg font-semibold py-3 px-6 hover:bg-primary-dark">
                                        {isSubmitting ? "Enviando..." : "Criar Conta"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Modal de Erro */}
            {errorDialog && (
                <AlertDialog open={!!errorDialog} onOpenChange={(open) => !open && setErrorDialog(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Erro no Cadastro</AlertDialogTitle>
                            <AlertDialogDescription>{errorDialog}</AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
