"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const { isAuthenticated, userType } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirecionar se já estiver autenticado
        if (isAuthenticated) {
            if (userType === "clinic") {
                router.push("/dashboard/clinic");
            } else if (userType === "health_professional") {
                router.push("/dashboard/professional");
            } else {
                router.push("/dashboard");
            }
        }
    }, [isAuthenticated, userType, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">CliniDesk</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sistema de Gestão para Clínicas de Saúde
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
