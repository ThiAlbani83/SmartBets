import React, { useState, useEffect } from "react";
import { useMemo } from "react";
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
import { FiCalendar, FiExternalLink, FiEye, FiLink, FiPlay, FiUser } from "react-icons/fi";
import { rootUrl } from "./utils/url.js";
import { key, secret } from "./utils/secret.js";
import { FiX } from "react-icons/fi";

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

const X_API_Key = key;
const X_API_Secret = secret;

const ScrapeDeepScan = () => {


    const navigate = useNavigate();
    const [filteredResults, setFilteredResults] = useState([]);

    const [profile, setProfile] = useState("");

    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState({ name: "" });
    const [showProfileModal, setShowProfileModal] = useState(false);


    const [keyWords, setKeyWords] = useState([]);
    const [newKeyword, setNewKeyword] = useState("");
    const [showKeywordModal, setShowKeywordModal] = useState(false);


    const [platforms, setPlatforms] = useState([]);
    const [newPlatform, setNewPlatform] = useState("");
    const [showPlatformModal, setShowPlatformModal] = useState(false);


    const [selectedRedeSocial, setSelectedRedeSocial] = useState("Todas");

    const [error, setError] = useState("");

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Extrair redes sociais únicas para o filtro
    const redesSociais = ["Todas", "Twitter", "Instagram", "Google", "Youtube"];

    const [sentimentoDistribution, setSentimentoDistribution] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


    const escapeRegExp = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function HighlightedText({ text, keywords }) {
        // memoriza a regex e o split para não recalcular em cada render
        const parts = useMemo(() => {
            if (!keywords.length) return [text];

            const pattern = keywords.map(escapeRegExp).join("|");
            const regex = new RegExp(`(${pattern})`, "gi");
            return text.split(regex);
        }, [text, keywords]);

        return (
            <>
                {parts.map((part, i) =>
                    keywords.some(kw => new RegExp(`^${escapeRegExp(kw)}$`, "i").test(part)) ? (
                        <span key={i} className="bg-yellow-200">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    }


    const handleAddProfile = () => {
        const name = newProfile.name.trim();
        if (!name) return;
        if (!profiles.includes(name)) {
            setProfiles(prev => [...prev, name]);
        }
        setNewProfile({ name: "" });
        setShowProfileModal(false);
    };

    // Handler para remover perfil
    const handleRemoveProfile = index => {
        setProfiles(prev => prev.filter((_, i) => i !== index));
    };



    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return;

        const keywordsToAdd = newKeyword
            .split(",")
            .map(k => k.trim())
            .filter(k => k.length > 0 && !keyWords.includes(k));

        if (keywordsToAdd.length > 0) {
            setKeyWords(prev => [...prev, ...keywordsToAdd]);
        }

        setNewKeyword("");
        setShowKeywordModal(false);
        setError("");
    };

    const handleRemoveKeyword = (index) => {
        setKeyWords(prev => prev.filter((_, i) => i !== index));
    };



    const handleAddPlatform = () => {
        if (newPlatform && !platforms.includes(newPlatform)) {
            setPlatforms(prev => [...prev, newPlatform]);
        }
        setNewPlatform("");
        setShowPlatformModal(false);
    };

    const handleRemovePlatform = index => {
        setPlatforms(prev => prev.filter((_, i) => i !== index));
    };



    // Função para navegar para a tela de agendamento com perfil pré-preenchido
    const handleScheduleMonitoring = (profileName, platform = "Instagram") => {
        navigate("/deepscan/agendamentos", {
            state: {
                prefilledProfile: profileName,
                prefilledPlatform: platform,
            },
        });
    };

    const fetchTableData = async (page = 1, limit = 1000) => {
        try {
            const params = new URLSearchParams();

            // backend: buildWhereClause({ platform, username, keywords, scrapeId })
            if (platforms.length) params.append("platform", platforms.join(","));
            if (profiles.length) params.append("username", profiles.join(","));
            if (keyWords.length) params.append("keywords", keyWords.join(","));

            params.append("page", page);
            params.append("limit", limit);

            const url = `${rootUrl}/data/filter?${params.toString()}`;

            const resp = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": X_API_Key,
                    "X-API-Secret": X_API_Secret,
                },
            });
            const json = await resp.json();
            setFilteredResults(json.data);
        } catch (err) {
            console.error("Erro ao buscar dados da tabela:", err);
        }
    };

    const handleSearch = () => {
        fetchTableData();
        fetchSentimentData();
    };


    const sentimentoData = useMemo(() => ({
        labels: Object.keys(sentimentoDistribution),
        datasets: [
            {
                data: Object.values(sentimentoDistribution),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(36, 228, 36, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(36, 228, 36, 1)",
                ],
                borderWidth: 1,
            },
        ],
    }), [sentimentoDistribution]);

    const fetchSentimentData = async () => {
        try {
            const params = new URLSearchParams();
            if (platforms.length) params.append("platform", platforms.join(","));
            if (profiles.length) params.append("username", profiles.join(","));
            if (keyWords.length) params.append("keywords", keyWords.join(","));

            const url = `${rootUrl}/data/sentiment/counts?${params.toString()}`;

            const resp = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": X_API_Key,
                    "X-API-Secret": X_API_Secret,
                },
            });
            const data = await resp.json();
            const distribution = data.distribution.reduce((acc, item) => {
                acc[item.sentiment] = item.count;
                return acc;
            }, {});
            setSentimentoDistribution(distribution);
        } catch (error) {
            console.error("Erro ao buscar dados de sentimentos:", error);
        }
    };


    useEffect(() => {
        handleSearch();
    }, []);


    // Calculate the actual filtered results that will be displayed
    const displayedResults = filteredResults.filter(
        (result) =>
            !profile ||
            (result.perfil &&
                result.perfil.toLowerCase().includes(profile.toLowerCase()))
    );

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

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="mx-auto px-4 py-8 flex flex-col">
            <h1 className="text-3xl font-bold mb-6">Resultados de Scraping</h1>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Filtros</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2">

                    {/* Perfis para Monitoramento */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Perfis para Monitoramento
                        </label>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-600">
                                    {profiles.length} perfil(is) adicionado(s)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(true)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    + Adicionar Perfil
                                </button>
                            </div>

                            {profiles.length > 0 ? (
                                <div className="space-y-2">
                                    {profiles.map((profile, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <span className="text-sm">{profile}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProfile(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remover perfil"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    Nenhum perfil adicionado ainda
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Palavras-chave */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Palavras-chave para Monitoramento
                        </label>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-600">
                                    {keyWords.length} palavra(s) adicionada(s)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowKeywordModal(true)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    + Adicionar Palavra-chave
                                </button>
                            </div>

                            {keyWords.length > 0 ? (
                                <div className="space-y-2">
                                    {keyWords.map((keyword, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <div className="flex items-center flex-1">
                                                <span className="text-sm mr-2">{keyword}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveKeyword(index)}
                                                className="text-red-500 hover:text-red-700 ml-2 p-1"
                                                title="Remover palavra-chave"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    Nenhuma palavra-chave adicionada ainda
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Plataformas para Monitoramento */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plataformas para Monitoramento
                        </label>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-600">
                                    {platforms.length} plataforma(s) adicionada(s)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowPlatformModal(true)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    + Adicionar Plataforma
                                </button>
                            </div>

                            {platforms.length > 0 ? (
                                <div className="space-y-2">
                                    {platforms.map((plat, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <span className="text-sm">{plat}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePlatform(idx)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remover plataforma"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    Nenhuma plataforma adicionada ainda
                                </div>
                            )}
                        </div>
                    </div>

                </div>


                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => handleSearch()}
                        // disabled={isScraping}
                        className={`flex items-center px-10 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                            }`}
                    >
                        <FiPlay className="mr-2" size={16} />
                        Buscar Resultados
                    </button>
                </div>
            </div>

            {/* Estatísticas e Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Distribuição de Sentimentos
                    </h2>
                    <div className="h-80 flex justify-center">
                        <div className="w-1/3">
                            <Pie
                                data={sentimentoData}
                                options={pieOptions}
                                redraw />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Resultados */}
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
                                    profile,
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

                <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
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
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.sentimento === "POSITIVO"
                                                ? "bg-green-100 text-green-800"
                                                : result.sentimento === "NEGATIVO"
                                                    ? "bg-red-100 text-red-800"
                                                    : result.sentimento === null ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {result.sentimento === null ? "N/A" : result.sentimento}
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
                                            onClick={() => {
                                                setSelectedItem(result);
                                                setShowModal(true);
                                            }}
                                            className="flex items-center px-2 py-1 text-xs rounded transition-colors duration-200 bg-green-100 text-green-700 hover:bg-green-200"
                                            title="Visualizar Resultado"
                                        >
                                            <FiEye size={14} className="mr-1" />
                                            Ver Dados
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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

            {/* Modal de Adição de Perfil */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Perfil</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Perfil
                            </label>
                            <input
                                type="text"
                                value={newProfile.name}
                                onChange={e => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: usuario123"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setNewProfile({ name: "" });
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddProfile}
                                disabled={!newProfile.name.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal de Adição de Keywords */}
            {showKeywordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Adicionar Palavras-chave
                        </h3>
                        <textarea
                            value={newKeyword}
                            onChange={e => setNewKeyword(e.target.value)}
                            placeholder="Separe múltiplas palavras-chave com vírgulas"
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowKeywordModal(false);
                                    setNewKeyword("");
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddKeyword}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newKeyword.trim()}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal de Adição de Plataforma */}
            {showPlatformModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Plataforma</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plataforma
                            </label>
                            <select
                                value={newPlatform}
                                onChange={e => setNewPlatform(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecione uma plataforma</option>
                                {[
                                    "Instagram",
                                    "Facebook",
                                    "Twitter",
                                    "LinkedIn",
                                    "Youtube",
                                    "Discord",
                                    "Telegram",
                                    "Github",
                                    "DeepWeb",
                                    "DarkWeb",
                                    "Google",
                                ].map(plat => (
                                    <option key={plat} value={plat}>
                                        {plat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowPlatformModal(false);
                                    setNewPlatform("");
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddPlatform}
                                disabled={!newPlatform}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botão de Agendar Monitoramento - Aparece quando há um perfil pesquisado */}
            {profile && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FiUser className="text-blue-600 mr-2" size={20} />
                            <div>
                                <h3 className="text-sm font-medium text-blue-900">
                                    Monitorar perfil "{profile}"
                                </h3>
                                <p className="text-xs text-blue-700">
                                    Configure um monitoramento automático para este perfil
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                handleScheduleMonitoring(
                                    profile,
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

            {/* Modal de Resultados */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {selectedItem.plataforma}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedItem.sentimento === "positivo"
                                            ? "bg-green-100 text-green-800"
                                            : selectedItem.sentimento === "NEGATIVO"
                                                ? "bg-red-100 text-red-800"
                                                : selectedItem.sentimento === null ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {selectedItem.sentimento === null ? "N/A" : selectedItem.sentimento}
                                    </span>
                                    {/* <span
                                        className="text-xs font-medium px-2.5 py-0.5 rounded"
                                    >
                                        {selectedItem.sentimento || "N/A"}
                                    </span> */}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiCalendar size={14} className="mr-1" />
                                    {formatDateTime(selectedItem.createdAt)}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <FiUser size={16} className="text-gray-400 mr-2" />
                                    <span className="font-medium text-gray-900">
                                        {selectedItem.perfil}
                                    </span>
                                </div>
                                {selectedItem.link && (
                                    <div className="flex items-center">
                                        <FiLink size={16} className="text-gray-400 mr-2" />
                                        <a
                                            href={selectedItem.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                        >
                                            {selectedItem.link.length > 60
                                                ? selectedItem.link.substring(0, 60) + "..."
                                                : selectedItem.link}
                                            <FiExternalLink size={12} className="ml-1" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {selectedItem.texto && (
                                <div className="bg-gray-50 p-4 rounded-lg overflow-y-auto" style={{ maxHeight: '60vh' }}>
                                    <h4 className="font-medium text-gray-900 mb-2">Conteúdo:</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        <HighlightedText
                                            text={selectedItem.texto}
                                            keywords={keyWords}
                                        />
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>ID: {selectedItem.id}</span>
                                    <span>Scrape ID: {selectedItem.scrape_id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ScrapeDeepScan;
