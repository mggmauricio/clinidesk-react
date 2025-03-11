"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfessionalsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Profissionais</h1>

            <div className="flex justify-end mb-4">
                <Button>Adicionar Profissional</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Profissionais</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Dr. João Silva</h3>
                                <p className="text-sm text-muted-foreground">Cardiologista</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Editar</Button>
                            </div>
                        </div>

                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Dra. Ana Souza</h3>
                                <p className="text-sm text-muted-foreground">Pediatra</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Editar</Button>
                            </div>
                        </div>

                        <div className="p-4 border rounded-md flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Dr. Carlos Mendes</h3>
                                <p className="text-sm text-muted-foreground">Ortopedista</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                                <Button variant="outline" size="sm">Editar</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 