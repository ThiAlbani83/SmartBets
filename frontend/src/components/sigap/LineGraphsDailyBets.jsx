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

// Dados fictícios: valores totais de apostas por dia
const dailyBetValues = [
  { dia: "01/12", valor: 1500 },
  { dia: "02/12", valor: 2000 },
  { dia: "03/12", valor: 1800 },
  { dia: "04/12", valor: 2200 },
  { dia: "05/12", valor: 2500 },
  { dia: "06/12", valor: 2400 },
  { dia: "07/12", valor: 2300 },
];

const LineGraphsDailyBets = ({ timeRange }) => {
  const labels = dailyBetValues.map((entry) => entry.dia);
  const dataValues = dailyBetValues.map((entry) => entry.valor);

  const data = {
    labels,
    datasets: [
      {
        label: "Valores Totais de Apostas (R$)",
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4, // Suaviza a linha
        pointRadius: 6,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
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
            return `Valor: R$ ${context.raw.toLocaleString("pt-BR")}`;
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
            return "R$ " + value.toLocaleString("pt-BR");
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

export default LineGraphsDailyBets;
