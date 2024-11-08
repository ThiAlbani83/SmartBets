import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
  completedOrders: [], // Initialize as empty array
  orders: [],
  error: null,
  isLoading: false,

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        ...state,
        orders: [...state.orders, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response?.data?.message || "Erro ao criar pedido",
        isLoading: false,
      }));
    }
  },

  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/search`);
      set((state) => ({
        ...state,
        orders: response.data,
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

  getProducts: async (searchTerm = "") => {
    try {
      const response = await axios.get(
        `${API_URL}/products/search?term=${searchTerm}`
      );
      set((state) => ({
        ...state,
        products: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: "Erro ao buscar produtos",
        isLoading: false,
      }));
    }
  },

  getSuppliers: async (searchTerm = "") => {
    try {
      const response = await axios.get(
        `${API_URL}/suppliers/search?term=${searchTerm}`
      );
      set((state) => ({
        ...state,
        suppliers: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: "Erro ao buscar fornecedores",
        isLoading: false,
      }));
    }
  },

  updateOrder: async (id, { status, enviarPara }) => {
    try {
      const response = await axios.put(`${API_URL}/orders/update/${id}`, {
        status,
        enviarPara,
      });
      set((state) => ({
        ...state,
        currentOrder: response.data,
      }));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  },

  deleteOrder: async (id) => {
    try {
      await axios.delete(`${API_URL}/orders/delete/${id}`);
      set((state) => ({
        ...state,
        orders: state.orders.filter((order) => order.id !== id),
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

  getActiveOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/active`);
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching active orders", isLoading: false });
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/orders/find/${id}`);
      set({ currentOrder: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching order details", isLoading: false });
    }
  },

  getCompletedOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/completed`);
      set({ completedOrders: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching completed orders", isLoading: false });
    }
  },
}));
