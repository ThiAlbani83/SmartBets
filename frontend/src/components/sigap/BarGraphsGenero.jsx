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

const BarGraphsGenero = () => {
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
          "rgba(75, 192, 192, 0.6)", // Masculino
          "rgba(75, 192, 192, 0.6)", // Feminino
          "rgba(75, 192, 192, 0.6)", // Não Informado
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
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
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Gênero",
        },
      },
      y: {
        title: {
          display: true,
          text: "Número de Apostadores",
        },
        beginAtZero: true,
        suggestedMax: Math.max(...Object.values(genderDistribution)) + 5,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
      <div className="flex items-center text-center">
        <p className="w-full font-bold">Distribuição por Gênero</p>
      </div>
      <div className="w-full h-full flex justify-center items-center text-sm mt-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraphsGenero;
