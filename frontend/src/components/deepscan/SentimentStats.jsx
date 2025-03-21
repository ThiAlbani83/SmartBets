import React from "react";

const SentimentStats = ({ sentimentData }) => {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-green-600">
          {Math.round(
            (sentimentData.datasets[0].data.filter(
              (val) => parseFloat(val) > 0.3
            ).length /
              sentimentData.datasets[0].data.length) *
              100
          )}
          %
        </div>
        <div className="text-sm text-green-800">Menções Positivas</div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-red-600">
          {Math.round(
            (sentimentData.datasets[0].data.filter(
              (val) => parseFloat(val) < -0.3
            ).length /
              sentimentData.datasets[0].data.length) *
              100
          )}
          %
        </div>
        <div className="text-sm text-red-800">Menções Negativas</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-gray-600">
          {Math.round(
            (sentimentData.datasets[0].data.filter(
              (val) => parseFloat(val) >= -0.3 && parseFloat(val) <= 0.3
            ).length /
              sentimentData.datasets[0].data.length) *
              100
          )}
          %
        </div>
        <div className="text-sm text-gray-800">Menções Neutras</div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-blue-600">
          {parseFloat(
            sentimentData.datasets[0].data.reduce(
              (sum, val) => sum + parseFloat(val),
              0
            ) / sentimentData.datasets[0].data.length
          ).toFixed(2)}
        </div>
        <div className="text-sm text-blue-800">Sentimento Médio</div>
      </div>
    </div>
  );
};

export default SentimentStats;
