import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/suppliers";
axios.defaults.withCredentials = true;

export const useSupplierStore = create((set) => ({
  suppliers: [],
  error: null,
  isLoading: false,

  addSupplier: async (supplier) => {
    try {
      const response = await axios.post(`${API_URL}/register`, supplier);
      set((state) => ({
        ...state,
        suppliers: [...state.suppliers, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response?.data?.message || "Erro ao cadastrar fornecedor",
        isLoading: false,
      }));
    }
  },

  getSuppliers: async () => {
    try {
      const response = await axios.get(`${API_URL}/search`);
      set((state) => ({
        ...state,
        suppliers: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: "Nada encontrado",
        isLoading: false,
      }));
    }
  },

  deleteSupplier: async (id) => {
    try {
      await axios.post(`${API_URL}/delete/${id}`);
      set((state) => ({
        ...state,
        suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response.data.message,
        isLoading: false,
      }));
    }
  },

  updateSupplier: async (supplier) => {
    try {
      await axios.put(`${API_URL}/edit/${supplier.id}`, supplier);
      set((state) => ({
        ...state,
        suppliers: state.suppliers.map((s) =>
          s.id === supplier.id ? supplier : s
        ),
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response.data.message,
        isLoading: false,
      }));
    }
  },
}));
