import React, { useEffect, useState } from "react";
import auditSuccess from "../../assets/auditSuccess.png";
import auditPending from "../../assets/auditPending.png";
import viewFile from "../../assets/viewFile.png";
import axios from "axios";
import { Link } from "react-router-dom";

const SubmitTable = ({ selectedCategory, currentPage, setCurrentPage }) => {
  const [data, setData] = useState([]);
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

  const getSortIndicator = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory]);

  const fetchFiles = async () => {
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
      console.log(data);
    } catch (error) {
      console.log("Response details:", error.response?.data);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-auto max-h-[540px]">
        <table className="min-w-full border-primary">
          <thead>
            <tr className="text-black border-b border-b-[#ECECEC] font-rem text-sm font-light">
              <th
                className="px-4 py-2 text-left  gap-2"
                onClick={() => sortData("sequencial")}
              >
                Sequencial {getSortIndicator("sequencial")}
              </th>
              <th
                className="px-4 py-2 text-left gap-2"
                onClick={() => sortData("fileName")}
              >
                Nome do Arquivo {getSortIndicator("fileName")}
              </th>
              <th
                className="px-4 py-2 text-left  gap-2"
                onClick={() => sortData("date")}
              >
                Data {getSortIndicator("date")}
              </th>
              <th className="px-4 py-2 text-left  gap-2">Empresa</th>
              <th className="px-4 py-2 text-left  gap-2">Tipo do Arquivo</th>
              <th className="px-4 py-2 text-left  gap-2">Auditar</th>
              <th className="px-4 py-2 text-left  gap-2">Ver</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(([key, fileName]) => (
              <tr key={key} className="border-b border-b-[#ECECEC]">
                <td className="x-4 py-2 font-rem font-semibold text-sm text-[#333333]">
                  {key}
                </td>
                <td className="x-4 py-2 font-rem font-semibold text-sm text-[#333333]">
                  {fileName}
                </td>
                <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">
                  {formattedDate}
                </td>
                <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">
                  -
                </td>
                <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">
                  {selectedCategory}
                </td>
                <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm cursor-pointer">
                  <img
                    src={auditSuccess}
                    alt="success"
                    className="place-self-center"
                  />
                </td>
                <td className="px-4 py-2 cursor-pointer">
                  <Link to={"/sigap/detalhes_arquivo"}>
                    <img
                      src={viewFile}
                      alt="view"
                      className="place-self-center"
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-[#E5F4F8]"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubmitTable;
