import React from "react";
import { FaFilter } from "react-icons/fa";

const TypeFilter = ({ onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  const filterOptions = [
    { id: "apostador", label: "Apostador" },
    { id: "aposta", label: "Aposta" },
    { id: "carteira", label: "Carteira" },
    { id: "jogo", label: "Jogo" },
    { id: "operador-diario", label: "Operador Diário" },
    { id: "operador-mensal", label: "Operador Mensal" },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-200">
        <FaFilter className="text-blue-600" />
        <h3 className="text-gray-800 font-medium">Filtrar por Tipo</h3>
      </div>

      <div className="space-y-3">
        {filterOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
          >
            <input
              type="radio"
              id={option.id}
              name="radioGroup"
              value={option.id}
              defaultChecked={option.id === "apostador"}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor={option.id}
              className="text-gray-700 cursor-pointer font-medium text-sm flex-1"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
