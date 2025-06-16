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
import { FiEdit2, FiPause, FiTrash2 } from "react-icons/fi";

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


  const handleViewResult = async (agendamento) => {
    if (agendamento.status !== "completed") {
      console.log("Resultado não disponível para visualização");
      return;
    }
  
    try {
      console.log("Tentando visualizar resultado para o scrape com ID:", agendamento.id);
  
      // Construindo a URL para a requisição GET com o scrapeId
      const url = `http://89.116.74.250:5001/api/v1/data/filter?scrapeId=${agendamento.id}&page=1&limit=100`;
  
      // Fazendo a requisição GET
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-Key': 'c9f93bcc-4369-43de-9a00-6af58446935b',
          'X-API-Secret': '74354ff0-2649-4af7-b71e-7086cc14978a'
        }
      });
  
      // Verificando a resposta
      if (response.ok) {
        const result = await response.json();
        console.log("Resultado obtido com sucesso:", result);
  
        // Aqui você pode manipular os dados recebidos, como exibi-los em um modal ou redirecionar para outra página
        // Por exemplo, podemos abrir um modal ou exibir os dados diretamente:
        // openModal(result); // Se estiver usando um modal
      } else {
        const error = await response.json();
        console.error("Erro ao buscar o resultado:", error);
      }
    } catch (error) {
      console.error("Erro desconhecido ao buscar o resultado:", error);
    }
  };
  

  // Adicione estas plataformas no início do componente
  const profilePlatforms = [
    "Instagram",
    "Facebook",
    "Google",
    "X",
    "LinkedIn",
    "Youtube",
    "Discord",
    "Telegram",
    "Deep/Dark",
    "Tiktok",
    "Reddit",
    "Sites de Noticias",
    "Blogs",
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
  };

  // Função para lidar com a mudança dos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilesChange = (e) => {
    setFormData({
      ...formData,
      profiles: e.target.value.split(",").map((profile) => profile.trim()),
    });
    setError(""); // Limpar erro
  };

  const handleKeywordsChange = (e) => {
    setFormData({
      ...formData,
      keywords: e.target.value.split(",").map((keyword) => keyword.trim()),
    });
    setError(""); // Limpar erro
  };

  const handleSearchPhrasesChange = (e) => {
    setFormData({
      ...formData,
      searchPhrases: e.target.value.split(",").map((phrase) => phrase.trim()),
    });
  };

  const handlePlatformsChange = (e) => {
    const { value, checked } = e.target;
    const updatedPlatforms = checked
      ? [...formData.platforms, value]
      : formData.platforms.filter((platform) => platform !== value);
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  const handleSelectedDaysChange = (e) => {
    const { value, checked } = e.target;
    const updatedDays = checked
      ? [...formData.selectedDays, parseInt(value)]
      : formData.selectedDays.filter((day) => day !== parseInt(value));
    setFormData({ ...formData, selectedDays: updatedDays });
  };

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

    // Verificar se os campos obrigatórios foram preenchidos
    if (formData.platforms.length === 0) {
      setError("Pelo menos uma plataforma deve ser selecionada.");
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

    // Limpar o erro caso os campos estejam corretamente preenchidos
    setError("");

    const scrapingParams = {
      searchPhrases: formData.searchPhrases,
      platforms: formData.platforms,
      format: formData.format,
      selectedDays: formData.selectedDays,
      startHour: formData.startHour,
      afterDate: formData.afterDate || undefined,
      beforeDate: formData.beforeDate || undefined,
    };

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

    setIsLoading(false);
  };

  // Exemplo de plataformas
  const platforms = ["Twitter", "Facebook", "Instagram", "Google"];

  // Gerar dias do mês para seleção
  const diasDoMes = Array.from({ length: 31 }, (_, i) => i + 1);

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
    return `${d.getDate()}/${d.getMonth() + 1
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
      const response = await fetch(`http://89.116.74.250:5001/api/v1/schedule/${scrapeId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'X-API-Key': 'c9f93bcc-4369-43de-9a00-6af58446935b',
          'X-API-Secret': '74354ff0-2649-4af7-b71e-7086cc14978a'
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Agendamento cancelado com sucesso:", result.message);
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  

  return (
    <div className="mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Agendamento de Monitoramento</h1>

      {/* Formulário de Agendamento */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>
        <form onSubmit={handleSubmit}>
          {/* Perfis e Termos de Busca */}
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
                  <div className="flex flex-wrap gap-2">
                    {formData.profiles.map((profile, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                      >
                        <span className="mr-2">{profile}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProfile(index)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
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
            {/* Palavras-chave */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave para Monitoramento
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {formData.keywords.length} palavra(s) adicionada(s)
                  </span>
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords.join(", ")}
                    onChange={handleKeywordsChange}
                    placeholder="palavra1, palavra2, palavra3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {formData.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                      >
                        <span className="mr-2">{keyword}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    Digite as palavras-chave separadas por vírgula
                  </div>
                )}
              </div>
            </div>
          </div>

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

          {/* Plataformas */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plataformas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {platforms.map((rede, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${rede}`}
                    value={rede}
                    checked={formData.platforms.includes(rede)}
                    onChange={handlePlatformsChange}
                    className="mr-2"
                  />
                  <label htmlFor={`platform-${rede}`} className="text-sm">
                    {rede}
                  </label>
                </div>
              ))}
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
            ${formData.selectedDays.includes(dia)
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

          {/* Exibindo erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Agendando..." : "Agendar Monitoramento"}
            </button>
          </div>
        </form>
      </div>

      {/* Estatísticas e Gráficos */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Agendamentos por Empresa
          </h2>
          <div className="h-80">
            <Bar data={agendamentosEmpresaData} options={barOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Distribuição por Dia da Semana
          </h2>
          <div className="h-80">
            <Pie data={agendamentosDiaData} options={pieOptions} />
          </div>
        </div>
      </div> */}

      {/* Filtros */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa ou responsável"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <select
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as empresas</option>
              {empresas.map((empresa, index) => (
                <option key={index} value={empresa}>
                  {empresa}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}

      {/* Tabela de Agendamentos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Agendamentos ({filteredAgendamentos.length} agendamentos)
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data/Hora
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Plataformas
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Perfis
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Keywords
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  {agendamento.id}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agendamento.profiles.length > 0
                    ? agendamento.profiles.join(", ")
                    : "-"}
                </td>
                <td className="px-6 py-4 w-full max-w-[400px] whitespace-nowrap text-sm text-gray-500">
                  {agendamento.keywords.length > 0
                    ? agendamento.keywords.join(", ")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${agendamento.status === "scheduled"
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
                    <button
                      onClick={() => handleViewResult(agendamento)}
                      disabled={agendamento.status !== "completed"}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${agendamento.status === "completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      title={
                        agendamento.status === "completed"
                          ? "Visualizar Resultado"
                          : "Resultado não disponível"
                      }
                    >
                      Ver Resultado
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Próximos Agendamentos */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Próximos Agendamentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgendamentos
            .filter(
              (item) =>
                item.status === "Agendado" &&
                new Date(item.dataAgendamento) > new Date()
            )
            .sort(
              (a, b) =>
                new Date(a.dataAgendamento) - new Date(b.dataAgendamento)
            )
            .slice(0, 6)
            .map((agendamento, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    {agendamento.empresa}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      agendamento.status === "Agendado"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {agendamento.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Data/Hora:</span>{" "}
                  {formatDate(agendamento.dataAgendamento)}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Responsável:</span>{" "}
                  {agendamento.responsavel}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Plataformas:</span>
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {agendamento.redesSociais &&
                    agendamento.redesSociais.map((rede, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {rede}
                      </span>
                    ))}
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Iniciar monitoramento de progresso
                      startProgressMonitoring(agendamento.scrapeId);
                      alert(
                        `Monitoramento iniciado para o agendamento ${agendamento.id}`
                      );
                    }}
                  >
                    Monitorar
                  </button>
                </div>
              </div>
            ))}
        </div>

        {filteredAgendamentos.filter(
          (item) =>
            item.status === "Agendado" &&
            new Date(item.dataAgendamento) > new Date()
        ).length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Não há agendamentos futuros.
          </p>
        )}
      </div> */}

      {/* Ações em Lote */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações em Lote</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // Exportar agendamentos como CSV
              const headers = [
                "ID",
                "Empresa",
                "Data/Hora",
                "Plataformas",
                "Frequência",
                "Responsável",
                "Status",
              ];
              const csvContent = [
                headers.join(","),
                ...filteredAgendamentos.map((item) =>
                  [
                    item.id,
                    item.empresa,
                    formatDate(item.dataAgendamento),
                    item.redesSociais ? item.redesSociais.join(";") : "",
                    item.frequencia,
                    item.responsavel,
                    item.status,
                  ].join(",")
                ),
              ].join("\n");

              const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `agendamentos_${new Date().toISOString().split("T")[0]}.csv`
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Exportar Agendamentos
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {
              // Gerar relatório
              alert("Gerando relatório de agendamentos...");
              // Aqui você poderia implementar uma função para gerar um relatório mais detalhado
            }}
          >
            Gerar Relatório
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => {
              // Agendar em lote
              alert(
                "Para agendar em lote, prepare um arquivo CSV com os dados e importe-o."
              );
              // Aqui você poderia implementar um modal para upload de CSV
            }}
          >
            Agendar em Lote
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => {
              // Cancelar todos os agendamentos pendentes
              if (
                window.confirm(
                  "Tem certeza que deseja cancelar todos os agendamentos pendentes?"
                )
              ) {
                // Implementar lógica para cancelar todos os agendamentos pendentes
                alert(
                  "Função de cancelamento em lote será implementada em breve."
                );
              }
            }}
          >
            Cancelar Pendentes
          </button>
        </div>
      </div> */}

      {/* Histórico de Monitoramentos */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Histórico de Monitoramentos Recentes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataformas Monitoradas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgendamentos
                .filter(
                  (item) =>
                    item.status === "Concluído" ||
                    item.status === "Falhou" ||
                    (item.status === "Cancelado" && item.ultimaExecucao)
                )
                .sort(
                  (a, b) =>
                    new Date(b.ultimaExecucao || b.dataAgendamento) -
                    new Date(a.ultimaExecucao || a.dataAgendamento)
                )
                .slice(0, 5)
                .map((agendamento, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agendamento.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(
                        agendamento.ultimaExecucao ||
                          agendamento.dataAgendamento
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agendamento.responsavel}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {agendamento.redesSociais &&
                          agendamento.redesSociais.map((rede, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {rede}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agendamento.status === "Concluído"
                            ? "bg-green-100 text-green-800"
                            : agendamento.status === "Falhou"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {agendamento.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          // Lógica para ver relatório/resultados
                          alert(
                            `Ver resultados do monitoramento ${agendamento.id}`
                          );
                        }}
                      >
                        Ver Resultados
                      </button>
                    </td>
                  </tr>
                ))}

              {filteredAgendamentos.filter(
                (item) =>
                  item.status === "Concluído" ||
                  item.status === "Falhou" ||
                  (item.status === "Cancelado" && item.ultimaExecucao)
              ).length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Nenhum histórico de monitoramento disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            onClick={() => {
              // Lógica para ver todos os históricos
              alert("Ver histórico completo de monitoramentos");
            }}
          >
            Ver histórico completo →
          </button>
        </div>
      </div> */}

      {/* Dicas e Melhores Práticas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Dicas e Melhores Práticas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Frequência Ideal</h3>
            <p className="text-sm text-gray-600">
              Para empresas com alto volume de postagens, recomenda-se
              monitoramento diário. Para as demais, 2-3 vezes por semana é
              suficiente.
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
              Inclua todas as plataformas da empresa para garantir uma cobertura
              completa e evitar violações não detectadas.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Ação Rápida</h3>
            <p className="text-sm text-gray-600">
              Ao detectar violações, notifique imediatamente a empresa para
              remoção do conteúdo em até 24 horas.
            </p>
          </div>
        </div>
      </div>

      {/* Status da API */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Status da API</h2>
        <div className="flex items-center mb-4">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              error ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {error ? "API com problemas" : "API operacional"}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
            <button
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              onClick={() => getScheduledTasks()}
            >
              Tentar reconectar
            </button>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Endpoints disponíveis:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
            <li>Agendamento de monitoramentos</li>
            <li>Validação de perfis</li>
            <li>Busca de dados por perfil</li>
            <li>Monitoramento de progresso em tempo real</li>
            <li>Filtragem de dados raspados</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default SearchDeepScan;
