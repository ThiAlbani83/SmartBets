import { useEffect, useState } from "react";
import {
    FiX,
    FiExternalLink,
    FiCalendar,
    FiUser,
    FiLink,
} from "react-icons/fi";

import { rootUrl } from "../../pages/deepscan/utils/url.js";
import { key as X_API_Key, secret as X_API_Secret } from "../../pages/deepscan/utils/secret.js";


// Função para truncar texto
const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

const ResultModal = ({
    showResultModal,
    setShowResultModal,
    resultData,
    setResultData,
    loadingResult,
    setLoadingResult,
    error,
    setError,
}) => {
    // if (!showResultModal) return null;

    // Função para formatar data
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

    // Função para obter cor do sentimento
    const getSentimentColor = (sentimento) => {
        switch (sentimento?.toUpperCase()) {
            case "POSITIVO":
                return "bg-green-100 text-green-800";
            case "NEGATIVO":
                return "bg-red-100 text-red-800";
            case "NEUTRO":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const [expandedItems, setExpandedItems] = useState({});

    const [page, setPage] = useState(1);

    const fetchResults = async (pageToLoad) => {
        setLoadingResult(true);
        setError("");
        try {
            const response = await fetch(
                `${rootUrl}/data/filter?scrapeId=${resultData.scrapeId}&page=${pageToLoad}&limit=100`,
                {
                    headers: {
                        accept: "application/json",
                        "X-API-Key": X_API_Key,
                        "X-API-Secret": X_API_Secret,
                    },
                }
            );
            const json = await response.json();
            // mantém o scrapeId para próximos carregamentos
            setResultData({ ...json, scrapeId: resultData.scrapeId });
        } catch {
            setError("Falha ao carregar resultados.");
        } finally {
            setLoadingResult(false);
        }
    };

    useEffect(() => {
        let intervalId;

        if (showResultModal && resultData?.scrapeId) {
            // chamada imediata
            fetchResults(page);

            // chama novamente a cada 30s
            intervalId = setInterval(() => {
                fetchResults(page);
            }, 30_000);
        }

        return () => {
            // limpa o intervalo ao desmontar ou quando deps mudarem
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [page, showResultModal]);

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(p => p - 1);
        }
    };

    const handleNextPage = () => {
        if (resultData && page < resultData.totalPages) {
            setPage(p => p + 1);
        }
    };

    const handleExpand = (id) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Alterna o estado de expansão do item
        }));
    };

    const handleClose = () => {
        setResultData(null)
        setShowResultModal(false);
        setPage(1);
        setError("");
    };


    if (!showResultModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header do Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Resultados do Scraping
                        </h2>
                        {resultData && (
                            <p className="text-sm text-gray-600 mt-1">
                                {resultData.total} resultado(s) encontrado(s) - Página{" "}
                                {resultData.page} de {resultData.totalPages}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loadingResult ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">
                                Carregando resultados...
                            </span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">
                                <FiX size={48} className="mx-auto" />
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : resultData && resultData.data ? (
                        <div className="space-y-6">
                            {/* Estatísticas Resumidas */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-600">
                                        Total de Resultados
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {resultData.total}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">
                                        Sentimento Positivo
                                    </h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {
                                            resultData.data.filter(
                                                (item) => item.sentimento?.toUpperCase() === "POSITIVO"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-600">
                                        Sentimento Negativo
                                    </h3>
                                    <p className="text-2xl font-bold text-red-900">
                                        {
                                            resultData.data.filter(
                                                (item) => item.sentimento?.toUpperCase() === "NEGATIVO"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Plataformas
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            new Set(resultData.data.map((item) => item.plataforma))
                                                .size
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Lista de Resultados */}
                            <div className="space-y-4">
                                {resultData.data.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        {/* Header do Item */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {item.plataforma}
                                                </span>
                                                <span
                                                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${getSentimentColor(
                                                        item.sentimento
                                                    )}`}
                                                >
                                                    {item.sentimento || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FiCalendar size={14} className="mr-1" />
                                                {formatDateTime(item.createdAt)}
                                            </div>
                                        </div>

                                        {/* Informações do Perfil */}
                                        <div className="mb-4">
                                            <div className="flex items-center mb-2">
                                                <FiUser size={16} className="text-gray-400 mr-2" />
                                                <span className="font-medium text-gray-900">
                                                    {item.perfil}
                                                </span>
                                            </div>
                                            {item.link && (
                                                <div className="flex items-center">
                                                    <FiLink size={16} className="text-gray-400 mr-2" />
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                    >
                                                        {item.link.length > 60
                                                            ? item.link.substring(0, 60) + "..."
                                                            : item.link}
                                                        <FiExternalLink size={12} className="ml-1" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Texto do Conteúdo */}
                                        {item.texto && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Conteúdo:
                                                </h4>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {item.texto.length > 300 && !expandedItems[item.id] ? (
                                                        <>
                                                            {truncateText(item.texto, 300)}
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800 ml-2 text-sm font-medium"
                                                                onClick={() => handleExpand(item.id)}
                                                            >
                                                                Ver mais
                                                            </button>
                                                        </>
                                                    ) : (
                                                        item.texto
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer com ID */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>ID: {item.id}</span>
                                                <span>Scrape ID: {item.scrape_id}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginação (se necessário) */}
                            {resultData.totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                            className={`px-3 py-1 text-sm border rounded ${page === 1
                                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            Anterior
                                        </button>
                                        <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                                            {page} / {resultData.totalPages}
                                        </span>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={page === resultData.totalPages}
                                            className={`px-3 py-1 text-sm border rounded ${page === resultData.totalPages
                                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            Próximo
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nenhum resultado encontrado.</p>
                        </div>
                    )}
                </div>

                {/* Footer do Modal */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
