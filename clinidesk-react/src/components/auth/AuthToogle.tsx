"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthToggleProps {
    onSelect: (role: "clinic" | "professional") => void;
}

export default function AuthToggle({ onSelect }: AuthToggleProps) {
    return (
        <Tabs defaultValue="clinic" onValueChange={(value) => onSelect(value as "clinic" | "professional")}>
            <TabsList className="w-full bg-muted p-1 rounded-lg flex">
                <TabsTrigger
                    value="clinic"
                    className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
                >
                    Clínica
                </TabsTrigger>
                <TabsTrigger
                    value="professional"
                    className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
                >
                    Profissional
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
