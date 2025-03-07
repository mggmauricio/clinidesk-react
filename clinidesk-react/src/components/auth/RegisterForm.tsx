"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RegisterClinic from "./RegisterClinic";
import RegisterProfessional from "./RegisterProfessional";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClinicMedical, FaUserMd } from "react-icons/fa";

export default function RegisterForm() {
    const [selectedTab, setSelectedTab] = useState<"clinic" | "professional">("clinic");

    const headerData = {
        clinic: {
            icon: <FaClinicMedical className="text-4xl text-primary" />,
            title: "Cadastro de Clínica",
            subtitle: "Faça seu registro como Clínica e gerencie seus serviços."
        },
        professional: {
            icon: <FaUserMd className="text-4xl text-primary" />,
            title: "Cadastro de Profissional",
            subtitle: "Cadastre-se como profissional e gerencie seus atendimentos."
        }
    };

    const { icon, title, subtitle } = headerData[selectedTab];

    return (
        <div className="flex items-center justify-center min-h-screen py-10">
            <Card className="w-full max-w-3xl shadow-2xl border border-border bg-card text-card-foreground transition-all duration-300">
                <CardHeader className="text-center">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-3">
                            {icon}
                            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                        </div>
                        <p className="text-lg text-primary">{subtitle}</p>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs
                        defaultValue="clinic"
                        onValueChange={(value) => setSelectedTab(value as "clinic" | "professional")}
                        className="w-full"
                    >
                        <TabsList className="w-full flex bg-muted p-2 rounded-lg gap-2">
                            <TabsTrigger
                                value="clinic"
                                className="flex-1 text-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-md"
                            >
                                Clínica
                            </TabsTrigger>
                            <TabsTrigger
                                value="professional"
                                className="flex-1 text-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 rounded-md"
                            >
                                Profissional
                            </TabsTrigger>
                        </TabsList>

                        <div className="w-full mt-4 flex items-center justify-center">
                            <TabsContent value="clinic" className="w-full transition-all duration-300">
                                <RegisterClinic />
                            </TabsContent>
                            <TabsContent value="professional" className="w-full transition-all duration-300">
                                <RegisterProfessional />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
