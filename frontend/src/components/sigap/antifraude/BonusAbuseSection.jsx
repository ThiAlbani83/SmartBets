import React, { useState, useEffect } from "react";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BonusAbuseSection = ({ timeRange, selectedSports, isLoading }) => {
  const [histogramData, setHistogramData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [bonusAbuseAlerts, setBonusAbuseAlerts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    // Gerar dados simulados para o histograma de ativação de bônus vs. tempo de aposta
    const generateHistogramData = () => {
      const labels = [
        "0-1h",
        "1-3h",
        "3-6h",
        "6-12h",
        "12-24h",
        "1-2d",
        "2-3d",
        "3-7d",
        ">7d",
      ];

      // Gerar dados para usuários normais (padrão de distribuição mais uniforme)
      const normalUsers = labels.map((_, index) => {
        if (index < 2) return Math.floor(Math.random() * 20) + 5;
        if (index < 4) return Math.floor(Math.random() * 30) + 20;
        if (index < 6) return Math.floor(Math.random() * 40) + 30;
        return Math.floor(Math.random() * 30) + 10;
      });

      // Gerar dados para usuários suspeitos (concentrados nas primeiras horas)
      const suspiciousUsers = labels.map((_, index) => {
        if (index < 2) return Math.floor(Math.random() * 60) + 40;
        if (index < 4) return Math.floor(Math.random() * 30) + 10;
        return Math.floor(Math.random() * 10) + 1;
      });

      return {
        labels,
        datasets: [
          {
            label: "Usuários Normais",
            data: normalUsers,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
          {
            label: "Usuários Suspeitos",
            data: suspiciousUsers,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
        ],
      };
    };

    // Gerar dados simulados para o mapa de calor por região
    const generateHeatmapData = () => {
      // Usando scatter plot para simular um mapa de calor
      const regions = [
        "São Paulo",
        "Rio de Janeiro",
        "Minas Gerais",
        "Bahia",
        "Rio Grande do Sul",
        "Paraná",
        "Pernambuco",
        "Ceará",
        "Distrito Federal",
        "Goiás",
        "Pará",
        "Amazonas",
      ];

      const datasets = [];

      // Gerar pontos para cada região (x: taxa de ativação, y: taxa de saque)
      regions.forEach((region, index) => {
        // Definir algumas regiões como outliers (potencialmente abusivas)
        const isOutlier = index === 1 || index === 4 || index === 7;

        // Gerar entre 3-8 pontos por região
        const pointCount = Math.floor(Math.random() * 5) + 3;
        const data = [];

        for (let i = 0; i < pointCount; i++) {
          // Para outliers, concentrar pontos em alta ativação e alto saque
          if (isOutlier) {
            data.push({
              x: Math.random() * 30 + 70, // 70-100% taxa de ativação
              y: Math.random() * 30 + 70, // 70-100% taxa de saque
              r: Math.random() * 10 + 10, // tamanho do ponto (volume)
            });
          } else {
            // Para regiões normais, distribuir mais uniformemente
            data.push({
              x: Math.random() * 70 + 10, // 10-80% taxa de ativação
              y: Math.random() * 60 + 10, // 10-70% taxa de saque
              r: Math.random() * 8 + 5, // tamanho do ponto (volume)
            });
          }
        }

        datasets.push({
          label: region,
          data: data,
          backgroundColor: isOutlier
            ? "rgba(255, 99, 132, 0.7)"
            : "rgba(75, 192, 192, 0.7)",
          borderColor: isOutlier
            ? "rgba(255, 99, 132, 1)"
            : "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          pointRadius: 0, // Será substituído pelo valor r de cada ponto
          pointHoverRadius: 0, // Será substituído pelo valor r de cada ponto
        });
      });

      return { datasets };
    };

    // Gerar alertas simulados de abuso de bônus
    const generateBonusAbuseAlerts = () => {
      return [
        {
          id: "BA001",
          usuario: "fastclaimer22",
          bonus: "Boas-vindas 100%",
          valorBonus: "R$ 200,00",
          tempoAteAposta: "0h 12m",
          tempoAteSaque: "1h 05m",
          padraoBusca: "Apostas mínimas em odds altas",
          regiao: "Rio de Janeiro",
          riskScore: 92,
          status: "Bloqueado",
        },
        {
          id: "BA002",
          usuario: "sportsbetter99",
          bonus: "Recarga 50%",
          valorBonus: "R$ 150,00",
          tempoAteAposta: "0h 22m",
          tempoAteSaque: "1h 47m",
          padraoBusca: "Apostas em ambos os lados",
          regiao: "São Paulo",
          riskScore: 78,
          status: "Em Análise",
        },
        {
          id: "BA003",
          usuario: "bonushunter2023",
          bonus: "Boas-vindas 200%",
          valorBonus: "R$ 400,00",
          tempoAteAposta: "0h 08m",
          tempoAteSaque: "0h 55m",
          padraoBusca: "Apostas em mercados opostos",
          regiao: "Rio Grande do Sul",
          riskScore: 95,
          status: "Bloqueado",
        },
        {
          id: "BA004",
          usuario: "luckyplayer7",
          bonus: "Aposta Grátis",
          valorBonus: "R$ 50,00",
          tempoAteAposta: "1h 30m",
          tempoAteSaque: "3h 22m",
          padraoBusca: "Apostas em favoritos pesados",
          regiao: "Minas Gerais",
          riskScore: 65,
          status: "Não Resolvido",
        },
        {
          id: "BA005",
          usuario: "betmaster55",
          bonus: "Recarga 100%",
          valorBonus: "R$ 300,00",
          tempoAteAposta: "0h 17m",
          tempoAteSaque: "1h 12m",
          padraoBusca: "Apostas em mercados de handicap",
          regiao: "Ceará",
          riskScore: 88,
          status: "Em Análise",
        },
      ];
    };

    // Simular chamadas de API
    setTimeout(() => {
      setHistogramData(generateHistogramData());
      setHeatmapData(generateHeatmapData());
      setBonusAbuseAlerts(generateBonusAbuseAlerts());
    }, 1000);
  }, [timeRange, selectedSports]);

  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tempo entre Ativação de Bônus e Primeira Aposta",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value} usuários`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tempo após ativação do bônus",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Número de usuários",
        },
      },
    },
  };

  const heatmapOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Correlação entre Ativação de Bônus e Saque por Região",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label;
            const x = context.parsed.x.toFixed(1);
            const y = context.parsed.y.toFixed(1);
            const r = context.raw.r.toFixed(1);
            return [
              `Região: ${datasetLabel}`,
              `Taxa de Ativação: ${x}%`,
              `Taxa de Saque: ${y}%`,
              `Volume: ${r} (relativo)`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Taxa de Ativação de Bônus (%)",
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Taxa de Saque Rápido (%)",
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].datasetIndex;
        const region = heatmapData.datasets[index].label;
        setSelectedRegion(region);
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Bônus Abuse (Bonus Hunting)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Histograma: Ativação de Bônus vs. Tempo de Aposta
          </h3>
          {isLoading || !histogramData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Bar data={histogramData} options={histogramOptions} />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Usuários que apostam imediatamente após receber bônus podem estar
            engajados em bonus hunting.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Mapa de Calor: Ativação e Saque por Região
          </h3>
          {isLoading || !heatmapData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Scatter
                data={
                  selectedRegion
                    ? {
                        datasets: heatmapData.datasets.filter(
                          (dataset) => dataset.label === selectedRegion
                        ),
                      }
                    : heatmapData
                }
                options={heatmapOptions}
              />
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {selectedRegion
                ? `Mostrando dados para: ${selectedRegion}`
                : "Pontos no quadrante superior direito indicam possível abuso de bônus."}
            </p>
            {selectedRegion && (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => setSelectedRegion(null)}
              >
                Mostrar todas as regiões
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <h3 className="text-md font-medium text-yellow-800 mb-2">
          Padrões de Bonus Hunting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-yellow-500 pl-3">
            <h4 className="font-medium text-yellow-800">Apostas Rápidas</h4>
            <p className="text-sm text-yellow-700">
              Usuários que apostam imediatamente após receber o bônus,
              geralmente em menos de 1 hora.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-3">
            <h4 className="font-medium text-yellow-800">Apostas Opostas</h4>
            <p className="text-sm text-yellow-700">
              Apostas em resultados opostos do mesmo evento para garantir
              retorno mínimo.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-3">
            <h4 className="font-medium text-yellow-800">Saque Rápido</h4>
            <p className="text-sm text-yellow-700">
              Tentativas de saque logo após cumprir requisitos mínimos de
              apostas para liberar o bônus.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-3">
        Alertas de Abuso de Bônus Detectados
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bônus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo até Aposta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo até Saque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Padrão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Região
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risco
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
                <td colSpan="11" className="px-6 py-4 text-center">
                  <div className="animate-pulse text-gray-500">
                    Carregando alertas...
                  </div>
                </td>
              </tr>
            ) : (
              bonusAbuseAlerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.usuario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.bonus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.valorBonus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.tempoAteAposta.startsWith("0h")
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.tempoAteAposta}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.tempoAteSaque.startsWith("0h") ||
                        (alert.tempoAteSaque.startsWith("1h") &&
                          parseInt(alert.tempoAteSaque.split("h")[1]) < 30)
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.tempoAteSaque}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.padraoBusca}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={() => setSelectedRegion(alert.regiao)}
                    >
                      {alert.regiao}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.riskScore >= 80
                            ? "bg-red-100 text-red-800"
                            : alert.riskScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.riskScore}
                      </span>
                      <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            alert.riskScore >= 80
                              ? "bg-red-500"
                              : alert.riskScore >= 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${alert.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === "Bloqueado"
                          ? "bg-red-100 text-red-800"
                          : alert.status === "Em Análise"
                          ? "bg-yellow-100 text-yellow-800"
                          : alert.status === "Resolvido"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Medidas Preventivas
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              Implementar períodos de carência entre ativação de bônus e saque
            </li>
            <li>Limitar bônus por endereço IP/dispositivo/residência</li>
            <li>
              Exigir verificação de identidade antes da liberação de bônus
            </li>
            <li>
              Definir requisitos de apostas que dificultem apostas em mercados
              opostos
            </li>
            <li>Monitorar padrões de apostas após ativação de bônus</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Estatísticas de Impacto
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Bônus abusados (estimativa)
              </p>
              <p className="text-2xl font-bold text-red-600">R$ 28.450,00</p>
              <p className="text-xs text-gray-500">Últimos 30 dias</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contas bloqueadas</p>
              <p className="text-2xl font-bold text-blue-600">37</p>
              <p className="text-xs text-gray-500">Últimos 30 dias</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taxa de detecção</p>
              <p className="text-2xl font-bold text-green-600">82%</p>
              <p className="text-xs text-gray-500">Precisão estimada</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Economia projetada</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ 125.800,00
              </p>
              <p className="text-xs text-gray-500">Anual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusAbuseSection;
