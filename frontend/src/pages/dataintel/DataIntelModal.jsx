import {
  FiX,
  FiExternalLink,
  FiCopy,
  FiDownload,
  FiShield,
  FiClock,
  FiDatabase,
} from "react-icons/fi";

const DataIntelModal = ({ isOpen, onClose, resultData }) => {
  if (!isOpen || !resultData) return null;

  const { details } = resultData;

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Você pode adicionar uma notificação aqui
  };

  const handleExportDetails = () => {
    const dataToExport = {
      ...resultData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data-intel-details-${resultData.id}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "baixo":
        return "bg-green-100 text-green-800";
      case "médio":
      case "medio":
        return "bg-yellow-100 text-yellow-800";
      case "alto":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FiDatabase className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes da Informação
              </h2>
              <p className="text-sm text-gray-500">
                {details?.metadata?.dataSource || resultData.source}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportDetails}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Exportar detalhes"
            >
              <FiDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Fechar"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FiShield className="mr-2 text-blue-600" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonte
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">
                    {resultData.source}
                  </span>
                  <button
                    onClick={() => handleCopyToClipboard(resultData.source)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {resultData.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confiança
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                    resultData.confidence
                  )}`}
                >
                  {resultData.confidence}%
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data/Hora
                </label>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-400" size={14} />
                  <span className="text-sm text-gray-900">
                    {formatDate(resultData.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Completo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Conteúdo Completo</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {details?.fullContent || resultData.content}
              </p>
            </div>
          </div>

          {/* Metadados */}
          {details?.metadata && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Metadados</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(details.metadata).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{value}</span>
                        <button
                          onClick={() => handleCopyToClipboard(value)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <FiCopy size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dados Específicos por Tipo */}
          {details?.electoralData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Dados Eleitorais</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(details.electoralData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <span className="text-sm text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {details?.companyData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Dados da Empresa</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(details.companyData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <span className="text-sm text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {details?.socialProfiles && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Perfis de Redes Sociais
              </h3>
              <div className="space-y-4">
                {details.socialProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        {profile.platform}
                      </h4>
                      {profile.profileUrl && (
                        <a
                          href={profile.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {Object.entries(profile).map(([key, value]) => {
                        if (key === "platform" || key === "profileUrl")
                          return null;
                        return (
                          <div key={key}>
                            <span className="text-gray-600">
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/([A-Z])/g, " $1")}
                              :
                            </span>
                            <span className="ml-1 text-gray-900">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details?.mentions && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Menções na Mídia</h3>
              <div className="space-y-4">
                {details.mentions.map((mention, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {mention.title}
                      </h4>
                      <a
                        href={mention.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiExternalLink size={16} />
                      </a>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {mention.snippet}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Fonte: {mention.source}</span>
                      <span>Data: {mention.date}</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          mention.sentiment === "Positivo"
                            ? "bg-green-100 text-green-800"
                            : mention.sentiment === "Negativo"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {mention.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dados Relacionados */}
          {details?.relatedData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Dados Relacionados</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {details.relatedData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {item.field}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {item.value}
                        </span>
                        <span className="text-xs text-gray-500">
                          Verificado em: {item.lastVerified}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fatores de Risco */}
          {details?.riskFactors && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Análise de Risco</h3>
              <div className="space-y-3">
                {details.riskFactors.map((risk, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {risk.factor}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(
                          risk.level
                        )}`}
                      >
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          {details?.additionalInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Informações Técnicas
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {details.additionalInfo.processingTime}
                    </div>
                    <div className="text-xs text-gray-600">
                      Tempo de Processamento
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {details.additionalInfo.dataQuality}
                    </div>
                    <div className="text-xs text-gray-600">
                      Qualidade dos Dados
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {details.additionalInfo.sources}
                    </div>
                    <div className="text-xs text-gray-600">
                      Fontes Consultadas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {details.additionalInfo.crossReferences}
                    </div>
                    <div className="text-xs text-gray-600">
                      Referências Cruzadas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Histórico de Votação (para dados eleitorais) */}
          {details?.votingHistory && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Histórico de Votação
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eleição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.votingHistory.map((vote, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vote.election}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vote.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vote.status === "Compareceu"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vote.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sócios (para dados empresariais) */}
          {details?.partners && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Quadro Societário</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPF
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualificação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.partners.map((partner, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {partner.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.cpf}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.qualificacao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {partner.participacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Experiência Profissional (para dados do LinkedIn) */}
          {details?.experience && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Experiência Profissional
              </h3>
              <div className="space-y-4">
                {details.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
                      <span className="text-sm text-gray-500">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Duração: {exp.duration}
                    </p>
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades (para dados do LinkedIn) */}
          {details?.skills && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-3">
                  {details.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm font-medium text-blue-900">
                        {skill.name}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {skill.endorsements} endorsements
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            ID: {resultData.id} | Processado em:{" "}
            {formatDate(resultData.timestamp)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiDownload size={16} />
              <span>Exportar</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataIntelModal;
