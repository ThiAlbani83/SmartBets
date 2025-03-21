import { useRef } from "react";
import jsPDF from "jspdf";

const PdfReportGenerator = ({
  selectedCompany,
  selectedDate,
  wordCloudData,
  wordDistributionData,
  sentimentData,
  stakeholderData,
  mediaData,
  profileBarData,
  nonCompliantPosts,
}) => {
  const generatePdfReport = () => {
    const pdf = new jsPDF();
    let yPos = 20;
    const lineHeight = 8;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add text with proper wrapping
    const addText = (text, fontSize = 12, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont("helvetica", "bold");
      } else {
        pdf.setFont("helvetica", "normal");
      }

      // Check if we need a new page
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }

      const splitText = pdf.splitTextToSize(text, contentWidth);
      pdf.text(splitText, margin, yPos);
      yPos += splitText.length * lineHeight;
      return yPos;
    };

    // Add title and header information
    addText(`RELATÓRIO DE DEEPSCAN - ${selectedCompany}`, 18, true);
    yPos += 5;
    addText(`Data da análise: ${selectedDate}`, 12);
    yPos += 10;

    // 1. Nuvem de Palavras section
    addText("1. ANÁLISE DE TERMOS RELEVANTES", 14, true);
    yPos += 5;
    addText(
      "As seguintes palavras apresentaram maior relevância nas redes sociais analisadas:"
    );

    if (wordCloudData && wordCloudData.length) {
      const sortedWordCloudData = [...wordCloudData].sort(
        (a, b) => b.value - a.value
      );
      let wordCloudText = "";
      sortedWordCloudData.forEach((word) => {
        wordCloudText += `• "${word.text}" - frequência relativa: ${word.value}\n`;
      });
      addText(wordCloudText);
    }
    yPos += 5;

    // 2. Distribuição por Rede Social
    addText("2. DISTRIBUIÇÃO DE TERMOS POR REDE SOCIAL", 14, true);
    yPos += 5;

    if (wordDistributionData && wordDistributionData.labels) {
      addText(
        "Os seguintes termos-chave foram detectados nas plataformas sociais:"
      );

      wordDistributionData.labels.forEach((platform, idx) => {
        addText(`\n${platform}:`, 12, true);
        wordDistributionData.datasets.forEach((dataset) => {
          addText(`• ${dataset.label}: ${dataset.data[idx]} menções`);
        });
      });
    }
    yPos += 10;

    // 3. Análise de Sentimento
    addText("3. ANÁLISE DE SENTIMENTO", 14, true);
    yPos += 5;

    if (sentimentData && sentimentData.datasets) {
      const totalSentiment = sentimentData.datasets[0].data.reduce(
        (a, b) => a + b,
        0
      );
      sentimentData.labels.forEach((label, idx) => {
        const percentage = Math.round(
          (sentimentData.datasets[0].data[idx] / totalSentiment) * 100
        );
        addText(`• ${label}: ${percentage}% das menções`);
      });
    }
    yPos += 10;

    // 4. Análise de Stakeholders
    addText("4. ANÁLISE DE STAKEHOLDERS: SENTIMENTO E IMPACTO", 14, true);
    yPos += 5;

    if (stakeholderData && stakeholderData.datasets) {
      stakeholderData.datasets[0].data.forEach((item) => {
        addText(`• ${item.label}:`, 12, true);
        addText(`  - Impacto: ${item.x}/10`);
        addText(`  - Sentimento: ${item.y}/10`);
        addText(`  - Relevância: ${item.r} (escala relativa)`);
      });
    }
    yPos += 10;

    // 5. Análise de Mídias
    addText("5. ANÁLISE DE MÍDIAS: SENTIMENTO E IMPACTO", 14, true);
    yPos += 5;

    if (mediaData && mediaData.datasets) {
      mediaData.datasets[0].data.forEach((item) => {
        addText(`• ${item.label}:`, 12, true);
        addText(`  - Impacto: ${item.x}/10`);
        addText(`  - Sentimento: ${item.y}/10`);
        addText(`  - Alcance: ${item.r} (escala relativa)`);
      });
    }
    yPos += 10;

    // 6. Perfis com Maior Incidência
    addText("6. PERFIS COM MAIOR INCIDÊNCIA DE PALAVRAS PROIBIDAS", 14, true);
    yPos += 5;

    if (profileBarData && profileBarData.labels) {
      profileBarData.labels.forEach((profile, idx) => {
        addText(
          `• ${profile}: ${profileBarData.datasets[0].data[idx]} palavras proibidas`
        );
      });
    }
    yPos += 10;

    // 7. Posts em Disconformidade
    addText("7. POSTS EM DISCONFORMIDADE COM REGULAÇÕES", 14, true);
    yPos += 5;

    if (nonCompliantPosts && nonCompliantPosts.length) {
      nonCompliantPosts.forEach((post, index) => {
        if (index < 15) {
          // Limiting to prevent overly long reports
          addText(`• Plataforma: ${post.platform}`, 12, true);
          addText(`  URL: ${post.url}`);
          addText(`  Problema: ${post.issue}`);
          addText("");
        }
      });

      if (nonCompliantPosts.length > 15) {
        addText(
          `... e mais ${nonCompliantPosts.length - 15} posts identificados.`
        );
      }
    }

    // 8. Conclusão
    addText("8. CONCLUSÃO E RECOMENDAÇÕES", 14, true);
    yPos += 5;

    // Generate summary based on data
    if (
      profileBarData &&
      profileBarData.datasets &&
      sentimentData &&
      sentimentData.datasets
    ) {
      const totalProblematicWords = profileBarData.datasets[0].data.reduce(
        (sum, val) => sum + val,
        0
      );
      const mostProblematicProfile =
        profileBarData.labels[
          profileBarData.datasets[0].data.indexOf(
            Math.max(...profileBarData.datasets[0].data)
          )
        ];

      let recommendationText = `Este relatório identificou um total de ${totalProblematicWords} palavras potencialmente problemáticas `;
      recommendationText += `em ${profileBarData.labels.length} perfis analisados, com maior concentração no perfil ${mostProblematicProfile}. `;
      recommendationText += `Foram identificados ${
        nonCompliantPosts ? nonCompliantPosts.length : 0
      } posts em disconformidade com regulações, `;

      // Analyze sentiment data
      const totalSentiment = sentimentData.datasets[0].data.reduce(
        (a, b) => a + b,
        0
      );
      const positivePercentage = Math.round(
        (sentimentData.datasets[0].data[0] / totalSentiment) * 100
      );
      const negativePercentage = Math.round(
        (sentimentData.datasets[0].data[1] / totalSentiment) * 100
      );

      if (positivePercentage > negativePercentage) {
        recommendationText += `com um sentimento geral positivo (${positivePercentage}% das menções). `;
        recommendationText += `Recomenda-se manter o monitoramento ativo e realizar ajustes nos perfis problemáticos identificados.`;
      } else {
        recommendationText += `com um sentimento geral negativo (${negativePercentage}% das menções). `;
        recommendationText += `Recomenda-se ação imediata para remediar os problemas identificados, `;
        recommendationText += `especialmente nos perfis mais problemáticos, e implementar um plano de comunicação para melhorar a percepção pública.`;
      }

      addText(recommendationText);
    }

    // Add report footer
    yPos = 280;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Relatório gerado em ${new Date().toLocaleDateString()} - SmartBets DeepScan`,
      margin,
      yPos
    );

    // Save the PDF
    pdf.save(`DeepScan_${selectedCompany}_${selectedDate}.pdf`);
  };

  return (
    <button
      className="bg-primaryLight py-2 px-4 text-white rounded-lg"
      onClick={generatePdfReport}
    >
      Baixar Relatório
    </button>
  );
};

export default PdfReportGenerator;
