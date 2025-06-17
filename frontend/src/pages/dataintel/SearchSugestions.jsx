import React from "react";
import { FiSearch, FiUser, FiBuilding } from "react-icons/fi";

const SearchSuggestions = ({ suggestions, onSuggestionClick, searchTerm }) => {
  if (!suggestions || suggestions.length === 0) return null;

  const getSearchTypeIcon = (suggestion) => {
    const cleanSuggestion = suggestion.replace(/\D/g, "");
    if (cleanSuggestion.length === 11)
      return <FiUser className="text-blue-500" size={16} />;
    if (cleanSuggestion.length === 14)
      return <FiBuilding className="text-green-500" size={16} />;
    return <FiSearch className="text-gray-500" size={16} />;
  };

  const getSearchTypeLabel = (suggestion) => {
    const cleanSuggestion = suggestion.replace(/\D/g, "");
    if (cleanSuggestion.length === 11) return "CPF";
    if (cleanSuggestion.length === 14) return "CNPJ";
    return "Nome";
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
      <div className="py-2">
        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
          Sugestões de Busca
        </div>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            {getSearchTypeIcon(suggestion)}
            <div className="flex-1">
              <div className="text-sm text-gray-900">
                {highlightMatch(suggestion, searchTerm)}
              </div>
              <div className="text-xs text-gray-500">
                {getSearchTypeLabel(suggestion)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
