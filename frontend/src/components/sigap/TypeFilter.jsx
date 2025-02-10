import React from "react";
import filter from "../../assets/filter.png";

const TypeFilter = ({ onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[170px] h-full pr-4 border-r border-r-linesAndBorders">
      <div className="flex items-center gap-2 mb-4">
        <img src={filter} alt="filter" />
        <span className="text-mainText">Filtro</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="apostador"
          name="radioGroup"
          value="apostador"
          defaultChecked
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="apostador" className="text-mainText">
          Apostador
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="aposta"
          name="radioGroup"
          value="aposta"
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="aposta" className="text-mainText">
          Aposta
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="carteira"
          name="radioGroup"
          value="carteira"
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="carteira" className="text-mainText">
          Carteira
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="jogo"
          name="radioGroup"
          value="jogo"
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="jogo" className="text-mainText">
          Jogo
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="operador-diario"
          name="radioGroup"
          value="operador-diario"
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="operador-diario" className="text-mainText">
          Operador Diário
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="operador-mensal"
          name="radioGroup"
          value="operador-mensal"
          onChange={handleChange}
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="operador-mensal" className="text-mainText">
          Operador Mensal
        </label>
      </div>
    </div>
  );
};

export default TypeFilter;
