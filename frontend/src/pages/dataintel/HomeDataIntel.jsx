import { useState, useMemo } from "react";
import {
  FiSearch,
  FiDatabase,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import { PiBuildingOffice } from "react-icons/pi";
import {
  databaseKPIs,
  searchExamples,
  getIntelligentSearchResults,
  getCategoryStats,
} from "../../utils/fakeData";

const HomeDataIntel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  const categoryStats = useMemo(() => {
    if (searchResults.length === 0) return {};
    return getCategoryStats(searchResults);
  }, [searchResults]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);

    // Simular delay da IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = getIntelligentSearchResults(searchTerm);
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleExampleClick = (example) => {
    setSearchTerm(example.example);
    setSelectedExample(example);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Dados Pessoais": FiUsers,
      "Violações de Trânsito": FiShield,
      "Dados Financeiros": FiTrendingUp,
      Propriedades: PiBuildingOffice,
      Veículos: PiBuildingOffice,
      "Processos Judiciais": FiShield,
      "Redes Sociais": FiUsers,
      "Dados Familiares": FiUsers,
    };
    return icons[category] || FiDatabase;
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Intelligence IA
        </h1>
        <p className="text-gray-600">
          Sistema inteligente de busca e análise de dados em múltiplas bases
          conectadas
        </p>
      </div>

      {/* KPIs das Bases de Dados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bases Conectadas
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {databaseKPIs.connectedDatabases}
              </p>
            </div>
            <FiDatabase className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Registros
              </p>
              <p className="text-3xl font-bold text-green-600">
                {(databaseKPIs.totalRecords / 1000000).toFixed(1)}M
              </p>
            </div>
            <FiTrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                CPFs Cadastrados
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {(databaseKPIs.breakdown.cpf / 1000000).toFixed(1)}M
              </p>
            </div>
            <FiUsers className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CNPJs Ativos</p>
              <p className="text-3xl font-bold text-orange-600">
                {(databaseKPIs.breakdown.cnpj / 100000).toFixed(0)}M
              </p>
            </div>
            <PiBuildingOffice className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Breakdown Detalhado dos Dados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Distribuição dos Dados nas Bases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(databaseKPIs.breakdown.genderMale / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Gênero Masculino</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {(databaseKPIs.breakdown.genderFemale / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Gênero Feminino</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {(databaseKPIs.breakdown.cellphones / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-gray-600">Celulares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {(databaseKPIs.breakdown.emails / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-gray-600">Emails</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {(databaseKPIs.breakdown.criminalRecords / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Registros Criminais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(databaseKPIs.breakdown.properties / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Propriedades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {(databaseKPIs.breakdown.vehicles / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Veículos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(databaseKPIs.breakdown.adicto / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Adictos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(databaseKPIs.breakdown.dopaminado / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Dopaminados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(databaseKPIs.breakdown.ludopata / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Ludópatas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(databaseKPIs.breakdown.peps / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-gray-600">PEPs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(databaseKPIs.breakdown.sancionados / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-gray-600">Sancionados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(databaseKPIs.breakdown.obitos / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Óbitos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {(databaseKPIs.breakdown.redesSociais / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Redes Sociais</div>
          </div>
        </div>
      </div>

      {/* Barra de Busca com IA */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Busca Inteligente com IA
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Digite sua consulta em linguagem natural... Ex: 'Busque violações de trânsito do CPF 123.456.789-00'"
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            <FiSearch
              className="absolute left-3 top-5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Botão de Busca */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors text-lg font-medium"
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="animate-spin" size={20} />
                <span>IA Analisando...</span>
              </>
            ) : (
              <>
                <FiSearch size={20} />
                <span>Buscar com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Exemplos de Busca */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Exemplos de consultas para teste:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900 text-sm">
                  {example.title}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {example.description}{" "}
                  <span className="font-mono text-blue-600">
                    {example.example}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
          <FiRefreshCw
            className="animate-spin mx-auto text-blue-600 mb-4"
            size={48}
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            IA Processando sua Consulta
          </h3>
          <p className="text-gray-600">
            Analisando {databaseKPIs.connectedDatabases} bases de dados
            conectadas...
          </p>
        </div>
      )}

      {/* Resultados da Busca */}
      {searchResults.length > 0 && !isLoading && (
        <div className="space-y-6">
          {/* Estatísticas dos Resultados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Resumo dos Resultados Encontrados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div
                  key={category}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.count}
                  </div>
                  <div className="text-sm text-gray-600">{category}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.avgConfidence}% confiança média
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Resultados */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Dados Encontrados ({searchResults.length} registros)
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Consulta: "{searchTerm}"
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confiança
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atualização
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((result) => {
                    const IconComponent = getCategoryIcon(result.category);
                    return (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <IconComponent
                              className="text-gray-400 mr-2"
                              size={16}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {result.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {result.field}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {result.value}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {result.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                              result.confidence
                            )}`}
                          >
                            {result.confidence}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {result.verified ? (
                            <div className="flex items-center text-green-600">
                              <FiCheckCircle size={16} className="mr-1" />
                              <span className="text-xs">Verificado</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <FiAlertCircle size={16} className="mr-1" />
                              <span className="text-xs">Pendente</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(result.lastUpdate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ações dos Resultados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Ações Disponíveis</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <FiEye size={16} />
                <span>Exportar Relatório</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <FiDatabase size={16} />
                <span>Salvar Consulta</span>
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                <FiTrendingUp size={16} />
                <span>Análise Avançada</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado Vazio - Nenhum Resultado */}
      {!isLoading && searchResults.length === 0 && searchTerm && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            A IA não encontrou informações para "{searchTerm}" nas bases
            conectadas.
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-2">Dicas para melhorar sua busca:</p>
            <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
              <li>
                Use termos mais específicos como CPF, CNPJ ou nome completo
              </li>
              <li>Experimente diferentes variações da consulta</li>
              <li>Verifique se os dados estão formatados corretamente</li>
            </ul>
          </div>
        </div>
      )}

      {/* Estado Inicial */}
      {!searchTerm && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiDatabase className="mx-auto text-blue-600 mb-4" size={64} />
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            Sistema de Inteligência de Dados
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nossa IA está conectada a {databaseKPIs.connectedDatabases} bases de
            dados com mais de {(databaseKPIs.totalRecords / 1000000).toFixed(1)}{" "}
            milhões de registros. Faça consultas em linguagem natural e obtenha
            informações precisas e organizadas.
          </p>

          {/* Recursos Disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <FiUsers className="mx-auto text-blue-600 mb-3" size={32} />
              <h4 className="font-semibold text-gray-900 mb-2">
                Dados Pessoais
              </h4>
              <p className="text-sm text-gray-600">
                CPF, RG, dados eleitorais, histórico familiar e informações
                cadastrais
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <PiBuildingOffice
                className="mx-auto text-green-600 mb-3"
                size={32}
              />
              <h4 className="font-semibold text-gray-900 mb-2">
                Dados Empresariais
              </h4>
              <p className="text-sm text-gray-600">
                CNPJ, sócios, atividades, situação fiscal e histórico
                empresarial
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <FiShield className="mx-auto text-purple-600 mb-3" size={32} />
              <h4 className="font-semibold text-gray-900 mb-2">
                Registros Legais
              </h4>
              <p className="text-sm text-gray-600">
                Processos judiciais, violações de trânsito, registros criminais
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Privacidade */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="flex items-start space-x-3">
          <FiShield className="text-green-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Privacidade e Segurança dos Dados
            </h3>
            <p className="text-sm text-gray-600">
              Todas as consultas são realizadas em bases de dados públicas e
              seguem rigorosamente a Lei Geral de Proteção de Dados (LGPD). Os
              dados são criptografados e as consultas são registradas para
              auditoria. Utilizamos apenas informações de fontes oficiais e
              autorizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDataIntel;
