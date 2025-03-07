import { apiFetch } from "./api";
import { LocationFormInputs } from "@/schemas/location";
import { Location } from "@/models/location";

// 🏠 Criar uma nova localização
export const createLocation = async (locationData: Omit<Location, "id">): Promise<Location | null> => {
  try {
    return await apiFetch("/locations/", {
      method: "POST",
      body: JSON.stringify(locationData),
    });
  } catch (error) {
    console.error("Erro ao criar localização:", error);
    return null;
  }
};

// 🏠 Buscar localização por ID
export const fetchLocationById = async (locationId: string): Promise<Location | null> => {
  try {
    return await apiFetch(`/locations/${locationId}/`);
  } catch (error) {
    console.error("Erro ao buscar localização:", error);
    return null;
  }
};

// 🏠 Atualizar uma localização
export const updateLocation = async (locationId: string, locationData: Partial<LocationFormInputs>): Promise<Location | null> => {
  try {
    return await apiFetch(`/locations/${locationId}/`, {
      method: "PUT",
      body: JSON.stringify(locationData),
    });
  } catch (error) {
    console.error("Erro ao atualizar localização:", error);
    return null;
  }
};

// 🏠 Deletar uma localização
export const deleteLocation = async (locationId: string): Promise<boolean> => {
  try {
    await apiFetch(`/locations/${locationId}/`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Erro ao deletar localização:", error);
    return false;
  }
};
