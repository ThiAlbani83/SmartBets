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
import { ResponsiveSankey } from "@nivo/sankey"; // Replace react-vis import with @nivo/sankey

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PaymentFraudSection = ({ timeRange, selectedSports, isLoading }) => {
  const [failedAttemptsData, setFailedAttemptsData] = useState(null);
  const [sankeyData, setSankeyData] = useState(null);
  const [suspiciousUsers, setSuspiciousUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fraudStats, setFraudStats] = useState({
    totalSuspiciousTransactions: 0,
    totalFraudAmount: 0,
    blockedAccounts: 0,
    recoveredAmount: 0,
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      // Dados para o gráfico de barras de tentativas falhas vs. cartões diferentes
      const generateFailedAttemptsData = () => {
        const labels = [
          "user123",
          "betmaster44",
          "luckyplayer7",
          "winner2023",
          "fastbet88",
          "sportking",
          "bettingpro",
          "gambler456",
          "luckycharm",
          "highroller",
        ];

        const failedAttempts = labels.map(
          () => Math.floor(Math.random() * 15) + 1
        );

        const differentCards = labels.map((_, index) => {
          // Alguns usuários têm um número suspeito de cartões diferentes
          if (index === 1 || index === 3 || index === 6) {
            return Math.floor(Math.random() * 8) + 6;
          }
          return Math.floor(Math.random() * 3) + 1;
        });

        // Calcular score de risco baseado na correlação entre tentativas falhas e cartões diferentes
        const riskScores = labels.map((_, index) => {
          const baseScore =
            failedAttempts[index] * 5 + differentCards[index] * 10;
          return Math.min(100, baseScore);
        });

        return {
          labels,
          datasets: [
            {
              label: "Tentativas de Pagamento Falhas",
              data: failedAttempts,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
            {
              label: "Cartões Diferentes Utilizados",
              data: differentCards,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
            {
              label: "Score de Risco",
              data: riskScores,
              backgroundColor: "rgba(255, 206, 86, 0.5)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
              type: "line",
              yAxisID: "y1",
            },
          ],
        };
      };

      // Dados para o diagrama de Sankey de fluxo financeiro - formato adaptado para @nivo/sankey
      const generateSankeyData = () => {
        return {
          nodes: [
            { id: "Depósitos" },
            { id: "Conta 1" },
            { id: "Conta 2" },
            { id: "Conta 3" },
            { id: "Conta 4" },
            { id: "Conta 5" },
            { id: "Saques" },
            { id: "Apostas" },
            { id: "Bônus" },
            { id: "Transferências" },
          ],
          links: [
            { source: "Depósitos", target: "Conta 1", value: 5000 },
            { source: "Depósitos", target: "Conta 2", value: 3000 },
            { source: "Depósitos", target: "Conta 3", value: 7000 },
            { source: "Depósitos", target: "Conta 4", value: 2000 },
            { source: "Depósitos", target: "Conta 5", value: 4000 },
            { source: "Conta 1", target: "Apostas", value: 2000 },
            { source: "Conta 1", target: "Saques", value: 2500 },
            { source: "Conta 2", target: "Apostas", value: 1000 },
            { source: "Conta 2", target: "Transferências", value: 1500 },
            { source: "Conta 3", target: "Apostas", value: 3000 },
            { source: "Conta 3", target: "Saques", value: 3500 },
            { source: "Conta 4", target: "Transferências", value: 1800 },
            { source: "Conta 5", target: "Apostas", value: 1500 },
            { source: "Conta 5", target: "Saques", value: 2000 },
            { source: "Bônus", target: "Conta 1", value: 500 },
            { source: "Bônus", target: "Conta 3", value: 500 },
            { source: "Transferências", target: "Saques", value: 3000 },
          ],
        };
      };

      // Gerar usuários suspeitos
      const generateSuspiciousUsers = () => {
        return [
          {
            id: "PF001",
            usuario: "betmaster44",
            tentativasFalhas: 12,
            cartoesUtilizados: 8,
            valorTransacoes: "R$ 15.750,00",
            padrao: "Múltiplos cartões com mesmos dados de titular",
            ultimaAtividade: "15/04/2023 14:32",
            riskScore: 87,
            status: "Bloqueado",
          },
          {
            id: "PF002",
            usuario: "winner2023",
            tentativasFalhas: 9,
            cartoesUtilizados: 6,
            valorTransacoes: "R$ 8.200,00",
            padrao: "Tentativas repetidas com cartões inválidos",
            ultimaAtividade: "14/04/2023 22:15",
            riskScore: 76,
            status: "Em Análise",
          },
          {
            id: "PF003",
            usuario: "bettingpro",
            tentativasFalhas: 7,
            cartoesUtilizados: 9,
            valorTransacoes: "R$ 12.450,00",
            padrao: "Depósitos seguidos de saques imediatos",
            ultimaAtividade: "13/04/2023 18:40",
            riskScore: 92,
            status: "Bloqueado",
          },
          {
            id: "PF004",
            usuario: "sportking",
            tentativasFalhas: 5,
            cartoesUtilizados: 3,
            valorTransacoes: "R$ 5.800,00",
            padrao: "Múltiplas contas usando mesmos métodos de pagamento",
            ultimaAtividade: "16/04/2023 09:22",
            riskScore: 65,
            status: "Em Análise",
          },
          {
            id: "PF005",
            usuario: "highroller",
            tentativasFalhas: 3,
            cartoesUtilizados: 4,
            valorTransacoes: "R$ 25.300,00",
            padrao: "Transações de alto valor com cartões diferentes",
            ultimaAtividade: "12/04/2023 11:05",
            riskScore: 71,
            status: "Monitoramento",
          },
        ];
      };

      // Estatísticas de fraude
      setFraudStats({
        totalSuspiciousTransactions: 127,
        totalFraudAmount: 87500,
        blockedAccounts: 23,
        recoveredAmount: 42300,
      });

      setFailedAttemptsData(generateFailedAttemptsData());
      setSankeyData(generateSankeyData());
      setSuspiciousUsers(generateSuspiciousUsers());
    }, 1000);
  }, [timeRange, selectedSports]);

  const failedAttemptsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tentativas Falhas vs. Cartões Diferentes por Usuário",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Usuários",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Quantidade",
        },
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Score de Risco",
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
        const username = failedAttemptsData.labels[index];
        const user = suspiciousUsers.find((u) => u.usuario === username);
        setSelectedUser(user || { usuario: username });
      }
    },
  };

  // Renderização do diagrama Sankey usando @nivo/sankey
  const renderSankeyDiagram = () => {
    if (isLoading || !sankeyData) {
      return (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            Carregando dados de fluxo financeiro...
          </div>
        </div>
      );
    }

    return (
      <div className="h-80">
        <ResponsiveSankey
          data={sankeyData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          align="justify"
          colors={{ scheme: "category10" }}
          nodeOpacity={1}
          nodeHoverOpacity={1}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
          animate={true}
          motionConfig="gentle"
          tooltip={({ node }) => (
            <div className="bg-white p-2 shadow-md rounded border border-gray-200 text-xs">
              <strong>{node.id}</strong>: {node.value} transações
            </div>
          )}
        />
      </div>
    );
  };

  // Rest of the component remains the same...

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Fraudes de Pagamento</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Tentativas Falhas vs. Cartões Diferentes
          </h3>
          {isLoading || !failedAttemptsData ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Bar data={failedAttemptsData} options={failedAttemptsOptions} />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Usuários com muitas tentativas falhas e múltiplos cartões têm maior
            probabilidade de fraude. Clique em uma barra para ver detalhes do
            usuário.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-3">
            Fluxo Financeiro Suspeito
          </h3>
          {renderSankeyDiagram()}
          <p className="text-sm text-gray-500 mt-2">
            Diagrama de Sankey mostrando o fluxo de fundos entre contas,
            destacando padrões suspeitos como transferências circulares e
            depósitos seguidos de saques imediatos.
          </p>
        </div>
      </div>

      {/* The rest of your component remains unchanged */}
    </div>
  );
};

export default PaymentFraudSection;
