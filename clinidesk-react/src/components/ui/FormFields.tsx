import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MaskedInput } from "./maked-input";
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id: string;
    inputClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, id, inputClassName, ...props }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-lg font-bold">
                {label}
            </Label>
            <Input
                id={id}
                {...props}
                className={cn("text-lg font-medium px-4 py-2", inputClassName)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

interface FormMaskedFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id: string;
    mask: string;
    replacement: string;
}

export const FormMaskedField: React.FC<FormMaskedFieldProps> = ({
    label,
    error,
    id,
    mask,
    replacement,
    ...props
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-lg font-bold">
                {label}
            </Label>
            <MaskedInput
                id={id}
                mask={mask}
                replacement={replacement}
                {...props}
                className="text-lg font-medium px-4 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};
