import React, { useState, useEffect } from "react";
import {
  registerBet,
  scrapingResults,
  contentAnalysisData,
  violationAlerts,
  monitoringHistory,
  complianceReports,
  systemStats,
  postFrequencyData,
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
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";

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
  ArcElement,
  RadialLinearScale
);

const HomeDeepScan = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [topViolatingCompanies, setTopViolatingCompanies] = useState([]);
  const [violationsByNetwork, setViolationsByNetwork] = useState({});
  const [violationTrend, setViolationTrend] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState({});
  const [postFrequency, setPostFrequency] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalMonitorings: 0,
    totalViolations: 0,
    violationRate: 0,
    pendingAlerts: 0,
    criticalAlerts: 0,
  });

  // Extrair empresas únicas
  const companies = [...new Set(registerBet.map((item) => item.empresa))];

  // Extrair redes sociais únicas
  const socialNetworks = ["Instagram", "X", "Facebook", "Telegram", "Discord"];

  useEffect(() => {
    // Filtrar violações com base na empresa selecionada
    let violations = scrapingResults.filter((item) => item.violacaoTermos);

    if (selectedCompany) {
      violations = violations.filter(
        (item) => item.empresa === selectedCompany
      );
    }

    if (selectedNetwork) {
      violations = violations.filter(
        (item) => item.redeSocial === selectedNetwork
      );
    }

    setFilteredViolations(violations);

    // Filtrar relatórios
    let reports = complianceReports;

    if (selectedCompany) {
      reports = reports.filter((item) => item.empresa === selectedCompany);
    }

    setFilteredReports(reports);

    // Calcular KPIs
    const pendingAlerts = violationAlerts.filter(
      (alert) => alert.statusRevisao === "Pendente"
    ).length;

    const criticalAlerts = violationAlerts.filter(
      (alert) => alert.prioridade === "Alta"
    ).length;

    const totalMonitorings = monitoringHistory.length;
    const totalViolations = violations.length;
    const violationRate =
      totalMonitorings > 0
        ? ((totalViolations / totalMonitorings) * 100).toFixed(1)
        : 0;

    setKpiData({
      totalMonitorings,
      totalViolations,
      violationRate,
      pendingAlerts,
      criticalAlerts,
    });

    // Calcular empresas com mais violações
    const violationsByCompany = contentAnalysisData
      .sort((a, b) => b.percentualViolacoes - a.percentualViolacoes)
      .slice(0, 5);

    setTopViolatingCompanies(violationsByCompany);

    // Calcular violações por rede social
    const networkViolations = {};
    socialNetworks.forEach((network) => {
      networkViolations[network] = scrapingResults.filter(
        (item) => item.redeSocial === network && item.violacaoTermos
      ).length;
    });

    setViolationsByNetwork(networkViolations);

    // Tendência de violações
    setViolationTrend(systemStats.tendenciaViolacoes);

    // Status de compliance
    const complianceStatusData = {};
    const statusTypes = ["Não conforme", "Parcialmente conforme", "Conforme"];

    statusTypes.forEach((status) => {
      complianceStatusData[status] = complianceReports.filter(
        (report) => report.statusCompliance === status
      ).length;
    });

    setComplianceStatus(complianceStatusData);

    // Frequência de postagens
    if (selectedCompany) {
      const companyFrequency = postFrequencyData.find(
        (item) => item.empresa === selectedCompany
      );

      if (companyFrequency) {
        setPostFrequency(companyFrequency.ultimosDias);
      } else {
        setPostFrequency([]);
      }
    } else {
      // Média de postagens por dia para todas as empresas
      const avgPostsByDay = {};

      postFrequencyData.forEach((company) => {
        company.ultimosDias.forEach((day) => {
          if (!avgPostsByDay[day.data]) {
            avgPostsByDay[day.data] = { total: 0, count: 0 };
          }
          avgPostsByDay[day.data].total += day.quantidadePostagens;
          avgPostsByDay[day.data].count += 1;
        });
      });

      const avgPostsArray = Object.keys(avgPostsByDay).map((date) => ({
        data: date,
        quantidadePostagens:
          avgPostsByDay[date].total / avgPostsByDay[date].count,
      }));

      setPostFrequency(
        avgPostsArray.sort((a, b) => new Date(a.data) - new Date(b.data))
      );
    }
  }, [selectedCompany, selectedNetwork, selectedPeriod]);

  // Preparar dados para gráficos
  const violationsByCompanyData = {
    labels: topViolatingCompanies.map((item) => item.empresa),
    datasets: [
      {
        label: "% de Violações",
        data: topViolatingCompanies.map((item) => item.percentualViolacoes),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const violationsByNetworkData = {
    labels: Object.keys(violationsByNetwork),
    datasets: [
      {
        label: "Violações por Rede Social",
        data: Object.values(violationsByNetwork),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const violationTrendData = {
    labels: violationTrend.map((item) => item.mes),
    datasets: [
      {
        label: "Tendência de Violações",
        data: violationTrend.map((item) => item.quantidade),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const complianceStatusData = {
    labels: Object.keys(complianceStatus),
    datasets: [
      {
        label: "Status de Compliance",
        data: Object.values(complianceStatus),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const postFrequencyChartData = {
    labels: postFrequency.map((item) => {
      const date = new Date(item.data);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: "Frequência de Postagens",
        data: postFrequency.map((item) => item.quantidadePostagens),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const termsViolationData = {
    labels: systemStats.termosProibidosMaisComuns.map((item) => item.termo),
    datasets: [
      {
        label: "Termos Proibidos Mais Comuns",
        data: systemStats.termosProibidosMaisComuns.map(
          (item) => item.ocorrencias
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
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
        text: "Empresas com Maior % de Violações",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
        text: "Violações por Rede Social",
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tendência de Violações",
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
        position: "top",
      },
      title: {
        display: true,
        text: "Status de Compliance",
      },
    },
  };

  const polarAreaOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Termos Proibidos Mais Comuns",
      },
    },
  };

  return (
    <>
      <div className="mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Monitoramento</h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as empresas</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rede Social
              </label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as redes</option>
                {socialNetworks.map((network, index) => (
                  <option key={index} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
            </div>
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total de Monitoramentos
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {kpiData.totalMonitorings}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Monitoramentos realizados no período
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Violações Detectadas
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {kpiData.totalViolations}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Total de violações encontradas
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Taxa de Violação
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {kpiData.violationRate}%
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Percentual de monitoramentos com violações
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Alertas Pendentes
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {kpiData.pendingAlerts}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Alertas aguardando análise
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Alertas Críticos
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {kpiData.criticalAlerts}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Alertas de alta prioridade
            </div>
          </div>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Empresas com Maior % de Violações
            </h2>
            <div className="h-80">
              <Bar data={violationsByCompanyData} options={barOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Tendência de Violações
            </h2>
            <div className="h-80">
              <Line data={violationTrendData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Gráficos secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Violações por Rede Social
            </h2>
            <div className="h-64">
              <Pie data={violationsByNetworkData} options={pieOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Status de Compliance</h2>
            <div className="h-64">
              <Doughnut data={complianceStatusData} options={doughnutOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Termos Proibidos Mais Comuns
            </h2>
            <div className="h-64">
              <PolarArea data={termsViolationData} options={polarAreaOptions} />
            </div>
          </div>
        </div>

        {/* Frequência de Postagens */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Frequência de Postagens
          </h2>
          <div className="h-64">
            <Bar data={postFrequencyChartData} />
          </div>
        </div>

        {/* Alertas Recentes */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Alertas Recentes ({violationAlerts.length} alertas)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rede Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Detecção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Termos Violados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {violationAlerts.slice(0, 5).map((alert, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alert.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.redeSocial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(alert.dataDeteccao).toLocaleDateString(
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
                        {alert.termosViolados.map((termo, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                          >
                            {termo}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.statusRevisao === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : alert.statusRevisao === "Em análise"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.statusRevisao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.prioridade === "Alta"
                            ? "bg-red-100 text-red-800"
                            : alert.prioridade === "Média"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.prioridade}
                      </span>
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
                alert("Ver todos os alertas");
              }}
            >
              Ver todos os alertas →
            </button>
          </div>
        </div>

        {/* Violações Recentes */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Violações Recentes ({filteredViolations.length} violações)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rede Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Postagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Termos Violados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredViolations.slice(0, 5).map((violation, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {violation.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {violation.perfil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {violation.redeSocial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(violation.dataPostagem).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {violation.palavrasChaveEncontradas.map(
                          (termo, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                            >
                              {termo}
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={violation.linkPostagem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver postagem
                      </a>
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
                alert("Ver todas as violações");
              }}
            >
              Ver todas as violações →
            </button>
          </div>
        </div>

        {/* Relatórios de Compliance */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Relatórios de Compliance ({filteredReports.length} relatórios)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nível de Risco
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.slice(0, 5).map((report, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.periodoInicio).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      a{" "}
                      {new Date(report.periodoFim).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.dataEmissao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.statusCompliance === "Não conforme"
                            ? "bg-red-100 text-red-800"
                            : report.statusCompliance ===
                              "Parcialmente conforme"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.statusCompliance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.nivelRisco === "Crítico"
                            ? "bg-red-100 text-red-800"
                            : report.nivelRisco === "Alto"
                            ? "bg-orange-100 text-orange-800"
                            : report.nivelRisco === "Médio"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.nivelRisco}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.statusAcao === "Não iniciado"
                            ? "bg-gray-100 text-gray-800"
                            : report.statusAcao === "Em andamento"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.statusAcao}
                      </span>
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
                alert("Ver todos os relatórios");
              }}
            >
              Ver todos os relatórios →
            </button>
          </div>
        </div>

        {/* Resumo por Empresa */}
        {selectedCompany && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Resumo da Empresa: {selectedCompany}
            </h2>

            {contentAnalysisData
              .filter((item) => item.empresa === selectedCompany)
              .map((company, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Estatísticas Gerais
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">
                            Total de Postagens
                          </p>
                          <p className="text-xl font-semibold">
                            {company.totalPostagens}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">
                            Postagens com Violações
                          </p>
                          <p className="text-xl font-semibold">
                            {company.postagensComViolacoes}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">
                            Percentual de Violações
                          </p>
                          <p className="text-xl font-semibold">
                            {company.percentualViolacoes}%
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">
                            Tendência Mensal
                          </p>
                          <p className="text-xl font-semibold capitalize">
                            {company.tendenciaMensal}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Principais Termos Violados
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {company.principaisTermosViolados.map(
                            (termo, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between items-center"
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  {termo.termo}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {termo.ocorrencias} ocorrências
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Redes Sociais Mais Utilizadas
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg h-64">
                      <Pie
                        data={{
                          labels: company.redesMaisUtilizadas.map(
                            (rede) => rede.rede
                          ),
                          datasets: [
                            {
                              data: company.redesMaisUtilizadas.map(
                                (rede) => rede.percentual
                              ),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.6)",
                                "rgba(255, 206, 86, 0.6)",
                                "rgba(75, 192, 192, 0.6)",
                                "rgba(153, 102, 255, 0.6)",
                                "rgba(255, 159, 64, 0.6)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              position: "right",
                            },
                            title: {
                              display: true,
                              text: "Distribuição por Rede Social",
                            },
                          },
                        }}
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Ações Recomendadas
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {complianceReports
                          .filter(
                            (report) => report.empresa === selectedCompany
                          )
                          .slice(0, 1)
                          .map((report, idx) => (
                            <div key={idx}>
                              <p className="text-sm text-gray-700 mb-2">
                                <span className="font-medium">
                                  Nível de Risco:
                                </span>{" "}
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    report.nivelRisco === "Crítico"
                                      ? "bg-red-100 text-red-800"
                                      : report.nivelRisco === "Alto"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {report.nivelRisco}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700 mb-2">
                                <span className="font-medium">
                                  Prazo de Adequação:
                                </span>{" "}
                                {new Date(
                                  report.prazoAdequacao
                                ).toLocaleDateString("pt-BR")}
                              </p>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Recomendações:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                {report.recomendacoes.map((rec, recIdx) => (
                                  <li
                                    key={recIdx}
                                    className="text-sm text-gray-700"
                                  >
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Resumo por Empresa */}
      {selectedCompany && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Resumo da Empresa: {selectedCompany}
          </h2>

          {contentAnalysisData
            .filter((item) => item.empresa === selectedCompany)
            .map((company, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Estatísticas Gerais
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Total de Postagens
                        </p>
                        <p className="text-xl font-semibold">
                          {company.totalPostagens}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Postagens com Violações
                        </p>
                        <p className="text-xl font-semibold">
                          {company.postagensComViolacoes}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Percentual de Violações
                        </p>
                        <p className="text-xl font-semibold">
                          {company.percentualViolacoes}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Tendência Mensal
                        </p>
                        <p className="text-xl font-semibold capitalize">
                          {company.tendenciaMensal}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Principais Termos Violados
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {company.principaisTermosViolados.map((termo, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {termo.termo}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {termo.ocorrencias} ocorrências
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Redes Sociais Mais Utilizadas
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg h-64">
                    <Pie
                      data={{
                        labels: company.redesMaisUtilizadas.map(
                          (rede) => rede.rede
                        ),
                        datasets: [
                          {
                            data: company.redesMaisUtilizadas.map(
                              (rede) => rede.percentual
                            ),
                            backgroundColor: [
                              "rgba(54, 162, 235, 0.6)",
                              "rgba(255, 206, 86, 0.6)",
                              "rgba(75, 192, 192, 0.6)",
                              "rgba(153, 102, 255, 0.6)",
                              "rgba(255, 159, 64, 0.6)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            position: "right",
                          },
                          title: {
                            display: true,
                            text: "Distribuição por Rede Social",
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Ações Recomendadas
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {complianceReports
                        .filter((report) => report.empresa === selectedCompany)
                        .slice(0, 1)
                        .map((report, idx) => (
                          <div key={idx}>
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">
                                Nível de Risco:
                              </span>{" "}
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  report.nivelRisco === "Crítico"
                                    ? "bg-red-100 text-red-800"
                                    : report.nivelRisco === "Alto"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {report.nivelRisco}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">
                                Prazo de Adequação:
                              </span>{" "}
                              {new Date(
                                report.prazoAdequacao
                              ).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Recomendações:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              {report.recomendacoes.map((rec, recIdx) => (
                                <li
                                  key={recIdx}
                                  className="text-sm text-gray-700"
                                >
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Calendário de Monitoramentos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Próximos Monitoramentos Agendados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monitoringSchedules
            .filter(
              (schedule) => new Date(schedule.dataAgendamento) > new Date()
            )
            .sort(
              (a, b) =>
                new Date(a.dataAgendamento) - new Date(b.dataAgendamento)
            )
            .slice(0, 6)
            .map((schedule, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    {schedule.empresa}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {schedule.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Data/Hora:</span>{" "}
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
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Responsável:</span>{" "}
                  {schedule.responsavel}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Redes:</span>
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {schedule.redesMonitorar.map((rede, idx) => (
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
                      alert(`Detalhes do agendamento ${schedule.id}`);
                    }}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            onClick={() => {
              alert("Ver todos os agendamentos");
            }}
          >
            Ver todos os agendamentos →
          </button>
        </div>
      </div>

      {/* Estatísticas do Sistema */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Estatísticas do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total de Empresas
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {systemStats.totalEmpresas}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total de Monitoramentos
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {systemStats.totalMonitoramentos}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total de Violações
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {systemStats.totalViolacoes}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Taxa Média de Violação
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {systemStats.percentualViolacoes}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Redes Sociais Monitoradas
            </h3>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: systemStats.redesMaisMonitoradas.map(
                    (rede) => rede.rede
                  ),
                  datasets: [
                    {
                      data: systemStats.redesMaisMonitoradas.map(
                        (rede) => rede.percentual
                      ),
                      backgroundColor: [
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: true,
                      text: "Distribuição por Rede Social",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Tendência de Violações
            </h3>
            <div className="h-64">
              <Line
                data={{
                  labels: systemStats.tendenciaViolacoes.map(
                    (item) => item.mes
                  ),
                  datasets: [
                    {
                      label: "Quantidade de Violações",
                      data: systemStats.tendenciaViolacoes.map(
                        (item) => item.quantidade
                      ),
                      fill: true,
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Evolução Mensal",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDeepScan;
