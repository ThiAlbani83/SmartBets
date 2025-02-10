import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Dados fictícios: valores totais de apostas por dia
const dailyBetValues = [
  { dia: "2024-12-01", valor: 1500 },
  { dia: "2024-12-02", valor: 2000 },
  { dia: "2024-12-03", valor: 1800 },
  { dia: "2024-12-04", valor: 2200 },
  { dia: "2024-12-05", valor: 2500 },
  { dia: "2024-12-06", valor: 2400 },
  { dia: "2024-12-07", valor: 2300 },
];

const LineGraphsDailyBets = () => {
  const labels = dailyBetValues.map((entry) => entry.dia);
  const dataValues = dailyBetValues.map((entry) => entry.valor);

  const data = {
    labels,
    datasets: [
      {
        label: "Valores Totais de Apostas (R$)",
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        fill: true,
        tension: 0.4, // Suaviza a linha
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
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
          text: "Data",
        },
      },
      y: {
        title: {
          display: true,
          text: "Valores Totais (R$)",
        },
        beginAtZero: true,
        suggestedMax: 3000,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
      <div className="flex items-center text-center">
        <p className="w-full font-bold">Valores Totais em Apostas por Dia</p>
      </div>
      <div className="w-full h-full flex justify-center items-center text-sm mt-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraphsDailyBets;
