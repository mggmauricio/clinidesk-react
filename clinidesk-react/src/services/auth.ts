import { apiFetch } from "@/services/api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_type: string; // "clinic" ou "health_professional"
  user_id: string;
}

export interface UserData {
  user_id: string;
  user_type: string;
  username: string;
  email: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    // Convertendo para FormData conforme esperado pelo endpoint OAuth2
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    console.log("Login attempt for username:", credentials.username);
    
    // Log FormData entries (without showing the actual password)
    const formDataEntries: Record<string, string> = {};
    formData.forEach((value, key) => {
      formDataEntries[key] = key === 'password' ? '********' : value.toString();
    });
    console.log("FormData entries:", formDataEntries);

    try {
      const response = await apiFetch("/auth/login/", {
        method: "POST",
        body: formData,
        // Não definimos Content-Type aqui para que o navegador defina automaticamente
        // com o boundary correto para FormData
      });
      console.log("Login successful, token response:", {
        ...response,
        access_token: response.access_token ? `${response.access_token.substring(0, 10)}...` : undefined
      });
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async getUserInfo(): Promise<UserData> {
    console.log("Fetching user info");
    try {
      const userData = await apiFetch("/auth/test-token/", {
        method: "POST",
      });
      console.log("User info fetched successfully:", userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      throw error;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    
    try {
      // Decodificar o token JWT para verificar a expiração
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // Verificar se o token expirou
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      console.error("Erro ao decodificar token:", e);
      return false;
    }
  },

  getUserTypeFromToken(): string | null {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    
    try {
      // Extrair o user_type do token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // O subject está no formato "user_id:user_type"
      const sub = payload.sub;
      if (sub) {
        const parts = sub.split(':');
        if (parts.length === 2) {
          return parts[1]; // user_type
        }
      }
      return null;
    } catch (e) {
      console.error("Erro ao extrair user_type do token:", e);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
  }
}; 