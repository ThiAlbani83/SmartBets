import React, { useState } from "react";
import { Bar, Doughnut, Line, Radar, PolarArea, Pie } from "react-chartjs-2";
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
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import {
  FiShield,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiMonitor,
  FiZap,
  FiMapPin,
  FiClock,
  FiAlertTriangle,
  FiDatabase,
  FiLink,
  FiCreditCard,
  FiEye,
  FiUser,
} from "react-icons/fi";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const FraudIntel = () => {
  const [activeTab, setActiveTab] = useState("device");

  const tabs = [
    {
      id: "device",
      title: "Device Intelligence",
      icon: <FiMonitor className="w-5 h-5" />,
    },
    {
      id: "velocity",
      title: "Velocity & Behavioural",
      icon: <FiActivity className="w-5 h-5" />,
    },
    {
      id: "graph",
      title: "Graph & Relational",
      icon: <FiUsers className="w-5 h-5" />,
    },
  ];

  // ===== DADOS PARA DEVICE INTELLIGENCE =====

  // Gráfico de detecção de dispositivos
  const deviceFingerprintData = {
    labels: ["Últimas 24h", "7 dias", "30 dias"],
    datasets: [
      {
        label: "Dispositivos Únicos",
        data: [1250, 8500, 34200],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "Dispositivos Suspeitos",
        data: [45, 320, 1280],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de tipos de rede
  const networkTypeData = {
    labels: ["Residencial", "Datacenter", "VPN", "Proxy", "Tor"],
    datasets: [
      {
        data: [65, 15, 12, 6, 2],
        backgroundColor: [
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#374151",
        ],
      },
    ],
  };

  // Gráfico de fingerprinting avançado
  const fingerprintingData = {
    labels: ["Hardware ID", "SO/Browser", "Canvas/WebGL", "Fontes", "Timezone"],
    datasets: [
      {
        label: "Detecções Únicas (milhares)",
        data: [95, 88, 76, 82, 91],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de integridade do dispositivo
  const deviceIntegrityData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Jailbreak/Root",
        data: [23, 19, 25, 31, 28, 22],
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        tension: 0.4,
      },
      {
        label: "Emuladores",
        data: [12, 15, 18, 22, 19, 16],
        backgroundColor: "rgba(251, 146, 60, 0.6)",
        borderColor: "rgba(251, 146, 60, 1)",
        tension: 0.4,
      },
      {
        label: "Automation",
        data: [8, 11, 14, 17, 13, 10],
        backgroundColor: "rgba(168, 85, 247, 0.6)",
        borderColor: "rgba(168, 85, 247, 1)",
        tension: 0.4,
      },
    ],
  };

  // Gráfico de anomalias comportamentais
  const behavioralAnomaliesData = {
    labels: [
      "Mudança Fingerprint",
      "Sessões Simultâneas",
      "Hardware Anômalo",
      "Apps Automação",
    ],
    datasets: [
      {
        data: [156, 89, 67, 34],
        backgroundColor: ["#F59E0B", "#EF4444", "#8B5CF6", "#6B7280"],
      },
    ],
  };

  // ===== DADOS PARA VELOCITY & BEHAVIOURAL =====

  // Gráfico de velocidades ao longo do dia
  const velocityData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Velocidade de Cadastro",
        data: [12, 8, 25, 45, 38, 22],
        backgroundColor: "rgba(34, 197, 94, 0.3)",
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Velocidade de Apostas",
        data: [25, 18, 42, 68, 55, 35],
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Gráfico de cadastros por período
  const registrationSpeedData = {
    labels: ["Madrugada", "Manhã", "Tarde", "Noite"],
    datasets: [
      {
        label: "Cadastros Normais",
        data: [45, 120, 89, 67],
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
      {
        label: "Cadastros Suspeitos",
        data: [12, 8, 25, 31],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
    ],
  };

  // Gráfico de apostas por frequência
  const bettingSpeedData = {
    labels: ["< 1s", "1-5s", "5-30s", "30s-2m", "> 2m"],
    datasets: [
      {
        data: [156, 234, 445, 567, 234],
        backgroundColor: [
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#3B82F6",
          "#6B7280",
        ],
      },
    ],
  };

  // Gráfico de viagens impossíveis
  const impossibleTravelData = {
    labels: [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "Detecções de Viagem Impossível",
        data: [3, 7, 12, 8, 15, 23, 18],
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de transações rápidas
  const quickTransactionsData = {
    labels: [
      "Depósito Imediato",
      "Aposta Rápida",
      "Saque Imediato",
      "Ciclo Completo",
    ],
    datasets: [
      {
        data: [23, 45, 67, 12],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
      },
    ],
  };

  // ===== DADOS PARA GRAPH & RELATIONAL =====

  // Gráfico de clusters
  const clusterData = {
    labels: ["Cluster A", "Cluster B", "Cluster C", "Cluster D", "Isolados"],
    datasets: [
      {
        label: "Contas por Cluster",
        data: [234, 189, 156, 92, 1420],
        backgroundColor: [
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#3B82F6",
          "#6B7280",
        ],
      },
    ],
  };

  // Gráfico de conexões por dispositivo/IP
  const deviceConnectionsData = {
    labels: [
      "1 Conta",
      "2-3 Contas",
      "4-6 Contas",
      "7-10 Contas",
      "> 10 Contas",
    ],
    datasets: [
      {
        data: [1420, 234, 89, 34, 12],
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
          "#7C2D12",
        ],
      },
    ],
  };

  // Gráfico de métodos de pagamento duplicados
  const paymentMethodsData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Cartões Duplicados",
        data: [45, 52, 48, 61, 55, 67],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
      },
      {
        label: "Contas Bancárias",
        data: [23, 28, 31, 35, 29, 42],
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "rgba(16, 185, 129, 1)",
      },
      {
        label: "Carteiras Digitais",
        data: [12, 18, 22, 25, 21, 28],
        backgroundColor: "rgba(245, 158, 11, 0.6)",
        borderColor: "rgba(245, 158, 11, 1)",
      },
    ],
  };

  // Gráfico de social graph
  const socialGraphData = {
    labels: [
      "Mesmo Referenciador",
      "Afiliados Compartilhados",
      "Padrões de Amizade",
      "Conexões Indiretas",
    ],
    datasets: [
      {
        data: [156, 89, 67, 234],
        backgroundColor: ["#EF4444", "#F59E0B", "#8B5CF6", "#6B7280"],
      },
    ],
  };

  // Gráfico de apostas sincronizadas
  const synchronizedBetsData = {
    labels: ["00:00", "06:00", "12:00", "18:00"],
    datasets: [
      {
        label: "Apostas Coordenadas",
        data: [12, 25, 45, 28],
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        tension: 0.4,
      },
      {
        label: "Apostas Normais",
        data: [145, 234, 189, 167],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.4,
      },
    ],
  };

  // Gráfico de fluxo de fundos
  const fundsFlowData = {
    labels: [
      "Depósitos Diretos",
      "Transferências Entre Contas",
      "Contas Mulas",
      "Saques Coordenados",
    ],
    datasets: [
      {
        data: [67, 23, 12, 8],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
      },
    ],
  };

  // Gráfico de overlap com exclusão
  const exclusionOverlapData = {
    labels: [
      "Autoexcluídos",
      "Familiares",
      "Documentos Relacionados",
      "Padrões Similares",
    ],
    datasets: [
      {
        label: "Detecções",
        data: [28, 15, 12, 22],
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Opções dos gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const renderDeviceIntelligence = () => (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Device Intelligence
        </h2>
        <p className="text-blue-700">
          Detecta padrões e anomalias no dispositivo usado pelo usuário,
          reduzindo risco de múltiplas contas, spoofing e automação.
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Fingerprints Únicos
              </p>
              <p className="text-2xl font-bold text-gray-900">34,201</p>
              <p className="text-xs text-green-600">+8.2% vs mês anterior</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiShield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Dispositivos Suspeitos
              </p>
              <p className="text-2xl font-bold text-gray-900">1,284</p>
              <p className="text-xs text-red-600">+12.4% vs mês anterior</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Emuladores Detectados
              </p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-xs text-yellow-600">+5.1% vs mês anterior</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiMonitor className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sessões Simultâneas
              </p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-orange-600">+3.7% vs mês anterior</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiUsers className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiShield className="w-5 h-5 mr-2 text-blue-600" />
            Detecção de Dispositivos
          </h3>
          <Bar data={deviceFingerprintData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
            Tipos de Rede
          </h3>
          <Doughnut data={networkTypeData} options={doughnutOptions} />
        </div>
      </div>

      {/* Gráficos específicos por funcionalidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiShield className="w-5 h-5 mr-2 text-purple-600" />
            Fingerprinting Avançado
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Precisão da identificação por tipo de fingerprint (%)
          </p>
          <Bar data={fingerprintingData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiZap className="w-5 h-5 mr-2 text-orange-600" />
            Anomalias Comportamentais
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Distribuição de anomalias detectadas
          </p>
          <Pie data={behavioralAnomaliesData} options={doughnutOptions} />
        </div>
      </div>

      {/* Gráfico de integridade do dispositivo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiMonitor className="w-5 h-5 mr-2 text-red-600" />
          Integridade do Dispositivo - Evolução Temporal
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Detecções de dispositivos comprometidos ao longo do tempo
        </p>
        <Line data={deviceIntegrityData} options={lineOptions} />
      </div>

      {/* Resumo das funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <FiShield className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-blue-900 mb-2">
            Fingerprinting Avançado
          </h4>
          <p className="text-sm text-blue-700">
            ID único por combinação de hardware, SO, navegador, timezone,
            fontes, canvas e WebGL
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <FiMapPin className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">IP & Rede</h4>
          <p className="text-sm text-green-700">
            ASN, tipo de rede (residencial, datacenter, VPN, proxy, Tor),
            geolocalização
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <FiMonitor className="w-8 h-8 text-red-600 mb-3" />
          <h4 className="font-semibold text-red-900 mb-2">
            Integridade do Dispositivo
          </h4>
          <p className="text-sm text-red-700">
            Jailbreak/root detection, emulador, VM, automation frameworks
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <FiZap className="w-8 h-8 text-orange-600 mb-3" />
          <h4 className="font-semibold text-orange-900 mb-2">Anomalias</h4>
          <p className="text-sm text-orange-700">
            Mudança de fingerprint, sessões simultâneas, hardware anômalo
          </p>
        </div>
      </div>
    </div>
  );
  <div className="space-y-6">
    {/* Estatísticas principais */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Fingerprints Únicos
            </p>
            <p className="text-2xl font-bold text-gray-900">34,201</p>
            <p className="text-xs text-green-600">+8.2% vs mês anterior</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <FiShield className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Dispositivos Suspeitos
            </p>
            <p className="text-2xl font-bold text-gray-900">1,284</p>
            <p className="text-xs text-red-600">+12.4% vs mês anterior</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Emuladores Detectados
            </p>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-xs text-yellow-600">+5.1% vs mês anterior</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <FiMonitor className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Sessões Simultâneas
            </p>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-orange-600">+3.7% vs mês anterior</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <FiUsers className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Gráficos */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Detecção de Dispositivos</h3>
        <Bar data={deviceFingerprintData} options={chartOptions} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Tipos de Rede</h3>
        <Doughnut data={networkTypeData} options={doughnutOptions} />
      </div>
    </div>

    {/* Funcionalidades detalhadas */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiShield className="w-5 h-5 mr-2 text-blue-600" />
          Fingerprinting Avançado
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            ID único por combinação de hardware
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Sistema operacional e navegador
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Timezone, fontes e canvas
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            WebGL fingerprinting
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
          IP & Rede
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            ASN e tipo de rede detectados
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Geolocalização precisa
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Histórico de ASN
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Detecção VPN/Proxy/Tor
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiMonitor className="w-5 h-5 mr-2 text-purple-600" />
          Integridade do Dispositivo
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Jailbreak/Root detection
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Detecção de emuladores e VMs
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Automation frameworks
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Selenium, Puppeteer detection
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiZap className="w-5 h-5 mr-2 text-orange-600" />
          Anomalias Comportamentais
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Mudança atípica de fingerprint
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Sessões simultâneas detectadas
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Hardware anômalo
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Navegadores headless
          </li>
        </ul>
      </div>
    </div>
  </div>;

  const renderVelocityBehavioural = () => (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-900 mb-2">
          Velocity & Behavioural Features
        </h2>
        <p className="text-green-700">
          Mede a velocidade e o volume de ações para detectar abuso ou scripts
          automatizados.
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cadastros/Hora (Pico)
              </p>
              <p className="text-2xl font-bold text-gray-900">68</p>
              <p className="text-xs text-red-600">Limite: 50/hora</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Apostas/Minuto (Pico)
              </p>
              <p className="text-2xl font-bold text-gray-900">245</p>
              <p className="text-xs text-orange-600">+15% vs média</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiZap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Viagens Impossíveis
              </p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-xs text-red-600">Últimas 24h</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiMapPin className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sessões Rápidas
              </p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-yellow-600">&lt; 30 segundos</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico principal de velocidades */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2 text-blue-600" />
          Velocidades ao Longo do Dia
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Monitoramento de cadastros e apostas por horário
        </p>
        <Line data={velocityData} options={lineOptions} />
      </div>

      {/* Grid de gráficos por funcionalidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Velocidade de Cadastro
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Distribuição de cadastros por período do dia
          </p>
          <Bar data={registrationSpeedData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiZap className="w-5 h-5 mr-2 text-purple-600" />
            Velocidade de Apostas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Frequência de apostas por intervalo de tempo
          </p>
          <Doughnut data={bettingSpeedData} options={doughnutOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiMapPin className="w-5 h-5 mr-2 text-red-600" />
            Viagens Impossíveis
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Detecções de "impossible travel" por dia da semana
          </p>
          <Bar data={impossibleTravelData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiCreditCard className="w-5 h-5 mr-2 text-orange-600" />
            Transações Rápidas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Padrões de cash-out e retiradas suspeitas
          </p>
          <Pie data={quickTransactionsData} options={doughnutOptions} />
        </div>
      </div>

      {/* Resumo das funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <FiTrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">
            Velocidade de Cadastro
          </h4>
          <p className="text-sm text-green-700">
            Número de registros únicos por IP/ASN/dispositivo em janela de tempo
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <FiZap className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-purple-900 mb-2">
            Velocidade de Apostas
          </h4>
          <p className="text-sm text-purple-700">
            Frequência incomum de apostas por conta/mercado em segundos/minutos
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <FiMapPin className="w-8 h-8 text-red-600 mb-3" />
          <h4 className="font-semibold text-red-900 mb-2">
            Mudança Geográfica
          </h4>
          <p className="text-sm text-red-700">
            "Impossible travel" - login no Brasil e minutos depois na Europa
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <FiCreditCard className="w-8 h-8 text-orange-600 mb-3" />
          <h4 className="font-semibold text-orange-900 mb-2">
            Cash-out Rápido
          </h4>
          <p className="text-sm text-orange-700">
            Alta frequência de depósitos/saques com pouca ou nenhuma aposta
          </p>
        </div>
      </div>
    </div>
  );

  const renderGraphRelational = () => (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-xl font-semibold text-purple-900 mb-2">
          Graph & Relational Intelligence
        </h2>
        <p className="text-purple-700">
          Relaciona contas, dispositivos e transações para detectar redes e
          conluio.
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Clusters Detectados
              </p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-xs text-red-600">12 de alto risco</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiUsers className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Contas Conectadas
              </p>
              <p className="text-2xl font-bold text-gray-900">671</p>
              <p className="text-xs text-orange-600">+8.5% esta semana</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiLink className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Métodos Pagamento
              </p>
              <p className="text-2xl font-bold text-gray-900">234</p>
              <p className="text-xs text-yellow-600">Duplicados</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiCreditCard className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Autoexcluídos</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-xs text-red-600">Reentradas suspeitas</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiEye className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico principal de clusters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiUsers className="w-5 h-5 mr-2 text-purple-600" />
          Distribuição de Contas por Cluster
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Visualização dos agrupamentos de contas detectados
        </p>
        <Bar data={clusterData} options={chartOptions} />
      </div>

      {/* Grid de gráficos por funcionalidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiDatabase className="w-5 h-5 mr-2 text-blue-600" />
            Conexões por Device/IP
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Número de contas por dispositivo/IP
          </p>
          <Doughnut data={deviceConnectionsData} options={doughnutOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2 text-green-600" />
            Social Graph
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Padrões de conexão social detectados
          </p>
          <Pie data={socialGraphData} options={doughnutOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiCreditCard className="w-5 h-5 mr-2 text-indigo-600" />
            Métodos de Pagamento Duplicados
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Evolução temporal de métodos duplicados
          </p>
          <Line data={paymentMethodsData} options={lineOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiLink className="w-5 h-5 mr-2 text-orange-600" />
            Fluxo de Fundos
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tipos de transações suspeitas detectadas
          </p>
          <Doughnut data={fundsFlowData} options={doughnutOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-red-600" />
            Apostas Sincronizadas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Detecção de coordenação em apostas
          </p>
          <Line data={synchronizedBetsData} options={lineOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiEye className="w-5 h-5 mr-2 text-rose-600" />
            Overlap com Exclusão
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Reentradas de autoexcluídos detectadas
          </p>
          <Bar data={exclusionOverlapData} options={chartOptions} />
        </div>
      </div>

      {/* Resumo das funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <FiDatabase className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-blue-900 mb-2">Clusterização</h4>
          <p className="text-sm text-blue-700">
            Múltiplas contas ligadas ao mesmo dispositivo, IP ou endereço físico
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
          <FiCreditCard className="w-8 h-8 text-indigo-600 mb-3" />
          <h4 className="font-semibold text-indigo-900 mb-2">
            Métodos de Pagamento
          </h4>
          <p className="text-sm text-indigo-700">
            Cartões, contas bancárias ou carteiras digitais repetidas
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <FiUsers className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">Social Graph</h4>
          <p className="text-sm text-green-700">
            Padrões de amizade, mesmo referenciador ou afiliado
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <FiActivity className="w-8 h-8 text-orange-600 mb-3" />
          <h4 className="font-semibold text-orange-900 mb-2">
            Apostas Sincronizadas
          </h4>
          <p className="text-sm text-orange-700">
            Mesmas seleções, odds e timestamps por grupo de contas
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <FiLink className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-purple-900 mb-2">
            Fluxo de Fundos
          </h4>
          <p className="text-sm text-purple-700">
            Rastreamento de depósitos/saques entre contas e terceiros
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-lg border border-rose-200">
          <FiEye className="w-8 h-8 text-rose-600 mb-3" />
          <h4 className="font-semibold text-rose-900 mb-2">
            Listas de Exclusão
          </h4>
          <p className="text-sm text-rose-700">
            Mapeamento de autoexcluídos que reentram por conexões indiretas
          </p>
        </div>
      </div>
    </div>
  );
  <div className="space-y-6">
    {/* Estatísticas principais */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Clusters Detectados
            </p>
            <p className="text-2xl font-bold text-gray-900">47</p>
            <p className="text-xs text-red-600">12 de alto risco</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <FiUsers className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Contas Conectadas</p>
          <p className="text-2xl font-bold text-gray-900">671</p>
          <p className="text-xs text-orange-600">+8.5% esta semana</p>
        </div>
        <div className="p-3 bg-orange-100 rounded-full">
          <FiLink className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Métodos Pagamento</p>
          <p className="text-2xl font-bold text-gray-900">234</p>
          <p className="text-xs text-yellow-600">Duplicados</p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-full">
          <FiCreditCard className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Autoexcluídos</p>
          <p className="text-2xl font-bold text-gray-900">28</p>
          <p className="text-xs text-red-600">Reentradas suspeitas</p>
        </div>
        <div className="p-3 bg-red-100 rounded-full">
          <FiEye className="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>
  </div>;

  {
    /* Gráfico de clusters */
  }
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold mb-4">
      Distribuição de Contas por Cluster
    </h3>
    <Bar data={clusterData} options={chartOptions} />
  </div>;

  {
    /* Funcionalidades detalhadas */
  }
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiDatabase className="w-5 h-5 mr-2 text-blue-600" />
        Clusterização por Device/IP
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Múltiplas contas por dispositivo
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Análise de endereços IP
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Endereços físicos repetidos
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Redes de dispositivos
        </li>
      </ul>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiCreditCard className="w-5 h-5 mr-2 text-purple-600" />
        Métodos de Pagamento
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Cartões repetidos
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Contas bancárias duplicadas
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Carteiras digitais compartilhadas
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Padrões de transação
        </li>
      </ul>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiUsers className="w-5 h-5 mr-2 text-green-600" />
        Social Graph
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Padrões de amizade
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Mesmo referenciador
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Afiliados compartilhados
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Redes de conexão
        </li>
      </ul>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiEye className="w-5 h-5 mr-2 text-orange-600" />
        Apostas Sincronizadas
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Mesmas seleções
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Odds idênticas
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Timestamps suspeitos
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          Grupo de contas coordenadas
        </li>
      </ul>
    </div>
  </div>;
  const renderTabContent = () => {
    switch (activeTab) {
      case "device":
        return renderDeviceIntelligence();
      case "velocity":
        return renderVelocityBehavioural();
      case "graph":
        return renderGraphRelational();
      default:
        return renderDeviceIntelligence();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fraud Intelligence
          </h1>
          <p className="text-gray-600">
            Sistema avançado de detecção e prevenção de fraudes através de
            análise comportamental e correlacional
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FraudIntel;
