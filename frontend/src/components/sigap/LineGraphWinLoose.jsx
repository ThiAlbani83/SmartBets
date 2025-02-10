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

// Dados fictícios: ganho médio dos apostadores por tipo de aposta
const betTypeData = [
  { tipo: "Simples", ganhoMedio: 50 },
  { tipo: "Múltipla", ganhoMedio: 200 },
  { tipo: "Sistema", ganhoMedio: 120 },
  { tipo: "Ao Vivo", ganhoMedio: 80 },
  { tipo: "Pré-Jogo", ganhoMedio: 100 },
];

const LineGraphWinLoose = () => {
  const data = {
    labels: betTypeData.map((item) => item.tipo), // Tipos de aposta no eixo X
    datasets: [
      {
        label: "Ganho Médio (R$)",
        data: betTypeData.map((item) => item.ganhoMedio), // Ganho médio no eixo Y
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4, // Suaviza a linha
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tipos de Aposta",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ganho Médio (R$)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
      <div className="flex items-center w-full  text-center">
        <p className="w-full font-bold">
          Ganho Médio dos Apostadores por Tipo de Aposta
        </p>
      </div>
      <div className="w-full h-full flex justify-center items-center mt-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraphWinLoose;
