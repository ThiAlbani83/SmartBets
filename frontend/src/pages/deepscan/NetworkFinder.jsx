import React, { useState } from "react";
import { useDeepScanStore } from "../../store/useDeepscanStore";

const NetworkFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "Instagram",
    "Facebook",
    "Twitter",
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");

  // Simulated data for demonstration
  const mockResults = [
    {
      id: 1,
      name: "BetWinner",
      platforms: ["Instagram", "Facebook"],
      followers: 45000,
      posts: 127,
      lastActivity: "2023-11-15",
      status: "Não Regulamentada",
      risk: "Alto",
    },
    {
      id: 2,
      name: "LuckyPlay",
      platforms: ["Instagram", "Twitter"],
      followers: 28000,
      posts: 89,
      lastActivity: "2023-11-18",
      status: "Não Regulamentada",
      risk: "Médio",
    },
    {
      id: 3,
      name: "GoldenBet",
      platforms: ["Facebook"],
      followers: 32000,
      posts: 103,
      lastActivity: "2023-11-14",
      status: "Não Regulamentada",
      risk: "Alto",
    },
    {
      id: 4,
      name: "WinnersBet",
      platforms: ["Instagram", "Twitter"],
      followers: 18500,
      posts: 67,
      lastActivity: "2023-11-17",
      status: "Não Regulamentada",
      risk: "Baixo",
    },
    {
      id: 5,
      name: "BetKing",
      platforms: ["Instagram", "Facebook", "Twitter"],
      followers: 52000,
      posts: 145,
      lastActivity: "2023-11-16",
      status: "Não Regulamentada",
      risk: "Alto",
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };

  const handleExport = () => {
    // Implement export functionality
    alert("Exportando resultados...");
  };

  const handleSchedule = () => {
    // Implement scheduling functionality
    alert("Agendando varredura periódica...");
  };

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "Alto":
        return "bg-red-100 text-red-800 border-red-200";
      case "Médio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixo":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Network Finder - Detecção de Casas de Apostas Não Regulamentadas
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Termos de busca (ex: apostas, bet, bônus, cassino)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite palavras-chave separadas por vírgula"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              className={`w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${
                isSearching ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Iniciar Varredura
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-12 mt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Plataformas:
            </p>
            <div className="flex flex-wrap gap-2">
              {["Instagram", "Facebook", "Twitter", "TikTok", "YouTube"].map(
                (platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPlatforms.includes(platform)
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {platform}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Resultados da Varredura ({results.length} casas de apostas
              detectadas)
            </h2>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={handleSchedule}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Agendar Varredura
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={handleExport}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Exportar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Plataformas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Seguidores
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posts
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Última Atividade
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
                    Nível de Risco
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {row.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.followers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.posts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getRiskBadgeColor(
                          row.risk
                        )}`}
                      >
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkFinder;
