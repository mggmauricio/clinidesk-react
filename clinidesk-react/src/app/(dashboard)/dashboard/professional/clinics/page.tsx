"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClinicsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Clínicas Parceiras</h1>

            <div className="flex justify-end mb-4">
                <Button>Buscar Novas Clínicas</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Minhas Clínicas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Clínica Saúde Total</h3>
                                <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Agendar</Button>
                            </div>
                        </div>

                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Centro Médico Bem Estar</h3>
                                <p className="text-sm text-muted-foreground">Rio de Janeiro, RJ</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Agendar</Button>
                            </div>
                        </div>

                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Instituto de Saúde Integrada</h3>
                                <p className="text-sm text-muted-foreground">Belo Horizonte, MG</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Agendar</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 