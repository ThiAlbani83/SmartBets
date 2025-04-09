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

  // Function to generate dates between today and 7 days ago in dd-mm-YYYY format
  const generateRecentDate = () => {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 7); // Random number between 0-6 days ago
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    // Format as dd-mm-YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Function to generate creation date (older than last activity)
  const generateCreationDate = () => {
    const today = new Date();
    const monthsAgo = Math.floor(Math.random() * 24) + 6; // Random between 6-30 months ago
    const date = new Date(today);
    date.setMonth(today.getMonth() - monthsAgo);

    // Format as dd-mm-YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Simulated data for demonstration with expanded fields
  const mockResults = [
    {
      id: 1,
      name: "BetWinner",
      platforms: ["Instagram", "Facebook"],
      followers: 45000,
      posts: 127,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "betwinner.com",
      gateways: ["PIX", "Boleto", "Crypto"],
      cnpj: "Não identificado",
      banks: ["Nubank", "Itaú"],
      creationDate: generateCreationDate(),
    },
    {
      id: 2,
      name: "LuckyPlay",
      platforms: ["Instagram", "Twitter"],
      followers: 28000,
      posts: 89,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Médio",
      domain: "luckyplay.bet",
      gateways: ["PIX", "Transferência"],
      cnpj: "12.345.678/0001-99",
      banks: ["Bradesco"],
      creationDate: generateCreationDate(),
    },
    {
      id: 3,
      name: "GoldenBet",
      platforms: ["Facebook"],
      followers: 32000,
      posts: 103,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "goldenbet.com.br",
      gateways: ["PIX", "Boleto", "Cartão"],
      cnpj: "Não identificado",
      banks: ["Santander", "Inter"],
      creationDate: generateCreationDate(),
    },
    {
      id: 4,
      name: "WinnersBet",
      platforms: ["Instagram", "Twitter"],
      followers: 18500,
      posts: 67,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Baixo",
      domain: "winnersbet.io",
      gateways: ["PIX", "Crypto"],
      cnpj: "23.456.789/0001-10",
      banks: ["C6", "Inter"],
      creationDate: generateCreationDate(),
    },
    {
      id: 5,
      name: "BetKing",
      platforms: ["Instagram", "Facebook", "Twitter"],
      followers: 52000,
      posts: 145,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "betking.com",
      gateways: ["PIX", "Boleto", "Transferência"],
      cnpj: "Não identificado",
      banks: ["Itaú", "Bradesco", "Nubank"],
      creationDate: generateCreationDate(),
    },
    // 10 more tropicalized results
    {
      id: 6,
      name: "SambaBet",
      platforms: ["Instagram", "TikTok"],
      followers: 63000,
      posts: 215,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "sambabet.com.br",
      gateways: ["PIX", "Boleto", "Crypto"],
      cnpj: "34.567.890/0001-21",
      banks: ["Nubank", "Caixa"],
      creationDate: generateCreationDate(),
    },
    {
      id: 7,
      name: "CarnavalGames",
      platforms: ["Facebook", "YouTube"],
      followers: 41200,
      posts: 178,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Médio",
      domain: "carnavalgames.bet",
      gateways: ["PIX", "Transferência"],
      cnpj: "Não identificado",
      banks: ["Banco do Brasil", "Inter"],
      creationDate: generateCreationDate(),
    },
    {
      id: 8,
      name: "CopacabanaCasino",
      platforms: ["Instagram", "Twitter", "TikTok"],
      followers: 87500,
      posts: 342,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "copacabanacasino.com",
      gateways: ["PIX", "Boleto", "Cartão", "Crypto"],
      cnpj: "45.678.901/0001-32",
      banks: ["Itaú", "Santander", "BTG"],
      creationDate: generateCreationDate(),
    },
    {
      id: 9,
      name: "IpanemaJogos",
      platforms: ["Facebook", "Instagram"],
      followers: 29800,
      posts: 112,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Baixo",
      domain: "ipanemajogos.bet",
      gateways: ["PIX", "Boleto"],
      cnpj: "Não identificado",
      banks: ["Nubank"],
      creationDate: generateCreationDate(),
    },
    {
      id: 10,
      name: "FuteBet Brasil",
      platforms: ["Twitter", "Instagram"],
      followers: 76300,
      posts: 289,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "futebet.com.br",
      gateways: ["PIX", "Transferência", "Crypto"],
      cnpj: "56.789.012/0001-43",
      banks: ["Bradesco", "Banco do Brasil"],
      creationDate: generateCreationDate(),
    },
    {
      id: 11,
      name: "AçaíBet",
      platforms: ["Instagram", "TikTok", "YouTube"],
      followers: 54200,
      posts: 198,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Médio",
      domain: "acaibet.com.br",
      gateways: ["PIX", "Boleto"],
      cnpj: "Não identificado",
      banks: ["C6", "Inter", "Nubank"],
      creationDate: generateCreationDate(),
    },
    {
      id: 12,
      name: "CaipirinhaCasino",
      platforms: ["Facebook", "Twitter"],
      followers: 32700,
      posts: 143,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "caipirinhacasino.bet",
      gateways: ["PIX", "Crypto"],
      cnpj: "67.890.123/0001-54",
      banks: ["Itaú", "Santander"],
      creationDate: generateCreationDate(),
    },
    {
      id: 13,
      name: "GuaranáGames",
      platforms: ["Instagram"],
      followers: 21500,
      posts: 87,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Baixo",
      domain: "guaranagames.com",
      gateways: ["PIX"],
      cnpj: "Não identificado",
      banks: ["Nubank"],
      creationDate: generateCreationDate(),
    },
    {
      id: 14,
      name: "FeijoadadaBet",
      platforms: ["TikTok", "Instagram"],
      followers: 48900,
      posts: 231,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Médio",
      domain: "feijoadadabet.bet",
      gateways: ["PIX", "Boleto", "Transferência"],
      cnpj: "78.901.234/0001-65",
      banks: ["Bradesco", "Caixa"],
      creationDate: generateCreationDate(),
    },
    {
      id: 15,
      name: "CaipiraBet",
      platforms: ["Facebook", "Instagram", "Twitter", "YouTube"],
      followers: 93200,
      posts: 376,
      lastActivity: generateRecentDate(),
      status: "Não Regulamentada",
      risk: "Alto",
      domain: "caipirabet.com.br",
      gateways: ["PIX", "Boleto", "Cartão", "Crypto"],
      cnpj: "89.012.345/0001-76",
      banks: ["Itaú", "Bradesco", "Santander", "Inter"],
      creationDate: generateCreationDate(),
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
    <div className="p-6 max-w-8xl w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        BetCrawler - Detecção de Casas de Apostas Não Regulamentadas
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* <div className="md:col-span-6">
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
          </div> */}

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
              {[
                "Instagram",
                "Facebook",
                "Google",
                "Linkedin",
                "Discord",
                "Telegram",
                "Deep/Dark Web",
                "Reddit",
                "Sites de Notícias",
                "Twitter",
                "TikTok",
                "YouTube",
                "Blogs",
              ].map((platform) => (
                <button
                  key={platform}
                  /* onClick={() => togglePlatform(platform)} */
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-default ${
                    selectedPlatforms.includes(platform)
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {platform}
                </button>
              ))}
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
                    Casa de Apostas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Presença Digital
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Informações Legais
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Métodos de Pagamento
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avaliação de Risco
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main row with reorganized data */}
                    <tr className="hover:bg-gray-50">
                      {/* Casa de Apostas */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 mb-1">
                            {row.name}
                          </span>
                          <a
                            href={`https://${row.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {row.domain}
                          </a>
                          <span className="text-xs text-gray-500 mt-1">
                            Criado em: {row.creationDate}
                          </span>
                        </div>
                      </td>

                      {/* Presença Digital */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {row.platforms.map((platform) => (
                              <span
                                key={platform}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 text-xs">
                            <div>
                              <span className="text-gray-500">Seguidores:</span>{" "}
                              <span className="font-medium text-gray-700">
                                {row.followers.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Posts:</span>{" "}
                              <span className="font-medium text-gray-700">
                                {row.posts}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Última atividade: {row.lastActivity}
                          </div>
                        </div>
                      </td>

                      {/* Informações Legais */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">CNPJ:</span>{" "}
                            <span className="text-xs font-medium text-gray-700">
                              {row.cnpj}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Status:
                            </span>{" "}
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                              {row.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Métodos de Pagamento */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">
                              Gateways:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {row.gateways.map((gateway) => (
                                <span
                                  key={gateway}
                                  className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                                >
                                  {gateway}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Bancos:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {row.banks.map((bank) => (
                                <span
                                  key={bank}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200"
                                >
                                  {bank}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Avaliação de Risco */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`px-3 py-1 text-sm rounded-full border font-medium ${getRiskBadgeColor(
                              row.risk
                            )}`}
                          >
                            Risco {row.risk}
                          </span>

                          {/* Indicador visual de risco */}
                          <div className="w-full mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                row.risk === "Alto"
                                  ? "bg-red-500 w-full"
                                  : row.risk === "Médio"
                                  ? "bg-yellow-500 w-2/3"
                                  : "bg-green-500 w-1/3"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
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
