import React, { useState, useEffect } from "react";
import { useDeepScanStore } from "../../store/useDeepscanStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Import components
import DeepScanForm from "../../components/deepscan/DeepScanForm";
import ResultsPanel from "../../components/deepscan/ResultsPanel";

// Import utility functions
import {
  generateWordcloudData,
  generateSentimentData,
  generateScatterData,
  prepareDownloadContent,
} from "../../utils/DataUtils.js";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ScrapeDeepScan = () => {
  const {
    scrape,
    getScrapedData,
    isLoading,
    error,
    scrapingResults,
    scrapedData,
  } = useDeepScanStore();

  const [profiles, setProfiles] = useState("");
  const [searchPhrases, setSearchPhrases] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [format, setFormat] = useState("CSV");
  const [sentimentData, setSentimentData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [wordcloudData, setWordcloudData] = useState([]);
  const [searchMode, setSearchMode] = useState("query"); // "scrape" ou "query"

  // Gerar dados de sentimento simulados quando os resultados mudam
  useEffect(() => {
    if (
      scrapingResults &&
      scrapingResults.results &&
      scrapingResults.results.length > 0
    ) {
      setSentimentData(generateSentimentData());
      setScatterData(generateScatterData(scrapingResults));
      setWordcloudData(generateWordcloudData(scrapingResults, searchPhrases));
    }
  }, [scrapingResults, searchPhrases]);

  // Efeito similar para scrapedData
  useEffect(() => {
    if (scrapedData && scrapedData.length > 0) {
      setSentimentData(generateSentimentData());
      setScatterData(generateScatterData({ results: scrapedData }));
      setWordcloudData(
        generateWordcloudData({ results: scrapedData }, searchPhrases)
      );
    }
  }, [scrapedData, searchPhrases]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchMode === "scrape") {
      // Parse profiles and search phrases from text inputs
      const profilesList = profiles
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p);
      const searchPhrasesList = searchPhrases
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p);

      await scrape({
        profiles: profilesList,
        searchPhrases: searchPhrasesList,
        format,
        platforms: selectedPlatforms,
      });
    } else if (searchMode === "query") {
      // Modificado para suportar múltiplas plataformas e palavras-chave
      const keywordsList = searchPhrases
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p);

      if (selectedPlatforms.length > 0 && keywordsList.length > 0) {
        await getScrapedData(selectedPlatforms, keywordsList);
      }
    }
  };

  const downloadResults = () => {
    if (!scrapingResults && !scrapedData) return;

    const dataToDownload = scrapedData || scrapingResults;

    const { content, filename } = prepareDownloadContent(
      dataToDownload,
      format
    );

    const blob = new Blob([content], {
      type: format === "CSV" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto px-4 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Deep Scan</h1>

      <div className="mb-4">
        <div className="flex space-x-4">
          {/* <button
            className={`px-4 py-2 rounded-md ${
              searchMode === "scrape"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSearchMode("scrape")}
          >
            Novo Scraping
          </button> */}
          {/* <button
            className={`px-4 py-2 rounded-md ${
              searchMode === "query"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSearchMode("query")}
          >
            Verificar
          </button> */}
        </div>
      </div>

      <DeepScanForm
        profiles={profiles}
        setProfiles={setProfiles}
        searchPhrases={searchPhrases}
        setSearchPhrases={setSearchPhrases}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        format={format}
        setFormat={setFormat}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        searchMode={searchMode}
      />

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
          role="alert"
        >
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {(scrapingResults || scrapedData) && (
        <ResultsPanel
          scrapingResults={scrapingResults}
          scrapedData={scrapedData}
          sentimentData={sentimentData}
          scatterData={scatterData}
          wordcloudData={wordcloudData}
          format={format}
          downloadResults={downloadResults}
          searchMode={searchMode}
        />
      )}
    </div>
  );
};

export default ScrapeDeepScan;
