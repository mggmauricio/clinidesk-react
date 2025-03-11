"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToogle";
import { Bell } from "lucide-react";
import Image from "next/image";

interface TopbarProps {
    companyName?: string;
}

export default function Topbar({ companyName }: TopbarProps) {
    const [notificationCount, setNotificationCount] = useState(5);
    const [currentTheme, setCurrentTheme] = useState<string>("light");

    // Detectar o tema atual
    useEffect(() => {
        // Verificar o tema inicial
        const storedTheme = localStorage.getItem("theme") || "light";
        setCurrentTheme(storedTheme);

        // Observar mudanças no tema
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute("data-theme") || "light";
            setCurrentTheme(theme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"]
        });

        return () => observer.disconnect();
    }, []);

    // Determinar se é tema claro
    const isLightTheme = currentTheme !== "dark";

    return (
        <header className={`h-16 flex items-center justify-between px-4 ${isLightTheme
            ? 'bg-[#f8f9fa] text-[#333333] border-b border-[#e9ecef]'
            : 'bg-[#1e2124] text-[#e9ecef] border-b border-[#2d3238]'
            }`}>
            <div className="w-16"></div> {/* Espaço vazio para equilibrar o layout */}

            <div className="text-center flex-1 flex justify-center items-center">
                <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                    {/* Logo */}
                    <div className="relative h-6 w-6">
                        <Image
                            src="/logo.png"
                            alt="CliniDesk Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">CliniDesk</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notificações */}
                <div className="relative">
                    <button className="p-2 rounded-md flex items-center justify-center border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] transition-all duration-200 hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)]">
                        <Bell className="h-4 w-4" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Seletor de tema */}
                <ThemeToggle />
            </div>
        </header>
    );
} 