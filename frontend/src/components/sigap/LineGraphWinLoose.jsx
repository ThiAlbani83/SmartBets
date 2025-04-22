import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

// Dados fictícios: ganho médio dos apostadores por tipo de aposta
const betTypeData = [
  { tipo: "Simples", ganhoMedio: 50 },
  { tipo: "Múltipla", ganhoMedio: 200 },
  { tipo: "Sistema", ganhoMedio: 120 },
  { tipo: "Ao Vivo", ganhoMedio: 80 },
  { tipo: "Pré-Jogo", ganhoMedio: 100 },
];

const LineGraphWinLoose = ({ timeRange }) => {
  const data = {
    labels: betTypeData.map((item) => item.tipo), // Tipos de aposta no eixo X
    datasets: [
      {
        label: "Ganho Médio (R$)",
        data: betTypeData.map((item) => item.ganhoMedio), // Ganho médio no eixo Y
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Suaviza a linha
        pointRadius: 6,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          family: "'Poppins', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Ganho Médio: R$ ${context.raw}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          callback: function (value) {
            return "R$ " + value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraphWinLoose;
