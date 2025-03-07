"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary to-secondary">
            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <RegisterForm />
            </main>
        </div>
    );
}
