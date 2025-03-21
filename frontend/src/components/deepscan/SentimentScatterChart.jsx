import React from "react";
import { Scatter } from "react-chartjs-2";

const SentimentScatterChart = ({ scatterData }) => {
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: -1,
        max: 1,
        title: {
          display: true,
          text: "Sentimento Médio",
        },
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return "rgba(0, 0, 0, 0.5)"; // Linha do zero mais escura
            }
            return "rgba(0, 0, 0, 0.1)";
          },
          lineWidth: (context) => {
            if (context.tick.value === 0) {
              return 2; // Linha do zero mais grossa
            }
            return 1;
          },
        },
        ticks: {
          callback: function (value) {
            if (value === 1) return "Muito Positivo";
            if (value === 0.5) return "Positivo";
            if (value === 0) return "Neutro";
            if (value === -0.5) return "Negativo";
            if (value === -1) return "Muito Negativo";
            return "";
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Frequência (Número de Posts)",
        },
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const point = context.raw;
            let value = point.y;
            let sentiment = "";

            if (value >= 0.7) sentiment = "Muito Positivo";
            else if (value >= 0.3) sentiment = "Positivo";
            else if (value >= -0.3) sentiment = "Neutro";
            else if (value >= -0.7) sentiment = "Negativo";
            else sentiment = "Muito Negativo";

            return [
              `Perfil: ${point.profile}`,
              `Frequência: ${point.x} posts`,
              `Sentimento: ${sentiment} (${value})`,
            ];
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Relação entre Frequência e Sentimento por Perfil
      </h3>
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="h-80">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
        <div className="mt-4 flex justify-center items-center text-sm flex-wrap gap-2">
          <div className="flex items-center mr-2">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-1"></div>
            <span>Muito Negativo</span>
          </div>
          <div className="flex items-center mr-2">
            <div className="w-4 h-4 bg-red-300 rounded-full mr-1"></div>
            <span>Negativo</span>
          </div>
          <div className="flex items-center mr-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full mr-1"></div>
            <span>Neutro</span>
          </div>
          <div className="flex items-center mr-2">
            <div className="w-4 h-4 bg-teal-300 rounded-full mr-1"></div>
            <span>Positivo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full mr-1"></div>
            <span>Muito Positivo</span>
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500">
          <p>
            Este gráfico relaciona a frequência de posts por perfil com o
            sentimento médio. Tamanho dos pontos indica volume de conteúdo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentScatterChart;
