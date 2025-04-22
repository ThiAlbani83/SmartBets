import React from "react";

const ScanStatusPanel = ({ scanStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Varredura em andamento
            </h2>
            <p className="text-sm text-gray-600">
              Monitoramento contínuo de plataformas digitais
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas de varredura */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Sites analisados</p>
          <p className="text-2xl font-bold text-blue-800">
            {scanStats.sitesAnalyzed.toLocaleString()}
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <p className="text-sm text-indigo-600 font-medium">
            Perfis escaneados
          </p>
          <p className="text-2xl font-bold text-indigo-800">
            {scanStats.profilesScanned.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">
            Posts analisados
          </p>
          <p className="text-2xl font-bold text-purple-800">
            {scanStats.postsAnalyzed.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-sm text-green-600 font-medium">Última detecção</p>
          <p className="text-xl font-bold text-green-800">
            {scanStats.lastDetection || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanStatusPanel;
