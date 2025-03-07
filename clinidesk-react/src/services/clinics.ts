import { apiFetch } from "./api";
import { Clinic } from "@/models/clinic";
import { ClinicFormInputs } from "@/schemas/clinic";

// 📌 1. Buscar todas as clínicas (com paginação e filtro opcional por nome)
export const fetchClinics = async (skip = 0, limit = 10, name?: string): Promise<Clinic[]> => {
  const query = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (name) query.append("name", name);

  return apiFetch(`/clinics/?${query.toString()}`);
};

// 📌 2. Criar uma nova clínica
export const createClinic = async (clinicData: ClinicFormInputs): Promise<boolean> => {
    try {
        const response = await apiFetch("/clinics/", {
            method: "POST",
            body: JSON.stringify(clinicData),
        });

        return response !== null;
    } catch (error) {
        console.error("Erro ao criar clínica:", error);
        return false;
    }
};

// 📌 3. Buscar uma clínica por ID
export const fetchClinicById = async (clinicId: string): Promise<Clinic> => {
  return apiFetch(`/clinics/${clinicId}/`);
};

// 📌 4. Atualizar uma clínica
export const updateClinic = async (clinicId: string, clinicData: Partial<ClinicFormInputs>): Promise<Clinic> => {
  return apiFetch(`/clinics/${clinicId}/`, {
    method: "PUT",
    body: JSON.stringify(clinicData),
  });
};

// 📌 5. Deletar uma clínica
export const deleteClinic = async (clinicId: string): Promise<void> => {
  return apiFetch(`/clinics/${clinicId}/`, {
    method: "DELETE",
  });
};
