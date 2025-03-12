"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedUserTypes?: string[]; // Tipos de usuário permitidos (opcional)
}

export default function ProtectedRoute({
    children,
    allowedUserTypes
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, userType, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Verificar se o usuário está autenticado
            if (!isAuthenticated) {
                router.push("/login");
            }
            // Verificar se o tipo de usuário tem permissão
            else if (allowedUserTypes && allowedUserTypes.length > 0 && userType) {
                if (!allowedUserTypes.includes(userType)) {
                    // Redirecionar para a dashboard apropriada
                    if (userType === "clinic") {
                        router.push("/dashboard/clinic");
                    } else if (userType === "health_professional") {
                        router.push("/dashboard/professional");
                    } else {
                        // Caso de tipo desconhecido, fazer logout
                        logout();
                    }
                }
            }
        }
    }, [isAuthenticated, isLoading, userType, router, allowedUserTypes, logout]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>;
    }

    // Verificar permissões
    if (allowedUserTypes && allowedUserTypes.length > 0 && userType) {
        if (!allowedUserTypes.includes(userType)) {
            return null; // Não renderizar nada enquanto redireciona
        }
    }

    return isAuthenticated ? <>{children}</> : null;
} 