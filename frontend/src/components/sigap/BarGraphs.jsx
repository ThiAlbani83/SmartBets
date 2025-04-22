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

const BarGraphs = ({ timeRange }) => {
  // Distribuição dos apostadores por faixa etária
  const ageDistribution = {
    "-18": 0, // Faixa etária menor de 18 anos
    "18-30": 187, // Faixa etária de 18 a 30 anos
    "31-50": 96, // Faixa etária de 31 a 50 anos
    "51-65": 58, // Faixa etária de 51 a 65 anos
    "+65": 44, // Faixa etária maior que 65 anos
  };

  // Dados do gráfico
  const data = {
    labels: Object.keys(ageDistribution), // Faixas etárias como rótulos
    datasets: [
      {
        label: "Número de Apostadores",
        data: Object.values(ageDistribution), // Quantidade de apostadores em cada faixa
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

export default BarGraphs;
