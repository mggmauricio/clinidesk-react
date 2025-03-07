"use client";

import React from "react";
import TopBar from "@/components/ui/TopBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary to-secondary">
            <TopBar />
            <main className="flex-1 flex items-center justify-center">
                {/* Ajustando largura máxima para melhor encaixe */}
                <div className="w-full max-w-4xl">{children}</div>
            </main>
        </div>
    );
}
