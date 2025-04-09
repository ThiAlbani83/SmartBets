import React, { useEffect, useState } from "react";
import SentimentLineChart from "./SentimentLineChart";
import SentimentScatterChart from "./SentimentScatterChart";
import WordCloudChart from "./WordCloudChart";
import SentimentStats from "./SentimentStats";
import ResultsTable from "./ResultsTable";
import { useDeepScanStore } from "../../store/useDeepscanStore";

const ResultsPanel = ({
  scrapingResults,
  scrapedData,
  sentimentData,
  scatterData,
  wordcloudData,
  format,
  downloadResults,
  isCheckingProgress,
  searchMode,
  searchTerms, // Parâmetro para receber as palavras-chave digitadas
}) => {
  const progressData = useDeepScanStore((state) => state.progressData);
  const selectedPlatforms = useDeepScanStore(
    (state) => state.selectedPlatforms
  );
  const [filteredCount, setFilteredCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [enhancedWordcloudData, setEnhancedWordcloudData] = useState([]);

  // Determinar qual conjunto de dados usar
  const resultsData =
    searchMode === "query" ? scrapedData : scrapingResults?.results;

  // Processar palavras-chave para o wordcloud
  // Dentro do useEffect que processa as palavras-chave
  useEffect(() => {
    if (searchTerms && searchTerms.length > 0) {
      // O problema está aqui - vamos corrigir a forma como dividimos as palavras
      const userKeywords = searchTerms
        .split(",")
        .map((term) => term.trim())
        .filter((term) => term.length > 0)
        .map((term) => ({
          text: term,
          value: Math.floor(Math.random() * 50) + 100, // Valor alto para destacar
          userInput: true, // Marcar como entrada do usuário
          sentiment: 0, // Adicionar um valor de sentimento neutro para evitar erros
        }));

      console.log("Palavras-chave processadas:", userKeywords); // Para debug

      // Combinar com dados existentes, garantindo que não haja duplicatas
      const combinedData = [
        ...userKeywords,
        ...wordcloudData.filter(
          (item) =>
            !userKeywords.some(
              (kw) => kw.text.toLowerCase() === item.text.toLowerCase()
            )
        ),
      ];

      setEnhancedWordcloudData(combinedData);
    } else {
      setEnhancedWordcloudData(wordcloudData);
    }
  }, [wordcloudData, searchTerms]);

  // Calculate filtered and total counts when results or selected platforms change
  useEffect(() => {
    if (!resultsData) {
      setFilteredCount(0);
      setTotalCount(0);
      return;
    }

    setTotalCount(resultsData.length);

    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      setFilteredCount(resultsData.length);
      return;
    }

    // Calculate filtered count
    const normalizedSelectedPlatforms = selectedPlatforms.map((p) =>
      typeof p === "string" ? p.toLowerCase().trim() : p
    );

    const filtered = resultsData.filter((result) => {
      if (!result.plataforma) return false;

      const resultPlatform = result.plataforma.toLowerCase().trim();
      return normalizedSelectedPlatforms.includes(resultPlatform);
    });

    setFilteredCount(filtered.length);
  }, [resultsData, selectedPlatforms]);

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-full mb-8 overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 rounded-t-lg border-b flex flex-wrap justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">
          {searchMode === "query"
            ? "Resultados da Consulta"
            : "Resultados do Scraping"}
        </h2>
        <button
          onClick={downloadResults}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm mt-2 sm:mt-0"
        >
          Baixar {format}
        </button>
      </div>

      <div
        className="p-3 sm:p-4 overflow-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {/* Barra de Progresso - apenas para modo scrape */}
        {searchMode === "scrape" && isCheckingProgress && progressData && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Progresso do Scraping
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progressData.progress || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressData.progress || 0}%` }}
              ></div>
            </div>
            {progressData.status && (
              <div className="mt-1 text-xs text-gray-500">
                Status: {progressData.status}
                {progressData.message && ` - ${progressData.message}`}
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <strong className="font-semibold">Total de posts encontrados:</strong>{" "}
          {filteredCount}
          {selectedPlatforms &&
            selectedPlatforms.length > 0 &&
            filteredCount !== totalCount && (
              <span className="ml-2 text-sm text-gray-600">
                (de um total de {totalCount} em todas as plataformas, filtrando
                por: {selectedPlatforms.join(", ")})
              </span>
            )}
        </div>

        {/* Palavras-chave pesquisadas */}
        {searchTerms && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">
              Palavras-chave pesquisadas:
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchTerms.split(",").map((term, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {term.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gráficos de Análise de Sentimentos - Agora em uma única linha */}
        {sentimentData && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gráfico de linha */}
            <div className="overflow-hidden h-64">
              <SentimentLineChart sentimentData={sentimentData} />
            </div>

            {/* Gráfico de dispersão */}
            {scatterData && (
              <div className="overflow-hidden h-64">
                <SentimentScatterChart scatterData={scatterData} />
              </div>
            )}

            {/* Nuvem de Palavras */}
            {enhancedWordcloudData.length > 0 && (
              <div className="overflow-hidden h-64">
                <WordCloudChart wordcloudData={enhancedWordcloudData} />
              </div>
            )}
          </div>
        )}

        {/* Estatísticas de Sentimento */}
        {sentimentData && (
          <div className="mb-6 overflow-x-auto">
            <SentimentStats sentimentData={sentimentData} />
          </div>
        )}

        {/* Tabela de Resultados */}
        <div className="overflow-x-auto">
          {resultsData && resultsData.length > 0 ? (
            <ResultsTable
              results={resultsData}
              selectedPlatforms={selectedPlatforms}
              searchTerms={searchTerms} // Passar os termos de pesquisa para a tabela
            />
          ) : (
            <div
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
              role="alert"
            >
              <p>Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
