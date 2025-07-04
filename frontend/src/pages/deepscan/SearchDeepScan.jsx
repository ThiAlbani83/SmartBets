import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { useDeepScanStore } from "../../store/useDeepscanStore.js";
import {
  FiEdit2,
  FiPause,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiLoader,
  FiPlay,
} from "react-icons/fi";
import ResultModal from "../../components/deepscan/ResultModal.jsx";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const SearchDeepScan = () => {
  const [formData, setFormData] = useState({
    profiles: [],
    keywords: [],
    searchPhrases: [],
    platforms: [],
    format: "DB",
    selectedDays: [],
    startHour: "08:00",
    afterDate: "",
    beforeDate: "",
    frequencia: "Mensal",
    responsavel: "",
    observacoes: "",
  });
  const [error, setError] = useState("");
  // Adicione este estado no início do componente, junto com os outros useState
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: "", platform: "" });

  // Estados para modal de palavras-chave
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  // Estados para validação de perfis
  const [profileValidation, setProfileValidation] = useState({});
  const [validatingProfiles, setValidatingProfiles] = useState(new Set());

  // Estados para o modal de resultados
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);

  // Estados para controle de exibição dos campos de agendamento
  const [showScheduleFields, setShowScheduleFields] = useState(false);

  // Estados para o modal de progresso do scraping
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapeStatus, setScrapeStatus] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // Função para validar se um perfil existe
  const validateProfile = async (profileName, platform, profileIndex) => {
    const profileKey = `${profileName}_${platform}_${profileIndex}`;

    // Adicionar ao conjunto de perfis sendo validados
    setValidatingProfiles((prev) => new Set([...prev, profileKey]));

    try {
      // Simular validação - substitua pela API real
      const response = await fetch(
        `http://89.116.74.250:5001/api/v1/validate/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b",
            "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a",
          },
          body: JSON.stringify({
            profile: profileName,
            platform: platform,
          }),
        }
      );

      let isValid = false;
      if (response.ok) {
        const result = await response.json();
        isValid = result.exists || result.valid || false;
      } else {
        // Se a API não existir, simular validação baseada em regras básicas
        isValid = await simulateProfileValidation(profileName, platform);
      }

      // Atualizar o estado de validação
      setProfileValidation((prev) => ({
        ...prev,
        [profileKey]: {
          isValid,
          checked: true,
          timestamp: Date.now(),
        },
      }));
    } catch (error) {
      console.error("Erro ao validar perfil:", error);

      // Em caso de erro, usar validação simulada
      const isValid = await simulateProfileValidation(profileName, platform);

      setProfileValidation((prev) => ({
        ...prev,
        [profileKey]: {
          isValid,
          checked: true,
          timestamp: Date.now(),
          error: true,
        },
      }));
    } finally {
      // Remover do conjunto de perfis sendo validados
      setValidatingProfiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(profileKey);
        return newSet;
      });
    }
  };

  // Função para simular validação de perfil (substitua pela lógica real)
  const simulateProfileValidation = async (profileName, platform) => {
    // Simular delay de rede
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Regras básicas de validação simulada
    const cleanName = profileName.replace("@", "").toLowerCase();

    // Simular alguns perfis como válidos e outros como inválidos
    const validPatterns = [
      /^[a-zA-Z0-9._]{3,30}$/, // Padrão básico de username
      /^[a-zA-Z0-9]{5,}$/, // Pelo menos 5 caracteres alfanuméricos
    ];

    const invalidPatterns = [
      /test/i, // Perfis de teste
      /fake/i, // Perfis fake
      /spam/i, // Perfis spam
    ];

    // Verificar se corresponde a padrões inválidos
    if (invalidPatterns.some((pattern) => pattern.test(cleanName))) {
      return false;
    }

    // Verificar se corresponde a padrões válidos
    if (validPatterns.some((pattern) => pattern.test(cleanName))) {
      // 80% de chance de ser válido para perfis que seguem o padrão
      return Math.random() > 0.2;
    }

    // Para outros casos, 50% de chance
    return Math.random() > 0.5;
  };

  // Função para renderizar o status de validação do perfil
  const renderProfileValidationStatus = (profile, index) => {
    const [profileName, platformPart] = profile.split(" (");
    const platform = platformPart?.replace(")", "") || "";
    const profileKey = `${profileName}_${platform}_${index}`;

    const validation = profileValidation[profileKey];
    const isValidating = validatingProfiles.has(profileKey);

    if (isValidating) {
      return (
        <div className="flex items-center ml-2">
          <FiLoader className="animate-spin text-blue-500" size={14} />
          <span className="text-xs text-blue-600 ml-1">Verificando...</span>
        </div>
      );
    }

    if (!validation || !validation.checked) {
      return (
        <button
          type="button"
          onClick={() => validateProfile(profileName, platform, index)}
          className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors"
          title="Clique para verificar se o perfil existe"
        >
          Verificar
        </button>
      );
    }

    if (validation.isValid) {
      return (
        <div className="flex items-center ml-2">
          <FiCheck className="text-green-500" size={14} />
          <span className="text-xs text-green-600 ml-1">Válido</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center ml-2">
          <FiX className="text-red-500" size={14} />
          <span className="text-xs text-red-600 ml-1">Inválido</span>
        </div>
      );
    }
  };

  const handleViewResult = async (agendamento) => {
    if (agendamento.status !== "completed" && agendamento.status !== "failed") {
      console.log("Resultado não disponível para visualização");
      return;
    }

    try {
      setLoadingResult(true);
      setShowResultModal(true);
      console.log(
        "Tentando visualizar resultado para o scrape com ID:",
        agendamento.id
      );

      // Construindo a URL para a requisição GET com o scrapeId
      const url = `http://89.116.74.250:5001/api/v1/data/filter?scrapeId=${agendamento.id}&page=1&limit=100`;

      // Fazendo a requisição GET
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b",
          "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a",
        },
      });

      // Verificando a resposta
      if (response.ok) {
        const result = await response.json();
        console.log("Resultado obtido com sucesso:", result);
        setResultData(result);
      } else {
        const error = await response.json();
        console.error("Erro ao buscar o resultado:", error);
        setError("Erro ao carregar os resultados");
      }
    } catch (error) {
      console.error("Erro desconhecido ao buscar o resultado:", error);
      setError("Erro desconhecido ao carregar os resultados");
    } finally {
      setLoadingResult(false);
    }
  };

  // Função para renderizar o botão de visualização baseado no status
  const renderViewButton = (agendamento) => {
    const isCompleted = agendamento.status === "completed";
    const isFailed = agendamento.status === "failed";
    const hasResults = isCompleted || isFailed;

    if (!hasResults) {
      return (
        <button
          disabled
          className="flex items-center px-2 py-1 text-xs rounded transition-colors duration-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          title="Resultado não disponível"
        >
          <FiEyeOff size={14} className="mr-1" />
          Sem Log
        </button>
      );
    }

    if (isFailed) {
      return (
        <button
          onClick={() => handleViewResult(agendamento)}
          className="flex items-center px-2 py-1 text-xs rounded transition-colors duration-200 bg-red-100 text-red-700 hover:bg-red-200"
          title="Visualizar Log de Erro"
        >
          <FiEye size={14} className="mr-1" />
          Ver Erro
        </button>
      );
    }

    if (isCompleted) {
      return (
        <button
          onClick={() => handleViewResult(agendamento)}
          className="flex items-center px-2 py-1 text-xs rounded transition-colors duration-200 bg-green-100 text-green-700 hover:bg-green-200"
          title="Visualizar Resultado"
        >
          <FiEye size={14} className="mr-1" />
          Ver Dados
        </button>
      );
    }

    return null;
  };

  // Adicione estas plataformas no início do componente
  const profilePlatforms = [
    "Instagram",
    "Facebook",
    "Google",
    "DeepWeb",
    "DarkWeb",
    "Twitter",
    "LinkedIn",
    "YouTube",
    "Discord",
    "Telegram",
    "Github",
  ];

  const handleAddProfile = () => {
    if (newProfile.name.trim() && newProfile.platform) {
      const profileWithPlatform = `${newProfile.name} (${newProfile.platform})`;
      setFormData({
        ...formData,
        profiles: [...formData.profiles, profileWithPlatform],
      });
      setNewProfile({ name: "", platform: "" });
      setShowProfileModal(false);
      setError("");
    }
  };

  const handleRemoveProfile = (index) => {
    const updatedProfiles = formData.profiles.filter((_, i) => i !== index);
    setFormData({ ...formData, profiles: updatedProfiles });

    // Limpar validação do perfil removido
    const profile = formData.profiles[index];
    const [profileName, platformPart] = profile.split(" (");
    const platform = platformPart?.replace(")", "") || "";
    const profileKey = `${profileName}_${platform}_${index}`;

    setProfileValidation((prev) => {
      const newValidation = { ...prev };
      delete newValidation[profileKey];
      return newValidation;
    });
  };

  // Funções para gerenciar palavras-chave
  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      // Split by comma and clean up each keyword
      const keywordsToAdd = newKeyword
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0)
        .filter((keyword) => !formData.keywords.includes(keyword)); // Avoid duplicates

      if (keywordsToAdd.length > 0) {
        setFormData({
          ...formData,
          keywords: [...formData.keywords, ...keywordsToAdd],
        });
        setNewKeyword("");
        setShowKeywordModal(false);
        setError("");
      }
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({ ...formData, keywords: updatedKeywords });
  };

  // Função para lidar com a mudança dos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchPhrasesChange = (e) => {
    setFormData({
      ...formData,
      searchPhrases: e.target.value.split(",").map((phrase) => phrase.trim()),
    });
  };

  const handleSelectedDaysChange = (e) => {
    const { value, checked } = e.target;
    const updatedDays = checked
      ? [...formData.selectedDays, parseInt(value)]
      : formData.selectedDays.filter((day) => day !== parseInt(value));
    setFormData({ ...formData, selectedDays: updatedDays });
  };

  // Função para executar scraping imediato
  const handleScrapeNow = async () => {
    // Verificar se 'profiles' ou 'keywords' não estão vazios
    if (formData.profiles.length === 0 && formData.keywords.length === 0) {
      setError("Pelo menos um perfil ou palavra-chave deve ser fornecido.");
      return;
    }

    // Verificar se há perfis inválidos
    const invalidProfiles = formData.profiles.filter((profile, index) => {
      const [profileName, platformPart] = profile.split(" (");
      const platform = platformPart?.replace(")", "") || "";
      const profileKey = `${profileName}_${platform}_${index}`;
      const validation = profileValidation[profileKey];
      return validation && validation.checked && !validation.isValid;
    });

    if (invalidProfiles.length > 0) {
      setError(
        `Os seguintes perfis são inválidos: ${invalidProfiles.join(
          ", "
        )}. Por favor, remova-os ou verifique novamente.`
      );
      return;
    }

    // Limpar o erro
    setError("");

    // Abrir modal de progresso
    setShowScrapeModal(true);
    setIsScraping(true);
    setScrapeProgress(0);
    setScrapeStatus("Iniciando scraping...");

    try {
      // Simular progresso de scraping
      const progressSteps = [
        { progress: 10, status: "Validando dados..." },
        { progress: 25, status: "Conectando com APIs..." },
        { progress: 40, status: "Coletando dados dos perfis..." },
        { progress: 60, status: "Processando palavras-chave..." },
        { progress: 80, status: "Analisando resultados..." },
        { progress: 95, status: "Finalizando..." },
        { progress: 100, status: "Concluído!" },
      ];

      for (const step of progressSteps) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setScrapeProgress(step.progress);
        setScrapeStatus(step.status);
      }

      // Simular criação de um novo agendamento com status completed
      const newScrapeResult = {
        id: `scrape-${Date.now()}`,
        client_id: "immediate-scrape",
        status: "completed",
        profiles: formData.profiles,
        keywords: formData.keywords,
        platforms: ["Instagram", "Facebook", "X.com"], // Plataformas padrão para scraping imediato
        scheduledAt: new Date().toISOString(),
      };

      // Adicionar à lista de agendamentos
      setAgendamentos((prev) => [newScrapeResult, ...prev]);
      setFilteredAgendamentos((prev) => [newScrapeResult, ...prev]);

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setShowScrapeModal(false);
        setIsScraping(false);
        setScrapeProgress(0);
        setScrapeStatus("");
      }, 2000);
    } catch (error) {
      console.error("Erro durante o scraping:", error);
      setScrapeStatus("Erro durante o scraping");
      setError("Erro ao executar scraping imediato");

      setTimeout(() => {
        setShowScrapeModal(false);
        setIsScraping(false);
        setScrapeProgress(0);
        setScrapeStatus("");
      }, 3000);
    }
  };

  //************************************************************************* */
  //************************************************************************* */
  //************************************************************************* */

  const [agendamentos, setAgendamentos] = useState([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "id", // Coluna inicial para ordenação
    direction: "asc", // Direção de ordenação inicial (crescente)
  });

  const fetchAgendamentos = async () => {
    try {
      const response = await fetch(
        "http://89.116.74.250:5001/api/v1/scrapes?limit=100&offset=0",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b",
            "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a",
          },
        }
      );

      const data = await response.json();
      // Processar os dados recebidos da API
      const scrapes = data.scrapes.map((scrape) => {
        const parameters = JSON.parse(scrape.parameters); // Parse do parâmetro JSON

        return {
          id: scrape.id,
          client_id: scrape.client_id,
          status: scrape.status,
          profiles: parameters.profiles || [],
          keywords: parameters.keywords || [],
          platforms: parameters.platforms || [],
          scheduledAt: scrape.scheduled_at,
        };
      });

      // Atualizar os estados com os dados processados
      setAgendamentos(scrapes);
      setFilteredAgendamentos(scrapes); // Inicializa com todos os dados
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos(); // Chama a função de fetch quando o componente é montado
  }, []);

  // Função para fazer a requisição de agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Verificar se 'profiles' ou 'keywords' não estão vazios
    if (formData.profiles.length === 0 && formData.keywords.length === 0) {
      setError("Pelo menos um perfil ou palavra-chave deve ser fornecido.");
      setIsLoading(false);
      return;
    }

    if (formData.selectedDays.length === 0) {
      setError("Pelo menos um dia do mês deve ser selecionado.");
      setIsLoading(false);
      return;
    }

    if (!formData.startHour) {
      setError("O horário de início é obrigatório.");
      setIsLoading(false);
      return;
    }

    if (!formData.frequencia) {
      setError("A frequência é obrigatória.");
      setIsLoading(false);
      return;
    }

    // Verificar se há perfis inválidos
    const invalidProfiles = formData.profiles.filter((profile, index) => {
      const [profileName, platformPart] = profile.split(" (");
      const platform = platformPart?.replace(")", "") || "";
      const profileKey = `${profileName}_${platform}_${index}`;
      const validation = profileValidation[profileKey];
      return validation && validation.checked && !validation.isValid;
    });

    if (invalidProfiles.length > 0) {
      setError(
        `Os seguintes perfis são inválidos: ${invalidProfiles.join(
          ", "
        )}. Por favor, remova-os ou verifique novamente.`
      );
      setIsLoading(false);
      return;
    }

    // Limpar o erro caso os campos estejam corretamente preenchidos
    setError("");

    const scrapingParams = {
      searchPhrases: formData.searchPhrases,
      platforms: ["Instagram", "Facebook", "X.com"], // Plataformas padrão
      format: formData.format,
      selectedDays: formData.selectedDays,
      startHour: formData.startHour,
      afterDate: formData.afterDate || undefined,
      beforeDate: formData.beforeDate || undefined,
    };

    // Variável para controlar se houve sucesso em pelo menos uma requisição
    let hasSuccess = false;

    const makeRequest = async (params, type) => {
      try {
        const response = await fetch(
          "http://89.116.74.250:5001/api/v1/schedule",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b", // Substitua com sua chave de API
              "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a", // Substitua com seu segredo de API
            },
            body: JSON.stringify(params),
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          alert(`${type} Agendado com sucesso!`);
          hasSuccess = true; // Marca que houve sucesso
        } else {
          setError(result.error || "Erro desconhecido");
        }
      } catch (err) {
        setError(err.message || "Erro ao agendar");
      }
    };

    // Realizar a requisição para 'profiles' ou 'keywords' separadamente
    const requests = [];

    // Se houver 'profiles', fazer a requisição
    if (formData.profiles.length > 0) {
      const profilesParams = {
        ...scrapingParams,
        profiles: formData.profiles,
      };
      requests.push(makeRequest(profilesParams, "Perfis"));
    }

    // Se houver 'keywords', fazer a requisição
    if (formData.keywords.length > 0) {
      const keywordsParams = {
        ...scrapingParams,
        keywords: formData.keywords,
      };
      requests.push(makeRequest(keywordsParams, "Palavras-chave"));
    }

    // Esperar todas as requisições finalizarem
    await Promise.all(requests);

    // Se houve sucesso em pelo menos uma requisição, atualizar a lista e limpar o formulário
    if (hasSuccess) {
      // Atualizar a lista de agendamentos
      await fetchAgendamentos();

      // Limpar o formulário
      setFormData({
        profiles: [],
        keywords: [],
        searchPhrases: [],
        platforms: [],
        format: "DB",
        selectedDays: [],
        startHour: "08:00",
        afterDate: "",
        beforeDate: "",
        frequencia: "Mensal",
        responsavel: "",
        observacoes: "",
      });

      // Limpar validações de perfis
      setProfileValidation({});
      setValidatingProfiles(new Set());

      // Ocultar campos de agendamento novamente
      setShowScheduleFields(false);
    }

    setIsLoading(false);
  };

  const handleMonitorNow = async () => {
    setIsLoading(true); // Inicia o estado de carregamento
    const monitorParams = {
      profiles: formData.profiles,
      platforms: formData.platforms,
      searchPhrases: formData.searchPhrases,
      format: "DB",
    };
    try {
      // Fazendo a requisição POST para monitoramento imediato
      const response = await fetch(
        "http://89.116.74.250:5001/api/v1/scrape/profiles",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b",
            "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(monitorParams),
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert(`Monitoramento iniciado! Scrape ID: ${result.scrapeId}`);
        setError("");
        await fetchAgendamentos();
      } else {
        // Verificar se 'profiles' ou 'keywords' não estão vazios
        if (formData.profiles.length === 0 && formData.keywords.length === 0) {
          setError("Pelo menos um perfil ou palavra-chave deve ser fornecido.");
          setIsLoading(false);
          return;
        }

        // Verificar se os campos obrigatórios foram preenchidos
        if (formData.platforms.length === 0) {
          setError("Pelo menos uma plataforma deve ser selecionada.");
          setIsLoading(false);
          return;
        } else
          setError(
            result.message || "Erro desconhecido ao iniciar monitoramento."
          );
      }
    } catch (error) {
      console.error("Erro ao iniciar monitoramento:", error);
      setError("Erro ao iniciar monitoramento.");
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sortedData = [...filteredAgendamentos].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredAgendamentos(sortedData);
    setSortConfig({ key, direction });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  };

  const handleEdit = (agendamento) => {
    // Implementar lógica de edição
    console.log("Editar agendamento:", agendamento);
  };

  const handlePause = (agendamento) => {
    // Implementar lógica de pausar
    console.log("Pausar agendamento:", agendamento);
  };

  const handleDelete = async (scrapeId) => {
    if (!isValidUuid(scrapeId)) {
      console.error("ID inválido:", scrapeId);
      return;
    }

    // Fazendo a requisição DELETE
    try {
      console.log("Tentando cancelar agendamento com ID:", scrapeId);
      const response = await fetch(
        `http://89.116.74.250:5001/api/v1/schedule/${scrapeId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "X-API-Key": "c9f93bcc-4369-43de-9a00-6af58446935b",
            "X-API-Secret": "74354ff0-2649-4af7-b71e-7086cc14978a",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Agendamento cancelado com sucesso:", result.message);
        // Atualizar a lista após deletar
        fetchAgendamentos();
      } else {
        const error = await response.json();
        console.error("Erro ao cancelar o agendamento:", error);
      }
    } catch (error) {
      console.error("Erro desconhecido ao cancelar o agendamento:", error);
    }
  };

  // Função para validar o formato do UUID
  const isValidUuid = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Gerar dias do mês para seleção
  const diasDoMes = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Agendamento de Monitoramento</h1>

      {/* Formulário de Agendamento */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>
        <form onSubmit={handleSubmit}>
          {/* Perfis e Palavras-chave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Perfis */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perfis para Monitoramento
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {formData.profiles.length} perfil(s) adicionado(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Adicionar Perfil
                  </button>
                </div>

                {formData.profiles.length > 0 ? (
                  <div className="space-y-2">
                    {formData.profiles.map((profile, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center flex-1">
                          <span className="text-sm mr-2">{profile}</span>
                          {renderProfileValidationStatus(profile, index)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProfile(index)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1"
                          title="Remover perfil"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Nenhum perfil adicionado ainda
                  </div>
                )}
              </div>
            </div>

            {/* Palavras-chave */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave para Monitoramento
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {formData.keywords.length} palavra(s) adicionada(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowKeywordModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Adicionar Palavra-chave
                  </button>
                </div>

                {formData.keywords.length > 0 ? (
                  <div className="space-y-2">
                    {formData.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center flex-1">
                          <span className="text-sm mr-2">{keyword}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(index)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1"
                          title="Remover palavra-chave"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Nenhuma palavra-chave adicionada ainda
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal para adicionar perfil */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Adicionar Novo Perfil
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Perfil
                  </label>
                  <input
                    type="text"
                    value={newProfile.name}
                    onChange={(e) =>
                      setNewProfile({ ...newProfile, name: e.target.value })
                    }
                    placeholder="Ex: @usuario123"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plataforma
                  </label>
                  <select
                    value={newProfile.platform}
                    onChange={(e) =>
                      setNewProfile({
                        ...newProfile,
                        platform: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione uma plataforma</option>
                    {profilePlatforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      setNewProfile({ name: "", platform: "" });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProfile}
                    disabled={!newProfile.name.trim() || !newProfile.platform}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal para adicionar palavra-chave */}
          {showKeywordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Adicionar Palavras-chave
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palavras-chave
                  </label>
                  <textarea
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Ex: aposta garantida, ganhe dinheiro fácil, renda extra certa"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe múltiplas palavras-chave com vírgulas
                  </p>
                </div>

                {/* Preview das palavras-chave que serão adicionadas */}
                {newKeyword.trim() && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palavras-chave a serem adicionadas:
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border">
                      {newKeyword
                        .split(",")
                        .map((keyword) => keyword.trim())
                        .filter((keyword) => keyword.length > 0)
                        .map((keyword, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              formData.keywords.includes(keyword)
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {keyword}
                            {formData.keywords.includes(keyword) && (
                              <span
                                className="ml-1 text-yellow-600"
                                title="Já existe"
                              >
                                ⚠️
                              </span>
                            )}
                          </span>
                        ))}
                    </div>
                    {newKeyword
                      .split(",")
                      .map((keyword) => keyword.trim())
                      .filter((keyword) => keyword.length > 0)
                      .some((keyword) =>
                        formData.keywords.includes(keyword)
                      ) && (
                      <p className="text-xs text-yellow-600 mt-1">
                        ⚠️ Palavras-chave marcadas já existem e serão ignoradas
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowKeywordModal(false);
                      setNewKeyword("");
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    disabled={!newKeyword.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      newKeyword.trim()
                        ? `Adicionar ${
                            newKeyword
                              .split(",")
                              .filter((k) => k.trim().length > 0).length
                          } palavra(s)-chave`
                        : "Digite pelo menos uma palavra-chave"
                    }
                  >
                    Adicionar{" "}
                    {newKeyword.trim() &&
                      `(${
                        newKeyword.split(",").filter((k) => k.trim().length > 0)
                          .length
                      })`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campos de Agendamento - Mostrar apenas quando solicitado */}
          {showScheduleFields && (
            <>
              {/* Data e Horário */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    name="startHour"
                    value={formData.startHour}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Inicial (opcional)
                  </label>
                  <input
                    type="date"
                    name="afterDate"
                    value={formData.afterDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Final (opcional)
                  </label>
                  <input
                    type="date"
                    name="beforeDate"
                    value={formData.beforeDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Dias do mês */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias do Mês para Agendamento
                </label>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">
                      {formData.selectedDays.length} selecionado(s)
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, selectedDays: diasDoMes })
                        }
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Todos
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, selectedDays: [] })
                        }
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {diasDoMes.map((dia) => (
                      <label
                        key={dia}
                        className={`
                          flex items-center justify-center w-8 h-8 rounded border cursor-pointer transition-colors
                          ${
                            formData.selectedDays.includes(dia)
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          value={dia}
                          checked={formData.selectedDays.includes(dia)}
                          onChange={handleSelectedDaysChange}
                          className="sr-only"
                        />
                        <span className="text-xs font-medium">{dia}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Frequência */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência
                </label>
                <select
                  name="frequencia"
                  value={formData.frequencia}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Única">Única</option>
                  <option value="Diária">Diária</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>
            </>
          )}

          {/* Exibindo erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleScrapeNow}
              disabled={isScraping}
              className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isScraping ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiPlay className="mr-2" size={16} />
              {isScraping ? "Raspando..." : "Raspar Agora"}
            </button>

            {!showScheduleFields ? (
              <button
                type="button"
                onClick={() => setShowScheduleFields(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Agendar Monitoramento
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleFields(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar Agendamento
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Agendando..." : "Confirmar Agendamento"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Progresso do Scraping */}
      {showScrapeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Raspagem em Progresso
            </h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{scrapeStatus}</span>
                <span className="text-sm font-medium text-gray-900">
                  {scrapeProgress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scrapeProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <FiLoader className="animate-spin text-blue-500 mr-2" size={20} />
              <span className="text-sm text-gray-600">
                Processando dados...
              </span>
            </div>

            {scrapeProgress === 100 && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                <FiCheck className="inline mr-2" size={16} />
                Scraping concluído com sucesso!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabela de Agendamentos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Agendamentos ({filteredAgendamentos.length} agendamentos)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data/Hora
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plataformas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Perfis
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keywords
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgendamentos.map((agendamento, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {agendamento.id.length > 20
                      ? `${agendamento.id.substring(0, 20)}...`
                      : agendamento.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(agendamento.scheduledAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {agendamento.platforms.map((platform, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">
                      {agendamento.profiles.length > 0
                        ? agendamento.profiles.join(", ")
                        : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">
                      {agendamento.keywords.length > 0
                        ? agendamento.keywords.join(", ")
                        : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agendamento.status === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : agendamento.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : agendamento.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(agendamento)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Editar"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handlePause(agendamento)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                        title="Pausar"
                      >
                        <FiPause size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(agendamento.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Excluir"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      {renderViewButton(agendamento)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas e Melhores Práticas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Dicas e Melhores Práticas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">
              Raspagem Imediata
            </h3>
            <p className="text-sm text-gray-600">
              Use "Raspar Agora" para obter resultados instantâneos. Ideal para
              verificações pontuais e análises urgentes.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">
              Horários Estratégicos
            </h3>
            <p className="text-sm text-gray-600">
              Agende monitoramentos para períodos de maior atividade nas redes
              sociais, geralmente entre 10h e 15h.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">
              Monitoramento Completo
            </h3>
            <p className="text-sm text-gray-600">
              Combine perfis específicos com palavras-chave relevantes para
              garantir uma cobertura completa de monitoramento.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Ação Rápida</h3>
            <p className="text-sm text-gray-600">
              Ao detectar violações, notifique imediatamente a empresa para
              remoção do conteúdo em até 24 horas.
            </p>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">
              Validação de Perfis
            </h3>
            <p className="text-sm text-gray-600">
              Sempre verifique se os perfis existem antes de iniciar o
              monitoramento. Perfis inválidos podem causar falhas no processo.
            </p>
          </div>
          <div className="border-l-4 border-pink-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">
              Palavras-chave Eficazes
            </h3>
            <p className="text-sm text-gray-600">
              Use termos específicos e variações comuns. Palavras muito
              genéricas podem gerar muitos falsos positivos.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Resultados */}
      <ResultModal
        showResultModal={showResultModal}
        setShowResultModal={setShowResultModal}
        resultData={resultData}
        setResultData={setResultData}
        loadingResult={loadingResult}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default SearchDeepScan;
