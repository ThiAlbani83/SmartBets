import { create } from "zustand";
import axios from "axios";
import qs from "qs";

const API_URL = "http://89.116.74.250:8000/api/v1/auth";
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  if (config.headers) {
    delete config.headers["x-api-secret"];
    delete config.headers["X-API-SECRET"];
    delete config.headers["x-api-key"];
    delete config.headers["X-API-KEY"];
  }
  return config;
});

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  message: null,
  isCheckingAuth: false,

  login: async (email, password) => {
    set({ isCheckingAuth: true, error: null });
    try {
      const data = qs.stringify({
        grant_type: "password",
        username: email,
        password: password,
        scope: "",
        client_id: "string",
        client_secret: "********",
      });

      const res = await axios.post(
        `${API_URL}/token`,
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
          },
          withCredentials: true,
        }
      );

      const accessToken = res.data.access_token;
      localStorage.setItem("access_token", accessToken);

      set({
        user: { email },
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });

      return accessToken;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isCheckingAuth: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, isAuthenticated: false, error: null, message: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  refreshToken: async () => {
    try {
      const currentToken = localStorage.getItem("access_token");
      if (!currentToken) {
        throw new Error("Token não encontrado");
      }

      const res = await axios.post(
        `${API_URL}/refresh_token`,
        qs.stringify({ refresh_token: currentToken }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
          },
          withCredentials: true,
        }
      );

      const newToken = res.data.access_token;
      localStorage.setItem("access_token", newToken);
      set({ isAuthenticated: true });

      console.log("Token renovado com sucesso");
    } catch (error) {
      console.error("Erro ao renovar o token", error);
      set({ isAuthenticated: false, error: "Erro ao renovar o token" });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Adicione um listener para atualizar o estado de autenticação quando o token for alterado
window.addEventListener("storage", () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    useAuthStore.getState().checkAuth();
  } else {
    useAuthStore.getState().logout();
  }
});

