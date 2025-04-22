import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const SubmitTable = ({ selectedCategory, currentPage, setCurrentPage }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate current items based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Object.entries(data).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Calculate total pages
  const totalPages = Math.ceil(Object.keys(data).length / itemsPerPage);

  const API_URL = "https://srv654319.hstgr.cloud/api/";

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = { ...data };
    const entries = Object.entries(sortedData);

    entries.sort((a, b) => {
      if (key === "sequencial") {
        return direction === "ascending"
          ? parseInt(a[0]) - parseInt(b[0])
          : parseInt(b[0]) - parseInt(a[0]);
      }
      if (key === "fileName") {
        return direction === "ascending"
          ? a[1].localeCompare(b[1])
          : b[1].localeCompare(a[1]);
      }
      return 0;
    });

    setData(Object.fromEntries(entries));
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp className="inline ml-1 text-blue-600" />
      ) : (
        <FaSortDown className="inline ml-1 text-blue-600" />
      );
    }
    return <FaSort className="inline ml-1 text-gray-400" />;
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL + "list_files", {
        params: {
          category: selectedCategory,
          company: "-",
          token: import.meta.env.VITE_TOKEN_SIGAP,
        },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      setData(response.data);
    } catch (error) {
      console.log("Response details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (Object.keys(data).length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Nenhum arquivo encontrado para esta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData("sequencial")}
              >
                Sequencial {getSortIcon("sequencial")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => sortData("fileName")}
              >
                Nome do Arquivo {getSortIcon("fileName")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Empresa
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo do Arquivo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Auditar
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ver
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map(([key, fileName]) => (
              <tr key={key} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {fileName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formattedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {selectedCategory}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="text-green-500 hover:text-green-700 transition-colors">
                    <FaCheckCircle className="text-xl" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link
                    to={"/sigap/detalhes_arquivo"}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FaEye className="text-xl" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === index + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Próximo</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitTable;
