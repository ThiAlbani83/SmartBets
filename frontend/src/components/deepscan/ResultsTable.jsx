import React from "react";

const ResultsTable = ({ results }) => {
  return (
    <div className="flex-1 overflow-auto">
      <table className="min-w-full h-[650px] bg-white border border-gray-200">
        <thead className="sticky top-0 bg-white">
          <tr>
            <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plataforma
            </th>
            <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perfil
            </th>
            <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conteúdo
            </th>
            <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Link
            </th>
            <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sentimento
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {results.map((result, index) => {
            // Gerar um valor de sentimento simulado para cada resultado
            const sentimentValue = parseFloat(
              (Math.random() * 2 - 1).toFixed(2)
            );
            let sentimentClass = "bg-gray-100 text-gray-800"; // Neutro
            let sentimentText = "Neutro";

            if (sentimentValue > 0.3) {
              sentimentClass = "bg-green-100 text-green-800";
              sentimentText =
                sentimentValue > 0.7 ? "Muito Positivo" : "Positivo";
            } else if (sentimentValue < -0.3) {
              sentimentClass = "bg-red-100 text-red-800";
              sentimentText =
                sentimentValue < -0.7 ? "Muito Negativo" : "Negativo";
            }

            return (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {result.plataforma}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{result.perfil}</td>
                <td className="px-4 py-2 flex-1">
                  <div className="max-h-24 overflow-y-auto text-sm text-gray-700">
                    {result.texto}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div>{result.link}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sentimentClass}`}
                  >
                    {sentimentText} ({sentimentValue})
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
