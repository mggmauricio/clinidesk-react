import { apiFetch } from "@/services/api";
import { HealthProfessional } from "@/models/health_professional";

export const healthProfessionalService = {
    async create(data: Omit<HealthProfessional, "id" | "created_at" | "updated_at"> & { password?: string }): Promise<HealthProfessional | null> {
        console.log("healthProfessionalService.create - Data being sent:", {
            ...data,
            password: data.password ? "********" : undefined,
            birth_date: data.birth_date // Mostrar o formato da data que está sendo enviada
        });
        return apiFetch("/health-professionals", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async getAll(page: number = 1, size: number = 100): Promise<{ total: number; page: number; size: number; items: HealthProfessional[] } | null> {
        return apiFetch(`/health-professionals?page=${page}&size=${size}`);
    },

    async getById(id: string): Promise<HealthProfessional | null> {
        return apiFetch(`/health-professionals/${id}`);
    },

    async update(id: string, data: Partial<HealthProfessional>): Promise<HealthProfessional | null> {
        return apiFetch(`/health-professionals/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<HealthProfessional | null> {
        return apiFetch(`/health-professionals/${id}`, {
            method: "DELETE",
        });
    },
};
