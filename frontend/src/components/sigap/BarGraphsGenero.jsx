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

const BarGraphsGenero = ({ timeRange }) => {
  // Distribuição dos apostadores por gênero
  const genderDistribution = {
    Masculino: 50, // Número de apostadores masculinos
    Feminino: 35, // Número de apostadores femininos
    "Não Informado": 15, // Número de apostadores que não informaram o gênero
  };

  // Dados do gráfico
  const data = {
    labels: Object.keys(genderDistribution), // Gêneros como rótulos
    datasets: [
      {
        label: "Distribuição por Gênero",
        data: Object.values(genderDistribution), // Quantidade de apostadores em cada gênero
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Masculino
          "rgba(255, 99, 132, 0.7)", // Feminino
          "rgba(255, 205, 86, 0.7)", // Não Informado
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  // Configurações do gráfico
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
            return `${context.label}: ${context.raw} apostadores`;
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

export default BarGraphsGenero;
