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

const BarGraphs = () => {
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
        label: "Distribuição por Faixa Etária",
        data: Object.values(ageDistribution), // Quantidade de apostadores em cada faixa
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
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
          text: "Faixa Etária",
        },
      },
      y: {
        title: {
          display: true,
          text: "Número de Apostadores",
        },
        beginAtZero: true,
        suggestedMax: Math.max(...Object.values(ageDistribution)) + 5,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
      <div className="flex items-center text-center">
        <p className="w-full font-bold">Distribuição por Faixa Etária</p>
      </div>
      <div className="w-full h-full flex justify-center items-center text-sm mt-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraphs;
