import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MultiAccountSection = ({ timeRange, selectedSports, isLoading }) => {
  const [clusterData, setClusterData] = useState(null);
  const [multiAccountAlerts, setMultiAccountAlerts] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    // Gerar dados simulados para clusterização de IPs/Dispositivos
    const generateClusterData = () => {
      const labels = [
        "Cluster 1",
        "Cluster 2",
        "Cluster 3",
        "Cluster 4",
        "Cluster 5",
        "Cluster 6",
        "Cluster 7",
      ];

      // Gerar dados para contas por cluster
      const accountsPerCluster = labels.map(
        () => Math.floor(Math.random() * 15) + 2
      );

      // Gerar dados para IPs únicos por cluster
      const uniqueIpsPerCluster = accountsPerCluster.map((accounts) =>
        Math.max(1, Math.floor(accounts / (Math.random() * 2 + 1)))
      );

      // Gerar dados para dispositivos únicos por cluster
      const uniqueDevicesPerCluster = accountsPerCluster.map((accounts) =>
        Math.max(1, Math.floor(accounts / (Math.random() * 2 + 1)))
      );

      return {
        labels,
        datasets: [
          {
            label: "Contas",
            data: accountsPerCluster,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
          {
            label: "IPs Únicos",
            data: uniqueIpsPerCluster,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          },
          {
            label: "Dispositivos Únicos",
            data: uniqueDevicesPerCluster,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
        ],
      };
    };

    // Gerar alertas simulados de multi-contas
    const generateMultiAccountAlerts = () => {
      return [
        {
          id: "MA001",
          cluster: "Cluster 1",
          accounts: ["user123", "betmaster55", "luckyplayer7"],
          commonData: [
            "IP: 187.54.123.45",
            "Dispositivo: iPhone 12",
            "Endereço: Rua das Flores, 123",
          ],
          riskScore: 87,
          lastActivity: "2023-10-15 14:22:18",
          status: "Não Resolvido",
        },
        {
          id: "MA002",
          cluster: "Cluster 2",
          accounts: ["winner2023", "betking", "sportsfan99", "luckycharm"],
          commonData: [
            "IP: 201.33.87.12",
            "Dispositivo: Samsung Galaxy S21",
            "Método de Pagamento: MasterCard **** 4532",
          ],
          riskScore: 92,
          lastActivity: "2023-10-14 18:45:33",
          status: "Em Análise",
        },
        {
          id: "MA003",
          cluster: "Cluster 3",
          accounts: ["footballpro", "bettingace"],
          commonData: [
            "IP: 177.68.45.201",
            "Dispositivo: MacBook Pro",
            "Email: j****@gmail.com",
          ],
          riskScore: 65,
          lastActivity: "2023-10-13 09:12:45",
          status: "Não Resolvido",
        },
        {
          id: "MA004",
          cluster: "Cluster 4",
          accounts: ["soccerlover", "betexpert", "gambler777", "luckystar"],
          commonData: [
            "IP: 189.54.102.78",
            "Dispositivo: Windows PC",
            "Telefone: (11) ****-5678",
          ],
          riskScore: 78,
          lastActivity: "2023-10-12 22:33:17",
          status: "Bloqueado",
        },
        {
          id: "MA005",
          cluster: "Cluster 5",
          accounts: ["sportsbetter", "oddsmaker"],
          commonData: [
            "IP: 200.158.97.32",
            "Dispositivo: iPad Pro",
            "Endereço: Av. Paulista, 1000",
          ],
          riskScore: 58,
          lastActivity: "2023-10-11 16:19:42",
          status: "Resolvido",
        },
      ];
    };

    // Simular chamadas de API
    setTimeout(() => {
      setClusterData(generateClusterData());
      setMultiAccountAlerts(generateMultiAccountAlerts());
    }, 1000);
  }, [timeRange, selectedSports]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Clusterização de Contas por IPs/Dispositivos",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Clusters",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade",
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clusterName = clusterData.labels[index];
        setSelectedCluster(clusterName);
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Multi-Contas (Multi-accounting)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Clusterização de IPs/Dispositivos
          </h3>
          {isLoading || !clusterData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Bar data={clusterData} options={barOptions} />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Clique em um cluster para ver detalhes das contas relacionadas.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Gráfico de Rede de Contas Relacionadas
          </h3>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : selectedCluster ? (
            <div className="h-80 flex flex-col">
              <div className="text-center mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {selectedCluster}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    Visualização de rede para {selectedCluster}
                  </p>
                  <p className="text-sm text-gray-400">
                    (Esta visualização requer uma biblioteca específica como
                    D3.js ou react-force-graph)
                  </p>

                  {/* Visualização simplificada da rede */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-bold border-2 border-red-400">
                      IP
                    </div>
                    <div className="w-32 border-t-2 border-dashed border-gray-400"></div>
                    <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold border-2 border-blue-400">
                      Contas
                    </div>
                    <div className="w-32 border-t-2 border-dashed border-gray-400"></div>
                    <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold border-2 border-green-400">
                      Pagto
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => setSelectedCluster(null)}
              >
                ← Voltar para visão geral
              </button>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">
                Selecione um cluster no gráfico ao lado para visualizar a rede
                de contas relacionadas.
              </p>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-3">
        Alertas de Multi-Contas Detectados
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cluster
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contas Relacionadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dados em Comum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score de Risco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atividade
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
                <td colSpan="8" className="px-6 py-4 text-center">
                  <div className="animate-pulse text-gray-500">
                    Carregando alertas...
                  </div>
                </td>
              </tr>
            ) : (
              multiAccountAlerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {alert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={() => setSelectedCluster(alert.cluster)}
                    >
                      {alert.cluster}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {alert.accounts.map((account, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {account}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {alert.commonData.map((data, idx) => (
                        <li key={idx} className="text-xs">
                          {data}
                        </li>
                      ))}
                    </ul>
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
                    {alert.lastActivity}
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
                    {alert.status !== "Bloqueado" &&
                      alert.status !== "Resolvido" && (
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

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-md font-medium text-blue-800 mb-2">
          Informações sobre Multi-Contas
        </h3>
        <p className="text-sm text-blue-700 mb-2">
          A detecção de multi-contas é realizada através de análise de padrões
          em:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 mb-2">
          <li>Endereços IP compartilhados</li>
          <li>Identificadores de dispositivos</li>
          <li>Informações de pagamento</li>
          <li>Dados de localização geográfica</li>
          <li>Padrões de comportamento de apostas</li>
        </ul>
        <p className="text-sm text-blue-700">
          Clusters com alto score de risco indicam maior probabilidade de fraude
          e devem ser priorizados para investigação.
        </p>
      </div>
    </div>
  );
};

export default MultiAccountSection;
