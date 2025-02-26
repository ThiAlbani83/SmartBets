import { useState } from "react";
import WordCloudWrapper from "../../components/deepscan/WordCloudWrapper";
import PizzaGraphs from "../../components/deepscan/PizzaGraphs";
import { Bar, Scatter, Bubble } from "react-chartjs-2"; // Add Bubble to imports
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  BubbleController,
} from "chart.js";

// Register the bubble chart components
ChartJS.register(LinearScale, PointElement, BubbleController);
const SearchDeepScan = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showResults, setShowResults] = useState(false);

  //fake data for the word cloud
  const wordCloudData = [
    { text: "Apostas", value: 64 },
    { text: "Dinheiro", value: 42 },
    { text: "Ganhos", value: 35 },
    { text: "Lucro", value: 28 },
    { text: "Investimento", value: 25 },
    { text: "Cassino", value: 22 },
    { text: "Bonus", value: 20 },
    { text: "Promoção", value: 18 },
  ];

  //fake data for the pie chart
  const sentimentData = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Novo dado para o gráfico de distribuição de palavras por rede social
  const wordDistributionData = {
    labels: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
    datasets: [
      {
        label: "Apostas",
        data: [25, 18, 12, 9],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Dinheiro",
        data: [15, 12, 10, 5],
        backgroundColor: "#FF6384",
      },
      {
        label: "Ganhos",
        data: [10, 15, 8, 2],
        backgroundColor: "#FFCE56",
      },
      {
        label: "Lucro",
        data: [8, 7, 10, 3],
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  // Options for the scatter chart
  const scatterChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Perfis com Incidência de Palavras Proibidas",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw.label}: ${context.raw.y} palavras proibidas`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Qtd de Palavras",
        },
      },
      x: {
        ticks: {
          // This will replace the x-axis numeric values with profile names
          callback: function (value) {
            const profiles = profileScatterData.datasets[0].data;
            return profiles.find((item) => item.x === value)?.label || "";
          },
        },
        title: {
          display: true,
          text: "Perfis",
        },
      },
    },
  };
  // Data for the scatter plot (for a single day)
  const profileScatterData = {
    datasets: [
      {
        label: "Perfis Problemáticos",
        data: [
          { x: 1, y: 30, label: "/jetbet_oficial" },
          { x: 2, y: 21, label: "@jetbet_facebook" },
          { x: 3, y: 18, label: "jetbet_linkedin" },
          { x: 4, y: 17, label: "/jetbet_instagram" },
          { x: 5, y: 14, label: "/jetbet_x" },
          { x: 6, y: 12, label: "/jetbet_" },
          { x: 7, y: 10, label: "@jetbet_discord" },
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  // Transforme os dados do Scatter para um formato adequado para gráfico de barras
  const profileBarData = {
    labels: profileScatterData.datasets[0].data.map((item) => item.label),
    datasets: [
      {
        label: "Palavras Proibidas",
        data: profileScatterData.datasets[0].data.map((item) => item.y),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opções para o gráfico de barras
  const barProfileOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Perfis com Incidência de Palavras Proibidas",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw} palavras proibidas`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Qtd de Palavras",
        },
      },
      x: {
        title: {
          display: true,
          text: "Perfis",
        },
      },
    },
  };
  //fake data for found posts
  const nonCompliantPosts = [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/example",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/post2",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/post3",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/example",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/example",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/post2",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/post3",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/example",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/example",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/example",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/post2",
      issue: "Conteúdo inadequado",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/post3",
      issue: "Promessa de ganhos garantidos",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/example",
      issue: "Conteúdo inadequado",
    },
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowResults(true);
  };

  // Stakeholder sentiment and impact data
  const stakeholderData = {
    datasets: [
      {
        label: "Stakeholders",
        data: [
          { x: 8, y: 7, r: 15, label: "Investidores" },
          { x: 6, y: 9, r: 12, label: "Clientes VIP" },
          { x: 9, y: 4, r: 18, label: "Reguladores" },
          { x: 4, y: 8, r: 10, label: "Parceiros" },
          { x: 7, y: 6, r: 14, label: "Funcionários" },
          { x: 3, y: 3, r: 8, label: "Fornecedores" },
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Media sentiment and impact data
  const mediaData = {
    datasets: [
      {
        label: "Canais de Mídia",
        data: [
          { x: 9, y: 6, r: 18, label: "Instagram" },
          { x: 8, y: 4, r: 14, label: "globo.com" },
          { x: 5, y: 7, r: 12, label: "UOL" },
          { x: 3, y: 6, r: 6, label: "Blogs" },
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the bubble charts
  const bubbleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw.label}: Impacto ${context.raw.x}, Sentimento ${context.raw.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: "Sentimento (Negativo → Positivo)",
        },
      },
      x: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: "Impacto (Baixo → Alto)",
        },
      },
    },
  };

  return (
    <div className="w-full pb-4 pr-10 h-full overflow-y-auto">
      <div className="mb-6 flex items-start justify-between">
        <div className=" flex flex-col gap-10">
          <div>
            <label className="block text-mainText mb-2">
              Selecione a Empresa
            </label>
            <select className="border rounded p-2">
              <option value="empresa1">Selecione a Empresa</option>
              <option value="empresa2">Jetbet</option>
              <option value="empresa3">Bet4</option>
              <option value="empresa4">BetWarrior</option>
            </select>
          </div>
          <div>
            <label className="block text-mainText mb-2">
              Selecione a data da análise:
            </label>
            <input
              type="date"
              className="border rounded p-2"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
            />
          </div>
        </div>
        <button className="bg-primaryLight py-2 px-4 text-white rounded-lg">
          Baixar Relatório
        </button>
      </div>
      {showResults && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="p-4 rounded-lg shadow w-1/3 max-h-[400px] border border-linesAndBorders">
              <h3 className="text-xl mb-10">Nuvem de Palavras</h3>
              <WordCloudWrapper
                words={wordCloudData}
                options={{
                  fontSizes: [20, 60],
                  colors: [
                    "#000000",
                    "#3B70A2",
                    "#5BB9D3",
                    "#101A5A",
                    "#171717",
                    "#303030",
                  ],
                  fontStyle: "normal",
                  rotations: 3,
                  rotationAngles: [0, 90],
                  enableTooltip: true,
                  deterministic: false,
                  fontFamily: "Roboto",
                  padding: 3,
                  maxSpeed: "fast",
                  spiral: "archimedean",
                  fontWeight: "bold",
                  spiralFromCenter: true,
                }}
              />
            </div>
            {/* Novo gráfico de distribuição de palavras por rede social */}
            <div className="border border-linesAndBorders p-4 rounded-lg shadow w-1/3 max-h-[400px]">
              <h3 className="text-xl mb-4">
                Distribuição de Palavras por Rede Social
              </h3>
              <div className="h-64">
                <Bar data={wordDistributionData} options={barProfileOptions} />
              </div>
            </div>
            <div className="border border-linesAndBorders p-4 rounded-lg shadow w-1/3 max-h-[400px]">
              <h3 className="text-xl mb-4">Análise de Sentimento</h3>
              <PizzaGraphs bet_name="Análise Geral" data={sentimentData} />
            </div>
          </div>
          <div className="flex gap-6">
            {/* Add this after your existing rows of charts */}
            <div className="border border-linesAndBorders p-4 rounded-lg shadow col-span-full w-1/3 max-h-[400px]">
              <h3 className="text-xl mb-4">
                Análise de Stakeholders: Sentimento e Impacto
              </h3>
              <div className="h-64">
                <Bubble data={stakeholderData} options={bubbleChartOptions} />
              </div>
            </div>
            <div className="border border-linesAndBorders p-4 rounded-lg shadow col-span-full w-1/3 max-h-[400px]">
              <h3 className="text-xl mb-4">
                Análise de Mídias: Sentimento e Impacto
              </h3>
              <div className="h-64">
                <Bubble data={mediaData} options={bubbleChartOptions} />
              </div>
            </div>
            <div className="border border-linesAndBorders p-4 rounded-lg shadow col-span-full w-1/3 max-h-[400px]">
              <h3 className="text-xl mb-4">Perfis com Maior Incidência</h3>
              <div className="h-64">
                <Bar data={profileBarData} options={barProfileOptions} />
              </div>
            </div>
          </div>
          <div className="border border-linesAndBorders p-4 rounded-lg shadow col-span-full w-1/3 overflow-y-scroll max-h-[400px]">
            <h3 className="text-xl mb-10">Posts em Disconformidade</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Plataforma</th>
                  <th className="text-left p-2">URL</th>
                  <th className="text-left p-2">Problema</th>
                </tr>
              </thead>
              <tbody>
                {nonCompliantPosts.map((post, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{post.platform}</td>
                    <td className="p-2">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver post
                      </a>
                    </td>
                    <td className="p-2">{post.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDeepScan;
