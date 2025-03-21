// Utility functions for data processing and chart generation

export const generateWordcloudData = (scrapingResults, searchPhrases) => {
  if (!scrapingResults || !scrapingResults.results || !searchPhrases) return [];

  // Extrair as frases de busca
  const keywordsList = searchPhrases
    .split("\n")
    .map((phrase) => phrase.trim().toLowerCase())
    .filter((phrase) => phrase);

  // Se não houver palavras-chave, não podemos continuar
  if (keywordsList.length === 0) return [];

  // Mapear todas as ocorrências de palavras-chave nos textos
  const wordFrequency = {};
  const wordSentiment = {};

  scrapingResults.results.forEach((result) => {
    if (!result.texto) return;

    const text = result.texto.toLowerCase();

    // Gerar um valor de sentimento simulado para este texto
    // Na implementação real, você usaria o sentimento real do texto
    const textSentiment = Math.random() * 2 - 1; // Entre -1 e 1

    keywordsList.forEach((keyword) => {
      // Verificar se a palavra-chave está presente no texto
      if (text.includes(keyword)) {
        // Incrementar a contagem desta palavra
        wordFrequency[keyword] = (wordFrequency[keyword] || 0) + 1;

        // Atualizar o sentimento médio desta palavra
        if (!wordSentiment[keyword]) {
          wordSentiment[keyword] = textSentiment;
        } else {
          // Média ponderada do sentimento
          const prevCount = wordFrequency[keyword] - 1;
          wordSentiment[keyword] =
            (wordSentiment[keyword] * prevCount + textSentiment) /
            wordFrequency[keyword];
        }
      }
    });
  });

  // Converter para o formato esperado pela biblioteca react-wordcloud
  const cloudData = Object.keys(wordFrequency).map((word) => ({
    text: word,
    value: wordFrequency[word],
    sentiment: wordSentiment[word],
  }));

  // Ordenar por sentimento (mais negativo primeiro)
  cloudData.sort((a, b) => a.sentiment - b.sentiment);

  return cloudData;
};

export const generateSentimentData = () => {
  const numberOfPoints = 20; // Número de pontos no gráfico
  const dates = [];
  const sentiments = [];

  // Criar datas para os últimos 20 dias
  for (let i = 0; i < numberOfPoints; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (numberOfPoints - i - 1));
    dates.push(date.toLocaleDateString("pt-BR"));

    // Gerar valor de sentimento entre -1 e 1 com alguma suavidade
    // Usando uma função senoidal para criar uma curva suave
    const baseValue = Math.sin(i / 3) * 0.5;
    const randomFactor = (Math.random() - 0.5) * 0.4;
    const sentiment = baseValue + randomFactor;
    sentiments.push(sentiment.toFixed(2));
  }

  return {
    labels: dates,
    datasets: [
      {
        label: "Análise de Sentimentos",
        data: sentiments,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4, // Suavidade da linha
        pointRadius: 3,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p1.parsed.y;
            return value < 0
              ? "rgba(255, 99, 132, 1)"
              : "rgba(75, 192, 192, 1)";
          },
        },
        backgroundColor: (ctx) => {
          const ctx2d = ctx.chart.ctx;
          const gradient = ctx2d.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)"); // Verde para valores positivos
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
          gradient.addColorStop(1, "rgba(255, 99, 132, 0.5)"); // Vermelho para valores negativos
          return gradient;
        },
        fill: {
          target: "origin",
          above: "rgba(75, 192, 192, 0.3)", // Verde para valores acima de zero
          below: "rgba(255, 99, 132, 0.3)", // Vermelho para valores abaixo de zero
        },
      },
    ],
  };
};

export const generateScatterData = (scrapingResults) => {
  if (!scrapingResults || !scrapingResults.results) return null;

  // Extrair perfis únicos dos resultados
  const uniqueProfiles = [
    ...new Set(scrapingResults.results.map((r) => r.perfil)),
  ];

  const scatterPoints = uniqueProfiles.map((profile) => {
    // Filtrar resultados para este perfil
    const profileResults = scrapingResults.results.filter(
      (r) => r.perfil === profile
    );

    // Calcular frequência (número de posts)
    const frequency = profileResults.length;

    // Gerar um valor de sentimento médio simulado para este perfil
    // Na prática, isso seria calculado a partir dos sentimentos reais dos posts
    const sentimentAvg = (Math.random() * 2 - 1).toFixed(2);

    return {
      x: frequency,
      y: parseFloat(sentimentAvg),
      profile: profile,
    };
  });

  return {
    datasets: [
      {
        label: "Relação Frequência x Sentimento",
        data: scatterPoints,
        backgroundColor: (context) => {
          const value = context.raw.y;
          if (value < -0.7) return "rgba(255, 0, 0, 0.8)"; // Muito negativo
          if (value < -0.3) return "rgba(255, 99, 132, 0.8)"; // Negativo
          if (value < 0.3) return "rgba(180, 180, 180, 0.8)"; // Neutro
          if (value < 0.7) return "rgba(75, 192, 192, 0.8)"; // Positivo
          return "rgba(0, 128, 0, 0.8)"; // Muito positivo
        },
        pointRadius: (point) => 5 + point.raw.x / 2, // Tamanho do ponto baseado na frequência
        pointHoverRadius: 10,
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 1,
      },
    ],
  };
};

export const prepareDownloadContent = (scrapingResults, format) => {
  if (!scrapingResults) return { content: "", filename: "" };

  let content = "";
  let filename = "";

  if (format === "CSV") {
    // Create CSV content
    const headers = [
      "platform",
      "profile",
      "content",
      "date",
      "likes",
      "comments",
      "shares",
    ];
    content = [
      headers.join(","),
      ...scrapingResults.posts.map((post) =>
        headers.map((header) => `"${post[header] || ""}"`).join(",")
      ),
    ].join("\n");

    filename = "scraping-results.csv";
  } else {
    // JSON format
    content = JSON.stringify(scrapingResults, null, 2);
    filename = "scraping-results.json";
  }

  return { content, filename };
};
