"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfessionalDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard do Profissional</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Consultas Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">5</p>
                        <p className="text-muted-foreground">Próxima: 14:30</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">128</p>
                        <p className="text-muted-foreground">+3 esta semana</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Faturamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">R$ 4.500</p>
                        <p className="text-muted-foreground">Este mês</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="border-b pb-2">
                                <p className="font-medium">Consulta com Maria Oliveira</p>
                                <p className="text-sm text-muted-foreground">Hoje, 10:30</p>
                            </li>
                            <li className="border-b pb-2">
                                <p className="font-medium">Novo prontuário criado</p>
                                <p className="text-sm text-muted-foreground">Ontem, 15:45</p>
                            </li>
                            <li>
                                <p className="font-medium">Pagamento recebido</p>
                                <p className="text-sm text-muted-foreground">Ontem, 09:15</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button>Nova Consulta</Button>
                            <Button>Novo Paciente</Button>
                            <Button>Enviar Mensagem</Button>
                            <Button>Gerar Relatório</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 