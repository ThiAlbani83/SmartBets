import React from "react";

const FilterPanel = ({
  timeRange,
  selectedSports,
  riskLevel,
  onTimeRangeChange,
  onSportsChange,
  onRiskLevelChange,
}) => {
  const timeRangeOptions = [
    { value: "24h", label: "Últimas 24 horas" },
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 90 dias" },
    { value: "custom", label: "Personalizado" },
  ];

  const sportOptions = [
    "Futebol",
    "Tênis",
    "Basquete",
    "Vôlei",
    "eSports",
    "MMA/UFC",
    "Boxe",
    "Fórmula 1",
  ];

  const riskLevelOptions = [
    { value: "all", label: "Todos os níveis" },
    { value: "high", label: "Alto risco" },
    { value: "medium", label: "Médio risco" },
    { value: "low", label: "Baixo risco" },
  ];

  const handleSportToggle = (sport) => {
    if (selectedSports.includes(sport)) {
      onSportsChange(selectedSports.filter((s) => s !== sport));
    } else {
      onSportsChange([...selectedSports, sport]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período de Tempo
          </label>
          <div className="flex flex-wrap gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onTimeRangeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {timeRange === "custom" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sports Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Esportes
          </label>
          <div className="flex flex-wrap gap-2">
            {sportOptions.map((sport) => (
              <button
                key={sport}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedSports.includes(sport)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleSportToggle(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Risco
          </label>
          <select
            value={riskLevel}
            onChange={(e) => onRiskLevelChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {riskLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Additional Filters (collapsed by default) */}
      <div className="mt-4">
        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Mostrar filtros avançados
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
