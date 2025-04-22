import React, { useState, useEffect } from "react";

const FraudAlertPanel = ({ isLoading }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate fetching high priority alerts
    setTimeout(() => {
      setAlerts([
        {
          id: "FA001",
          type: "Match Fixing",
          event: "Flamengo vs Corinthians",
          timestamp: "2023-10-15 15:42:18",
          description:
            "Padrão anormal de apostas detectado em cartões amarelos",
          severity: "Alta",
          status: "Não Resolvido",
        },
        {
          id: "FA002",
          type: "Arbitragem",
          event: "PSG vs Manchester City",
          timestamp: "2023-10-14 16:35:22",
          description: "Exploração de diferenças de odds entre operadores",
          severity: "Alta",
          status: "Em Análise",
        },
        {
          id: "FA003",
          type: "Multi-Contas",
          event: "Múltiplos Eventos",
          timestamp: "2023-10-15 09:12:45",
          description: "Usuário detectado usando 8 contas diferentes",
          severity: "Alta",
          status: "Não Resolvido",
        },
        {
          id: "FA004",
          type: "Apostas Suspeitas",
          event: "Lakers vs Warriors",
          timestamp: "2023-10-10 22:48:33",
          description: "Padrão de apostas coordenadas em mercados específicos",
          severity: "Alta",
          status: "Resolvido",
        },
      ]);
    }, 1200);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Alertas de Alta Prioridade</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          {isLoading ? "..." : alerts.length} Alertas Ativos
        </span>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 ${
                alert.status === "Resolvido"
                  ? "border-green-500 bg-green-50"
                  : alert.status === "Em Análise"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
              } p-4 rounded-r-lg flex justify-between items-center`}
            >
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">
                    {alert.id}:
                  </span>
                  <span className="text-gray-800">{alert.type}</span>
                  <span
                    className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === "Resolvido"
                        ? "bg-green-100 text-green-800"
                        : alert.status === "Em Análise"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Evento:</span> {alert.event}
                </p>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Detectado em: {alert.timestamp}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Investigar
                </button>
                {alert.status !== "Resolvido" && (
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Marcar Resolvido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
          Ver todos os alertas →
        </button>
      </div>
    </div>
  );
};

export default FraudAlertPanel;
