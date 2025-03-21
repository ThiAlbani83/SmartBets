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
  const { scrape, isLoading, error, scrapingResults } = useDeepScanStore();

  const [profiles, setProfiles] = useState("");
  const [searchPhrases, setSearchPhrases] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [format, setFormat] = useState("CSV");
  const [sentimentData, setSentimentData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [wordcloudData, setWordcloudData] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  };

  const downloadResults = () => {
    if (!scrapingResults) return;

    const { content, filename } = prepareDownloadContent(
      scrapingResults,
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

      {scrapingResults && (
        <ResultsPanel
          scrapingResults={scrapingResults}
          sentimentData={sentimentData}
          scatterData={scatterData}
          wordcloudData={wordcloudData}
          format={format}
          downloadResults={downloadResults}
        />
      )}
    </div>
  );
};

export default ScrapeDeepScan;
