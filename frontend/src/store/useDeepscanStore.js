import { create } from "zustand";
import axios from "axios";

/* const API_URL = "http://89.116.74.250:5001"; */
const API_URL = "http://89.116.74.250:6001";
const API_V1_URL = `${API_URL}/api/v1`;
const API_KEY = "727786db-7ec9-4a8b-90c9-e89cdb1123fd";
const API_SECRET = "65fee979-8f6c-4461-bbe1-f4413dcb0cc8";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-API-Key"] = API_KEY;
axios.defaults.headers.common["X-API-Secret"] = API_SECRET;

export const useDeepScanStore = create((set, get) => ({
  profiles: [],
  searchPhrases: [],
  format: "DB", // Changed default to DB as per API docs
  platforms: ["Instagram", "X", "Facebook", "Telegram", "Discord", "Google"], // All available platforms
  selectedPlatforms: [],
  scrapingResults: null,
  error: null,
  isLoading: false,
  scheduledTasks: [],
  schedulingStatus: null,
  scrapedData: null,
  validationResults: {},
  uniqueUsernames: [], // To store unique usernames from the API

  // Add a method to update selected platforms
  setSelectedPlatforms: (platforms) => {
    set((state) => ({ ...state, selectedPlatforms: platforms }));
  },

  // Método para validar perfil usando o endpoint documentado
  validateProfile: async (profile, platform) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/validate/profile`, {
        profile,
        platform,
      });

      // Padronizar o resultado com a propriedade verified
      const result = {
        ...response.data,
        verified: response.data.exists,
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
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao validar perfil";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { verified: false, error: errorMessage };
    }
  },

  // Método para buscar dados de um perfil específico
  getProfileData: async (profileName) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      // Using the correct endpoint path as per API docs
      const response = await axios.get(
        `${API_V1_URL}/data/profiles/${profileName}`
      );

      set((state) => ({
        ...state,
        scrapedData: response.data.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar dados do perfil";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Método para buscar nomes de usuários únicos
  getUniqueUsernames: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/data/profiles/unique`);

      set((state) => ({
        ...state,
        uniqueUsernames: response.data.usernames,
        isLoading: false,
      }));

      return response.data.usernames;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar nomes de usuários únicos";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  // Método para filtrar dados raspados
  filterScrapedData: async (filters = {}) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/data/filter`, {
        params: filters,
      });

      set((state) => ({
        ...state,
        scrapedData: response.data.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao filtrar dados raspados";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Método para obter contagens de sentimento
  getSentimentCounts: async (filters = {}) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/data/sentiment/counts`, {
        params: filters,
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar contagem de sentimentos";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  // Método para agendar tarefas de scraping usando o endpoint documentado
  scheduleScraping: async (params) => {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      schedulingStatus: "pending",
      selectedPlatforms: params.platforms,
    }));

    try {
      // Verificar parâmetros obrigatórios conforme documentação
      if (!params.platforms || params.platforms.length === 0) {
        throw new Error("É necessário selecionar pelo menos uma plataforma");
      }

      if (!params.selectedDays || params.selectedDays.length === 0) {
        throw new Error("É necessário selecionar pelo menos um dia do mês");
      }

      if (!params.startHour) {
        throw new Error("É necessário definir um horário de início");
      }

      // Fazer a requisição para o endpoint documentado
      const response = await axios.post(`${API_V1_URL}/schedule`, {
        profiles: params.profiles || [],
        searchPhrases: params.searchPhrases || [],
        platforms: params.platforms,
        format: params.format || "DB", // Default to DB as per API docs
        selectedDays: params.selectedDays,
        startHour: params.startHour,
        afterDate: params.afterDate || undefined,
        beforeDate: params.beforeDate || undefined,
      });

      // Atualizar o estado com os dados da resposta
      set((state) => ({
        ...state,
        scheduledTasks: [...state.scheduledTasks, ...response.data.scheduled],
        isLoading: false,
        schedulingStatus: "completed",
        error: null,
      }));

      return {
        success: true,
        message: response.data.message,
        scheduled: response.data.scheduled,
      };
    } catch (error) {
      console.error("Erro ao agendar scraping:", error);

      const errorMessage =
        error.response?.data?.error ||
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

  // Método para cancelar uma tarefa agendada
  cancelScheduledTask: async (scrapeId) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.delete(
        `${API_V1_URL}/schedule/${scrapeId}`,
        {
          headers: {
            "X-API-Key": API_KEY,
            "X-API-Secret": API_SECRET,
          },
        }
      );

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao cancelar agendamento";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Método para buscar tarefas agendadas
  getScheduledTasks: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      // Usar o endpoint documentado para buscar tarefas agendadas
      const response = await axios.get(`${API_V1_URL}/scheduled-tasks`);

      set((state) => ({
        ...state,
        scheduledTasks: response.data,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar tarefas agendadas";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  // Método para monitorar progresso de uma tarefa
  monitorScrapeProgress: (scrapeId, callback) => {
    set((state) => ({ ...state, error: null }));

    if (!scrapeId) {
      const errorMsg =
        "ID da tarefa de scraping é necessário para monitorar o progresso";
      set((state) => ({ ...state, error: errorMsg }));
      if (callback) callback({ error: errorMsg });
      return () => {}; // Retorna uma função vazia de cleanup
    }

    try {
      // Criar uma nova conexão SSE
      const eventSource = new EventSource(
        `${API_V1_URL}/scrapes/${scrapeId}/progress`,
        {
          withCredentials: true,
          headers: {
            "X-API-Key": API_KEY,
            "X-API-Secret": API_SECRET,
          },
        }
      );

      // Manipular eventos recebidos
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (callback) callback(data);

          // Se o status for final, fechar a conexão
          if (
            data.status === "completed" ||
            data.status === "failed" ||
            data.status === "cancelled"
          ) {
            eventSource.close();
          }
        } catch (error) {
          console.error("Erro ao processar mensagem SSE:", error);
          if (callback)
            callback({
              error: "Erro ao processar atualização de progresso",
              progress: 0,
            });
        }
      };

      // Manipular erros de conexão
      eventSource.onerror = (error) => {
        console.error("Erro na conexão SSE:", error);

        // Tentar reconectar algumas vezes antes de desistir
        if (eventSource.readyState === EventSource.CLOSED) {
          const errorMsg = "Conexão com o servidor de progresso fechada";
          set((state) => ({ ...state, error: errorMsg }));
          if (callback) callback({ error: errorMsg, progress: 0 });
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log("Tentando reconectar ao servidor de progresso...");
          if (callback)
            callback({
              message: "Reconectando ao servidor...",
              progress: 0,
            });
        }
      };

      // Retornar função para fechar a conexão quando não for mais necessária
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Erro ao configurar monitoramento de progresso:", error);
      const errorMsg = "Não foi possível iniciar o monitoramento de progresso";
      set((state) => ({ ...state, error: errorMsg }));
      if (callback) callback({ error: errorMsg, progress: 0 });
      return () => {}; // Retorna uma função vazia de cleanup
    }
  },

  // Método para iniciar scraping de perfis em segundo plano
  initiateProfileScraping: async (params) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/scrape/profiles`, {
        profiles: params.profiles,
        platforms: params.platforms,
        searchPhrases: params.searchPhrases || [],
        format: params.format || "DB",
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        scrapeId: response.data.scrapeId,
        monitorUrl: response.data.monitor,
        message: response.data.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao iniciar scraping de perfis";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Método para iniciar scraping de palavras-chave em segundo plano
  initiateKeywordScraping: async (params) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/scrape/keywords`, {
        keywords: params.keywords,
        platforms: params.platforms,
        searchPhrases: params.searchPhrases || [],
        format: params.format || "DB",
        afterDate: params.afterDate || undefined,
        beforeDate: params.beforeDate || undefined,
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        scrapeId: response.data.scrapeId,
        monitorUrl: response.data.monitor,
        message: response.data.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao iniciar scraping de palavras-chave";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Métodos para gerenciar lista de monitoramento
  getMonitoringList: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/monitoring/list`);

      set((state) => ({
        ...state,
        profiles: response.data.entries,
        isLoading: false,
      }));

      return response.data.entries;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar lista de monitoramento";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  addProfileToMonitoring: async (username, platform) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/monitoring/list`, {
        username,
        platform,
      });

      // Atualizar a lista de perfis
      await get().getMonitoringList();

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: response.data.message,
        entry: response.data.entry,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao adicionar perfil à lista de monitoramento";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  removeProfileFromMonitoring: async (username, platform) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.delete(`${API_V1_URL}/monitoring/list`, {
        data: {
          username,
          platform,
        },
      });

      // Atualizar a lista de perfis
      await get().getMonitoringList();

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao remover perfil da lista de monitoramento";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  triggerMonitoring: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/monitoring/trigger`);

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: response.data.message,
        scrapeIds: response.data.scrapeIds,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao iniciar monitoramento";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Métodos para ocorrências globais
  getGlobalOccurrences: async (keywords, platformName) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/occurrences/`, {
        keywords,
        platformName,
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return response.data.occurrences;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar ocorrências globais";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  getGlobalKeywords: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/occurrences/keywords`);

      set((state) => ({
        ...state,
        searchPhrases: response.data.keywords.map((k) => k.termo),
        isLoading: false,
      }));

      return response.data.keywords;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar palavras-chave globais";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return [];
    }
  },

  registerGlobalKeywords: async (keywords) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(
        `${API_V1_URL}/occurrences/keywords/register`,
        {
          keywords,
        }
      );

      // Atualizar a lista de palavras-chave
      await get().getGlobalKeywords();

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: response.data.message,
        created: response.data.created,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao registrar palavras-chave globais";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  deleteGlobalKeywords: async (keywords) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(
        `${API_V1_URL}/occurrences/keywords/delete`,
        {
          keywords,
        }
      );

      // Atualizar a lista de palavras-chave
      await get().getGlobalKeywords();

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: response.data.message,
        deletedCount: response.data.deletedCount,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao deletar palavras-chave globais";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  getWordMap: async (keyword) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(
        `${API_V1_URL}/occurrences/wordmap/${keyword}`
      );

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao gerar mapa de palavras";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { wordmap: [], totalOccurrences: 0, error: errorMessage };
    }
  },

  // Método legado para compatibilidade com componentes existentes
  scrape: async (params) => {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      selectedPlatforms: params.platforms,
    }));
    try {
      // Verificar se estamos usando perfis ou palavras-chave
      if (params.profiles && params.profiles.length > 0) {
        // Usar o novo endpoint de scraping de perfis
        return await get().initiateProfileScraping(params);
      } else if (params.keywords && params.keywords.length > 0) {
        // Usar o novo endpoint de scraping de palavras-chave
        return await get().initiateKeywordScraping(params);
      } else {
        throw new Error(
          "É necessário fornecer perfis ou palavras-chave para busca"
        );
      }
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

  // Método legado para compatibilidade
  getScrapedData: async (platforms, keywords) => {
    // Usar o novo método de filtragem
    return await get().filterScrapedData({
      platform: platforms.join(","),
      keywords: keywords.join(","),
    });
  },

  registerClient: async (clientData) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_V1_URL}/clients`, {
        name: clientData.name,
        responsavel: clientData.responsavel || undefined,
        redes_sociais_perfis: clientData.redes_sociais_perfis || undefined,
        palavras_chave_cliente: clientData.palavras_chave_cliente || undefined,
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: "Cliente registrado com sucesso!",
        client: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao registrar cliente";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Add this method to get all clients
  getClients: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/clients`);

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        clients: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar clientes";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage, clients: [] };
    }
  },

  updateClient: async (clientId, clientData) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.put(`${API_V1_URL}/clients/${clientId}`, {
        name: clientData.name,
        responsavel: clientData.responsavel || undefined,
        redes_sociais_perfis: clientData.redes_sociais_perfis || undefined,
        palavras_chave_cliente: clientData.palavras_chave_cliente || undefined,
      });

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: "Cliente atualizado com sucesso!",
        client: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao atualizar cliente";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Method to delete a client
  deleteClient: async (clientId) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      await axios.delete(`${API_V1_URL}/clients/${clientId}`);

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: "Cliente excluído com sucesso!",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao excluir cliente";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Method to get a single client by ID
  getClientById: async (clientId) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_V1_URL}/clients/${clientId}`);

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        client: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar cliente";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },

  // Method to regenerate API key for a client
  regenerateApiKey: async (clientId) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.post(
        `${API_V1_URL}/clients/${clientId}/regenerate-key`
      );

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return {
        success: true,
        message: "API Key regenerada com sucesso!",
        apiKey: response.data.api_key,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erro ao regenerar API Key";

      set((state) => ({
        ...state,
        error: errorMessage,
        isLoading: false,
      }));

      return { success: false, error: errorMessage };
    }
  },
}));
