import React, { useState, useEffect } from "react";
import { Scatter, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
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
  TimeScale
);

const ArbitrageBettingSection = ({ timeRange, selectedSports, isLoading }) => {
  const [scatterData, setScatterData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [arbitrageAlerts, setArbitrageAlerts] = useState([]);

  useEffect(() => {
    // Generate mock data for scatter plot
    const generateScatterData = () => {
      const operators = [
        "Bet365",
        "Sportingbet",
        "Betano",
        "Betfair",
        "Pinnacle",
        "Rivalo",
        "KTO",
        "Betway",
      ];
      const datasets = [];

      // Generate data points for each operator
      operators.forEach((operator, index) => {
        const color = `hsl(${index * 45}, 70%, 60%)`;
        const data = [];

        // Generate 15-25 data points for each operator
        const pointCount = Math.floor(Math.random() * 10) + 15;

        for (let i = 0; i < pointCount; i++) {
          // Generate x (odds) between 1.1 and 10
          const x = Math.random() * 8.9 + 1.1;

          // Generate y (volume) between 100 and 5000
          const y = Math.random() * 4900 + 100;

          // Add some clusters to simulate arbitrage patterns
          const isArbitrageCluster = Math.random() > 0.7;

          if (isArbitrageCluster && i > 0) {
            // Create a cluster point near a previous point but with slightly different odds
            const prevPoint = data[Math.floor(Math.random() * data.length)];
            data.push({
              x: prevPoint.x * (Math.random() * 0.1 + 0.95),
              y: prevPoint.y * (Math.random() * 0.3 + 0.85),
            });
          } else {
            data.push({ x, y });
          }
        }

        datasets.push({
          label: operator,
          data: data,
          backgroundColor: color,
          pointRadius: 6,
          pointHoverRadius: 8,
        });
      });

      return { datasets };
    };

    // Generate mock timeline data
    const generateTimelineData = () => {
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

      // Generate baseline activity
      const baselineActivity = hours.map(
        () => Math.floor(Math.random() * 50) + 20
      );

      // Generate suspicious activity with spikes
      const suspiciousActivity = hours.map((_, i) => {
        // Create spikes at certain hours
        if (i === 8 || i === 12 || i === 17 || i === 20) {
          return Math.floor(Math.random() * 150) + 100;
        }
        return Math.floor(Math.random() * 30) + 10;
      });

      // Generate arbitrage detection points
      const arbitrageDetections = hours.map((_, i) => {
        // Only show detections at certain hours
        if (i === 8 || i === 12 || i === 17 || i === 20) {
          return Math.floor(Math.random() * 40) + 30;
        }
        return 0;
      });

      return {
        labels: hours,
        datasets: [
          {
            label: "Atividade Normal",
            data: baselineActivity,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Atividade Suspeita",
            data: suspiciousActivity,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Detecções de Arbitragem",
            data: arbitrageDetections,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0,
            pointRadius: arbitrageDetections.map((val) => (val > 0 ? 6 : 0)),
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            fill: false,
          },
        ],
      };
    };

    // Generate mock arbitrage alerts
    const generateArbitrageAlerts = () => {
      return [
        {
          id: "ARB001",
          event: "Fluminense vs São Paulo",
          date: "2023-10-15 14:30",
          operators: ["Bet365", "Betano", "Betfair"],
          marketType: "Resultado Final",
          profitMargin: "4.2%",
          riskLevel: "Médio",
          status: "Ativo",
        },
        {
          id: "ARB002",
          event: "PSG vs Manchester City",
          date: "2023-10-14 16:00",
          operators: ["Sportingbet", "Pinnacle", "KTO"],
          marketType: "Ambos Marcam",
          profitMargin: "5.8%",
          riskLevel: "Alto",
          status: "Bloqueado",
        },
        {
          id: "ARB003",
          event: "Novak Djokovic vs Carlos Alcaraz",
          date: "2023-10-12 11:00",
          operators: ["Betway", "Bet365", "Rivalo"],
          marketType: "Handicap de Sets",
          profitMargin: "3.1%",
          riskLevel: "Baixo",
          status: "Ativo",
        },
        {
          id: "ARB004",
          event: "Lakers vs Warriors",
          date: "2023-10-10 22:30",
          operators: ["Betano", "Betfair", "Pinnacle"],
          marketType: "Total de Pontos",
          profitMargin: "6.5%",
          riskLevel: "Alto",
          status: "Em Análise",
        },
      ];
    };

    // Simulate API calls
    setTimeout(() => {
      setScatterData(generateScatterData());
      setTimelineData(generateTimelineData());
      setArbitrageAlerts(generateArbitrageAlerts());
    }, 1000);
  }, [timeRange, selectedSports]);

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Dispersão de Odds vs. Operadores",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label;
            const x = context.parsed.x.toFixed(2);
            const y = context.parsed.y.toFixed(0);
            return `${datasetLabel}: Odds ${x}, Volume ${y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Odds",
        },
        min: 1,
        max: 10,
      },
      y: {
        title: {
          display: true,
          text: "Volume de Apostas",
        },
        beginAtZero: true,
      },
    },
  };

  const timelineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Análise Temporal de Apostas Cruzadas",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const label = context.dataset.label;
            if (label === "Detecções de Arbitragem" && value > 0) {
              return `${label}: ${value} (ALERTA DE ARBITRAGEM)`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Volume de Atividade",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hora do Dia",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Arbitrage Betting (Exploits Arbitrados)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Dispersão de Odds vs. Operadores
          </h3>
          {isLoading || !scatterData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Scatter data={scatterData} options={scatterOptions} />
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Análise Temporal de Apostas Cruzadas
          </h3>
          {isLoading || !timelineData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Line data={timelineData} options={timelineOptions} />
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-3">
        Alertas de Arbitragem Detectados
      </h3>
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
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operadores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Mercado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margem de Lucro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nível de Risco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
                    Carregando alertas...
                  </div>
                </td>
              </tr>
            ) : (
              arbitrageAlerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {alert.operators.map((operator, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {operator}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.marketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                    {alert.profitMargin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.riskLevel === "Alto"
                          ? "bg-red-100 text-red-800"
                          : alert.riskLevel === "Médio"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : alert.status === "Bloqueado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Detalhes
                    </button>
                    {alert.status !== "Bloqueado" && (
                      <button className="text-red-600 hover:text-red-900">
                        Bloquear
                      </button>
                    )}
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

export default ArbitrageBettingSection;
