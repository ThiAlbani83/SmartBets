import React, { useState, useEffect, useRef } from "react";
import { betCrawlerData } from "../../utils/betCrawlerData";
import ScanStatusPanel from "../../components/deepscan/betCrawler/ScanStatusPanel";
import LiveScanIndicator from "../../components/deepscan/betCrawler/LiveScanIndicator";
import BetSitesTable from "../../components/deepscan/betCrawler/BetSitesTable";
import ErrorAlert from "../../components/deepscan/betCrawler/ErrorAlert";

const BetCrawlerDeepScan = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [scanStats, setScanStats] = useState({
    sitesAnalyzed: 0,
    profilesScanned: 0,
    postsAnalyzed: 0,
    lastDetection: null,
  });

  // Referência para controlar o intervalo de atualização
  const scanIntervalRef = useRef(null);
  const statsIntervalRef = useRef(null);

  // Função para simular a detecção contínua de sites de apostas
  const simulateContinuousScan = () => {
    // Inicialmente, mostrar alguns resultados
    if (results.length === 0) {
      const initialResults = betCrawlerData.slice(0, 10);
      setResults(initialResults);

      // Atualizar estatísticas iniciais
      setScanStats({
        sitesAnalyzed: 1250,
        profilesScanned: 3780,
        postsAnalyzed: 15420,
        lastDetection: new Date().toLocaleTimeString(),
      });
    }

    // Configurar intervalo para adicionar novos resultados periodicamente
    scanIntervalRef.current = setInterval(() => {
      // Adicionar um novo resultado aleatório a cada intervalo
      const remainingItems = betCrawlerData.filter(
        (item) => !results.some((r) => r.id === item.id)
      );

      if (remainingItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingItems.length);
        const newItem = remainingItems[randomIndex];

        setResults((prevResults) => [...prevResults, newItem]);

        // Atualizar estatística de última detecção
        setScanStats((prev) => ({
          ...prev,
          lastDetection: new Date().toLocaleTimeString(),
        }));
      }
    }, 8000); // Adicionar um novo a cada 8 segundos

    // Configurar intervalo para atualizar estatísticas continuamente
    statsIntervalRef.current = setInterval(() => {
      setScanStats((prev) => ({
        sitesAnalyzed: prev.sitesAnalyzed + Math.floor(Math.random() * 50) + 10,
        profilesScanned:
          prev.profilesScanned + Math.floor(Math.random() * 30) + 5,
        postsAnalyzed:
          prev.postsAnalyzed + Math.floor(Math.random() * 100) + 20,
        lastDetection: prev.lastDetection,
      }));
    }, 3000); // Atualizar estatísticas a cada 3 segundos
  };

  // Iniciar a varredura contínua quando o componente montar
  useEffect(() => {
    simulateContinuousScan();

    // Limpar intervalos quando o componente desmontar
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    };
  }, []);

  return (
    <div className="p-6 max-w-8xl w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        BetCrawler - Detecção de Casas de Apostas Não Regulamentadas
      </h1>

      {/* Painel de status da varredura em tempo real */}
      <ScanStatusPanel scanStats={scanStats} />

      {/* Componente de erro */}
      <ErrorAlert message={error} />

      {/* Indicador de varredura em tempo real */}
      <LiveScanIndicator resultsCount={results.length} />

      {/* Tabela de resultados */}
      {results.length > 0 && <BetSitesTable results={results} />}
    </div>
  );
};

export default BetCrawlerDeepScan;
