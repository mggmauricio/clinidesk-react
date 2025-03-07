const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("API Fetch error:", error);
    return null;
  }
};
