import React, { useState, useEffect } from "react";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";

const DataIntelFilters = ({ searchResults, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    sources: [],
    types: [],
    confidenceRange: [0, 100],
    dateRange: {
      start: "",
      end: "",
    },
  });

  // Extrair opções únicas dos resultados
  const availableSources = [...new Set(searchResults.map((r) => r.source))];
  const availableTypes = [...new Set(searchResults.map((r) => r.type))];

  useEffect(() => {
    // Aplicar filtros aos resultados
    const filteredResults = searchResults.filter((result) => {
      // Filtro por fonte
      if (
        filters.sources.length > 0 &&
        !filters.sources.includes(result.source)
      ) {
        return false;
      }

      // Filtro por tipo
      if (filters.types.length > 0 && !filters.types.includes(result.type)) {
        return false;
      }

      // Filtro por confiança
      if (
        result.confidence < filters.confidenceRange[0] ||
        result.confidence > filters.confidenceRange[1]
      ) {
        return false;
      }

      // Filtro por data
      if (filters.dateRange.start || filters.dateRange.end) {
        const resultDate = new Date(result.timestamp);
        const startDate = filters.dateRange.start
          ? new Date(filters.dateRange.start)
          : null;
        const endDate = filters.dateRange.end
          ? new Date(filters.dateRange.end)
          : null;

        if (startDate && resultDate < startDate) return false;
        if (endDate && resultDate > endDate) return false;
      }

      return true;
    });

    onFiltersChange(filters, filteredResults);
  }, [filters, searchResults, onFiltersChange]);

  const handleSourceChange = (source) => {
    setFilters((prev) => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source],
    }));
  };

  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleConfidenceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      confidenceRange:
        name === "minConfidence"
          ? [parseInt(value), prev.confidenceRange[1]]
          : [prev.confidenceRange[0], parseInt(value)],
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value,
      },
    }));
  };

  const clearFilters = () => {
    setFilters({
      sources: [],
      types: [],
      confidenceRange: [0, 100],
      dateRange: {
        start: "",
        end: "",
      },
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.sources.length > 0 ||
      filters.types.length > 0 ||
      filters.confidenceRange[0] > 0 ||
      filters.confidenceRange[1] < 100 ||
      filters.dateRange.start ||
      filters.dateRange.end
    );
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      fiscal: "Fiscal",
      eleitoral: "Eleitoral",
      empresarial: "Empresarial",
      societário: "Societário",
      social: "Redes Sociais",
      menções: "Menções",
      profissional: "Profissional",
      publicações: "Publicações",
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
          hasActiveFilters()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-600 text-white hover:bg-gray-700"
        }`}
      >
        <FiFilter size={16} />
        <span>Filtros</span>
        {hasActiveFilters() && (
          <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
            {filters.sources.length +
              filters.types.length +
              (filters.confidenceRange[0] > 0 ||
              filters.confidenceRange[1] < 100
                ? 1
                : 0) +
              (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
          </span>
        )}
        <FiChevronDown
          size={16}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Limpar
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Filtro por Fonte */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fontes de Dados
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableSources.map((source) => (
                  <label key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.sources.includes(source)}
                      onChange={() => handleSourceChange(source)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de Dados
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {getTypeLabel(type)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Confiança */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Confiança
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    name="minConfidence"
                    min="0"
                    max="100"
                    value={filters.confidenceRange[0]}
                    onChange={handleConfidenceChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Máximo
                  </label>
                  <input
                    type="number"
                    name="maxConfidence"
                    min="0"
                    max="100"
                    value={filters.confidenceRange[1]}
                    onChange={handleConfidenceChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Atual: {filters.confidenceRange[0]}% -{" "}
                {filters.confidenceRange[1]}%
              </div>
            </div>

            {/* Filtro por Data */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    name="start"
                    value={filters.dateRange.start}
                    onChange={handleDateChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    name="end"
                    value={filters.dateRange.end}
                    onChange={handleDateChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntelFilters;
