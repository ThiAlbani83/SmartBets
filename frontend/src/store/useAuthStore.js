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

      localStorage.setItem("access_token", res.data.access_token);

      set({
        user: { email },
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });

      return res.data.access_token;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isCheckingAuth: false,
      });
      throw error;
    }
  },

  logout: () => {
    // Remove o token do localStorage
    localStorage.removeItem("access_token");

    // Limpa o estado de autenticação
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      message: null,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
