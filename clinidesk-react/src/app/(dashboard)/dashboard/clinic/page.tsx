"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClinicDashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedUserTypes={["clinic"]}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard da Clínica</h1>

                {user && (
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold mb-2">Bem-vinda, {user.username}!</h2>
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">ID: {user.user_id}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Profissionais</h3>
                        <p className="text-gray-600">Gerencie os profissionais da clínica.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Agendamentos</h3>
                        <p className="text-gray-600">Visualize todos os agendamentos da clínica.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Financeiro</h3>
                        <p className="text-gray-600">Acompanhe o faturamento da clínica.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 