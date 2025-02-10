import { useState, useEffect } from "react";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { verificationData } from "../../utils/fakeData";
import view from "../../assets/view.png";

const VerificationsTable = ({ selectedCompany, selectedStatus, selectedDate }) => {
  const [verificationsData, setVerificationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    try {
      setVerificationsData(verificationData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [verificationsData]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredVerifications = verificationsData.filter((verificationData) => {
    const matchesSearch = verificationData.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verificationData.ID.toString().includes(searchTerm);
    
    const matchesCompany = selectedCompany === "Empresa" || 
                          verificationData.Integracao === selectedCompany;
    
    const matchesStatus = selectedStatus === "Status" || 
                         verificationData.Status === selectedStatus;
    
    const matchesDate = !selectedDate || 
                       new Date(verificationData.IniciadoEm).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesCompany && matchesStatus && matchesDate;
  });

  const sortedVerifications = [...filteredVerifications].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedVerifications.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Carregando...</p>;
  return (
    <div className="container p-2 mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4"></div>
      <input
        type="text"
        placeholder="Pesquisar por Nome, CPF ou ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-[#ECECEC] focus:outline-none focus:border-b-2"
      />
      <table className="min-w-full border-primary">
        <thead>
          <tr className=" text-black border-b border-b-[#ECECEC] font-rem text-sm font-light">
            <th className="px-4 py-2 text-left flex gap-2">ID</th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("nomeProduto")}
            >
              <div className="flex gap-2">
                <span>Status</span>
              </div>
            </th>
            <th
              className="px-4 py-1 text-left cursor-pointer "
              onClick={() => requestSort("fabricante")}
            >
              Usuário
            </th>
            <th
              className="px-4 py-1 text-left cursor-pointer "
              onClick={() => requestSort("categoriaProduto")}
            >
              Iniciado em
            </th>
            <th
              className="px-4 py-1 text-left cursor-pointer "
              onClick={() => requestSort("createdAt")}
            >
              Última Atualização
            </th>
            <th className="px-4 py-1 text-left ">Integração</th>
          </tr>
        </thead>
        <tbody>
          {verificationData.map((data, index) => (
            <tr key={index} className="border-b border-b-[#ECECEC]">
              <td className="px-4 py-3 font-rem font-semibold text-sm text-[#333333]">
                {data.ID}
              </td>
              <td
                className={`px-4 py-3 font-rem font-semibold text-sm ${
                  data.Status === "Aprovado"
                    ? "text-green-500"
                    : data.Status === "Reprovado"
                    ? "text-red-500"
                    : "text-orange-500"
                }`}
              >
                {data.Status}
              </td>
              <td className="px-4 py-3 text-[#979797] font-rem font-normal text-sm">
                {data.Usuario}
              </td>
              <td className="px-4 py-3 text-[#979797] font-rem font-normal text-sm">
                {new Date(data.IniciadoEm).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 text-[#979797] font-rem font-normal text-sm">
                {new Date(data.UltimaAtualizacao).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 flex text-[#979797] font-rem font-normal text-sm mt-3">
                {data.Integracao}
              </td>
              <td>
                <img src={view} alt="ver-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-4 items-center font-rem font-medium text-sm text-gray-500">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronCircleLeft size={24} className="text-primaryLight" />{" "}
        </button>
        <span className="">{`${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronCircleRight size={24} className="text-primaryLight" />
        </button>
      </div>
    </div>
  );
};

export default VerificationsTable;
