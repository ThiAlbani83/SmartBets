import { create } from "zustand";
import axios from "axios";

/* const API_URL = "http://89.116.74.250:5001"; */
const API_URL = "http://srv493670.hstgr.cloud:5001";
axios.defaults.withCredentials = true;

export const useDeepScanStore = create((set) => ({
  profiles: [],
  searchPhrases: [],
  format: "CSV",
  platforms: [],
  selectedPlatforms: [], // Add this state to track selected platforms
  scrapingResults: null,
  error: null,
  isLoading: false,
  scheduledTasks: [],
  schedulingStatus: null,
  scrapedData: null,

  // Add a method to update selected platforms
  setSelectedPlatforms: (platforms) => {
    set((state) => ({ ...state, selectedPlatforms: platforms }));
  },

  getScrapedData: async (platforms, keywords) => {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      selectedPlatforms: platforms, // Update selected platforms when fetching data
    }));
    try {
      // Modificado para aceitar arrays de plataformas e palavras-chave
      const response = await axios.get(`${API_URL}/api/query/scraped-data`, {
        params: {
          platforms: platforms.join(","),
          keywords: keywords.join(","),
        },
      });

      // Atualizar o estado com os dados obtidos
      set((state) => ({
        ...state,
        scrapedData: response.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao buscar dados de scraping";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  validateProfile: async (profile, platform) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await axios.post(`${API_URL}/validate-profile`, {
        profile,
        platform,
      });

      // Return the data with a standardized verified property
      const result = {
        ...response.data,
        verified: response.data.exists, // Map exists to verified
      };

      set((state) => ({
        ...state,
        validationResults: {
          ...state.validationResults,
          [`${platform}-${profile}`]: result,
        },
        isLoading: false,
      }));

      return result;
    } catch (error) {
      set((state) => ({
        ...state,
        error: error.response?.data?.message || "Erro ao validar perfil",
        isLoading: false,
      }));
      return { verified: false, error: error.response?.data?.message };
    }
  },

  scheduleScraping: async (params) => {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      schedulingStatus: "pending",
      selectedPlatforms: params.platforms, // Update selected platforms when scheduling
    }));

    const maxRetries = 3;
    let retryCount = 0;

    const attemptRequest = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/schedule-scraping`,
          params,
          { timeout: 10000 } // 10 seconds timeout
        );

        set((state) => ({
          ...state,
          scheduledTasks: [...state.scheduledTasks, response.data],
          isLoading: false,
          schedulingStatus: "completed",
        }));

        return response.data;
      } catch (error) {
        if (error.code === "ERR_NETWORK" && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Network error, retrying (${retryCount}/${maxRetries})...`
          );
          // Exponential backoff with jitter
          const backoffTime = Math.min(
            1000 * 2 ** retryCount + Math.random() * 1000,
            10000
          );
          return new Promise((resolve) =>
            setTimeout(() => resolve(attemptRequest()), backoffTime)
          );
        }

        throw error;
      }
    };

    try {
      return await attemptRequest();
    } catch (error) {
      console.error("Error scheduling scraping:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao agendar scraping";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
        schedulingStatus: "failed",
      }));

      return { success: false, error: errorMessage };
    }
  },

  getScheduledTasks: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_URL}/scheduled-tasks`);

      set((state) => ({
        ...state,
        scheduledTasks: response.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao buscar tarefas agendadas";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  scrape: async (params) => {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      selectedPlatforms: params.platforms, // Update selected platforms when scraping
    }));
    try {
      const { profiles, searchPhrases, format, platforms } = params;

      // Log dos parâmetros para depuração
      console.log("Parâmetros de scraping:", {
        profiles,
        searchPhrases,
        format,
        platforms,
      });

      // Verifique os parâmetros
      if (!profiles || profiles.length === 0) {
        throw new Error(
          "É necessário fornecer pelo menos um perfil para busca"
        );
      }

      if (!platforms || platforms.length === 0) {
        throw new Error(
          "É necessário fornecer pelo menos uma plataforma para busca"
        );
      }

      // Faça a requisição à API
      const response = await axios.post(`${API_URL}/scrape`, {
        profiles,
        searchPhrases,
        format,
        platforms,
      });

      // Log da resposta para depuração
      console.log("Resposta da API:", response.data);

      // Verifique se posts está presente na resposta
      if (!response.data.posts || response.data.posts.length === 0) {
        console.warn("Aviso: O array 'posts' está vazio na resposta da API");

        // Se posts estiver vazio, tente criar uma estrutura de dados alternativa
        // Este é um fallback para manter a compatibilidade
        if (!response.data.posts) {
          response.data.posts = [];
        }

        // Se houver dados em outro formato na resposta, tente adaptá-los
        if (response.data.data && Array.isArray(response.data.data)) {
          response.data.posts = response.data.data;
          console.log("Usando 'data' como alternativa para 'posts'");
        }
      }

      set((state) => ({
        ...state,
        scrapingResults: response.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      console.error("Erro durante o scraping:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao realizar scraping";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },
}));
