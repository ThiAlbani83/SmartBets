import { useState } from "react";
import WordCloudWrapper from "./WordCloudWrapper";
import PizzaGraphs from "./PizzaGraphs";
import { Bar } from "react-chartjs-2"; // Add this import for the bar chart

const ScanHistory = () => {
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

  // Opções para o gráfico de barras
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribuição de Palavras por Rede Social",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
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

  return (
    <div className="w-full pb-4 h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="block text-gray-700 mb-2">
            Selecione a data da análise:
          </label>
          <input
            type="date"
            className="border rounded p-2"
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
          />
        </div>

        <button className="bg-primaryLight py-2 px-4 text-white rounded-lg">
          Baixar Relatório
        </button>
      </div>
      {showResults && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="bg-white p-4 rounded-lg shadow w-1/3">
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
            <div className="bg-white p-4 rounded-lg shadow w-1/3">
              <h3 className="text-xl mb-4">Análise de Sentimento</h3>
              <PizzaGraphs bet_name="Análise Geral" data={sentimentData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow col-span-full w-1/3 overflow-y-scroll max-h-[450px]">
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

          {/* Novo gráfico de distribuição de palavras por rede social */}
          <div className="bg-white p-4 rounded-lg shadow w-full mt-4">
            <h3 className="text-xl mb-4">
              Distribuição de Palavras por Rede Social
            </h3>
            <div className="h-64">
              <Bar data={wordDistributionData} options={barChartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
