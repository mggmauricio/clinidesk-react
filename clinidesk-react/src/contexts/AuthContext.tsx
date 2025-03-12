"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, LoginCredentials, TokenResponse, UserData } from "@/services/auth";

interface AuthContextType {
    user: UserData | null;
    userType: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Verificar autenticação ao carregar a página
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    // Carregar informações do usuário
                    const userData = await authService.getUserInfo();
                    setUser(userData);
                    setUserType(userData.user_type);
                    localStorage.setItem("user_type", userData.user_type);
                    localStorage.setItem("user_id", userData.user_id);
                } catch (error) {
                    console.error("Erro ao carregar dados do usuário:", error);
                    authService.logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            // Fazer login e obter token
            const tokenResponse: TokenResponse = await authService.login(credentials);

            // Salvar token e informações básicas
            localStorage.setItem("access_token", tokenResponse.access_token);
            localStorage.setItem("user_type", tokenResponse.user_type);
            localStorage.setItem("user_id", tokenResponse.user_id);

            setUserType(tokenResponse.user_type);

            // Carregar informações completas do usuário
            const userData = await authService.getUserInfo();
            setUser(userData);

            // Redirecionar para a dashboard apropriada
            if (tokenResponse.user_type === "clinic") {
                router.push("/dashboard/clinic");
            } else if (tokenResponse.user_type === "health_professional") {
                router.push("/dashboard/professional");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Erro de login:", error);
            setError(error instanceof Error ? error.message : "Usuário ou senha incorretos");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setUserType(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userType,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 