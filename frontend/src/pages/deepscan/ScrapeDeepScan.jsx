import React, { useState, useEffect } from "react";
import { scrapingResults } from "../../utils/fakeData.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Registrar os componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const ScrapeDeepScan = () => {
    const [filteredResults, setFilteredResults] = useState(scrapingResults);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRedeSocial, setSelectedRedeSocial] = useState("Todas");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


    // Extrair redes sociais únicas para o filtro
    const redesSociais = [
        "Todas",
        "Twitter",
        "Instagram",
        "Google"
    ];

    const [sentimentoDistribution, setSentimentoDistribution] = useState({});


    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                // Verificar se o perfil é fornecido, se sim, incluir na URL da requisição
                const perfilParam = searchTerm ? `&perfil=${searchTerm}` : "";
                const platformParam = selectedRedeSocial !== "Todas" ? `platform=${selectedRedeSocial}` : "";

                const response = await fetch(
                    `http://89.116.74.250:5001/api/v1/data/sentiment/counts?${platformParam}${perfilParam}`,
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'X-API-Key': 'c9f93bcc-4369-43de-9a00-6af58446935b',
                            'X-API-Secret': '74354ff0-2649-4af7-b71e-7086cc14978a',
                        },
                    }
                );
                const data = await response.json();
                const sentimentCounts = data.distribution.reduce(
                    (acc, item) => {
                        acc[item.sentiment] = item.count;
                        return acc;
                    },
                    {}
                );
                setSentimentoDistribution(sentimentCounts);
            } catch (error) {
                console.error("Erro ao buscar dados de sentimentos:", error);
            }
        };

        fetchSentimentData();
    }, [selectedRedeSocial, searchTerm]); // Adicione 'searchTerm' como dependência para atualizar os dados ao mudar o filtro


    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const response = await fetch(
                    `http://89.116.74.250:5001/api/v1/data/filter?page=1&limit=1000&platform=${selectedRedeSocial !== "Todas" ? selectedRedeSocial : ""}&perfil=${searchTerm}`,
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'X-API-Key': 'c9f93bcc-4369-43de-9a00-6af58446935b',
                            'X-API-Secret': '74354ff0-2649-4af7-b71e-7086cc14978a',
                        },
                    }
                );
                const data = await response.json();
                setFilteredResults(data.data);  // Atualizar a tabela com os dados retornados
            } catch (error) {
                console.error("Erro ao buscar dados da tabela:", error);
            }
        };

        fetchTableData();
    }, [selectedRedeSocial, searchTerm]);  // Recarregar sempre que o filtro de rede social ou perfil mudar



    // Função para ordenar resultados
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    // Preparar dados para o gráfico de distribuição de sentimentos
    const sentimentoData = {
        labels: Object.keys(sentimentoDistribution),
        datasets: [
            {
                data: Object.values(sentimentoDistribution),
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };


    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
            },
        },
    };

    return (
        <div className="mx-auto px-4 py-8 flex flex-col">
            <h1 className="text-3xl font-bold mb-6">Resultados de Scraping</h1>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o 'searchTerm', que agora serve para o filtro de perfil
                            placeholder="Buscar por perfil"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Empresa
                        </label>
                        <select
                            value={selectedEmpresa}
                            onChange={(e) => setSelectedEmpresa(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {empresas.map((empresa) => (
                                <option key={empresa} value={empresa}>
                                    {empresa}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rede Social
                        </label>
                        <select
                            value={selectedRedeSocial}
                            onChange={(e) => setSelectedRedeSocial(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {redesSociais.map((rede) => (
                                <option key={rede} value={rede}>
                                    {rede}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Violação
                        </label>
                        <select
                            value={selectedViolacao}
                            onChange={(e) => setSelectedViolacao(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Todas">Todas</option>
                            <option value="Com Violação">Com Violação</option>
                            <option value="Sem Violação">Sem Violação</option>
                        </select>
                    </div> */}
                </div>
            </div>

            {/* Estatísticas e Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Violações por Empresa</h2>
                    <div className="h-80">
                        <Bar data={violacoesEmpresaData} options={barOptions} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Violações por Rede Social
                    </h2>
                    <div className="h-80">
                        <Bar data={violacoesRedeSocialData} options={barOptions} />
                    </div>
                </div> */}
                <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Distribuição de Sentimentos
                    </h2>
                    <div className="h-80 flex justify-center">
                        <div className="w-1/3">
                            <Pie data={sentimentoData} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Resultados */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Resultados ({filteredResults.length} postagens encontradas)
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Perfil
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Plataforma
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Sentimento
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Link
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                            Data
                            </th>
                        </tr>
                        </thead>


                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredResults.map((result, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {result.perfil} {/* Adiciona a coluna de Perfil */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {result.plataforma}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {result.sentimento}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            Ver Post
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(result.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Detalhes das Violações */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Termos Proibidos Detectados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResults
                        .filter(
                            (result) =>
                                result.violacaoTermos &&
                                result.palavrasChaveEncontradas?.length > 0
                        )
                        .map((result, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <h3 className="font-medium text-gray-900 mb-2">
                                    {result.empresa} - {result.perfil}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {new Date(result.dataPostagem).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </p>
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Termos detectados:
                                    </span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {result.palavrasChaveEncontradas.map((termo, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                                            >
                                                {termo}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                                    {result.textoPostagem}
                                </p>
                                <a
                                    href={result.linkPostagem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Ver postagem original
                                </a>
                            </div>
                        ))}
                </div>
            </div> */}

            {/* Ações em Lote */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações em Lote</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // Lógica para exportar resultados
              alert("Exportando resultados...");
            }}
          >
            Exportar Resultados
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {
              // Lógica para gerar relatório
              alert("Gerando relatório...");
            }}
          >
            Gerar Relatório
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => {
              // Lógica para agendar monitoramento
              alert("Agendando monitoramento...");
            }}
          >
            Agendar Monitoramento
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => {
              // Lógica para notificar violações
              alert("Notificando violações...");
            }}
          >
            Notificar Violações
          </button>
        </div>
      </div> */}
        </div>
    );
};

export default ScrapeDeepScan;
