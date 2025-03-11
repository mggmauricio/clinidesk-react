"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthProfessionalSchema } from "@/schemas/health_professional";
import { LocationSchema } from "@/schemas/location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useViaCep } from "@/hooks/useViaCep";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { healthProfessionalService } from "@/services/health_professional";
import { createLocation } from "@/services/locations";
import { useRouter } from "next/navigation";
import { MaterialInput } from "@/components/ui/material-input";
import { FaUser, FaLock, FaIdCard, FaPhone, FaEnvelope, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { MapPin } from "lucide-react";

// Schema de formulário combinado
const FormSchema = HealthProfessionalSchema.extend({
    location: LocationSchema,
    sem_numero: z.boolean().optional().default(false),
});

type FormInputs = z.infer<typeof FormSchema>;

// Componente para o passo de credenciais
function CredentialsStep() {
    const { register, formState: { errors } } = useFormContext<FormInputs>();

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Dados de Acesso</h3>

            <MaterialInput
                label="Nome de Usuário"
                {...register("username")}
                startIcon={<FaUser />}
                errorMessage={errors.username?.message}
                required
                variant="outlined"
            />

            <MaterialInput
                label="Senha"
                type="password"
                {...register("password")}
                startIcon={<FaLock />}
                errorMessage={errors.password?.message}
                required
                variant="outlined"
            />
        </div>
    );
}

// Componente para o passo de informações pessoais
function PersonalInfoStep() {
    const { register, formState: { errors } } = useFormContext<FormInputs>();

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Dados Pessoais</h3>

            <MaterialInput
                label="Nome Completo"
                {...register("full_name")}
                startIcon={<FaUser />}
                errorMessage={errors.full_name?.message}
                required
                variant="outlined"
            />

            <MaterialInput
                label="CPF"
                {...register("identification_document")}
                startIcon={<FaIdCard />}
                errorMessage={errors.identification_document?.message}
                mask="XXX.XXX.XXX-XX"
                replacement={{ X: /\d/ }}
                required
                variant="outlined"
            />

            <MaterialInput
                label="Telefone"
                {...register("phone_number")}
                startIcon={<FaPhone />}
                errorMessage={errors.phone_number?.message}
                mask="(XX) XXXXX-XXXX"
                replacement={{ X: /\d/ }}
                required
                variant="outlined"
            />

            <MaterialInput
                label="Email"
                type="email"
                {...register("email")}
                startIcon={<FaEnvelope />}
                errorMessage={errors.email?.message}
                required
                variant="outlined"
            />
        </div>
    );
}

// Componente para o passo de informações profissionais
function ProfessionalInfoStep() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<FormInputs>();
    const isIndependent = watch("is_independent");

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Dados Profissionais</h3>

            <div className="space-y-1">
                <label className="text-sm font-medium">Profissão</label>
                <Select onValueChange={(value) => setValue("specialization", value, { shouldValidate: true })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma profissão" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="psicologo">Psicólogo</SelectItem>
                        <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                        <SelectItem value="nutricionista">Nutricionista</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                </Select>
                {errors.specialization && <p className="text-destructive text-xs">{errors.specialization.message}</p>}
            </div>

            <MaterialInput
                label="CNAE"
                {...register("cnae")}
                startIcon={<FaBriefcase />}
                errorMessage={errors.cnae?.message}
                variant="outlined"
            />

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id="is_independent"
                    checked={isIndependent}
                    onCheckedChange={(checked) =>
                        setValue("is_independent", checked === true, { shouldValidate: true })
                    }
                />
                <label htmlFor="is_independent" className="text-sm font-medium">Profissional Independente</label>
            </div>

            <MaterialInput
                label="Telefone do Bot (opcional)"
                {...register("bot_phone")}
                startIcon={<FaPhone />}
                errorMessage={errors.bot_phone?.message}
                mask="(XX) XXXXX-XXXX"
                replacement={{ X: /\d/ }}
                variant="outlined"
            />
        </div>
    );
}

// Componente para o passo de endereço
function AddressStep() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<FormInputs>();
    const [semNumero, setSemNumero] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // Helper function to format CEP (zip code)
    const formatCep = (cep: string) => {
        const digits = cep.replace(/\D/g, "");
        if (digits.length === 8) {
            return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        }
        return digits;
    };

    const cepValue = watch("location.zip_code") || "";
    const { address, loading, error: cepError } = useViaCep(cepValue);

    useEffect(() => {
        if (address) {
            setValue("location.address", address.logradouro || "", { shouldValidate: true });
            setValue("location.city", address.localidade || "", { shouldValidate: true });
            setValue("location.state", address.uf || "", { shouldValidate: true });
            setValue("location.zip_code", formatCep(cepValue), { shouldValidate: true });
        }
    }, [address, setValue, cepValue]);

    // Verificar se o campo "sem_numero" está marcado
    useEffect(() => {
        const semNumeroValue = watch("sem_numero");
        setSemNumero(!!semNumeroValue);
    }, [watch]);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Endereço</h3>

            <MaterialInput
                label="CEP"
                {...register("location.zip_code")}
                mask="XXXXX-XXX"
                replacement={{ X: /\d/ }}
                startIcon={<MapPin className="h-4 w-4" />}
                endIcon={loading ? <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /> : null}
                errorMessage={errors.location?.zip_code?.message}
                variant="outlined"
                inputSize="default"
                color="primary"
            />

            <MaterialInput
                label="Endereço"
                {...register("location.address")}
                startIcon={<FaMapMarkerAlt />}
                errorMessage={errors.location?.address?.message}
                disabled={!!address}
                required
                variant="outlined"
                className={watch("location.address") ? "has-value" : ""}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <MaterialInput
                        label="Número"
                        {...register("location.number")}
                        errorMessage={errors.location?.number?.message}
                        disabled={semNumero}
                        required={!semNumero}
                        variant="outlined"
                    />

                    <div className="flex items-center gap-1 mt-1">
                        <Checkbox
                            id="sem_numero"
                            checked={semNumero}
                            onCheckedChange={(checked) => {
                                setSemNumero(checked === true);
                                setValue("location.number", checked ? "S/N" : "", { shouldValidate: true });
                                setValue("sem_numero", checked === true, { shouldValidate: true });
                            }}
                        />
                        <label htmlFor="sem_numero" className="text-xs">Sem Número (S/N)</label>
                    </div>
                </div>

                <MaterialInput
                    label="Complemento"
                    {...register("location.complement")}
                    errorMessage={errors.location?.complement?.message}
                    variant="outlined"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaterialInput
                    label="Cidade"
                    {...register("location.city")}
                    startIcon={<FaCity />}
                    errorMessage={errors.location?.city?.message}
                    disabled={!!address}
                    required
                    variant="outlined"
                    className={watch("location.city") ? "has-value" : ""}
                />

                <MaterialInput
                    label="Estado"
                    {...register("location.state")}
                    errorMessage={errors.location?.state?.message}
                    disabled={!!address}
                    required
                    variant="outlined"
                    className={watch("location.state") ? "has-value" : ""}
                />
            </div>
        </div>
    );
}

// Componente principal
export default function RegisterHealthProfessional() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [semNumero, setSemNumero] = useState(false);
    const [stepErrors, setStepErrors] = useState<{ [key: number]: boolean }>({});

    // Referência para armazenar o formulário entre renderizações
    const formDataRef = useRef<FormInputs | null>(null);

    // Limpar dados salvos ao montar o componente
    useEffect(() => {
        // Limpar dados do localStorage ao entrar na página
        localStorage.removeItem('registerProfessionalForm');
        console.log("🧹 Dados do formulário limpos ao iniciar a página");
    }, []);

    // Valores padrão sempre em branco
    const defaultValues: FormInputs = {
        username: "",
        password: "",
        identification_document: "",
        full_name: "",
        phone_number: "",
        email: "",
        specialization: "",
        cnae: "",
        is_independent: false,
        bot_phone: "",
        sem_numero: false,
        location: {
            zip_code: "",
            address: "",
            number: "",
            city: "",
            state: "",
            country: "Brasil",
            complement: "",
        },
    };

    const methods = useForm<FormInputs>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues,
    });

    const { handleSubmit, formState: { isValid, errors }, control, trigger, getValues, watch } = methods;

    // Observar mudanças no formulário e salvar apenas durante a sessão atual
    useEffect(() => {
        const subscription = watch((value) => {
            // Salvar os dados atuais do formulário no localStorage apenas para a sessão atual
            const currentValues = getValues();
            // Usar sessionStorage em vez de localStorage para limpar ao fechar a aba/navegador
            sessionStorage.setItem('registerProfessionalForm', JSON.stringify(currentValues));

            // Atualizar a referência
            formDataRef.current = currentValues;
        });

        return () => subscription.unsubscribe();
    }, [watch, getValues]);

    // Função para verificar campos específicos de cada step
    const validateStep = async (step: number) => {
        let isStepValid = false;

        switch (step) {
            case 1:
                // Validar campos do step 1 (Credenciais)
                isStepValid = await trigger(["username", "password"]);
                break;
            case 2:
                // Validar campos do step 2 (Informações Pessoais)
                isStepValid = await trigger(["full_name", "identification_document", "phone_number", "email"]);
                break;
            case 3:
                // Validar campos do step 3 (Informações Profissionais)
                isStepValid = await trigger(["specialization", "cnae"]);
                break;
            case 4:
                // Validar campos do step 4 (Endereço)
                isStepValid = await trigger([
                    "location.zip_code",
                    "location.address",
                    "location.number",
                    "location.city",
                    "location.state"
                ]);
                break;
            default:
                isStepValid = true;
                break;
        }

        // Atualizar o estado de erros do step
        setStepErrors(prev => ({ ...prev, [step]: !isStepValid }));

        return isStepValid;
    };

    // Avançar para o próximo step com validação
    const handleNextStep = async () => {
        const isCurrentStepValid = await validateStep(currentStep);

        if (isCurrentStepValid) {
            // Salvar dados do formulário no sessionStorage para persistência apenas na sessão atual
            const formValues = getValues();
            sessionStorage.setItem('registerProfessionalForm', JSON.stringify(formValues));

            // Atualizar a referência
            formDataRef.current = formValues;

            setCurrentStep((prev) => prev + 1);
        } else {
            // Mostrar mensagem de erro se o step não for válido
            setErrorMessage("Por favor, preencha todos os campos obrigatórios corretamente antes de continuar.");

            // Limpar a mensagem de erro após 3 segundos
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    // Voltar para o step anterior
    const handlePrevStep = () => {
        // Salvar dados do formulário no sessionStorage para persistência apenas na sessão atual
        const formValues = getValues();
        sessionStorage.setItem('registerProfessionalForm', JSON.stringify(formValues));

        // Atualizar a referência
        formDataRef.current = formValues;

        setCurrentStep((prev) => prev - 1);
    };

    // Limpar dados salvos ao submeter o formulário com sucesso
    const clearSavedForm = () => {
        localStorage.removeItem('registerProfessionalForm');
        sessionStorage.removeItem('registerProfessionalForm');
        formDataRef.current = null;
    };

    const onSubmit = async (data: FormInputs) => {
        // Validar o último step antes de submeter
        const isLastStepValid = await validateStep(4);
        if (!isLastStepValid) {
            setErrorMessage("Por favor, preencha todos os campos obrigatórios corretamente antes de submeter.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Format and create location first
            const locationData = {
                zip_code: data.location.zip_code.replace(/\D/g, ""),
                address: data.location.address.trim(),
                number: data.sem_numero ? "S/N" : data.location.number.trim(),
                city: data.location.city.trim(),
                state: data.location.state.trim(),
                country: "Brasil",
                complement: data.location.complement?.trim() || "",
            };

            console.log("Creating location:", locationData);
            const createdLocation = await createLocation(locationData);

            console.log("Response from createLocation:", createdLocation);

            if (!createdLocation) {
                throw new Error("Erro ao criar localização: Resposta vazia");
            }

            if (!createdLocation.id) {
                throw new Error("Erro ao criar localização: ID não retornado");
            }

            const locationId = createdLocation.id;
            console.log("Location created with ID:", locationId);

            // Now create the health professional with the location ID
            const professionalData = {
                username: data.username,
                password: data.password,
                identification_document: data.identification_document.replace(/\D/g, ""),
                full_name: data.full_name,
                phone_number: data.phone_number.replace(/\D/g, ""),
                email: data.email,
                specialization: data.specialization,
                cnae: data.cnae,
                is_independent: data.is_independent,
                bot_phone: data.bot_phone?.replace(/\D/g, "") || "",
                location_id: locationId // Usar a variável separada para garantir
            };

            console.log("Creating health professional with data:", {
                ...professionalData,
                password: "********" // Ocultar senha no log
            });

            // Verificar explicitamente se o location_id está definido
            if (!professionalData.location_id) {
                throw new Error("ID da localização não foi definido corretamente.");
            }

            // Tentar criar o profissional com o location_id explícito
            const createdProfessional = await healthProfessionalService.create({
                ...professionalData,
                location_id: locationId // Garantir que o location_id está sendo passado
            });

            console.log("Response from create health professional:", createdProfessional);

            if (!createdProfessional) {
                throw new Error("Erro ao cadastrar profissional de saúde: Resposta vazia");
            }

            setSuccessMessage("Cadastro realizado com sucesso!");

            // Limpar dados salvos após sucesso
            clearSavedForm();

            setTimeout(() => {
                router.push("/health-professionals");
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage(`Erro ao cadastrar: ${error instanceof Error ? error.message : 'Tente novamente.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderiza o conteúdo do passo atual
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <CredentialsStep />;
            case 2:
                return <PersonalInfoStep />;
            case 3:
                return <ProfessionalInfoStep />;
            case 4:
                return <AddressStep />;
            default:
                return null;
        }
    };

    // Componente para indicador de progresso
    const StepIndicator = () => {
        return (
            <div className="flex justify-between mb-6">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                                    ${currentStep === step
                                    ? 'bg-primary text-white'
                                    : currentStep > step
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'}`}
                        >
                            {currentStep > step ? '✓' : step}
                        </div>
                        <div className="text-xs text-center font-medium">
                            {step === 1 && "Acesso"}
                            {step === 2 && "Pessoal"}
                            {step === 3 && "Profissional"}
                            {step === 4 && "Endereço"}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex justify-center w-full py-8">
            <Card className="w-full max-w-2xl shadow-2xl border border-border bg-card text-card-foreground">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-center">Cadastro de Profissional de Saúde</CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                    <StepIndicator />

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {renderStepContent()}

                            <div className="flex justify-between pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    disabled={currentStep === 1}
                                >
                                    Voltar
                                </Button>

                                {currentStep < 4 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNextStep}
                                        className={stepErrors[currentStep] ? "bg-red-100" : ""}
                                    >
                                        Próximo
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={!isValid || isSubmitting}
                                    >
                                        {isSubmitting ? "Enviando..." : "Cadastrar"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>

            {/* Alerta de erro */}
            {errorMessage && (
                <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Erro</AlertDialogTitle>
                            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setErrorMessage(null)}>
                                Fechar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Alerta de sucesso */}
            {successMessage && (
                <AlertDialog open={!!successMessage} onOpenChange={() => setSuccessMessage(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sucesso</AlertDialogTitle>
                            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setSuccessMessage(null)}>
                                Fechar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}