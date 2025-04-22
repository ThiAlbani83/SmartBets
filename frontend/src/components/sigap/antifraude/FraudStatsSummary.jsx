import React from "react";

const FraudStatsSummary = ({ stats, isLoading }) => {
  const statItems = [
    {
      title: "Total de Alertas",
      value: stats.totalAlerts,
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Alertas de Alto Risco",
      value: stats.highRiskAlerts,
      bgColor: "bg-red-500",
      textColor: "text-red-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      title: "Alertas de Médio Risco",
      value: stats.mediumRiskAlerts,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Alertas de Baixo Risco",
      value: stats.lowRiskAlerts,
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Alertas Resolvidos",
      value: stats.resolvedAlerts,
      bgColor: "bg-purple-500",
      textColor: "text-purple-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex items-center"
        >
          <div
            className={`p-3 rounded-full ${item.bgColor} bg-opacity-10 mr-4`}
          >
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{item.title}</p>
            {isLoading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FraudStatsSummary;
