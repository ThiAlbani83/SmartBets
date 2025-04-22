import React, { useState, useEffect } from "react";
import { scrapingResults } from "../../utils/fakeData.js";
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
import { Bar, Pie, Line } from "react-chartjs-2";

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

const ScrapeDeepScan = () => {
  const [filteredResults, setFilteredResults] = useState(scrapingResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("Todas");
  const [selectedRedeSocial, setSelectedRedeSocial] = useState("Todas");
  const [selectedViolacao, setSelectedViolacao] = useState("Todas");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Extrair empresas únicas para o filtro
  const empresas = [
    "Todas",
    ...new Set(scrapingResults.map((item) => item.empresa)),
  ];

  // Extrair redes sociais únicas para o filtro
  const redesSociais = [
    "Todas",
    ...new Set(scrapingResults.map((item) => item.redeSocial)),
  ];

  // Preparar dados para gráficos
  const [violacoesPorEmpresa, setViolacoesPorEmpresa] = useState({});
  const [violacoesPorRedeSocial, setViolacoesPorRedeSocial] = useState({});
  const [sentimentoDistribution, setSentimentoDistribution] = useState({});

  useEffect(() => {
    // Filtrar resultados com base nos critérios selecionados
    let results = [...scrapingResults];

    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.textoPostagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.perfil.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEmpresa !== "Todas") {
      results = results.filter((item) => item.empresa === selectedEmpresa);
    }

    if (selectedRedeSocial !== "Todas") {
      results = results.filter(
        (item) => item.redeSocial === selectedRedeSocial
      );
    }

    if (selectedViolacao !== "Todas") {
      if (selectedViolacao === "Com Violação") {
        results = results.filter((item) => item.violacaoTermos);
      } else if (selectedViolacao === "Sem Violação") {
        results = results.filter((item) => !item.violacaoTermos);
      }
    }

    // Ordenar resultados se necessário
    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredResults(results);

    // Calcular dados para gráficos
    const violacoesEmpresa = {};
    const violacoesRedeSocial = {};
    const sentimentos = { Positivo: 0, Neutro: 0, Negativo: 0 };

    results.forEach((item) => {
      // Contagem de violações por empresa
      if (!violacoesEmpresa[item.empresa]) {
        violacoesEmpresa[item.empresa] = { total: 0, violacoes: 0 };
      }
      violacoesEmpresa[item.empresa].total += 1;
      if (item.violacaoTermos) {
        violacoesEmpresa[item.empresa].violacoes += 1;
      }

      // Contagem de violações por rede social
      if (!violacoesRedeSocial[item.redeSocial]) {
        violacoesRedeSocial[item.redeSocial] = { total: 0, violacoes: 0 };
      }
      violacoesRedeSocial[item.redeSocial].total += 1;
      if (item.violacaoTermos) {
        violacoesRedeSocial[item.redeSocial].violacoes += 1;
      }

      // Contagem de sentimentos
      sentimentos[item.sentimento] += 1;
    });

    setViolacoesPorEmpresa(violacoesEmpresa);
    setViolacoesPorRedeSocial(violacoesRedeSocial);
    setSentimentoDistribution(sentimentos);
  }, [
    searchTerm,
    selectedEmpresa,
    selectedRedeSocial,
    selectedViolacao,
    sortConfig,
  ]);

  // Função para ordenar resultados
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Preparar dados para o gráfico de violações por empresa
  const violacoesEmpresaData = {
    labels: Object.keys(violacoesPorEmpresa),
    datasets: [
      {
        label: "Total de Postagens",
        data: Object.values(violacoesPorEmpresa).map((v) => v.total),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Violações",
        data: Object.values(violacoesPorEmpresa).map((v) => v.violacoes),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Preparar dados para o gráfico de violações por rede social
  const violacoesRedeSocialData = {
    labels: Object.keys(violacoesPorRedeSocial),
    datasets: [
      {
        label: "Total de Postagens",
        data: Object.values(violacoesPorRedeSocial).map((v) => v.total),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Violações",
        data: Object.values(violacoesPorRedeSocial).map((v) => v.violacoes),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Preparar dados para o gráfico de distribuição de sentimentos
  const sentimentoData = {
    labels: Object.keys(sentimentoDistribution),
    datasets: [
      {
        data: Object.values(sentimentoDistribution),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
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
        text: "Violações por Categoria",
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
        text: "Distribuição de Sentimentos",
      },
    },
  };

  return (
    <div className="mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Resultados de Scraping</h1>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa, texto ou perfil"
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
              {empresas.map((empresa) => (
                <option key={empresa} value={empresa}>
                  {empresa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rede Social
            </label>
            <select
              value={selectedRedeSocial}
              onChange={(e) => setSelectedRedeSocial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {redesSociais.map((rede) => (
                <option key={rede} value={rede}>
                  {rede}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Violação
            </label>
            <select
              value={selectedViolacao}
              onChange={(e) => setSelectedViolacao(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todas">Todas</option>
              <option value="Com Violação">Com Violação</option>
              <option value="Sem Violação">Sem Violação</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Violações por Empresa</h2>
          <div className="h-80">
            <Bar data={violacoesEmpresaData} options={barOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Violações por Rede Social
          </h2>
          <div className="h-80">
            <Bar data={violacoesRedeSocialData} options={barOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Distribuição de Sentimentos
          </h2>
          <div className="h-80 flex justify-center">
            <div className="w-1/2">
              <Pie data={sentimentoData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Resultados ({filteredResults.length} postagens encontradas)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  onClick={() => requestSort("redeSocial")}
                >
                  Rede Social
                  {sortConfig.key === "redeSocial" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("perfil")}
                >
                  Perfil
                  {sortConfig.key === "perfil" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("dataPostagem")}
                >
                  Data
                  {sortConfig.key === "dataPostagem" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("sentimento")}
                >
                  Sentimento
                  {sortConfig.key === "sentimento" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("violacaoTermos")}
                >
                  Violação
                  {sortConfig.key === "violacaoTermos" && (
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
              {filteredResults.map((result, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.redeSocial}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.perfil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.dataPostagem).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.sentimento === "Positivo"
                          ? "bg-green-100 text-green-800"
                          : result.sentimento === "Neutro"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.sentimento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.violacaoTermos
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {result.violacaoTermos ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => window.open(result.linkPostagem, "_blank")}
                    >
                      Ver Post
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => {
                        // Aqui você pode implementar a lógica para exibir detalhes
                        alert(`Detalhes da postagem: ${result.textoPostagem}`);
                      }}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes das Violações */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Termos Proibidos Detectados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults
            .filter(
              (result) =>
                result.violacaoTermos &&
                result.palavrasChaveEncontradas?.length > 0
            )
            .map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {result.empresa} - {result.perfil}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(result.dataPostagem).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Termos detectados:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {result.palavrasChaveEncontradas.map((termo, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                      >
                        {termo}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                  {result.textoPostagem}
                </p>
                <a
                  href={result.linkPostagem}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver postagem original
                </a>
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
              // Lógica para exportar resultados
              alert("Exportando resultados...");
            }}
          >
            Exportar Resultados
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {
              // Lógica para gerar relatório
              alert("Gerando relatório...");
            }}
          >
            Gerar Relatório
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => {
              // Lógica para agendar monitoramento
              alert("Agendando monitoramento...");
            }}
          >
            Agendar Monitoramento
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => {
              // Lógica para notificar violações
              alert("Notificando violações...");
            }}
          >
            Notificar Violações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrapeDeepScan;
