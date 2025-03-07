"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClinicFormInputs, ClinicSchema } from "@/schemas/clinic";
import { LocationSchema } from "@/schemas/location";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../ui/maked-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useViaCep } from "@/hooks/useViaCep";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { createClinic } from "@/services/clinics"; // ✅ Importando o serviço
import { useRouter } from "next/navigation"; // ✅ Para redirecionar após sucesso
import { createLocation } from "@/services/locations";
// Combinando os schemas para criar um formulário completo


const FormSchema = ClinicSchema.extend({
    location: LocationSchema
});

// Tipo para o formulário combinado
type FormInputs = z.infer<typeof FormSchema>;

export default function RegisterClinicSteps() {
    const router = useRouter(); // ✅ Criando o roteador para redirecionamento

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorDialog, setErrorDialog] = useState<string | null>(null);
    const [semNumero, setSemNumero] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            trade_name: "",
            legal_name: "",
            cnpj: "",
            address: "",
            zip_code: "",
            phone_number: "",
            location: {
                zip_code: "",
                address: "",
                number: "",
                city: "",
                state: "",
                country: "Brasil",
                complement: "",
            },
        },
    });

    const cepValue = watch("location.zip_code") || "";
    const { address, loading, error } = useViaCep(cepValue);

    useEffect(() => {
        if (address) {
            console.log("🟢 Endereço encontrado na API:", address);
            setValue("location.address", address.logradouro || "", { shouldValidate: true });
            setValue("location.city", address.localidade || "", { shouldValidate: true });
            setValue("location.state", address.uf || "", { shouldValidate: true });
            setValue("address", `${address.logradouro}, ${semNumero ? "S/N" : watch("location.number")} - ${address.bairro}, ${address.localidade} - ${address.uf}`, { shouldValidate: true });
            setValue("zip_code", cepValue.replace(/\D/g, ""), { shouldValidate: true });
        }
    }, [address, semNumero, setValue, watch, cepValue]);

    const onSubmit = async (data: FormInputs) => {
        setIsSubmitting(true);
        console.log("🟡 Tentando enviar formulário com os dados:", data);

        try {
            // 🔹 Formatando os dados para Location
            const locationData = {
                zip_code: data.location.zip_code.replace(/\D/g, ""), // Remove caracteres não numéricos
                address: data.location.address.trim(),
                number: semNumero ? "S/N" : data.location.number.trim(),
                city: data.location.city.trim(),
                state: data.location.state.trim(),
                country: "Brasil",
                complement: data.location.complement?.trim() || "",
            };

            console.log("🟢 Criando localização:", locationData);
            const createdLocation = await createLocation(locationData);

            if (!createdLocation || !createdLocation.id) {
                throw new Error("Erro ao criar localização.");
            }

            console.log("✅ Localização criada com ID:", createdLocation.id);

            // 🔹 Criando os dados da clínica
            const clinicData = {
                trade_name: data.trade_name.trim(),
                legal_name: data.legal_name.trim(),
                cnpj: data.cnpj.replace(/\D/g, ""), // Remove caracteres não numéricos
                phone_number: data.phone_number.replace(/\D/g, ""),
                bot_phone: data.bot_phone || null,
                location_id: createdLocation.id, // ✅ Associando Location à Clinic
            };

            console.log("🟢 Criando clínica:", clinicData);
            const createdClinic = await createClinic(clinicData);

            if (!createdClinic) {
                throw new Error("Erro ao criar clínica.");
            }

            alert("✅ Cadastro realizado com sucesso!");
            router.push("/clinics");
        } catch (error) {
            console.error("🔴 Erro ao enviar:", error);
            setErrorDialog("Erro ao cadastrar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
            console.log("🔵 Submissão finalizada.");
        }
    };


    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validar apenas os campos do passo 1
            if (!errors.trade_name && !errors.legal_name && !errors.cnpj &&
                watch("trade_name") && watch("legal_name") && watch("cnpj")) {
                setCurrentStep(2);
            } else {
                setErrorDialog("Por favor, preencha todos os campos obrigatórios corretamente.");
            }
        }
    };

    return (
        <div className="flex justify-center w-full">
            <Card className="w-full max-w-2xl shadow-2xl border border-border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg font-bold">Nome Fantasia</Label>
                                    <Input {...register("trade_name")} placeholder="Nome Fantasia" />
                                    {errors.trade_name && <p className="text-red-500 text-sm">{errors.trade_name.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Razão Social</Label>
                                    <Input {...register("legal_name")} placeholder="Razão Social" />
                                    {errors.legal_name && <p className="text-red-500 text-sm">{errors.legal_name.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">CNPJ</Label>
                                    <MaskedInput
                                        mask="XX.XXX.XXX/XXXX-XX"
                                        replacement={{ X: /\d/ }}
                                        {...register("cnpj")}
                                        error={errors.cnpj?.message}
                                    />
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Telefone</Label>
                                    <MaskedInput
                                        mask="(XX) XXXXX-XXXX"
                                        replacement={{ X: /\d/ }}
                                        {...register("phone_number")}
                                        error={errors.phone_number?.message}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full mt-4"
                                >
                                    Próximo
                                </Button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg font-bold">CEP</Label>
                                    <MaskedInput
                                        mask="XXXXX-XXX"
                                        replacement={{ X: /\d/ }}
                                        {...register("location.zip_code")}
                                        error={errors.location?.zip_code?.message}
                                    />
                                    {loading && <p className="text-primary">Buscando endereço...</p>}
                                    {error && <p className="text-red-500">{error}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Cidade</Label>
                                    <Input {...register("location.city")} placeholder="Cidade" disabled={!!address} />
                                    {errors.location?.city && <p className="text-red-500 text-sm">{errors.location.city.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Estado</Label>
                                    <Input {...register("location.state")} placeholder="UF" disabled={!!address} />
                                    {errors.location?.state && <p className="text-red-500 text-sm">{errors.location.state.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Endereço</Label>
                                    <Input {...register("location.address")} placeholder="Endereço" disabled={!!address} />
                                    {errors.location?.address && <p className="text-red-500 text-sm">{errors.location.address.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Número</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            {...register("location.number")}
                                            placeholder="Número"
                                            disabled={semNumero}
                                        />
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                id="sem-numero"
                                                checked={semNumero}
                                                onChange={(e) => {
                                                    setSemNumero(e.target.checked);
                                                    if (e.target.checked) {
                                                        setValue("location.number", "S/N", { shouldValidate: true });
                                                    } else {
                                                        setValue("location.number", "", { shouldValidate: true });
                                                    }
                                                }}
                                                className="mr-1"
                                            />
                                            <label htmlFor="sem-numero">S/N</label>
                                        </div>
                                    </div>
                                    {errors.location?.number && <p className="text-red-500 text-sm">{errors.location.number.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Complemento</Label>
                                    <Input
                                        {...register("location.complement")}
                                        placeholder="Complemento (opcional)"
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!isValid || isSubmitting}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? "Enviando..." : "Criar Conta"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {errorDialog && (
                <AlertDialog open={!!errorDialog} onOpenChange={(open) => !open && setErrorDialog(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Erro no Cadastro</AlertDialogTitle>
                            <AlertDialogDescription>{errorDialog}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <Button
                            onClick={() => setErrorDialog(null)}
                            className="mt-4"
                        >
                            Fechar
                        </Button>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}