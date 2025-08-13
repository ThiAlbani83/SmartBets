import React, { useState } from "react";

const BetSitesTable = ({ results }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleBacenClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleRFClick = (row) => {
    // Lógica para enviar para Receita Federal
    console.log("Enviando para Receita Federal:", row);
    alert("Dados enviados para a Receita Federal!");
  };

  const handleSendToBacen = () => {
    // Lógica para enviar para o Banco Central
    console.log("Enviando para Banco Central:", selectedRow);
    alert("Dados enviados para o Banco Central!");
    setModalOpen(false);
  };

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
                API
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
                      Influenciadores: {row.influenciadores}
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

                {/* API */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleBacenClick(row)}
                      className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      BACEN
                    </button>
                    <button
                      onClick={() => handleRFClick(row)}
                      className="px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      RF
                    </button>
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

      {/* Modal BACEN */}
      {modalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setModalOpen(false)}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Enviar para Banco Central (BACEN)
                    </h3>

                    {/* Informações da casa de apostas */}
                    <div className="mt-2 space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Casa de Apostas
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedRow.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {selectedRow.domain}
                        </p>
                        <p className="text-xs text-gray-500">
                          Criado em: {selectedRow.creationDate}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">
                          Presença Digital
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRow.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Seguidores: {selectedRow.followers.toLocaleString()} |
                          Posts: {selectedRow.posts}
                        </p>
                        <p className="text-xs text-gray-500">
                          Influenciadores: {selectedRow.influenciadores} |
                          Última atividade: {selectedRow.lastActivity}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">
                          Informações Legais
                        </h4>
                        <p className="text-sm text-gray-600">
                          CNPJ: {selectedRow.cnpj}
                        </p>
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                          {selectedRow.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">
                          Métodos de Pagamento
                        </h4>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">Gateways:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedRow.gateways.map((gateway) => (
                              <span
                                key={gateway}
                                className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {gateway}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Bancos:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedRow.banks.map((bank) => (
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

                      <div>
                        <h4 className="font-medium text-gray-900">
                          Avaliação de Risco
                        </h4>
                        <span
                          className={`px-3 py-1 text-sm rounded-full border font-medium ${getRiskBadgeColor(
                            selectedRow.risk
                          )}`}
                        >
                          Risco {selectedRow.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSendToBacen}
                >
                  Enviar ao Banco Central
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSitesTable;
