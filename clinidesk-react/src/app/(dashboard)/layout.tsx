"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Determinar o tipo de usuário com base na rota
    // Se a rota contém '/dashboard/clinic', é uma clínica, caso contrário é um profissional
    const isClinicRoute = pathname.includes('/dashboard/clinic');

    // Dados do usuário baseados na rota
    const userInfo = isClinicRoute
        ? {
            userType: "clinic" as const,
            userName: "Clínica Saúde Total",
            companyName: "Clínica Saúde Total"
        }
        : {
            userType: "professional" as const,
            userName: "Dr. João Silva",
            companyName: "Clínica Exemplo"
        };

    return (
        <DashboardLayout
            userType={userInfo.userType}
            userName={userInfo.userName}
            companyName={userInfo.companyName}
        >
            {children}
        </DashboardLayout>
    );
} 