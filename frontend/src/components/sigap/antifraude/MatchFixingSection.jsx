import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

// Register ChartJS components
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

const MatchFixingSection = ({ timeRange, selectedSports, isLoading }) => {
  const [outlierData, setOutlierData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [suspiciousEvents, setSuspiciousEvents] = useState([]);

  useEffect(() => {
    // Simulate data fetching based on filters
    const generateOutlierData = () => {
      const labels = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      // Generate average betting volume data
      const averageData = labels.map(
        () => Math.floor(Math.random() * 500) + 200
      );

      // Generate outlier data with some significant spikes
      const outlierData = averageData.map((avg) => {
        const shouldBeOutlier = Math.random() > 0.7;
        return shouldBeOutlier
          ? avg * (Math.random() * 3 + 2)
          : avg * (Math.random() * 0.4 + 0.8);
      });

      return {
        labels,
        datasets: [
          {
            label: "Volume Médio de Apostas",
            data: averageData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
          {
            label: "Apostas Detectadas",
            data: outlierData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            pointRadius: outlierData.map((val) => (val > 1000 ? 8 : 4)),
            pointBackgroundColor: outlierData.map((val) =>
              val > 1000 ? "red" : "rgba(255, 99, 132, 1)"
            ),
            tension: 0.4,
          },
        ],
      };
    };

    // Generate mock suspicious events
    const generateSuspiciousEvents = () => {
      return [
        {
          id: "MF001",
          event: "Flamengo vs Corinthians",
          date: "2023-10-15",
          anomalyType: "Volume súbito em resultado específico",
          riskLevel: "Alto",
          odds: "12.5",
          normalOdds: "3.2",
          volumeIncrease: "485%",
        },
        {
          id: "MF002",
          event: "Santos vs Palmeiras",
          date: "2023-10-12",
          anomalyType: "Apostas em cartões amarelos",
          riskLevel: "Médio",
          odds: "2.1",
          normalOdds: "1.8",
          volumeIncrease: "210%",
        },
        {
          id: "MF003",
          event: "Novak Djokovic vs Rafael Nadal",
          date: "2023-10-08",
          anomalyType: "Apostas em games específicos",
          riskLevel: "Alto",
          odds: "8.7",
          normalOdds: "2.5",
          volumeIncrease: "320%",
        },
        {
          id: "MF004",
          event: "Lakers vs Bulls",
          date: "2023-10-05",
          anomalyType: "Apostas em pontos de jogador específico",
          riskLevel: "Baixo",
          odds: "4.2",
          normalOdds: "3.5",
          volumeIncrease: "145%",
        },
      ];
    };

    // Simulate API call
    setTimeout(() => {
      setOutlierData(generateOutlierData());
      setSuspiciousEvents(generateSuspiciousEvents());

      // For heatmap, we'd need a proper heatmap library
      // This is just a placeholder for the concept
      setHeatmapData({
        labels: [
          "1.5",
          "2.0",
          "2.5",
          "3.0",
          "3.5",
          "4.0",
          "5.0",
          "7.0",
          "10.0",
          "15.0",
        ],
        datasets: [
          {
            label: "Volume de Apostas vs Odds",
            data: [150, 220, 310, 290, 250, 400, 180, 120, 90, 60],
            backgroundColor: "rgba(255, 99, 132, 0.8)",
          },
        ],
      });
    }, 1000);
  }, [timeRange, selectedSports]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Detecção de Outliers em Apostas",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            if (value > 1000) {
              return `${context.dataset.label}: ${value} (ANOMALIA DETECTADA)`;
            }
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Volume de Apostas",
        },
      },
      x: {
        title: {
          display: true,
          text: "Mês",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Manipulação de Resultados (Match Fixing)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Gráfico de Outliers em Apostas
          </h3>
          {isLoading || !outlierData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Line data={outlierData} options={lineOptions} />
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Heatmap de Odds vs. Volume de Apostas
          </h3>
          {isLoading || !heatmapData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">
                Visualização de Heatmap (Requer biblioteca específica como
                HeatMap.js ou D3.js)
              </p>
              {/* Placeholder for actual heatmap implementation */}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-3">Eventos Suspeitos Detectados</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Anomalia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odds Anômala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odds Normal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aumento Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center">
                  <div className="animate-pulse text-gray-500">
                    Carregando eventos...
                  </div>
                </td>
              </tr>
            ) : (
              suspiciousEvents.map((event, index) => (
                <tr
                  key={event.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.anomalyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.riskLevel === "Alto"
                          ? "bg-red-100 text-red-800"
                          : event.riskLevel === "Médio"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.odds}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.normalOdds}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                    {event.volumeIncrease}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Investigar
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Bloquear
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchFixingSection;
