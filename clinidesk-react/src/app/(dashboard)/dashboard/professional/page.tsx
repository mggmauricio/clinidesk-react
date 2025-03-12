"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfessionalDashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedUserTypes={["health_professional"]}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard do Profissional de Saúde</h1>

                {user && (
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold mb-2">Bem-vindo, {user.username}!</h2>
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">ID: {user.user_id}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Próximos Agendamentos</h3>
                        <p className="text-gray-600">Visualize seus próximos agendamentos aqui.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Pacientes</h3>
                        <p className="text-gray-600">Gerencie seus pacientes.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Financeiro</h3>
                        <p className="text-gray-600">Acompanhe seus ganhos e pagamentos.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 