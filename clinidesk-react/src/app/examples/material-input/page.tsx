"use client";

import { useState } from "react";
import MaterialInputExample from "@/components/examples/material-input-example";
import MaterialInputWithHookForm from "@/components/examples/material-input-with-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialInput } from "@/components/ui/material-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUser, FaEnvelope, FaPhone, FaPalette, FaIdCard, FaCalendarAlt, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function MaterialInputDemoPage() {
    const [values, setValues] = useState({
        default: "",
        filled: "",
        outlined: "",
        error: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        bgPrimary: "",
        bgSuccess: "",
        phone: "",
        cpf: "",
        date: "",
        creditCard: "",
        money: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Demonstração do Material Input</h1>

            <div className="mb-12">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Variantes do Material Input</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Variantes de Estilo</h3>
                            <MaterialInput
                                label="Default"
                                name="default"
                                value={values.default}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaUser />}
                            />

                            <MaterialInput
                                label="Filled"
                                name="filled"
                                value={values.filled}
                                onChange={handleChange}
                                variant="filled"
                                startIcon={<FaEnvelope />}
                            />

                            <MaterialInput
                                label="Outlined"
                                name="outlined"
                                value={values.outlined}
                                onChange={handleChange}
                                variant="outlined"
                                startIcon={<FaPhone />}
                            />

                            <MaterialInput
                                label="Com Erro"
                                name="error"
                                value={values.error}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaEnvelope />}
                                errorMessage="Este campo tem um erro"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Variantes de Cor</h3>
                            <MaterialInput
                                label="Cor Primária"
                                name="primary"
                                value={values.primary}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaPalette />}
                                color="primary"
                            />

                            <MaterialInput
                                label="Cor Secundária"
                                name="secondary"
                                value={values.secondary}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaPalette />}
                                color="secondary"
                            />

                            <MaterialInput
                                label="Cor Sucesso"
                                name="success"
                                value={values.success}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaPalette />}
                                color="success"
                            />

                            <MaterialInput
                                label="Cor Perigo"
                                name="danger"
                                value={values.danger}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaPalette />}
                                color="danger"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-12">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Cores de Fundo</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <MaterialInput
                                label="Fundo Primário"
                                name="bgPrimary"
                                value={values.bgPrimary}
                                onChange={handleChange}
                                variant="filled"
                                startIcon={<FaPalette />}
                                color="primary"
                                bgColor="primary"
                            />
                        </div>

                        <div>
                            <MaterialInput
                                label="Fundo Sucesso"
                                name="bgSuccess"
                                value={values.bgSuccess}
                                onChange={handleChange}
                                variant="outlined"
                                startIcon={<FaPalette />}
                                color="success"
                                bgColor="success"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-12">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Inputs com Máscara</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <MaterialInput
                                label="Telefone"
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaPhone />}
                                mask="(XX) XXXXX-XXXX"
                                replacement={{ X: /\d/ }}
                                color="primary"
                            />

                            <MaterialInput
                                label="CPF"
                                name="cpf"
                                value={values.cpf}
                                onChange={handleChange}
                                variant="filled"
                                startIcon={<FaIdCard />}
                                mask="XXX.XXX.XXX-XX"
                                replacement={{ X: /\d/ }}
                                color="info"
                            />
                        </div>

                        <div>
                            <MaterialInput
                                label="Data"
                                name="date"
                                value={values.date}
                                onChange={handleChange}
                                variant="outlined"
                                startIcon={<FaCalendarAlt />}
                                mask="XX/XX/XXXX"
                                replacement={{ X: /\d/ }}
                                color="success"
                            />

                            <MaterialInput
                                label="Cartão de Crédito"
                                name="creditCard"
                                value={values.creditCard}
                                onChange={handleChange}
                                variant="default"
                                startIcon={<FaCreditCard />}
                                mask="XXXX XXXX XXXX XXXX"
                                replacement={{ X: /\d/ }}
                                color="warning"
                            />

                            <MaterialInput
                                label="Valor (R$)"
                                name="money"
                                value={values.money}
                                onChange={handleChange}
                                variant="filled"
                                startIcon={<FaMoneyBillWave />}
                                mask="R$ XX.XXX,XX"
                                replacement={{ X: /\d/ }}
                                color="secondary"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                    <TabsTrigger value="basic">Exemplo Básico</TabsTrigger>
                    <TabsTrigger value="hook-form">Com React Hook Form</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <MaterialInputExample />
                </TabsContent>

                <TabsContent value="hook-form">
                    <MaterialInputWithHookForm />
                </TabsContent>
            </Tabs>
        </div>
    );
} 