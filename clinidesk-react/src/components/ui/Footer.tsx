"use client";

import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground border-t border-border h-16 flex flex-col items-center justify-center">
            <div className="flex space-x-4 mb-1">
                <a href="#" className="text-primary hover:text-primary/80 transition">
                    <FaLinkedin size={24} />
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                    <FaInstagram size={24} />
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                    <FaGithub size={24} />
                </a>
            </div>
            <p className="text-xs text-muted-foreground">
                © 2025 CliniDesk. Todos os direitos reservados.
            </p>
        </footer>
    );
}
