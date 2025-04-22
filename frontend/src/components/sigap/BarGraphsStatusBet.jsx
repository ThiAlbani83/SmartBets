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

const betStatusDistribution = {
  Premiada: 50,
  "Não Premiada": 120,
  Cancelada: 30,
  Pendente: 20,
};

const BarGraphsStatusBet = ({ timeRange }) => {
  const statusLabels = Object.keys(betStatusDistribution);
  const statusValues = Object.values(betStatusDistribution);

  const data = {
    labels: statusLabels,
    datasets: [
      {
        label: "Quantidade de Apostas",
        data: statusValues,
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)", // Premiada
          "rgba(255, 99, 132, 0.7)", // Não Premiada
          "rgba(255, 205, 86, 0.7)", // Cancelada
          "rgba(153, 102, 255, 0.7)", // Pendente
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
        borderRadius: 5,
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
          precision: 0,
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

export default BarGraphsStatusBet;
