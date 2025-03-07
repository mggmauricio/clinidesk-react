"use client";

import { forwardRef } from "react";
import { InputMask, type InputMaskProps } from "@react-input/mask";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends InputMaskProps {
    label?: string;
    error?: string;
}

// Criando um input customizado para ser usado no InputMask
const MaskedInputComponent = forwardRef<HTMLInputElement, any>(({ className, error, ...props }, ref) => (
    <Input ref={ref} className={cn(className, error && "border-destructive")} {...props} />
));

MaskedInputComponent.displayName = "MaskedInputComponent";

// Wrapper do InputMask com o componente customizado
export function MaskedInput({ label, error, className, ...props }: MaskedInputProps) {
    return (
        <div className="space-y-1">
            {label && <label htmlFor={props.id} className="text-sm font-medium text-foreground">{label}</label>}

            <InputMask component={MaskedInputComponent} {...props} className={cn(className, error && "border-destructive")} />

            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
