import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
  products: [],
  error: null,
  isLoading: false,

  addProduct: async (product) => {
    try {
      const response = await axios.post(`${API_URL}/register`, product); // Envia o produto corretamente
      set((state) => ({
        ...state,
        products: [...state.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response?.data?.message || "Erro ao cadastrar produto", // Trata o erro com segurança
        isLoading: false,
      }));
    }
  },

  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/search`);
      set((state) => ({
        ...state,
        products: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: "Nada encontrado" ,
        isLoading: false,
      }));
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`); // Changed from post to delete
      set((state) => ({
        ...state,
        products: state.products.filter((product) => product.id !== id),
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

  getProductsById: async () => {
    try {
      const response = await axios.get(`${API_URL}/searchById`);
      set((state) => ({
        ...state,
        products: response.data,
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

  updateProduct: async (product) => {
    try {
      await axios.put(`${API_URL}/update/${product.id}`, product);
      set((state) => ({
        ...state,
        products: state.products.map((p) =>
          p.id === product.id ? product : p
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
