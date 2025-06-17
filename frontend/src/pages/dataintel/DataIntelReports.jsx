import React, { useState } from "react";
import { FiDownload, FiMail, FiPrinter, FiShare2 } from "react-icons/fi";
import { generateSearchReport } from "../utils/fakeData";

const DataIntelReports = ({ searchResults, matrixResults, searchTerm }) => {
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);

    // Simular tempo de geração
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const report = generateSearchReport(
      searchResults,
      matrixResults,
      searchTerm
    );
    setReportData(report);
    setIsGenerating(false);
  };

  const downloadReport = (format) => {
    if (!reportData) return;

    let content, filename, mimeType;

    switch (format) {
      case "pdf":
        // Em uma implementação real, você usaria uma biblioteca como jsPDF
        content = JSON.stringify(reportData, null, 2);
        filename = `relatorio-${searchTerm}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        mimeType = "application/pdf";
        break;
      case "json":
        content = JSON.stringify(reportData, null, 2);
        filename = `relatorio-${searchTerm}-${
          new Date().toISOString().split("T")[0]
        }.json`;
        mimeType = "application/json";
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!searchResults.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Relatório de Análise
      </h3>

      {!reportData ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 mb-4">
            Gere um relatório completo da sua busca
          </p>
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </button>
        </div>
      ) : (
        <div>
          {/* Resumo Executivo */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Resumo Executivo</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.executive_summary.total_results}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total de Resultados
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.executive_summary.high_confidence}
                  </div>
                  <div className="text-sm text-gray-600">Alta Confiança</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {reportData.executive_summary.sources_count}
                  </div>
                  <div className="text-sm text-gray-600">
                    Fontes Consultadas
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {reportData.executive_summary.avg_confidence}%
                  </div>
                  <div className="text-sm text-gray-600">Confiança Média</div>
                </div>
              </div>
            </div>
          </div>

          {/* Principais Descobertas */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Principais Descobertas
            </h4>
            <div className="space-y-3">
              {reportData.key_findings.map((finding, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {finding.title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {finding.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {finding.confidence}% confiança
                      </span>
                      <span className="text-xs text-gray-500">
                        Fonte: {finding.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Análise de Riscos */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Análise de Riscos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-medium text-red-800">Alto Risco</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {reportData.risk_analysis.high}
                </div>
                <p className="text-sm text-red-700">Itens identificados</p>
              </div>

              <div className="p-4 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="font-medium text-yellow-800">
                    Médio Risco
                  </span>
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {reportData.risk_analysis.medium}
                </div>
                <p className="text-sm text-yellow-700">Itens identificados</p>
              </div>

              <div className="p-4 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-green-800">
                    Baixo Risco
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {reportData.risk_analysis.low}
                </div>
                <p className="text-sm text-green-700">Itens identificados</p>
              </div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Recomendações</h4>
            <div className="space-y-2">
              {reportData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ações de Relatório */}
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadReport("pdf")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <FiDownload size={16} />
                <span>PDF</span>
              </button>

              <button
                onClick={() => downloadReport("json")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FiDownload size={16} />
                <span>JSON</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FiPrinter size={16} />
                <span>Imprimir</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Relatório Data Intel - ${searchTerm}`,
                      text: `Relatório de análise para ${searchTerm}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FiShare2 size={16} />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => {
                  const subject = `Relatório Data Intel - ${searchTerm}`;
                  const body = `Segue relatório de análise para ${searchTerm}.\n\nResumo:\n- Total de resultados: ${reportData.executive_summary.total_results}\n- Confiança média: ${reportData.executive_summary.avg_confidence}%\n- Fontes consultadas: ${reportData.executive_summary.sources_count}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(
                    subject
                  )}&body=${encodeURIComponent(body)}`;
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FiMail size={16} />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Metadados do Relatório */}
          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-medium">Gerado em:</span>
                <br />
                {new Date(reportData.metadata.generated_at).toLocaleString(
                  "pt-BR"
                )}
              </div>
              <div>
                <span className="font-medium">Versão:</span>
                <br />
                {reportData.metadata.version}
              </div>
              <div>
                <span className="font-medium">Tempo de análise:</span>
                <br />
                {reportData.metadata.analysis_time}
              </div>
              <div>
                <span className="font-medium">ID do relatório:</span>
                <br />
                {reportData.metadata.report_id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntelReports;
