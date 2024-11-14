import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
  completedOrders: [],
  orders: [],
  error: null,
  isLoading: false,

  createOrder: async (orderData, enviarParaResponsavel) => {
    try {
      console.log("Sending order data:", orderData);

      const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });

      if (response.status === 400) {
        console.log("Server validation error:", response.data);
        throw new Error(response.data.message);
      }

      const order = response.data;

      // Send email notification
      await sendEmailNotification(enviarParaResponsavel, order.id);

      set((state) => ({
        ...state,
        orders: [...state.orders, order],
        isLoading: false,
      }));

      return order;
    } catch (error) {
      console.log("Full error details:", error);
      set((state) => ({
        ...state,
        error: error.response?.data?.message || "Erro ao criar pedido",
        isLoading: false,
      }));
      throw error;
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

  updateOrder: async (
    id,
    { status, enviarPara, enviarParaResponsavel, responsavelEmail }
  ) => {
    try {
      const response = await axios.put(`${API_URL}/orders/update/${id}`, {
        status,
        enviarPara,
        enviarParaResponsavel,
      });

      if (responsavelEmail) {
        sendEmailNotification(responsavelEmail, id);
      }

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

// Function to send email notification
const sendEmailNotification = async (recipientEmail, orderId) => {
  try {
    // Log the recipient email for debugging
    console.log("Sending email to:", recipientEmail);

    const response = await fetch(`${API_URL}/orders/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientEmail,
        orderId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
