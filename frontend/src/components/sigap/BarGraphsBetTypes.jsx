import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const betDistribution = {
  Simples: 180,
  Múltipla: 120,
  Sistema: 80,
};

const BarGraphsBetTypes = () => {
  const betTypes = Object.keys(betDistribution);
  const betValues = Object.values(betDistribution);

  const data = {
    labels: betTypes,
    datasets: [
      {
        label: "Quantidade de Apostas",
        data: betValues,
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Simples
        ],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tipo de Aposta",
        },
      },
      y: {
        title: {
          display: true,
          text: "Quantidade",
        },
        beginAtZero: true,
        suggestedMax: 150,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
      <div className="flex items-center text-center">
        <p className="w-full font-bold">Distribuição de Tipos de Apostas</p>
      </div>
      <div className="w-full h-full flex justify-center items-center text-sm mt-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraphsBetTypes;
