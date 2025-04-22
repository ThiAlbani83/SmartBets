import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

// Dados fictícios: volume de apostas por modalidade esportiva
const sportsBetVolume = [
  { modalidade: "Futebol", volume: 5000 },
  { modalidade: "Basquete", volume: 3500 },
  { modalidade: "Tênis", volume: 3000 },
  { modalidade: "Corrida de Cavalos", volume: 2500 },
  { modalidade: "E-Sports", volume: 2000 },
  { modalidade: "Vôlei", volume: 1800 },
  { modalidade: "Golfe", volume: 1500 },
];

// Ordenar e selecionar o Top 5
const top5Sports = sportsBetVolume
  .sort((a, b) => b.volume - a.volume)
  .slice(0, 5);

const BarGraphsTopSports = ({ timeRange }) => {
  const labels = top5Sports.map((sport) => sport.modalidade);
  const dataValues = top5Sports.map((sport) => sport.volume);

  const data = {
    labels,
    datasets: [
      {
        label: "Volume de Apostas",
        data: dataValues,
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bar chart
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
            return `Volume: ${context.raw.toLocaleString("pt-BR")}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
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
            if (value >= 1000) {
              return value / 1000 + "k";
            }
            return value;
          },
        },
      },
      y: {
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
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraphsTopSports;
