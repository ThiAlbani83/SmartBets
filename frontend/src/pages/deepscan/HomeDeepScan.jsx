import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WordCloudWrapper from "../../components/deepscan/WordCloudWrapper";
import PizzaGraphs from "../../components/deepscan/PizzaGraphs";
import { Bar } from "react-chartjs-2";

const HomeDeepScan = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [latestScans, setLatestScans] = useState([]);

  // Dados fictícios para demonstração
  const companies = [
    { id: "1", name: "Jetbet" },
    { id: "2", name: "Bet4" },
    { id: "3", name: "BetWarrior" },
    { id: "4", name: "Esporte365" },
  ];

  // Dados da nuvem de palavras
  const wordCloudData = [
    { text: "Apostas", value: 64 },
    { text: "Dinheiro", value: 42 },
    { text: "Ganhos", value: 35 },
    { text: "Lucro", value: 28 },
    { text: "Investimento", value: 25 },
    { text: "Cassino", value: 22 },
    { text: "Bonus", value: 20 },
    { text: "Promoção", value: 18 },
  ];

  // Dados de sentimento
  const sentimentData = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Dados de problemas por rede social - usando todas as redes do RegisterModal
  const networkIssuesData = {
    labels: [
      "Instagram",
      "Facebook",
      "LinkedIn",
      "X/Twitter",
      "Google",
      "YouTube",
      "Discord",
      "Telegram",
      "Deep/Dark Web",
      "TikTok",
      "Reddit",
    ],
    datasets: [
      {
        label: "Problemas Encontrados",
        data: [18, 15, 7, 12, 5, 9, 14, 11, 22, 13, 8],
        backgroundColor: [
          "#FF6384", // Instagram
          "#36A2EB", // Facebook
          "#4C68D7", // LinkedIn
          "#1DA1F2", // X/Twitter
          "#DB4437", // Google
          "#FF0000", // YouTube
          "#5865F2", // Discord
          "#0088CC", // Telegram
          "#2C2F33", // Deep/Dark Web
          "#000000", // TikTok
          "#FF4500", // Reddit
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opções para o gráfico de barras de problemas por rede
  const networkIssuesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Problemas Encontrados por Rede Social",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} ocorrências`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade de Problemas",
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  // Dados das últimas raspagens
  const mockLatestScans = [
    { id: 1, company: "Jetbet", date: "2023-11-05", keywords: 245, issues: 12 },
    { id: 2, company: "Bet4", date: "2023-11-04", keywords: 198, issues: 7 },
    {
      id: 3,
      company: "BetWarrior",
      date: "2023-11-04",
      keywords: 312,
      issues: 15,
    },
    { id: 4, company: "Jetbet", date: "2023-11-03", keywords: 187, issues: 9 },
    {
      id: 5,
      company: "Esporte365",
      date: "2023-11-02",
      keywords: 203,
      issues: 11,
    },
    { id: 6, company: "Bet4", date: "2023-11-01", keywords: 176, issues: 5 },
    { id: 7, company: "Jetbet", date: "2023-10-31", keywords: 231, issues: 14 },
    {
      id: 8,
      company: "BetWarrior",
      date: "2023-10-30",
      keywords: 289,
      issues: 10,
    },
    {
      id: 9,
      company: "Esporte365",
      date: "2023-10-29",
      keywords: 167,
      issues: 6,
    },
    { id: 10, company: "Bet4", date: "2023-10-28", keywords: 219, issues: 9 },
  ];

  // Carregar dados iniciais
  useEffect(() => {
    // Aqui você faria a chamada à API para buscar os dados reais
    // Por enquanto, usamos os dados simulados
    setLatestScans(mockLatestScans);
  }, []);

  // Filtrar dados com base na empresa selecionada
  const filteredScans =
    selectedCompany === "all"
      ? latestScans
      : latestScans.filter((scan) => scan.company === selectedCompany);

  // Contadores para cartões de resumo
  const totalKeywords = filteredScans.reduce(
    (sum, scan) => sum + scan.keywords,
    0
  );
  const totalIssues = filteredScans.reduce((sum, scan) => sum + scan.issues, 0);
  const averageIssuesPerScan =
    filteredScans.length > 0
      ? (totalIssues / filteredScans.length).toFixed(1)
      : 0;

  // Handle click on "Ver Detalhes" button
  const handleViewDetails = (scan) => {
    navigate("/deepscan/verificacoes", {
      state: {
        date: scan.date,
        company: scan.company,
      },
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col relative font-roboto">
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Visão Geral - DeepScan360</h2>
      </div>

      {/* Filtro de empresas */}
      <div className="mb-6 p-4">
        <label className="block text-mainText mb-2">Filtrar por Empresa:</label>
        <select
          className="border rounded p-2"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="all">Todas as Empresas</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cartões de resumo */}
      <div className="flex gap-6 mb-6 px-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-linesAndBorders flex-1">
          <h3 className="text-lg font-semibold text-primaryLight mb-2">
            Total de Palavras
          </h3>
          <p className="text-xl font-bold">{totalKeywords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-linesAndBorders flex-1">
          <h3 className="text-lg font-semibold text-primaryLight mb-2">
            Total de Problemas
          </h3>
          <p className="text-xl font-bold">{totalIssues}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-linesAndBorders flex-1">
          <h3 className="text-lg font-semibold text-primaryLight mb-2">
            Média de Problemas / Análise
          </h3>
          <p className="text-xl font-bold">{averageIssuesPerScan}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="flex gap-6 px-4 mb-6">
        <div className="p-4 rounded-lg shadow-md border border-linesAndBorders  flex-1 max-h-[400px]">
          <h3 className="text-xl mb-4">Nuvem de Palavras</h3>
          <WordCloudWrapper
            words={wordCloudData}
            options={{
              fontSizes: [20, 60],
              colors: ["#3B70A2", "#5BB9D3", "#101A5A", "#171717"],
              fontWeight: "bold",
              padding: 3,
            }}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md border border-linesAndBorders  flex-1 max-h-[400px]">
          <h3 className="text-xl mb-4">Análise de Sentimento</h3>
          <PizzaGraphs bet_name="Análise Geral" data={sentimentData} />
        </div>
        <div className="p-4 rounded-lg shadow-md border border-linesAndBorders flex-1 max-h-[400px]">
          <h3 className="text-xl mb-4">Problemas por Rede Social</h3>
          <div className="h-[220px]">
            <Bar data={networkIssuesData} options={networkIssuesOptions} />
          </div>
        </div>
      </div>

      {/* Lista das últimas raspagens */}
      <div className="flex-1 px-4 mb-4">
        <div className="border border-linesAndBorders p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Últimas Raspagens</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Empresa</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Palavras</th>
                  <th className="text-left p-2">Problemas</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{scan.id}</td>
                    <td className="p-2">{scan.company}</td>
                    <td className="p-2">{scan.date}</td>
                    <td className="p-2">{scan.keywords}</td>
                    <td className="p-2">{scan.issues}</td>
                    <td className="p-2">
                      <button
                        className="bg-primaryLight text-white py-1 px-3 rounded hover:bg-primary"
                        onClick={() => handleViewDetails(scan)}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDeepScan;
