import React, { useState } from "react";

const DeepScanForm = ({
  profiles,
  setProfiles,
  searchPhrases,
  setSearchPhrases,
  selectedPlatforms,
  setSelectedPlatforms,
  format,
  setFormat,
  handleSubmit,
  isLoading,
}) => {
  const platformOptions = [
    { value: "Instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "Telegram", label: "Telegram" },
  ];

  const handlePlatformChange = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="bg-gray-100 px-6 py-4 rounded-t-lg border-b">
        <h2 className="text-xl font-semibold">Configuração do Scraping</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="profiles"
            >
              Perfis (um por linha)
            </label>
            <textarea
              id="profiles"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={profiles}
              onChange={(e) => setProfiles(e.target.value)}
              placeholder="@usuario1&#10;@usuario2"
              required
            />
            <p className="text-gray-600 text-xs mt-1">
              Insira os nomes de usuário, um por linha
            </p>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="searchPhrases"
            >
              Frases de busca (opcional, uma por linha)
            </label>
            <textarea
              id="searchPhrases"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={searchPhrases}
              onChange={(e) => setSearchPhrases(e.target.value)}
              placeholder="frase1&#10;frase2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Plataformas
            </label>
            <div className="flex flex-wrap gap-4">
              {platformOptions.map((platform) => (
                <div key={platform.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${platform.value}`}
                    checked={selectedPlatforms.includes(platform.value)}
                    onChange={() => handlePlatformChange(platform.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`platform-${platform.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {platform.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="format"
            >
              Formato de Saída
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={
              isLoading || !profiles.trim() || selectedPlatforms.length === 0
            }
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading || !profiles.trim() || selectedPlatforms.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </div>
            ) : (
              "Iniciar Scraping"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeepScanForm;
