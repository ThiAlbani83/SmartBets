import React from "react";
import { Line } from "react-chartjs-2";

const SentimentLineChart = ({ sentimentData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: -1,
        max: 1,
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
        grid: {
          display: false,
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
            let value = parseFloat(context.parsed.y);
            let sentiment = "";

            if (value >= 0.7) sentiment = "Muito Positivo";
            else if (value >= 0.3) sentiment = "Positivo";
            else if (value >= -0.3) sentiment = "Neutro";
            else if (value >= -0.7) sentiment = "Negativo";
            else sentiment = "Muito Negativo";

            return `Sentimento: ${sentiment} (${value})`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Análise de Sentimentos ao Longo do Tempo
      </h3>
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="h-80">
          <Line data={sentimentData} options={chartOptions} />
        </div>
        <div className="mt-4 flex justify-center items-center text-sm">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-green-300 rounded-full mr-1"></div>
            <span>Sentimento Positivo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-300 rounded-full mr-1"></div>
            <span>Sentimento Negativo</span>
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500">
          <p>
            Este gráfico mostra a tendência de sentimentos nos conteúdos
            analisados ao longo do tempo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentLineChart;
