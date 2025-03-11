"use client";

import { forwardRef, useState, useRef, useEffect, type ReactNode, type InputHTMLAttributes, useCallback } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { InputMask } from "@react-input/mask";

// Definindo os tipos para as variantes
type InputVariantType = "default" | "filled" | "outlined";
type InputSizeType = "default" | "sm" | "lg";
type InputColorType = "default" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "danger";

const inputVariants = cva(
    "w-full bg-transparent text-foreground focus:outline-none focus:ring-0 placeholder:text-transparent transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-0 border-b-2 border-muted-foreground/50 focus:border-primary px-0 py-2",
                filled: "border-0 border-b-2 border-muted-foreground/50 focus:border-primary bg-muted/20 rounded-t-md px-3 pb-2 pt-7",
                outlined: "border-2 border-muted-foreground/50 focus:border-primary rounded-md px-3 py-3",
            },
            size: {
                default: "h-14 text-base",
                sm: "h-12 text-sm",
                lg: "h-16 text-lg",
            },
            error: {
                true: "border-destructive focus:border-destructive",
                false: "",
            },
            color: {
                default: "focus:border-primary",
                primary: "focus:border-primary",
                secondary: "focus:border-secondary",
                accent: "focus:border-accent",
                info: "focus:border-blue-500",
                success: "focus:border-green-500",
                warning: "focus:border-yellow-500",
                danger: "focus:border-destructive",
            },
            bgColor: {
                default: "",
                primary: "bg-primary/5",
                secondary: "bg-secondary/5",
                accent: "bg-accent/5",
                info: "bg-blue-500/5",
                success: "bg-green-500/5",
                warning: "bg-yellow-500/5",
                danger: "bg-destructive/5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            error: false,
            color: "default",
            bgColor: "default",
        },
    }
);

const labelVariants = cva(
    "absolute pointer-events-none transition-all duration-200",
    {
        variants: {
            variant: {
                default: "left-0 text-muted-foreground",
                filled: "left-3 text-muted-foreground",
                outlined: "left-3 text-muted-foreground",
            },
            size: {
                default: "text-base",
                sm: "text-sm",
                lg: "text-lg",
            },
            state: {
                resting: "top-1/2 -translate-y-1/2",
                floating: "top-[-0.5rem] text-xs text-primary",
                error: "top-[-0.5rem] text-xs text-destructive",
            },
            color: {
                default: "",
                primary: "text-primary",
                secondary: "text-secondary",
                accent: "text-accent",
                info: "text-blue-500",
                success: "text-green-500",
                warning: "text-yellow-500",
                danger: "text-destructive",
            },
            // Variantes adicionais para posicionamento específico da label
            filledFloating: {
                true: "top-2",
                false: "",
            },
            outlinedFloating: {
                true: "top-[-0.7rem]",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            state: "resting",
            color: "default",
            filledFloating: false,
            outlinedFloating: false,
        },
    }
);

// Omitindo a propriedade size do HTMLInputElement para evitar conflitos
export interface MaterialInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label: string;
    variant?: InputVariantType;
    inputSize?: InputSizeType;
    errorMessage?: string;
    helperText?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    containerClassName?: string;
    color?: InputColorType;
    bgColor?: InputColorType;
    mask?: string;
    replacement?: Record<string, RegExp>;
    disabled?: boolean;
}

const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(
    (
        {
            label,
            variant = "default",
            inputSize = "default",
            errorMessage,
            helperText,
            startIcon,
            endIcon,
            className,
            containerClassName,
            required,
            color = "default",
            bgColor = "default",
            mask,
            replacement,
            disabled,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        // Verificar se o input tem valor inicialmente
        useEffect(() => {
            // Verificar o valor inicial
            const initialValue = props.value || props.defaultValue || "";
            setHasValue(!!initialValue);

            // Verificar se o campo já tem um valor definido
            if (inputRef.current) {
                setHasValue(!!inputRef.current.value);
            }
        }, [props.value, props.defaultValue]);

        // Verificar periodicamente se o campo tem valor
        useEffect(() => {
            // Verificar imediatamente
            if (inputRef.current) {
                setHasValue(!!inputRef.current.value);
            }

            // Verificar a cada 500ms para garantir que o estado esteja sincronizado
            const interval = setInterval(() => {
                if (inputRef.current) {
                    setHasValue(!!inputRef.current.value);
                }
            }, 500);

            return () => clearInterval(interval);
        }, []);

        // Merge refs
        const handleRef = (instance: HTMLInputElement | null) => {
            // Update internal ref
            inputRef.current = instance;

            // Verificar se o campo tem valor quando a ref é atualizada
            if (instance) {
                setHasValue(!!instance.value);
            }

            // Forward the ref
            if (typeof ref === 'function') {
                ref(instance);
            } else if (ref) {
                ref.current = instance;
            }
        };

        // Determine label state
        const labelState = errorMessage
            ? "error"
            : isFocused || hasValue
                ? "floating"
                : "resting";

        // Determine label color
        const labelColor = errorMessage
            ? "danger"
            : isFocused
                ? color
                : "default";

        // Determine padding classes based on icons
        const paddingClasses = cn(
            startIcon && "pl-10",
            endIcon && "pr-10"
        );

        // Handle input change
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setHasValue(!!newValue);

            // Call the original onChange handler if provided
            if (props.onChange) {
                props.onChange(e);
            }
        }, [props.onChange]);

        // Handle focus
        const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (props.onFocus) {
                props.onFocus(e);
            }
        }, [props.onFocus]);

        // Handle blur
        const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            // Importante: atualizar hasValue quando o campo perde o foco
            setHasValue(!!e.target.value);
            if (props.onBlur) {
                props.onBlur(e);
            }
        }, [props.onBlur]);

        // Componente personalizado para o InputMask que mantém o foco
        const CustomInputComponent = useCallback(
            forwardRef<HTMLInputElement, any>((inputProps, inputRef) => {
                return (
                    <input
                        {...inputProps}
                        ref={inputRef}
                        className={cn(
                            inputVariants({
                                variant,
                                size: inputSize,
                                error: !!errorMessage,
                                color,
                                bgColor,
                            }),
                            paddingClasses,
                            "flex items-center justify-center", // Centraliza o texto verticalmente e horizontalmente
                            className
                        )}
                    />
                );
            }),
            [variant, inputSize, errorMessage, color, bgColor, paddingClasses, className]
        );

        CustomInputComponent.displayName = "CustomInputComponent";

        // Certifique-se de que disabled seja um booleano
        const inputProps = {
            ...props,
            disabled: disabled === true, // Converta para booleano explicitamente
            className: cn(
                inputVariants({
                    variant,
                    size: inputSize,
                    error: !!errorMessage,
                    color,
                    bgColor,
                }),
                paddingClasses,
                "flex items-center justify-center", // Centraliza o texto verticalmente e horizontalmente
                className
            ),
            ref: handleRef,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChange: handleChange,
        };

        return (
            <div className={cn(
                "relative w-full mb-5",
                containerClassName,
                (props.value || inputRef.current?.value) ? "material-input-has-value" : ""
            )}>
                <div className="relative flex items-center">
                    {/* Ícones posicionados com z-index para ficarem ao lado da label em estado de repouso */}
                    {startIcon && (
                        <div className={cn(
                            "absolute left-0 pl-3 z-10",
                            variant === "filled" ? "top-[60%] -translate-y-1/2" :
                                variant === "outlined" ? "top-1/2 -translate-y-1/2" :
                                    "top-1/2 -translate-y-1/2",
                            errorMessage ? "text-destructive" : isFocused ? `text-${color}` : "text-muted-foreground"
                        )}>
                            {startIcon}
                        </div>
                    )}

                    <div className="relative w-full">
                        {/* Renderiza InputMask se mask for fornecido, caso contrário renderiza input normal */}
                        {mask ? (
                            <InputMask
                                mask={mask}
                                replacement={replacement}
                                {...inputProps}
                            />
                        ) : (
                            <input {...inputProps} />
                        )}

                        {/* Label com background para cortar a borda na variante outlined */}
                        <label
                            className={cn(
                                labelVariants({
                                    variant,
                                    size: inputSize,
                                    state: labelState,
                                    color: labelColor as any,
                                    filledFloating: variant === "filled" && (labelState === "floating" || labelState === "error"),
                                    outlinedFloating: variant === "outlined" && (labelState === "floating" || labelState === "error"),
                                }),
                                // Adicionar background à label quando estiver em estado de erro ou floating
                                (labelState === "floating" || labelState === "error") && variant === "outlined" && "px-1 bg-background z-20",
                                // Garantir que a label tenha background mesmo quando há erro
                                errorMessage && variant === "outlined" && "px-1 bg-background z-20",
                                labelState === "floating" && variant === "default" && "left-0",
                                startIcon && labelState === "resting" && "ml-10", // Aumentado o espaçamento para ml-10
                            )}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    </div>

                    {endIcon && (
                        <div className={cn(
                            "absolute right-0 pr-3 z-10",
                            variant === "filled" ? "top-[60%] -translate-y-1/2" :
                                variant === "outlined" ? "top-1/2 -translate-y-1/2" :
                                    "top-1/2 -translate-y-1/2",
                            errorMessage ? "text-destructive" : isFocused ? `text-${color}` : "text-muted-foreground"
                        )}>
                            {endIcon}
                        </div>
                    )}
                </div>

                {/* Linha de erro ou mensagem de ajuda */}
                {variant === "default" && errorMessage && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-destructive" />
                )}

                {(errorMessage || helperText) && (
                    <div className={cn(
                        "text-xs mt-1",
                        errorMessage ? "text-destructive" : "text-muted-foreground"
                    )}>
                        {errorMessage || helperText}
                    </div>
                )}
            </div>
        );
    }
);

MaterialInput.displayName = "MaterialInput";

export { MaterialInput };