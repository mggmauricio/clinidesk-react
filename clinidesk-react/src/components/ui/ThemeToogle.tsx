"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
    { name: "Claro", value: "light", icon: "☀️" },
    { name: "Escuro", value: "dark", icon: "🌙" },
    { name: "Neon", value: "neon", icon: "⚡" },
];

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme") || "light";
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored);
    }, []);

    const changeTheme = (newTheme: string) => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <div className="flex items-center bg-muted/20 p-1 rounded-lg space-x-1">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => changeTheme(t.value)}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200",
                        theme === t.value
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-surface"
                            : "bg-transparent hover:bg-muted"
                    )}
                >
                    {t.icon} {t.name}
                </button>
            ))}
        </div>
    );
}
