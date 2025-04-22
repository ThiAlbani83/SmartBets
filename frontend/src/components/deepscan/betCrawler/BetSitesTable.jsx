import React from "react";

const BetSitesTable = ({ results }) => {
  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "Alto":
        return "bg-red-100 text-red-800 border-red-200";
      case "Médio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixo":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Resultados da Varredura ({results.length} casas de apostas detectadas)
        </h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Casa de Apostas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Presença Digital
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Informações Legais
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Métodos de Pagamento
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Avaliação de Risco
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {/* Casa de Apostas */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-1">
                      {row.name}
                    </span>
                    <a
                      href={`https://${row.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {row.domain}
                    </a>
                    <span className="text-xs text-gray-500 mt-1">
                      Criado em: {row.creationDate}
                    </span>
                  </div>
                </td>

                {/* Presença Digital */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {row.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 text-xs">
                      <div>
                        <span className="text-gray-500">Seguidores:</span>{" "}
                        <span className="font-medium text-gray-700">
                          {row.followers.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Posts:</span>{" "}
                        <span className="font-medium text-gray-700">
                          {row.posts}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Última atividade: {row.lastActivity}
                    </div>
                  </div>
                </td>

                {/* Informações Legais */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">CNPJ:</span>{" "}
                      <span className="text-xs font-medium text-gray-700">
                        {row.cnpj}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status:</span>{" "}
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                        {row.status}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Métodos de Pagamento */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Gateways:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {row.gateways.map((gateway) => (
                          <span
                            key={gateway}
                            className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {gateway}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Bancos:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {row.banks.map((bank) => (
                          <span
                            key={bank}
                            className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200"
                          >
                            {bank}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Avaliação de Risco */}
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center justify-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full border font-medium ${getRiskBadgeColor(
                        row.risk
                      )}`}
                    >
                      Risco {row.risk}
                    </span>

                    {/* Indicador visual de risco */}
                    <div className="w-full mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          row.risk === "Alto"
                            ? "bg-red-500 w-full"
                            : row.risk === "Médio"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-1/3"
                        }`}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetSitesTable;
