import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  message: null,
  isCheckingAuth: true,

  // Login
  login: async (email, password) => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      // Armazena o estado do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAuthenticated", "true");

      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });

      return res.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isCheckingAuth: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: "Error signing out", isLoading: false });
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    const storedUser = localStorage.getItem("user");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    if (storedUser && storedIsAuthenticated) {
      set({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
    } else {
      set({ isCheckingAuth: true, error: null });
      try {
        const res = await axios.get(`${API_URL}/check-auth`, {
          withCredentials: true,
        });

        if (res.data.user) {
          // Armazena o usuário no localStorage apenas se ele estiver autenticado
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("isAuthenticated", "true");

          set({
            user: res.data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
            error: null,
          });
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
          error: null,
        });
      }
    }
  },

  // Clear errors
  clearError: () => {
    set({ error: null });
  },
}));
