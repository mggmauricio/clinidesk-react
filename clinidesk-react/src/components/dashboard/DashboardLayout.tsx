"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userType: "professional" | "clinic";
    userName: string;
    userAvatar?: string;
    companyName?: string;
}

export default function DashboardLayout({
    children,
    userType,
    userName,
    userAvatar,
    companyName
}: DashboardLayoutProps) {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        // Implementar lógica de logout aqui
        // Por exemplo: limpar tokens, cookies, etc.

        // Redirecionar para a página de login
        router.push("/auth/login");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar
                userType={userType}
                userName={userName}
                userAvatar={userAvatar}
                onLogout={handleLogout}
                onToggle={handleSidebarToggle}
            />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
                <Topbar />

                <main className="flex-1">
                    <div className="p-6 bg-background text-foreground shadow-lg h-[calc(100vh-4rem)] overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 