import React from "react";
import ReactWordcloud from "react-wordcloud";
import { scaleLinear } from "d3-scale";

const WordCloudChart = ({ wordcloudData }) => {
  // Opções para a nuvem de palavras
  const wordcloudOptions = {
    colors: ["#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "Arial",
    fontSizes: [30, 100],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  // Callback para personalizar a cor das palavras com base no sentimento
  const getWordColor = (word) => {
    // Escala de cores do vermelho escuro ao vermelho claro
    const colorScale = scaleLinear()
      .domain([-1, 0])
      .range(["#8B0000", "#FFCCCC"])
      .clamp(true);

    // Quanto mais negativo o sentimento, mais escuro o vermelho
    return colorScale(word.sentiment);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">
        Nuvem de Palavras-Chave por Sentimento
      </h3>
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div style={{ height: 400 }}>
          <ReactWordcloud
            words={wordcloudData}
            options={wordcloudOptions}
            callbacks={{
              getWordColor: getWordColor,
              getWordTooltip: (word) =>
                `${word.text} (${
                  word.value
                } ocorrências, sentimento: ${word.sentiment.toFixed(2)})`,
            }}
          />
        </div>
        <div className="mt-4 flex justify-center items-center text-sm">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red-900 rounded-full mr-1"></div>
            <span>Muito Negativo</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-1"></div>
            <span>Negativo</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-red-400 rounded-full mr-1"></div>
            <span>Moderadamente Negativo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 rounded-full mr-1"></div>
            <span>Levemente Negativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudChart;
