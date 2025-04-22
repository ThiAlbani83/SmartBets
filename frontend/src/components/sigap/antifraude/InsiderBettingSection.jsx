import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ptBR } from "date-fns/locale";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const InsiderBettingSection = ({ timeRange, selectedSports, isLoading }) => {
  const [earlyBetsData, setEarlyBetsData] = useState(null);
  const [volumeComparisonData, setVolumeComparisonData] = useState(null);
  const [insiderAlerts, setInsiderAlerts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Gerar dados simulados para apostas antecipadas com odds específicas
    const generateEarlyBetsData = () => {
      // Simular um período de 24 horas antes de um evento
      const hoursBeforeEvent = 24;
      const labels = Array.from({ length: hoursBeforeEvent }, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - (hoursBeforeEvent - i));
        return date.toISOString();
      });

      // Simular mudanças nas odds ao longo do tempo
      const oddsChanges = labels.map((_, i) => {
        // Odds começam em 2.5 e diminuem gradualmente para 1.8
        // Com uma queda significativa em torno de 8 horas antes do evento
        if (i < 10) return 2.5 - i * 0.01;
        if (i < 14) return 2.4 - (i - 10) * 0.05; // Queda significativa
        return 2.0 - (i - 14) * 0.01;
      });

      // Simular volume de apostas normais
      const normalBetsVolume = labels.map((_, i) => {
        // Volume aumenta gradualmente, com pico próximo ao evento
        if (i < 12) return Math.floor(Math.random() * 10) + i * 2;
        if (i < 18) return Math.floor(Math.random() * 15) + i * 3;
        return Math.floor(Math.random() * 20) + i * 5;
      });

      // Simular volume de apostas suspeitas (picos antes da mudança de odds)
      const suspiciousBetsVolume = labels.map((_, i) => {
        // Picos de apostas suspeitas antes da queda nas odds (entre 8-10h antes)
        if (i >= 8 && i <= 10) return Math.floor(Math.random() * 30) + 20;
        if (i >= 11 && i <= 12) return Math.floor(Math.random() * 15) + 10;
        return Math.floor(Math.random() * 5);
      });

      return {
        labels,
        datasets: [
          {
            label: "Odds",
            data: oddsChanges,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            yAxisID: "y",
            tension: 0.2,
            pointRadius: 3,
            pointHoverRadius: 7,
          },
          {
            label: "Volume de Apostas Normais",
            data: normalBetsVolume,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            yAxisID: "y1",
            type: "bar",
          },
          {
            label: "Volume de Apostas Suspeitas",
            data: suspiciousBetsVolume,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.5)",
            yAxisID: "y1",
            type: "bar",
          },
        ],
      };
    };

    // Gerar dados simulados para comparação entre volume geral e volume de usuários específicos
    const generateVolumeComparisonData = () => {
      // Simular dados para 10 eventos diferentes
      const events = [
        "Flamengo vs Palmeiras",
        "Corinthians vs São Paulo",
        "Grêmio vs Internacional",
        "Atlético-MG vs Cruzeiro",
        "Fluminense vs Botafogo",
        "Santos vs Bragantino",
        "Fortaleza vs Ceará",
        "Athletico-PR vs Coritiba",
        "Bahia vs Vitória",
        "Vasco vs Fluminense",
      ];

      // Volume geral de apostas por evento
      const generalVolume = events.map(
        () => Math.floor(Math.random() * 5000) + 1000
      );

      // Volume de apostas de usuários específicos (suspeitos)
      const specificUsersVolume = events.map((_, index) => {
        // Alguns eventos têm volume desproporcional de usuários específicos
        if (index === 1 || index === 4 || index === 7) {
          return Math.floor(Math.random() * 1000) + 500;
        }
        return Math.floor(Math.random() * 200) + 50;
      });

      // Calcular a proporção (%) do volume de usuários específicos em relação ao volume geral
      const volumeRatio = events.map((_, index) =>
        ((specificUsersVolume[index] / generalVolume[index]) * 100).toFixed(1)
      );

      return {
        labels: events,
        datasets: [
          {
            label: "Volume Geral (R$)",
            data: generalVolume,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Volume de Usuários Específicos (R$)",
            data: specificUsersVolume,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Proporção (%)",
            data: volumeRatio,
            backgroundColor: "rgba(255, 205, 86, 0.5)",
            borderColor: "rgba(255, 205, 86, 1)",
            borderWidth: 1,
            type: "line",
            yAxisID: "y1",
            tension: 0.1,
          },
        ],
      };
    };

    // Gerar alertas simulados de apostas insider
    const generateInsiderAlerts = () => {
      return [
        {
          id: "IN001",
          evento: "Flamengo vs Palmeiras",
          data: "15/10/2023 16:00",
          mercado: "Resultado Final",
          oddInicial: 2.5,
          oddFinal: 1.85,
          tempoAntesEvento: "10h 22m",
          usuario: "betmaster99",
          valorAposta: "R$ 5.000,00",
          padrao: "Aposta alta antes de queda significativa nas odds",
          riskScore: 87,
          status: "Em Análise",
        },
        {
          id: "IN002",
          evento: "Corinthians vs São Paulo",
          data: "14/10/2023 19:30",
          mercado: "Total de Gols",
          oddInicial: 1.95,
          oddFinal: 1.45,
          tempoAntesEvento: "8h 15m",
          usuario: "goalscorer77",
          valorAposta: "R$ 3.200,00",
          padrao: "Múltiplas apostas coordenadas antes de mudança no mercado",
          riskScore: 92,
          status: "Confirmado",
        },
        {
          id: "IN003",
          evento: "Atlético-MG vs Cruzeiro",
          data: "16/10/2023 20:00",
          mercado: "Handicap Asiático",
          oddInicial: 2.1,
          oddFinal: 1.75,
          tempoAntesEvento: "12h 40m",
          usuario: "insidertips2023",
          valorAposta: "R$ 2.800,00",
          padrao: "Aposta em mercado específico antes de lesão anunciada",
          riskScore: 85,
          status: "Em Análise",
        },
        {
          id: "IN004",
          evento: "Athletico-PR vs Coritiba",
          data: "13/10/2023 16:30",
          mercado: "Ambas Equipes Marcam",
          oddInicial: 2.2,
          oddFinal: 1.65,
          tempoAntesEvento: "9h 50m",
          usuario: "bettingpro88",
          valorAposta: "R$ 4.500,00",
          padrao: "Grupo de contas relacionadas apostando no mesmo resultado",
          riskScore: 90,
          status: "Confirmado",
        },
        {
          id: "IN005",
          evento: "Vasco vs Fluminense",
          data: "17/10/2023 21:30",
          mercado: "Escanteios",
          oddInicial: 1.85,
          oddFinal: 1.4,
          tempoAntesEvento: "7h 10m",
          usuario: "cornerking",
          valorAposta: "R$ 2.000,00",
          padrao: "Aposta em mercado secundário antes de anúncio de escalação",
          riskScore: 78,
          status: "Não Confirmado",
        },
      ];
    };

    // Simular chamadas de API
    setTimeout(() => {
      setEarlyBetsData(generateEarlyBetsData());
      setVolumeComparisonData(generateVolumeComparisonData());
      setInsiderAlerts(generateInsiderAlerts());
    }, 1000);
  }, [timeRange, selectedSports]);

  const earlyBetsOptions = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Apostas Antecipadas vs. Mudanças nas Odds",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const date = new Date(context[0].label);
            return date.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
          tooltipFormat: "dd/MM/yyyy HH:mm",
        },
        adapters: {
          date: {
            locale: ptBR,
          },
        },
        title: {
          display: true,
          text: "Tempo antes do evento",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Odds",
        },
        min: 1.0,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Volume de Apostas",
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const volumeComparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Comparação entre Volume Geral e Volume de Usuários Específicos",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Eventos",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Volume (R$)",
        },
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Proporção (%)",
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const eventName = volumeComparisonData.labels[index];
        setSelectedEvent(eventName);
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Apostas Insiders / Vazamento de Informação
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Apostas Antecipadas com Odds Específicas
          </h3>
          {isLoading || !earlyBetsData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Line data={earlyBetsData} options={earlyBetsOptions} />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Picos de apostas antes de mudanças significativas nas odds podem
            indicar vazamento de informação privilegiada.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Volume Geral vs. Volume de Usuários Específicos
          </h3>
          {isLoading || !volumeComparisonData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Bar
                data={
                  selectedEvent
                    ? {
                        labels: [selectedEvent],
                        datasets: volumeComparisonData.datasets.map(
                          (dataset) => ({
                            ...dataset,
                            data: [
                              dataset.data[
                                volumeComparisonData.labels.indexOf(
                                  selectedEvent
                                )
                              ],
                            ],
                          })
                        ),
                      }
                    : volumeComparisonData
                }
                options={volumeComparisonOptions}
              />
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {selectedEvent
                ? `Detalhes para: ${selectedEvent}`
                : "Proporções altas indicam possível atividade de insider trading."}
            </p>
            {selectedEvent && (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => setSelectedEvent(null)}
              >
                Mostrar todos os eventos
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <h3 className="text-md font-medium text-red-800 mb-2">
          Sinais de Apostas Insider
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-red-500 pl-3">
            <h4 className="font-medium text-red-800">Timing Suspeito</h4>
            <p className="text-sm text-red-700">
              Apostas significativas feitas pouco antes de anúncios oficiais ou
              mudanças nas odds.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-3">
            <h4 className="font-medium text-red-800">Padrões Coordenados</h4>
            <p className="text-sm text-red-700">
              Múltiplas contas apostando no mesmo resultado em curto período de
              tempo.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-3">
            <h4 className="font-medium text-red-800">Mercados Específicos</h4>
            <p className="text-sm text-red-700">
              Foco em mercados secundários que podem ser influenciados por
              informações não públicas.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-3">
        Alertas de Apostas Insider Detectados
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
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mercado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odds (Inicial → Final)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo Antes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
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
              insiderAlerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`cursor-pointer hover:text-blue-600 ${
                        selectedEvent === alert.evento
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                      onClick={() => setSelectedEvent(alert.evento)}
                    >
                      {alert.evento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.mercado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-600 font-medium">
                      {alert.oddInicial}
                    </span>
                    <span className="mx-1">→</span>
                    <span className="text-green-600 font-medium">
                      {alert.oddFinal}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      (
                      {((1 - alert.oddFinal / alert.oddInicial) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parseInt(alert.tempoAntesEvento.split("h")[0]) < 10
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {alert.tempoAntesEvento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`cursor-pointer hover:text-blue-600 ${
                        selectedUser === alert.usuario
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                      onClick={() => setSelectedUser(alert.usuario)}
                    >
                      {alert.usuario}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.valorAposta}
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
                        alert.status === "Confirmado"
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
                    {alert.status !== "Confirmado" && (
                      <button className="text-red-600 hover:text-red-900">
                        Investigar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-md font-medium text-blue-800">
              Perfil do Usuário: {selectedUser}
            </h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => setSelectedUser(null)}
            >
              Fechar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Histórico de Apostas
              </h4>
              <p className="text-xs text-gray-600 mb-1">
                Total de apostas: <span className="font-medium">47</span>
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Apostas suspeitas:{" "}
                <span className="font-medium text-red-600">8 (17%)</span>
              </p>
              <p className="text-xs text-gray-600">
                Valor médio: <span className="font-medium">R$ 2.850,00</span>
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Padrões Detectados
              </h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Apostas antes de mudanças de odds</li>
                <li>Foco em mercados secundários</li>
                <li>Apostas em horários atípicos</li>
                <li>Alta taxa de acerto em eventos específicos</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Conexões
              </h4>
              <p className="text-xs text-gray-600 mb-1">
                IPs compartilhados: <span className="font-medium">3</span>
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Contas relacionadas:{" "}
                <span className="font-medium text-red-600">5</span>
              </p>
              <p className="text-xs text-gray-600">
                Possível afiliação:{" "}
                <span className="font-medium">Clube Atlético XYZ</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Medidas Preventivas
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Monitorar mudanças abruptas nas odds e volumes de apostas</li>
            <li>Implementar limites de apostas para mercados sensíveis</li>
            <li>Rastrear conexões entre usuários e funcionários/atletas</li>
            <li>
              Estabelecer protocolos de segurança para informações privilegiadas
            </li>
            <li>
              Cooperar com entidades esportivas para identificar vazamentos
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Impacto e Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Perdas estimadas</p>
              <p className="text-2xl font-bold text-red-600">R$ 145.800,00</p>
              <p className="text-xs text-gray-500">Últimos 90 dias</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Casos identificados</p>
              <p className="text-2xl font-bold text-blue-600">23</p>
              <p className="text-xs text-gray-500">Últimos 90 dias</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taxa de detecção</p>
              <p className="text-2xl font-bold text-green-600">68%</p>
              <p className="text-xs text-gray-500">Precisão estimada</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tempo médio de detecção</p>
              <p className="text-2xl font-bold text-purple-600">4.2h</p>
              <p className="text-xs text-gray-500">Antes do evento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 mb-3">
          Casos Notáveis Recentes
        </h3>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-800">
                Caso #IN002 - Corinthians vs São Paulo
              </h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Confirmado
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Grupo de 8 contas relacionadas apostou R$ 27.500,00 em "Total de
              Gols Acima de 2.5" aproximadamente 8 horas antes do jogo. As odds
              caíram de 1.95 para 1.45 nas 2 horas seguintes. Investigação
              revelou conexão com funcionário do departamento médico.
            </p>
            <div className="mt-2 flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Ver relatório completo
              </button>
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-800">
                Caso #IN004 - Athletico-PR vs Coritiba
              </h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Confirmado
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Usuário "bettingpro88" e 4 contas relacionadas apostaram um total
              de R$ 18.700,00 no mercado "Ambas Equipes Marcam" cerca de 10
              horas antes do anúncio oficial de mudança tática. Odds caíram 25%
              em 3 horas. Contas foram bloqueadas e caso reportado à autoridade
              esportiva.
            </p>
            <div className="mt-2 flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Ver relatório completo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="text-md font-medium text-indigo-800 mb-2">
          Recomendações para Investigação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="text-sm font-medium text-indigo-700 mb-2">
              Análise de Dados
            </h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Verificar histórico completo de apostas do usuário</li>
              <li>Analisar padrões de apostas em eventos similares</li>
              <li>
                Identificar contas relacionadas por IP, dispositivo ou
                comportamento
              </li>
              <li>
                Comparar timing das apostas com eventos externos (anúncios,
                lesões, etc.)
              </li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="text-sm font-medium text-indigo-700 mb-2">
              Ações Recomendadas
            </h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>
                Limitar temporariamente contas suspeitas durante investigação
              </li>
              <li>
                Contatar entidades esportivas para verificar possíveis
                vazamentos
              </li>
              <li>Revisar políticas de segurança da informação interna</li>
              <li>Implementar alertas em tempo real para padrões similares</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsiderBettingSection;
