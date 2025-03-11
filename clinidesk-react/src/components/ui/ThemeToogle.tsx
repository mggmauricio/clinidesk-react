"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon, Zap } from "lucide-react";

const themes = [
    { name: "Claro", value: "light", icon: <Sun className="h-4 w-4" /> },
    { name: "Escuro", value: "dark", icon: <Moon className="h-4 w-4" /> },
    { name: "Neon", value: "neon", icon: <Zap className="h-4 w-4" /> },
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
        <div className="flex items-center bg-transparent rounded-lg space-x-1 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => changeTheme(t.value)}
                    className={cn(
                        "p-2 rounded-md transition-all duration-200 flex items-center justify-center",
                        theme === t.value
                            ? "bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.1)] text-primary"
                            : "bg-transparent hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                    )}
                    title={t.name}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    );
}
