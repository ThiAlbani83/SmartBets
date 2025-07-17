import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { FiCalendar, FiUser } from "react-icons/fi";
import { rootUrl } from "./utils/url.js";

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

    const X_API_Key = "bbcc2ed2-3d95-42ea-a3d4-8006975f2f63";
    const X_API_Secret = "7e0b9539-4fa3-4411-a234-e781dc125c72";


    const navigate = useNavigate();
    const [filteredResults, setFilteredResults] = useState(scrapingResults);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRedeSocial, setSelectedRedeSocial] = useState("Todas");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Extrair redes sociais únicas para o filtro
    const redesSociais = ["Todas", "Twitter", "Instagram", "Google"];

    const [sentimentoDistribution, setSentimentoDistribution] = useState({});

    // Função para navegar para a tela de agendamento com perfil pré-preenchido
    const handleScheduleMonitoring = (profileName, platform = "Instagram") => {
        navigate("/deepscan/agendamentos", {
            state: {
                prefilledProfile: profileName,
                prefilledPlatform: platform,
            },
        });
    };

    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                // Verificar se o perfil é fornecido, se sim, incluir na URL da requisição
                const perfilParam = searchTerm ? `&perfil=${searchTerm}` : "";
                const platformParam =
                    selectedRedeSocial !== "Todas"
                        ? `platform=${selectedRedeSocial}`
                        : "";

                const response = await fetch(
                    `${rootUrl}/data/sentiment/counts?${platformParam}${perfilParam}`,
                    {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "X-API-Key": X_API_Key,
                            "X-API-Secret": X_API_Secret,
                        },
                    }
                );
                const data = await response.json();
                const sentimentCounts = data.distribution.reduce((acc, item) => {
                    acc[item.sentiment] = item.count;
                    return acc;
                }, {});
                setSentimentoDistribution(sentimentCounts);
            } catch (error) {
                console.error("Erro ao buscar dados de sentimentos:", error);
            }
        };

        fetchSentimentData();
    }, [selectedRedeSocial, searchTerm]);

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const response = await fetch(
                    `${rootUrl}/data/filter?page=1&limit=1000&platform=${selectedRedeSocial !== "Todas" ? selectedRedeSocial : ""
                    }&perfil=${searchTerm}`,
                    {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "X-API-Key": X_API_Key,
                            "X-API-Secret": X_API_Secret,
                        },
                    }
                );
                const data = await response.json();
                console.log(data)
                setFilteredResults(data.data); // Atualizar a tabela com os dados retornados
            } catch (error) {
                console.error("Erro ao buscar dados da tabela:", error);
            }
        };

        fetchTableData();
    }, [selectedRedeSocial, searchTerm]); // Recarregar sempre que o filtro de rede social ou perfil mudar

    // Função para ordenar resultados
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Calculate the actual filtered results that will be displayed
    const displayedResults = filteredResults.filter(
        (result) =>
            !searchTerm ||
            (result.perfil &&
                result.perfil.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                </div>

                {/* Botão de Agendar Monitoramento - Aparece quando há um perfil pesquisado */}
                {searchTerm && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FiUser className="text-blue-600 mr-2" size={20} />
                                <div>
                                    <h3 className="text-sm font-medium text-blue-900">
                                        Monitorar perfil "{searchTerm}"
                                    </h3>
                                    <p className="text-xs text-blue-700">
                                        Configure um monitoramento automático para este perfil
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    handleScheduleMonitoring(
                                        searchTerm,
                                        selectedRedeSocial !== "Todas"
                                            ? selectedRedeSocial
                                            : "Instagram"
                                    )
                                }
                                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <FiCalendar className="mr-2" size={16} />
                                Agendar Monitoramento
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Estatísticas e Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            {searchTerm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Resultados ({displayedResults.length} postagens encontradas)
                        </h2>

                        {/* Botão adicional de agendamento na tabela */}
                        {displayedResults.length > 0 && (
                            <button
                                onClick={() =>
                                    handleScheduleMonitoring(
                                        searchTerm,
                                        selectedRedeSocial !== "Todas"
                                            ? selectedRedeSocial
                                            : "Instagram"
                                    )
                                }
                                className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                title="Agendar monitoramento contínuo para este perfil"
                            >
                                <FiCalendar className="mr-2" size={14} />
                                Monitorar Perfil
                            </button>
                        )}
                    </div>

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
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedResults.map((result, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {result.perfil}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {result.plataforma}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.sentimento === "positivo"
                                                    ? "bg-green-100 text-green-800"
                                                    : result.sentimento === "negativo"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {result.sentimento}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a
                                                href={result.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() =>
                                                    handleScheduleMonitoring(
                                                        result.perfil,
                                                        result.plataforma
                                                    )
                                                }
                                                className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                                title="Agendar monitoramento para este perfil"
                                            >
                                                <FiCalendar className="mr-1" size={12} />
                                                Monitorar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Dicas de Uso */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    Como usar o Monitoramento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">1</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Busque um Perfil
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Digite o nome do perfil que deseja monitorar no campo de busca
                                    acima.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">2</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Analise os Resultados
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Visualize as postagens encontradas e analise os sentimentos
                                    detectados.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-sm">3</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Configure o Monitoramento
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Clique em "Agendar Monitoramento" para configurar alertas
                                    automáticos.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-sm">4</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Receba Alertas
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Seja notificado automaticamente sobre novas atividades do
                                    perfil monitorado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrapeDeepScan;
