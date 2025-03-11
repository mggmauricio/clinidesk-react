"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClinicDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard da Clínica</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Consultas Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">23</p>
                        <p className="text-muted-foreground">5 profissionais</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">542</p>
                        <p className="text-muted-foreground">+12 esta semana</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">8</p>
                        <p className="text-muted-foreground">2 novos este mês</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Faturamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">R$ 18.750</p>
                        <p className="text-muted-foreground">Este mês</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profissionais Ativos Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="border-b pb-2 flex justify-between">
                                <div>
                                    <p className="font-medium">Dra. Ana Souza</p>
                                    <p className="text-sm text-muted-foreground">Cardiologista</p>
                                </div>
                                <p className="text-sm font-medium">7 consultas</p>
                            </li>
                            <li className="border-b pb-2 flex justify-between">
                                <div>
                                    <p className="font-medium">Dr. Carlos Mendes</p>
                                    <p className="text-sm text-muted-foreground">Ortopedista</p>
                                </div>
                                <p className="text-sm font-medium">5 consultas</p>
                            </li>
                            <li className="flex justify-between">
                                <div>
                                    <p className="font-medium">Dra. Mariana Lima</p>
                                    <p className="text-sm text-muted-foreground">Pediatra</p>
                                </div>
                                <p className="text-sm font-medium">8 consultas</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ações Administrativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button>Adicionar Profissional</Button>
                            <Button>Gerenciar Agenda</Button>
                            <Button>Relatório Financeiro</Button>
                            <Button>Configurar Clínica</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 