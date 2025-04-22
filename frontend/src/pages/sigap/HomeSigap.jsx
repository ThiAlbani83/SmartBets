import { useState, useEffect } from "react";
import { FaChartBar, FaChartLine, FaChartPie, FaSync } from "react-icons/fa";
import BarGraphs from "../../components/sigap/BarGraphs";
import LineGraphWinLoose from "../../components/sigap/LineGraphWinLoose";
import BarGraphsBetTypes from "../../components/sigap/BarGraphsBetTypes";
import BarGraphsGenero from "../../components/sigap/BarGraphsGenero";
import BarGraphsStatusBet from "../../components/sigap/BarGraphsStatusBet";
import BarGraphsTopSports from "../../components/sigap/BarGraphsTopSports";
import LineGraphsDailyBets from "../../components/sigap/LineGraphsDailyBets";

const HomeSigap = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Simulated loading effect
    setIsLoading(true);
    const loadData = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(loadData);
  }, [timeRange]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="p-6 max-w-8xl w-full">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Visão Geral - SIGAP
        </h1>

        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <FaSync className={`${isLoading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Distribuição por Faixa Etária
              </h2>
              <FaChartBar className="text-blue-600" />
            </div>
            <div className="p-4 h-80">
              <BarGraphs timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Ganho Médio por Tipo de Aposta
              </h2>
              <FaChartLine className="text-green-600" />
            </div>
            <div className="p-4 h-80">
              <LineGraphWinLoose timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Tipos de Apostas</h2>
              <FaChartBar className="text-indigo-600" />
            </div>
            <div className="p-4 h-80">
              <BarGraphsBetTypes timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Distribuição por Gênero
              </h2>
              <FaChartPie className="text-purple-600" />
            </div>
            <div className="p-4 h-80">
              <BarGraphsGenero timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Status das Apostas</h2>
              <FaChartBar className="text-yellow-600" />
            </div>
            <div className="p-4 h-80">
              <BarGraphsStatusBet timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Top 5 Modalidades Esportivas
              </h2>
              <FaChartBar className="text-red-600" />
            </div>
            <div className="p-4 h-80">
              <BarGraphsTopSports timeRange={timeRange} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Valores Totais em Apostas por Dia
              </h2>
              <FaChartLine className="text-blue-600" />
            </div>
            <div className="p-4 h-80">
              <LineGraphsDailyBets timeRange={timeRange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSigap;
