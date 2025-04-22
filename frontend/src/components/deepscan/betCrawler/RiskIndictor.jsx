import React from "react";

const RiskIndicator = ({ risk }) => {
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
    <div className="flex flex-col items-center justify-center">
      <span
        className={`px-3 py-1 text-sm rounded-full border font-medium ${getRiskBadgeColor(
          risk
        )}`}
      >
        Risco {risk}
      </span>

      {/* Indicador visual de risco */}
      <div className="w-full mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            risk === "Alto"
              ? "bg-red-500 w-full"
              : risk === "Médio"
              ? "bg-yellow-500 w-2/3"
              : "bg-green-500 w-1/3"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default RiskIndicator;
