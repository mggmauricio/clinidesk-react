"use client";

import ThemeToggle from "./ThemeToogle";
export default function TopBar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-0 h-10 bg-background text-foreground border-b border-border flex items-center justify-center">
            {/* 
        Usamos grid com 3 colunas para centralizar o título 
        e deixar o ThemeToggle à direita 
      */}
            <div className="grid grid-cols-3 items-center w-full px-4">
                <div />
                <div className="text-center">
                    <h1 className="text-xl font-bold">Nome do Sistema</h1>
                </div>
                <div className="flex justify-end">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
