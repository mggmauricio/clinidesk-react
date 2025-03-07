import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            {/* Lado Esquerdo: Banner */}
            <div className="hidden md:flex flex-1 bg-gradient-to-r from-teal-700 to-teal-500 text-white p-10 relative">
                <div className="max-w-lg">
                    <h1 className="text-4xl font-bold">Cuidando da sua saúde com excelência</h1>
                    <p className="mt-4 text-lg">
                        Um sistema completo para gerenciar clínicas com múltiplos profissionais de saúde, permitindo agendamentos e gestão integrada.
                    </p>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                            ✅ <span>Segurança e Privacidade</span>
                        </div>
                        <div className="flex items-center gap-2">
                            ⚡ <span>Eficiência no Atendimento</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 text-xs">
                    © 2025 Sistema de Gerenciamento de Clínicas de Saúde. Todos os direitos reservados.
                </div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full">{children}</div>
            </div>
        </div>
    );
}
