import React from "react";
import SentimentLineChart from "./SentimentLineChart";
import SentimentScatterChart from "./SentimentScatterChart";
import WordCloudChart from "./WordCloudChart";
import SentimentStats from "./SentimentStats";
import ResultsTable from "./ResultsTable";

const ResultsPanel = ({
  scrapingResults,
  sentimentData,
  scatterData,
  wordcloudData,
  format,
  downloadResults,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden mb-8">
      <div className="bg-gray-100 px-6 py-4 rounded-t-lg border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resultados</h2>
        <button
          onClick={downloadResults}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Baixar {format}
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <strong className="font-semibold">Total de posts encontrados:</strong>{" "}
          {scrapingResults.results?.length || 0}
        </div>

        {/* Gráficos de Análise de Sentimentos */}
        {sentimentData && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gráfico de linha */}
            <SentimentLineChart sentimentData={sentimentData} />

            {/* Gráfico de dispersão */}
            {scatterData && <SentimentScatterChart scatterData={scatterData} />}

            {/* Nuvem de Palavras */}
            {wordcloudData.length > 0 && (
              <WordCloudChart wordcloudData={wordcloudData} />
            )}
          </div>
        )}

        {/* Estatísticas de Sentimento */}
        {sentimentData && <SentimentStats sentimentData={sentimentData} />}

        {scrapingResults.results && scrapingResults.results.length > 0 ? (
          <ResultsTable results={scrapingResults.results} />
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
  );
};

export default ResultsPanel;
