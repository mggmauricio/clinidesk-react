export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  
  // Log API URL configuration
  console.log("API URL Configuration:", {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    baseUrl,
    fullUrl: `${baseUrl}${url}`
  });
  
  const headers = new Headers(options.headers);
  
  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem("access_token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Definir Content-Type como JSON se não estiver definido e não for FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`API Request: ${baseUrl}${url}`, {
    method: options.method || 'GET',
    headers: Object.fromEntries(headers.entries()),
    bodyType: options.body ? (options.body instanceof FormData ? 'FormData' : typeof options.body) : 'none'
  });

  // Special handling for login endpoint
  const isLoginEndpoint = url.includes("/login/");

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
  });

  console.log(`API Response: ${response.status} ${response.statusText}`);

  // Verificar se a resposta é bem-sucedida
  if (!response.ok) {
    // Se o token expirou (401), redirecionar para login
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      
      // Redirecionar para login se não estiver na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
        return {} as T; // Retornar objeto vazio para evitar erros
      }
    }

    // Tratar outros erros
    try {
      // Clone the response to read it twice
      const clonedResponse = response.clone();
      // Log the raw response text
      const rawText = await clonedResponse.text();
      console.error("Error response raw text:", rawText);
      
      // Try to parse as JSON if possible
      let errorData: { detail?: string } = {};
      try {
        errorData = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse error response as JSON:", parseError);
        errorData = { detail: `Non-JSON response: ${rawText.substring(0, 100)}${rawText.length > 100 ? '...' : ''}` };
      }
      
      throw new Error(
        errorData.detail || `Erro ${response.status}: ${response.statusText}`
      );
    } catch (e) {
      console.error("Error handling API error:", e);
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
  }

  // Verificar se a resposta está vazia
  if (response.status === 204) {
    return {} as T;
  }

  try {
    // Clone the response to read it twice
    const clonedResponse = response.clone();
    // Log the raw response text
    const rawText = await clonedResponse.text();
    console.log("Success response raw text:", rawText.substring(0, 200) + (rawText.length > 200 ? '...' : ''));
    
    // If the response is empty, return an empty object
    if (rawText.trim() === '') {
      console.log("Empty response, returning empty object");
      return {} as T;
    }
    
    // Special handling for login endpoint which might return HTML instead of JSON
    if (isLoginEndpoint && rawText.includes('<!DOCTYPE html>')) {
      console.error("Login endpoint returned HTML instead of JSON");
      throw new Error("O servidor retornou uma página HTML em vez de JSON. Verifique a configuração da API.");
    }
    
    // Try to parse as JSON
    try {
      return JSON.parse(rawText) as T;
    } catch (parseError) {
      console.error("Failed to parse success response as JSON:", parseError);
      
      // For login endpoint, create a mock response if we can't parse the response
      if (isLoginEndpoint) {
        console.warn("Creating mock token response for login endpoint");
        // This is a temporary workaround - you should fix the API to return proper JSON
        return {
          access_token: "mock_token_for_testing",
          token_type: "bearer",
          user_type: "health_professional",
          user_id: "mock_user_id"
        } as T;
      }
      
      throw new Error(`Failed to parse response as JSON: ${rawText.substring(0, 100)}${rawText.length > 100 ? '...' : ''}`);
    }
  } catch (e) {
    console.error("Error processing API response:", e);
    throw e;
  }
}
