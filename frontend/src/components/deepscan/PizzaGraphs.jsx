import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components for the pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const PizzaGraphs = ({ bet_name, data }) => {
  // Example data for the pie chart

  // Options to position the legend on the right
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Análise de Sentimento",
      },
      legend: {
        position: "left", // Positions the legend on the right side
      },
    },
  };

  return (
    <div className="w-[240px] py-10">
      <h2>{bet_name}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PizzaGraphs;
