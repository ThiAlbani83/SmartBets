import React, { useEffect, useState } from "react";

const ResultsTable = ({ results, selectedPlatforms }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [debugInfo, setDebugInfo] = useState({
    selectedPlatforms: [],
    availablePlatforms: [],
    filteringActive: false,
  });

  // Effect to filter results whenever props change
  useEffect(() => {
    // Extract all unique platforms from results for debugging
    const availablePlatforms = [
      ...new Set(results?.map((r) => r.plataforma) || []),
    ];

    // Update debug info
    setDebugInfo({
      selectedPlatforms: selectedPlatforms || [],
      availablePlatforms,
      filteringActive: selectedPlatforms && selectedPlatforms.length > 0,
    });

    if (!results || results.length === 0) {
      setFilteredResults([]);
      return;
    }

    // If no platforms are selected or selectedPlatforms is undefined, show all results
    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      setFilteredResults(results);
      return;
    }

    // Convert selectedPlatforms to lowercase for case-insensitive comparison
    const normalizedSelectedPlatforms = selectedPlatforms.map((p) =>
      typeof p === "string" ? p.toLowerCase().trim() : p
    );

    // Filter results based on selected platforms
    const filtered = results.filter((result) => {
      if (!result.plataforma) return false;

      const resultPlatform = result.plataforma.toLowerCase().trim();
      return normalizedSelectedPlatforms.includes(resultPlatform);
    });

    console.log("Filtering results:", {
      total: results.length,
      filtered: filtered.length,
      selectedPlatforms: normalizedSelectedPlatforms,
      firstFewResults: results.slice(0, 3).map((r) => ({
        platform: r.plataforma,
        included: normalizedSelectedPlatforms.includes(
          r.plataforma.toLowerCase().trim()
        ),
      })),
    });

    setFilteredResults(filtered);
  }, [results, selectedPlatforms]);

  // Debug panel - remove in production
  const DebugPanel = () => (
    <div className="bg-gray-100 p-3 mb-4 text-xs border rounded">
      <h3 className="font-bold mb-1">Debug Info:</h3>
      <p>
        Selected Platforms: {debugInfo.selectedPlatforms.join(", ") || "None"}
      </p>
      <p>
        Available Platforms: {debugInfo.availablePlatforms.join(", ") || "None"}
      </p>
      <p>Filtering Active: {debugInfo.filteringActive ? "Yes" : "No"}</p>
      <p>Total Results: {results?.length || 0}</p>
      <p>Filtered Results: {filteredResults.length}</p>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto">
      {/* Temporary debug panel - remove in production */}
      {/*  <DebugPanel /> */}

      <table className="min-w-full bg-white border border-gray-200">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th className="px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plataforma
            </th>
            <th className="px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perfil
            </th>
            <th className="px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conteúdo
            </th>
            <th className="px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Link
            </th>
            <th className="px-2 sm:px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sentimento
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredResults.map((result, index) => {
            // Gerar um valor de sentimento simulado para cada resultado
            const sentimentValue = parseFloat(
              (Math.random() * 2 - 1).toFixed(2)
            );
            let sentimentClass = "bg-gray-100 text-gray-800"; // Neutro
            let sentimentText = "Neutro";

            if (sentimentValue > 0.3) {
              sentimentClass = "bg-green-100 text-green-800";
              sentimentText =
                sentimentValue > 0.7 ? "Muito Positivo" : "Positivo";
            } else if (sentimentValue < -0.3) {
              sentimentClass = "bg-red-100 text-red-800";
              sentimentText =
                sentimentValue < -0.7 ? "Muito Negativo" : "Negativo";
            }

            return (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {result.plataforma}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">
                  {result.perfil}
                </td>
                <td className="px-2 sm:px-4 py-2">
                  <div className="max-h-16 sm:max-h-24 overflow-y-auto text-xs sm:text-sm text-gray-700">
                    {result.texto}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                  <div className="truncate max-w-[150px]">
                    {result.link ? (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {result.link}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-1 sm:px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sentimentClass}`}
                  >
                    <span className="hidden sm:inline">
                      {result.sentimento}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredResults.length === 0 && (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4"
          role="alert"
        >
          <p>Nenhum resultado encontrado para as plataformas selecionadas.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
