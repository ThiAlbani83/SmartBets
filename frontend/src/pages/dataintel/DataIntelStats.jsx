import React from "react";
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
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DataIntelStats = ({ searchResults, matrixResults }) => {
  // Dados para gráfico de fontes
  const sourcesData = {
    labels: [...new Set(searchResults.map((r) => r.source))],
    datasets: [
      {
        label: "Resultados por Fonte",
        data: [...new Set(searchResults.map((r) => r.source))].map(
          (source) => searchResults.filter((r) => r.source === source).length
        ),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#84CC16",
          "#F97316",
          "#EC4899",
          "#6B7280",
        ],
        borderWidth: 0,
      },
    ],
  };
  // Dados para gráfico de confiança
  const confidenceData = {
    labels: ["Alta (90-100%)", "Média (70-89%)", "Baixa (0-69%)"],
    datasets: [
      {
        data: [
          searchResults.filter((r) => r.confidence >= 90).length,
          searchResults.filter((r) => r.confidence >= 70 && r.confidence < 90)
            .length,
          searchResults.filter((r) => r.confidence < 70).length,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  // Dados para gráfico de tipos
  const typesData = {
    labels: [...new Set(searchResults.map((r) => r.type))].map((type) => {
      const typeLabels = {
        fiscal: "Fiscal",
        eleitoral: "Eleitoral",
        empresarial: "Empresarial",
        societário: "Societário",
        social: "Redes Sociais",
        menções: "Menções",
        profissional: "Profissional",
        publicações: "Publicações",
      };
      return typeLabels[type] || type;
    }),
    datasets: [
      {
        label: "Resultados por Tipo",
        data: [...new Set(searchResults.map((r) => r.type))].map(
          (type) => searchResults.filter((r) => r.type === type).length
        ),
        backgroundColor: "#3B82F6",
        borderRadius: 4,
      },
    ],
  };

  // Dados para timeline (últimos 7 dias simulados)
  const timelineData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Buscas Realizadas",
        data: [45, 52, 38, 67, 73, 58, 84],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },
    },
    cutout: "60%",
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Calcular estatísticas gerais
  const totalResults = searchResults.length + matrixResults.length;
  const avgConfidence =
    searchResults.length > 0
      ? Math.round(
          searchResults.reduce((acc, r) => acc + r.confidence, 0) /
            searchResults.length
        )
      : 0;
  const uniqueSources = [...new Set(searchResults.map((r) => r.source))].length;
  const highConfidenceCount = searchResults.filter(
    (r) => r.confidence >= 90
  ).length;

  return (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {totalResults}
          </div>
          <div className="text-sm text-gray-600">Total de Resultados</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {avgConfidence}%
          </div>
          <div className="text-sm text-gray-600">Confiança Média</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {uniqueSources}
          </div>
          <div className="text-sm text-gray-600">Fontes Consultadas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {highConfidenceCount}
          </div>
          <div className="text-sm text-gray-600">Alta Confiança</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Fontes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Resultados por Fonte</h3>
          <div className="h-64">
            <Bar data={sourcesData} options={chartOptions} />
          </div>
        </div>

        {/* Gráfico de Confiança */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Distribuição de Confiança
          </h3>
          <div className="h-64">
            <Doughnut data={confidenceData} options={doughnutOptions} />
          </div>
        </div>

        {/* Gráfico de Tipos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Tipos de Dados</h3>
          <div className="h-64">
            <Bar data={typesData} options={chartOptions} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Atividade dos Últimos 7 Dias
          </h3>
          <div className="h-64">
            <Line data={timelineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Análise Detalhada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Matrix IA Results */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Matrix IA</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Campos Identificados:</span>
                <span className="font-medium">{matrixResults.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Alta Confiança:</span>
                <span className="font-medium text-green-600">
                  {matrixResults.filter((r) => r.confidence >= 90).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Múltiplas Fontes:</span>
                <span className="font-medium text-blue-600">
                  {matrixResults.filter((r) => r.sources.length > 1).length}
                </span>
              </div>
            </div>
          </div>

          {/* Qualidade dos Dados */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Qualidade dos Dados
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Excelente (95-100%):</span>
                <span className="font-medium text-green-600">
                  {searchResults.filter((r) => r.confidence >= 95).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Boa (80-94%):</span>
                <span className="font-medium text-blue-600">
                  {
                    searchResults.filter(
                      (r) => r.confidence >= 80 && r.confidence < 95
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Regular (60-79%):</span>
                <span className="font-medium text-yellow-600">
                  {
                    searchResults.filter(
                      (r) => r.confidence >= 60 && r.confidence < 80
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Tempo de Resposta */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo Médio:</span>
                <span className="font-medium">1.8s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa de Sucesso:</span>
                <span className="font-medium text-green-600">98.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fontes Ativas:</span>
                <span className="font-medium text-blue-600">
                  {uniqueSources}/15
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Recomendações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avgConfidence >= 90 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Dados Confiáveis
                </p>
                <p className="text-sm text-green-700">
                  Os resultados apresentam alta confiabilidade e podem ser
                  utilizados com segurança.
                </p>
              </div>
            </div>
          )}

          {avgConfidence < 70 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Verificação Recomendada
                </p>
                <p className="text-sm text-yellow-700">
                  Recomenda-se verificação manual dos dados devido à confiança
                  média baixa.
                </p>
              </div>
            </div>
          )}

          {uniqueSources >= 5 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Cobertura Ampla
                </p>
                <p className="text-sm text-blue-700">
                  Excelente cobertura de fontes de dados para validação cruzada.
                </p>
              </div>
            </div>
          )}

          {matrixResults.filter((r) => r.sources.length > 1).length >
            matrixResults.length * 0.7 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Validação Cruzada
                </p>
                <p className="text-sm text-purple-700">
                  A maioria dos dados foi validada em múltiplas fontes,
                  aumentando a confiabilidade.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataIntelStats;
