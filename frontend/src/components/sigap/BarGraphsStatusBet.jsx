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

const betStatusDistribution = {
  Premiada: 50,
  "Não Premiada": 120,
  Cancelada: 30,
  Pendente: 20,
};

const BarGraphsStatusBet = () => {
  const statusLabels = Object.keys(betStatusDistribution);
  const statusValues = Object.values(betStatusDistribution);

  const data = {
    labels: statusLabels,
    datasets: [
      {
        label: "Quantidade de Apostas",
        data: statusValues,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Premiada
        ],
        borderColor: ["rgba(75, 192, 192, 1)"],
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
          text: "Status da Aposta",
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
        <p className="w-full font-bold">Distribuição por Status da Aposta</p>
      </div>
      <div className="w-full h-full flex justify-center items-center text-sm mt-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraphsStatusBet;
