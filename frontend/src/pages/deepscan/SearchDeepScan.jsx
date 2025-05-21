import React, { useState, useEffect } from "react";
import { registerBet } from "../../utils/fakeData.js";
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
import { Bar, Pie } from "react-chartjs-2";
import { useDeepScanStore } from "../../store/useDeepscanStore.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const {
    scheduleScraping,
    scheduledTasks,
    getScheduledTasks,
    cancelScheduledTask,
    monitorScrapeProgress,
    isLoading,
    error,
    platforms,
  } = useDeepScanStore();

  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedRedes, setSelectedRedes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [progressMonitors, setProgressMonitors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    empresa: "",
    profiles: [],
    searchPhrases: [],
    platforms: [],
    format: "DB", // Default format as per API
    selectedDays: [],
    startHour: "08:00",
    afterDate: "",
    beforeDate: "",
    frequencia: "Mensal",
    responsavel: "",
    observacoes: "",
  });

  // Estatísticas
  const [agendamentosPorEmpresa, setAgendamentosPorEmpresa] = useState({});
  const [agendamentosPorDia, setAgendamentosPorDia] = useState({});

  // Função para formatar tarefas agendadas da API para o formato da UI
  const formatScheduledTasks = (tasks) => {
    return tasks.map((task, index) => {
      // Extrair dia e hora da data agendada
      const scheduledDate = new Date(task.scheduledAt || new Date());

      return {
        id: task.scrapeId || `MS${index + 1}`.padStart(5, "0"),
        empresa: task.clientName || selectedEmpresa || "Cliente",
        redesSociais: task.platforms || [],
        dataAgendamento: task.scheduledAt || new Date().toISOString(),
        frequencia: task.recurring ? "Mensal" : "Única",
        responsavel: task.responsavel || "Sistema",
        status: task.status || "Agendado",
        ultimaExecucao: task.lastRun || null,
        proximaExecucao: task.nextRun || task.scheduledAt,
        observacoes: task.notes || "",
        scrapeId: task.scrapeId,
        day: task.day,
        time: task.time,
      };
    });
  };

  useEffect(() => {
    // Buscar tarefas agendadas quando o componente montar
    const fetchScheduledTasks = async () => {
      const tasks = await getScheduledTasks();
      const formattedTasks = formatScheduledTasks(tasks);
      setAgendamentos(formattedTasks);
    };

    fetchScheduledTasks();

    // Extrair empresas únicas dos dados
    const empresasData = registerBet.map((item) => item.empresa);
    setEmpresas(empresasData);

    // Filtrar agendamentos com base na busca
    let filtered = [...agendamentos];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar resultados se necessário
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredAgendamentos(filtered);

    // Calcular estatísticas
    const agendEmpresa = {};
    agendamentos.forEach((item) => {
      if (!agendEmpresa[item.empresa]) {
        agendEmpresa[item.empresa] = 0;
      }
      agendEmpresa[item.empresa] += 1;
    });
    setAgendamentosPorEmpresa(agendEmpresa);

    // Agendamentos por dia da semana
    const agendDia = {
      Segunda: 0,
      Terça: 0,
      Quarta: 0,
      Quinta: 0,
      Sexta: 0,
      Sábado: 0,
      Domingo: 0,
    };

    agendamentos.forEach((item) => {
      const date = new Date(item.dataAgendamento);
      const diaSemana = date.getDay();
      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      agendDia[diasSemana[diaSemana]] += 1;
    });
    setAgendamentosPorDia(agendDia);
  }, [getScheduledTasks, searchTerm, sortConfig]);

  // Atualizar filteredAgendamentos quando agendamentos mudar
  useEffect(() => {
    setFilteredAgendamentos(agendamentos);
  }, [agendamentos]);

  // Função para ordenar resultados
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Manipulação do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "empresa") {
      const empresaSelecionada = registerBet.find(
        (item) => item.empresa === value
      );
      if (empresaSelecionada) {
        // Pré-selecionar redes sociais da empresa
        const redesDisponiveis = Object.keys(
          empresaSelecionada.redesSociais
        ).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
        setSelectedRedes(redesDisponiveis);
        setFormData({
          ...formData,
          empresa: value,
          platforms: redesDisponiveis,
        });
      }
    }
  };

  const handleProfilesChange = (e) => {
    const profiles = e.target.value.split(",").map((profile) => profile.trim());
    setFormData({
      ...formData,
      profiles,
    });
  };

  const handleSearchPhrasesChange = (e) => {
    const searchPhrases = e.target.value
      .split(",")
      .map((phrase) => phrase.trim());
    setFormData({
      ...formData,
      searchPhrases,
    });
  };

  const handlePlatformsChange = (e) => {
    const { value, checked } = e.target;
    let novasPlatforms = [...formData.platforms];

    if (checked) {
      novasPlatforms.push(value);
    } else {
      novasPlatforms = novasPlatforms.filter((platform) => platform !== value);
    }

    setFormData({
      ...formData,
      platforms: novasPlatforms,
    });
  };

  const handleSelectedDaysChange = (e) => {
    const { value, checked } = e.target;
    const day = parseInt(value, 10);
    let novosDias = [...formData.selectedDays];

    if (checked) {
      novosDias.push(day);
    } else {
      novosDias = novosDias.filter((d) => d !== day);
    }

    setFormData({
      ...formData,
      selectedDays: novosDias,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar dados para a API
    const scrapingParams = {
      profiles: formData.profiles,
      searchPhrases: formData.searchPhrases,
      platforms: formData.platforms,
      format: formData.format,
      selectedDays: formData.selectedDays,
      startHour: formData.startHour,
      afterDate: formData.afterDate || undefined,
      beforeDate: formData.beforeDate || undefined,
    };

    try {
      // Chamar a API para agendar a raspagem
      const result = await scheduleScraping(scrapingParams);

      if (result.success) {
        // Adicionar à lista de agendamentos local para UI
        const novosAgendamentos = result.scheduled.map((schedule) => {
          // Criar uma data válida para o agendamento
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();

          // Criar uma data para o dia agendado no mês atual
          // Se o dia for maior que o último dia do mês, usar o último dia
          const lastDayOfMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
          ).getDate();
          const scheduledDay = Math.min(schedule.day, lastDayOfMonth);

          // Extrair horas e minutos do horário
          const [hours, minutes] = schedule.time.split(":").map(Number);

          // Criar um objeto de data válido
          const scheduledDate = new Date(
            currentYear,
            currentMonth,
            scheduledDay,
            hours,
            minutes
          );

          // Se a data já passou neste mês, agendar para o próximo mês
          if (scheduledDate < currentDate) {
            scheduledDate.setMonth(scheduledDate.getMonth() + 1);
          }

          return {
            id:
              schedule.scrapeId ||
              `MS${agendamentos.length + 1}`.padStart(5, "0"),
            empresa: formData.empresa,
            redesSociais: formData.platforms,
            dataAgendamento: scheduledDate.toISOString(),
            frequencia: formData.frequencia,
            responsavel: formData.responsavel,
            status: "Agendado",
            ultimaExecucao: null,
            proximaExecucao: scheduledDate.toISOString(),
            observacoes: formData.observacoes,
            scrapeId: schedule.scrapeId,
            day: schedule.day,
            time: schedule.time,
          };
        });

        setAgendamentos([...agendamentos, ...novosAgendamentos]);

        // Limpar formulário
        setFormData({
          empresa: "",
          profiles: [],
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

        alert("Agendamento criado com sucesso!");
      } else {
        alert(`Erro ao agendar: ${result.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao agendar raspagem:", error);
      alert(`Erro ao agendar: ${error.message || "Erro desconhecido"}`);
    }
  };

  // Função para cancelar um agendamento
  const handleCancelSchedule = async (scrapeId) => {
    if (window.confirm(`Deseja cancelar o agendamento?`)) {
      try {
        const result = await cancelScheduledTask(scrapeId);

        if (result.success) {
          // Remover da lista local
          const updatedAgendamentos = agendamentos.filter(
            (item) => item.scrapeId !== scrapeId
          );
          setAgendamentos(updatedAgendamentos);
          alert("Agendamento cancelado com sucesso!");
        } else {
          alert(`Erro ao cancelar: ${result.error}`);
        }
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        alert(`Erro ao cancelar: ${error.message || "Erro desconhecido"}`);
      }
    }
  };

  // Função para iniciar monitoramento de progresso
  const startProgressMonitoring = (scrapeId) => {
    // Inicializar o estado de progresso
    setProgressMonitors((prev) => ({
      ...prev,
      [scrapeId]: { progress: 0, message: "Iniciando monitoramento..." },
    }));

    // Iniciar o monitoramento via SSE
    const closeMonitor = monitorScrapeProgress(scrapeId, (data) => {
      if (data.error) {
        setProgressMonitors((prev) => ({
          ...prev,
          [scrapeId]: {
            ...prev[scrapeId],
            error: data.error,
            message: "Erro no monitoramento",
          },
        }));
        return;
      }

      setProgressMonitors((prev) => ({
        ...prev,
        [scrapeId]: {
          progress: data.progress,
          message: data.message,
          status: data.status,
        },
      }));

      // Atualizar o status do agendamento na lista
      if (
        data.status === "completed" ||
        data.status === "failed" ||
        data.status === "cancelled"
      ) {
        setAgendamentos((prev) =>
          prev.map((item) =>
            item.scrapeId === scrapeId
              ? {
                  ...item,
                  status:
                    data.status === "completed"
                      ? "Concluído"
                      : data.status === "failed"
                      ? "Falhou"
                      : "Cancelado",
                  ultimaExecucao: new Date().toISOString(),
                }
              : item
          )
        );
      }
    });

    // Retornar função para parar o monitoramento
    return closeMonitor;
  };

  // Preparar dados para gráficos
  const agendamentosEmpresaData = {
    labels: Object.keys(agendamentosPorEmpresa),
    datasets: [
      {
        label: "Agendamentos por Empresa",
        data: Object.values(agendamentosPorEmpresa),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const agendamentosDiaData = {
    labels: Object.keys(agendamentosPorDia),
    datasets: [
      {
        label: "Agendamentos por Dia da Semana",
        data: Object.values(agendamentosPorDia),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(199, 199, 199, 0.5)",
        ],
      },
    ],
  };

  // Opções para os gráficos
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Agendamentos por Empresa",
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribuição por Dia da Semana",
      },
    },
  };

  // Gerar dias do mês para seleção
  const diasDoMes = Array.from({ length: 31 }, (_, i) => i + 1);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  return (
    <div className="mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Agendamento de Monitoramento</h1>

      {/* Formulário de Agendamento */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <select
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma empresa</option>
                {empresas.map((empresa, index) => (
                  <option key={index} value={empresa}>
                    {empresa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <input
                type="text"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleInputChange}
                required
                placeholder="Nome do responsável"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfis (separados por vírgula)
              </label>
              <input
                type="text"
                name="profiles"
                value={formData.profiles.join(", ")}
                onChange={handleProfilesChange}
                placeholder="usuario1, usuario2, usuario3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termos de Busca (separados por vírgula)
              </label>
              <input
                type="text"
                name="searchPhrases"
                value={formData.searchPhrases.join(", ")}
                onChange={handleSearchPhrasesChange}
                placeholder="termo1, termo2, termo3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dias do Mês para Agendamento
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
              {diasDoMes.map((dia) => (
                <div key={dia} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`dia-${dia}`}
                    value={dia}
                    checked={formData.selectedDays.includes(dia)}
                    onChange={handleSelectedDaysChange}
                    className="mr-1"
                  />
                  <label htmlFor={`dia-${dia}`} className="text-sm">
                    {dia}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequência
            </label>
            <select
              name="frequencia"
              value={formData.frequencia}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Única">Única</option>
              <option value="Diária">Diária</option>
              <option value="Semanal">Semanal</option>
              <option value="Quinzenal">Quinzenal</option>
              <option value="Mensal">Mensal</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Observações adicionais sobre o monitoramento"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Agendando..." : "Agendar Monitoramento"}
            </button>
          </div>
        </form>
      </div>

      {/* Estatísticas e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>

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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("id")}
                >
                  ID
                  {sortConfig.key === "id" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("empresa")}
                >
                  Empresa
                  {sortConfig.key === "empresa" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("dataAgendamento")}
                >
                  Data/Hora
                  {sortConfig.key === "dataAgendamento" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plataformas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("frequencia")}
                >
                  Frequência
                  {sortConfig.key === "frequencia" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("responsavel")}
                >
                  Responsável
                  {sortConfig.key === "responsavel" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  Status
                  {sortConfig.key === "status" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agendamento.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agendamento.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(agendamento.dataAgendamento)}
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
                    {agendamento.frequencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agendamento.responsavel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agendamento.status === "Agendado"
                          ? "bg-yellow-100 text-yellow-800"
                          : agendamento.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800"
                          : agendamento.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : agendamento.status === "Falhou"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agendamento.status}
                    </span>

                    {/* Mostrar progresso se estiver em andamento */}
                    {progressMonitors[agendamento.scrapeId] && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                progressMonitors[agendamento.scrapeId].progress
                              }%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1">
                          {progressMonitors[agendamento.scrapeId].message}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agendamento.status === "Agendado" && (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {
                            // Iniciar monitoramento de progresso
                            startProgressMonitoring(agendamento.scrapeId);
                          }}
                        >
                          Monitorar
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() =>
                            handleCancelSchedule(agendamento.scrapeId)
                          }
                        >
                          Cancelar
                        </button>
                      </>
                    )}

                    {agendamento.status === "Em andamento" && (
                      <button
                        className="text-orange-600 hover:text-orange-900"
                        onClick={() =>
                          handleCancelSchedule(agendamento.scrapeId)
                        }
                      >
                        Interromper
                      </button>
                    )}

                    {(agendamento.status === "Concluído" ||
                      agendamento.status === "Falhou") && (
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          // Lógica para ver resultados
                          alert(
                            `Ver resultados do agendamento ${agendamento.id}`
                          );
                        }}
                      >
                        Ver Resultados
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>

      {/* Ações em Lote */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>

      {/* Histórico de Monitoramentos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>

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
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
      </div>
    </div>
  );
};

export default SearchDeepScan;
