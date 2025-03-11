"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Aqui você pode implementar a lógica para verificar o tipo de usuário
        // Por exemplo, verificando um token JWT ou fazendo uma chamada à API

        // Para fins de demonstração, vamos redirecionar para o dashboard de profissional
        // Em uma aplicação real, você verificaria o tipo de usuário autenticado
        router.push("/dashboard/professional");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Redirecionando...</p>
        </div>
    );
} 