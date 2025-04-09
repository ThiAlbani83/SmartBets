import React from "react";
import ReactWordcloud from "react-wordcloud";
import { scaleLinear } from "d3-scale";

const WordCloudChart = ({ wordcloudData }) => {
  // Verificar e limpar os dados para garantir que estão no formato correto
  const cleanedData = wordcloudData
    .filter((word) => word && word.text && word.value) // Garantir que tem as propriedades necessárias
    .map((word) => ({
      ...word,
      text: String(word.text), // Garantir que text é uma string
      value: Number(word.value) || 50, // Garantir que value é um número
      sentiment: Number(word.sentiment || 0), // Garantir que sentiment é um número
    }));

  // Usar os dados limpos em vez dos dados originais
  if (!cleanedData || cleanedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  // Limitar o número de palavras para evitar overflow
  const maxWords = 50;
  const limitedData = wordcloudData.slice(0, maxWords).map((word) => ({
    ...word,
    // Limitar o tamanho do texto para evitar palavras muito longas
    text:
      word.text.length > 20 ? word.text.substring(0, 20) + "..." : word.text,
  }));

  // Opções para a nuvem de palavras
  const wordcloudOptions = {
    colors: ["#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ff6600"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "Arial",
    fontSizes: [12, 40], // Reduzir o tamanho máximo da fonte
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 3, // Aumentar o padding entre palavras
    rotations: 2, // Reduzir o número de rotações
    rotationAngles: [0, 45], // Limitar os ângulos de rotação
    scale: "linear", // Usar escala linear para melhor distribuição
    spiral: "rectangular", // Usar espiral retangular para melhor uso do espaço
    transitionDuration: 500,
    // Limitar a área de renderização para evitar overflow
    enableOptimizations: true,
    randomSeed: 42, // Valor fixo para consistência
  };

  // Callback para personalizar a cor das palavras com base no sentimento
  const getWordColor = (word) => {
    // Se a palavra foi marcada como entrada do usuário, usar a cor definida
    if (word.userInput) {
      return "#ff6600"; // Laranja para palavras do usuário
    }

    // Escala de cores do vermelho escuro ao vermelho claro
    const colorScale = scaleLinear()
      .domain([-1, 0])
      .range(["#8B0000", "#FFCCCC"])
      .clamp(true);

    // Quanto mais negativo o sentimento, mais escuro o vermelho
    return colorScale(word.sentiment || 0);
  };

  return (
    <div className="h-full w-full">
      <h3 className="text-sm font-semibold mb-2">Nuvem de Palavras-Chave</h3>
      <div className="bg-white rounded-lg h-[calc(100%-30px)] w-full overflow-hidden">
        <ReactWordcloud
          words={limitedData}
          options={wordcloudOptions}
          callbacks={{
            getWordColor: getWordColor,
            getWordTooltip: (word) =>
              `${word.text} (${word.value} ocorrências${
                word.sentiment
                  ? `, sentimento: ${word.sentiment.toFixed(2)}`
                  : ""
              })`,
          }}
          size={[300, 200]} // Definir tamanho fixo
        />
      </div>
      <div className="mt-1 flex justify-center items-center text-xs flex-wrap">
        <div className="flex items-center mr-2 mb-1">
          <div className="w-3 h-3 bg-red-900 rounded-full mr-1"></div>
          <span>Muito Negativo</span>
        </div>
        <div className="flex items-center mr-2 mb-1">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
          <span>Negativo</span>
        </div>
        <div className="flex items-center mr-2 mb-1">
          <div className="w-3 h-3 bg-ff6600 rounded-full mr-1"></div>
          <span>Palavra-chave</span>
        </div>
      </div>
    </div>
  );
};

export default WordCloudChart;
