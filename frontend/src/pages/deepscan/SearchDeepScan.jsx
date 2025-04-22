import React, { useState, useEffect } from "react";
import {
  registerBet,
  scheduledMonitorings,
  monitoringSchedules,
} from "../../utils/fakeData.js";
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
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [redesSociais, setRedesSociais] = useState([]);
  const [selectedRedes, setSelectedRedes] = useState([]);
  const [agendamentos, setAgendamentos] = useState(scheduledMonitorings);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Form state
  const [formData, setFormData] = useState({
    empresa: "",
    redesSociais: [],
    dataAgendamento: "",
    horaAgendamento: "08:00",
    frequencia: "Semanal",
    responsavel: "",
    observacoes: "",
  });

  // Estatísticas
  const [agendamentosPorEmpresa, setAgendamentosPorEmpresa] = useState({});
  const [agendamentosPorDia, setAgendamentosPorDia] = useState({});

  useEffect(() => {
    // Extrair empresas únicas dos dados
    const empresasData = registerBet.map((item) => item.empresa);
    setEmpresas(empresasData);

    // Extrair todas as redes sociais possíveis
    const todasRedes = ["Instagram", "X", "Facebook", "Telegram", "Discord"];
    setRedesSociais(todasRedes);

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
  }, [agendamentos, searchTerm, sortConfig]);

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
          redesSociais: redesDisponiveis,
        });
      }
    }
  };

  const handleRedesSociaisChange = (e) => {
    const { value, checked } = e.target;
    let novasRedes = [...formData.redesSociais];

    if (checked) {
      novasRedes.push(value);
    } else {
      novasRedes = novasRedes.filter((rede) => rede !== value);
    }

    setFormData({
      ...formData,
      redesSociais: novasRedes,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Criar novo agendamento
    const dataHora = `${formData.dataAgendamento}T${formData.horaAgendamento}:00`;

    const novoAgendamento = {
      id: `MS${agendamentos.length + 1}`.padStart(5, "0"),
      empresa: formData.empresa,
      redesSociais: formData.redesSociais,
      dataAgendamento: dataHora,
      frequencia: formData.frequencia,
      responsavel: formData.responsavel,
      status: "Agendado",
      ultimaExecucao: null,
      proximaExecucao: dataHora,
      observacoes: formData.observacoes,
    };

    // Adicionar à lista de agendamentos
    setAgendamentos([...agendamentos, novoAgendamento]);

    // Limpar formulário
    setFormData({
      empresa: "",
      redesSociais: [],
      dataAgendamento: "",
      horaAgendamento: "08:00",
      frequencia: "Semanal",
      responsavel: "",
      observacoes: "",
    });

    alert("Agendamento criado com sucesso!");
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

  // Obter data atual formatada para o input date
  const today = new Date().toISOString().split("T")[0];

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="dataAgendamento"
                value={formData.dataAgendamento}
                onChange={handleInputChange}
                min={today}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                name="horaAgendamento"
                value={formData.horaAgendamento}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
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
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Redes Sociais
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {redesSociais.map((rede, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`rede-${rede}`}
                    value={rede}
                    checked={formData.redesSociais.includes(rede)}
                    onChange={handleRedesSociaisChange}
                    className="mr-2"
                  />
                  <label htmlFor={`rede-${rede}`} className="text-sm">
                    {rede}
                  </label>
                </div>
              ))}
            </div>
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Agendar Monitoramento
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
                  Redes Sociais
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
                    {new Date(agendamento.dataAgendamento).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {agendamento.redesSociais.map((rede, idx) => (
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
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        // Lógica para editar agendamento
                        alert(`Editar agendamento ${agendamento.id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        // Lógica para cancelar agendamento
                        if (
                          window.confirm(
                            `Deseja cancelar o agendamento ${agendamento.id}?`
                          )
                        ) {
                          const updatedAgendamentos = agendamentos.filter(
                            (item) => item.id !== agendamento.id
                          );
                          setAgendamentos(updatedAgendamentos);
                        }
                      }}
                    >
                      Cancelar
                    </button>
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
            .filter((item) => new Date(item.dataAgendamento) > new Date())
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
                  {new Date(agendamento.dataAgendamento).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Responsável:</span>{" "}
                  {agendamento.responsavel}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Redes:</span>
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {agendamento.redesSociais.map((rede, idx) => (
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
                      // Lógica para visualizar detalhes
                      alert(`Detalhes do agendamento ${agendamento.id}`);
                    }}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Ações em Lote */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações em Lote</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // Lógica para exportar agendamentos
              alert("Exportando agendamentos...");
            }}
          >
            Exportar Agendamentos
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {
              // Lógica para gerar relatório
              alert("Gerando relatório de agendamentos...");
            }}
          >
            Gerar Relatório
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => {
              // Lógica para agendar em lote
              alert("Abrindo agendamento em lote...");
            }}
          >
            Agendar em Lote
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => {
              // Lógica para cancelar agendamentos selecionados
              alert("Cancelando agendamentos selecionados...");
            }}
          >
            Cancelar Selecionados
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
                  Redes Monitoradas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Violações
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
              {monitoringSchedules.slice(0, 5).map((schedule, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {schedule.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(schedule.dataAgendamento).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.responsavel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {schedule.redesMonitorar.map((rede, idx) => (
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {Math.floor(Math.random() * 5)} detectadas
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        schedule.status === "Agendado"
                          ? "bg-yellow-100 text-yellow-800"
                          : schedule.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800"
                          : schedule.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        // Lógica para ver relatório
                        alert(`Ver relatório do monitoramento ${schedule.id}`);
                      }}
                    >
                      Ver Relatório
                    </button>
                  </td>
                </tr>
              ))}
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
              Inclua todas as redes sociais da empresa para garantir uma
              cobertura completa e evitar violações não detectadas.
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
    </div>
  );
};

export default SearchDeepScan;
