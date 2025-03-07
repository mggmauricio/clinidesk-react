"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthProfessionalSchema } from "@/schemas/health_professional";
import { LocationSchema } from "@/schemas/location";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "../ui/maked-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useViaCep } from "@/hooks/useViaCep";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

// Modifying the schema to make location truly optional
const FormSchema = z.object({
    // Campos do HealthProfessional
    identification_document: HealthProfessionalSchema.shape.identification_document,
    full_name: HealthProfessionalSchema.shape.full_name,
    phone_number: HealthProfessionalSchema.shape.phone_number,
    email: HealthProfessionalSchema.shape.email,
    is_independent: HealthProfessionalSchema.shape.is_independent,
    bot_phone: HealthProfessionalSchema.shape.bot_phone.optional(), // Making bot_phone optional
    address: HealthProfessionalSchema.shape.address.optional(), // Making address optional

    // Campo para controlar se tem endereço
    hasAddress: z.boolean().default(false),

    // Campos de localização quando hasAddress é true
    location: z.object({
        zip_code: LocationSchema.shape.zip_code.optional(),
        address: LocationSchema.shape.address.optional(),
        number: LocationSchema.shape.number.optional(),
        city: LocationSchema.shape.city.optional(),
        state: LocationSchema.shape.state.optional(),
        country: LocationSchema.shape.country.optional(),
        complement: LocationSchema.shape.complement.optional(),
    }).optional()
}).refine(
    (data) => {
        // If hasAddress is true, then location fields should be required
        if (data.hasAddress) {
            return !!data.location?.zip_code &&
                !!data.location?.address &&
                !!data.location?.city &&
                !!data.location?.state &&
                (!!data.location?.number || data.location?.number === "S/N");
        }
        // If hasAddress is false, we don't care about location fields
        return true;
    },
    {
        message: "Campos de endereço são obrigatórios quando o endereço está habilitado",
        path: ["location"]
    }
);

type FormInputs = z.infer<typeof FormSchema>;

export default function RegisterProfessionalSteps() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasAddress, setHasAddress] = useState(false);
    const [semNumero, setSemNumero] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            is_independent: false,
            hasAddress: false,
            location: {
                country: "Brasil",
            }
        }
    });

    const watchHasAddress = watch("hasAddress");

    // Valores do endereço para busca no ViaCep
    const cepValue = watch("location.zip_code") || "";
    const { address, loading, error } = useViaCep(cepValue);

    // Atualiza o estado local quando o valor do formulário mudar
    useEffect(() => {
        setHasAddress(watchHasAddress);
    }, [watchHasAddress]);

    // Atualiza os campos de endereço quando o CEP é encontrado
    useEffect(() => {
        if (address) {
            setValue("location.address", address.logradouro || "", { shouldValidate: true });
            setValue("location.city", address.localidade || "", { shouldValidate: true });
            setValue("location.state", address.uf || "", { shouldValidate: true });

            // Atualiza o campo de endereço do profissional se necessário
            if (hasAddress) {
                const numero = semNumero ? "S/N" : watch("location.number");
                const complemento = watch("location.complement") ? `, ${watch("location.complement")}` : "";
                const enderecoCompleto = `${address.logradouro}, ${numero}${complemento} - ${address.localidade} - ${address.uf}`;
                setValue("address", enderecoCompleto, { shouldValidate: true });
            }
        }
    }, [address, semNumero, hasAddress, watch, setValue]);

    // Função para avançar para o próximo passo
    const handleNextStep = async () => {
        if (currentStep === 1) {
            // Valida apenas os campos do passo 1
            const isStep1Valid = await trigger([
                "identification_document",
                "full_name",
                "phone_number",
                "email"
            ]);

            if (isStep1Valid) {
                setCurrentStep(2);
            } else {
                setErrorMessage("Por favor, preencha todos os campos obrigatórios corretamente.");
            }
        } else if (currentStep === 2) {
            if (hasAddress) {
                setCurrentStep(3);
            } else {
                // Se não tem endereço, submete o formulário diretamente
                handleSubmit(onSubmit)();
            }
        }
    };

    const handleStep2Submit = async () => {
        if (!hasAddress) {
            console.log("Attempting to submit without address");

            // Validar apenas os campos necessários sem endereço
            const isStep2Valid = await trigger([
                "is_independent",
                "bot_phone"
            ]);

            console.log("Form validation result:", isStep2Valid);
            console.log("Form errors:", errors);

            if (isStep2Valid) {
                // Executar o submit do formulário
                handleSubmit(onSubmit)();
            } else {
                console.log("Form validation failed");
                setErrorMessage("Por favor, verifique os campos do formulário.");
            }
        } else {
            // Se tem endereço, avança para o próximo passo
            setCurrentStep(3);
        }
    };

    // Função para voltar ao passo anterior
    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: FormInputs) => {
        console.log("onSubmit called, hasAddress:", data.hasAddress);
        setIsSubmitting(true);
        try {
            // Se tem endereço mas não preencheu os campos obrigatórios, não permite submeter
            if (data.hasAddress) {
                const isAddressValid = await trigger(["location.zip_code", "location.address", "location.number", "location.city", "location.state"]);

                if (!isAddressValid) {
                    setErrorMessage("Por favor, preencha todos os campos de endereço obrigatórios.");
                    setIsSubmitting(false);
                    return;
                }
            }

            console.log("Dados do Profissional:", data);

            // Preparando os dados finais
            const finalData = {
                identification_document: data.identification_document,
                full_name: data.full_name,
                phone_number: data.phone_number,
                email: data.email,
                is_independent: data.is_independent,
                bot_phone: data.bot_phone || undefined, // Garantir que bot_phone seja undefined se estiver vazio
                address: data.hasAddress ? data.address : undefined // Garantir que address seja undefined se não tiver endereço
            };

            // Só incluir location se hasAddress for true
            const locationData = data.hasAddress ? {
                zip_code: data.location?.zip_code,
                address: data.location?.address,
                number: semNumero ? "S/N" : data.location?.number,
                city: data.location?.city,
                state: data.location?.state,
                country: "Brasil",
                complement: data.location?.complement
            } : undefined;

            console.log("Dados finais para envio:", { ...finalData, location: locationData });

            // Simulando envio
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert("Cadastro realizado com sucesso!");
            setCurrentStep(1);
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErrorMessage("Erro ao cadastrar. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
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
                                    <Label className="text-lg font-bold">CPF</Label>
                                    <MaskedInput
                                        mask="XXX.XXX.XXX-XX"
                                        replacement={{ X: /\d/ }}
                                        {...register("identification_document")}
                                        error={errors.identification_document?.message}
                                    />
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Nome Completo</Label>
                                    <Input
                                        {...register("full_name")}
                                        placeholder="Digite seu nome completo"
                                    />
                                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
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

                                <div>
                                    <Label className="text-lg font-bold">E-mail</Label>
                                    <Input
                                        {...register("email")}
                                        placeholder="Digite seu e-mail"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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

                        {/* Step 2: Informações Profissionais */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Informações Profissionais</h2>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_independent"
                                        checked={watch("is_independent")}
                                        onCheckedChange={(checked) => setValue("is_independent", checked)}
                                    />
                                    <Label htmlFor="is_independent" className="text-lg font-bold">
                                        Sou profissional independente
                                    </Label>
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Telefone do Bot (Opcional)</Label>
                                    <MaskedInput
                                        mask="(XX) XXXXX-XXXX"
                                        replacement={{ X: /\d/ }}
                                        {...register("bot_phone")}
                                        error={errors.bot_phone?.message}
                                    />
                                </div>

                                {/* Opção para adicionar endereço */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="has_address"
                                        checked={hasAddress}
                                        onCheckedChange={(checked) => {
                                            setValue("hasAddress", !!checked, { shouldValidate: true });
                                            if (!checked) {
                                                // Limpa os campos de endereço se o usuário desmarcar
                                                setValue("location", { country: "Brasil" }, { shouldValidate: false });
                                                setValue("address", "", { shouldValidate: false });
                                            }
                                        }}
                                    />
                                    <Label htmlFor="has_address" className="text-lg font-bold">
                                        Desejo cadastrar um endereço
                                    </Label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleStep2Submit}
                                        className="flex-1"
                                    >
                                        {hasAddress ? "Próximo" : "Criar Conta"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Endereço (Apenas se hasAddress for true) */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Endereço</h2>

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
                                    <Input
                                        {...register("location.city")}
                                        placeholder="Cidade"
                                        disabled={!!address}
                                    />
                                    {errors.location?.city && (
                                        <p className="text-red-500 text-sm">{errors.location.city.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Estado</Label>
                                    <Input
                                        {...register("location.state")}
                                        placeholder="UF"
                                        disabled={!!address}
                                    />
                                    {errors.location?.state && (
                                        <p className="text-red-500 text-sm">{errors.location.state.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">Endereço</Label>
                                    <Input
                                        {...register("location.address")}
                                        placeholder="Endereço"
                                        disabled={!!address}
                                    />
                                    {errors.location?.address && (
                                        <p className="text-red-500 text-sm">{errors.location.address.message}</p>
                                    )}
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
                                    {errors.location?.number && !semNumero && (
                                        <p className="text-red-500 text-sm">{errors.location.number.message}</p>
                                    )}
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
                                        onClick={handlePreviousStep}
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
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

            {/* Alerta de erro ao cadastrar */}
            {errorMessage && (
                <AlertDialog open={!!errorMessage} onOpenChange={(open) => !open && setErrorMessage("")}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Erro no Cadastro</AlertDialogTitle>
                            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button
                                onClick={() => setErrorMessage("")}
                            >
                                Fechar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}