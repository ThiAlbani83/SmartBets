import React, { useEffect, useState } from "react";
import axios from "axios";

const DetailsTable = ({ currentPage, setCurrentPage }) => {
  const [data, setData] = useState([]);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate current items based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const apostadores = [
    {
      nomeApostador: "João Silva",
      CPF: "123.456.789-00",
      dataNascimento: "1990-01-01",
      dataHoraCriacaoConta: "2024-01-15 12:30:00",
      dataHoraAceitacaoTC: "2024-02-01 14:20:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:00:00",
      genero: "Masculino",
      periodoPausa: "2024-12-01 a 2024-12-03",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Maria Oliveira",
      CPF: "987.654.321-00",
      dataNascimento: "1985-05-10",
      dataHoraCriacaoConta: "2024-03-22 15:30:00",
      dataHoraAceitacaoTC: "2024-04-05 09:00:00",
      statusApostador: "Inativo",
      dataHoraStatus: "2024-12-01 08:00:00",
      genero: "Feminino",
      periodoPausa: "2024-12-01 a 2024-12-02",
      periodoExclusao: "2024-11-20 a 2024-11-25",
      periodoExclusaoJudicial: "Sim",
      alteracaoDados: "Não",
    },
    {
      nomeApostador: "Carlos Pereira",
      CPF: "456.789.123-00",
      dataNascimento: "1992-11-25",
      dataHoraCriacaoConta: "2024-06-10 10:15:00",
      dataHoraAceitacaoTC: "2024-07-01 11:45:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 09:30:00",
      genero: "Masculino",
      periodoPausa: "2024-12-03 a 2024-12-04",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Ana Costa",
      CPF: "321.654.987-00",
      dataNascimento: "1988-02-17",
      dataHoraCriacaoConta: "2024-08-25 14:00:00",
      dataHoraAceitacaoTC: "2024-09-10 16:30:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 09:45:00",
      genero: "Feminino",
      periodoPausa: "2024-12-01 a 2024-12-02",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Não",
    },
    {
      nomeApostador: "Ricardo Almeida",
      CPF: "654.321.987-00",
      dataNascimento: "1980-07-23",
      dataHoraCriacaoConta: "2024-02-18 18:25:00",
      dataHoraAceitacaoTC: "2024-03-02 10:10:00",
      statusApostador: "Inativo",
      dataHoraStatus: "2024-12-01 13:00:00",
      genero: "Masculino",
      periodoPausa: "2024-11-10 a 2024-11-15",
      periodoExclusao: "2024-11-05 a 2024-11-09",
      periodoExclusaoJudicial: "Sim",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Fernanda Souza",
      CPF: "789.123.654-00",
      dataNascimento: "1995-03-30",
      dataHoraCriacaoConta: "2024-07-05 09:45:00",
      dataHoraAceitacaoTC: "2024-07-15 13:30:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:15:00",
      genero: "Feminino",
      periodoPausa: "2024-12-03 a 2024-12-04",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Não",
    },
    {
      nomeApostador: "Pedro Santos",
      CPF: "112.233.445-00",
      dataNascimento: "1993-06-12",
      dataHoraCriacaoConta: "2024-04-18 08:30:00",
      dataHoraAceitacaoTC: "2024-05-05 12:00:00",
      statusApostador: "Inativo",
      dataHoraStatus: "2024-12-02 17:00:00",
      genero: "Masculino",
      periodoPausa: "2024-12-01 a 2024-12-02",
      periodoExclusao: "2024-11-20 a 2024-11-23",
      periodoExclusaoJudicial: "Não",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Luiza Martins",
      CPF: "222.333.444-00",
      dataNascimento: "1998-09-14",
      dataHoraCriacaoConta: "2024-03-05 16:20:00",
      dataHoraAceitacaoTC: "2024-03-18 17:30:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 09:50:00",
      genero: "Feminino",
      periodoPausa: "2024-12-01 a 2024-12-03",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Eduardo Ferreira",
      CPF: "333.444.555-00",
      dataNascimento: "1984-04-02",
      dataHoraCriacaoConta: "2024-01-10 12:45:00",
      dataHoraAceitacaoTC: "2024-01-25 14:00:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:00:00",
      genero: "Masculino",
      periodoPausa: "2024-12-02 a 2024-12-04",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Não",
    },
    {
      nomeApostador: "Gustavo Lima",
      CPF: "444.555.666-00",
      dataNascimento: "1991-12-18",
      dataHoraCriacaoConta: "2024-06-08 09:30:00",
      dataHoraAceitacaoTC: "2024-06-18 13:15:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:05:00",
      genero: "Masculino",
      periodoPausa: "2024-12-01 a 2024-12-03",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Carla Souza",
      CPF: "555.666.777-00",
      dataNascimento: "1994-01-25",
      dataHoraCriacaoConta: "2024-07-22 11:00:00",
      dataHoraAceitacaoTC: "2024-08-01 09:00:00",
      statusApostador: "Inativo",
      dataHoraStatus: "2024-12-02 12:00:00",
      genero: "Feminino",
      periodoPausa: "2024-11-01 a 2024-11-05",
      periodoExclusao: "2024-10-20 a 2024-10-25",
      periodoExclusaoJudicial: "Sim",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Rafael Oliveira",
      CPF: "666.777.888-00",
      dataNascimento: "1987-08-30",
      dataHoraCriacaoConta: "2024-05-10 14:40:00",
      dataHoraAceitacaoTC: "2024-06-05 10:30:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:10:00",
      genero: "Masculino",
      periodoPausa: "2024-12-01 a 2024-12-02",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Fernanda Almeida",
      CPF: "777.888.999-00",
      dataNascimento: "1990-06-12",
      dataHoraCriacaoConta: "2024-08-30 16:20:00",
      dataHoraAceitacaoTC: "2024-09-10 12:30:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:20:00",
      genero: "Feminino",
      periodoPausa: "2024-12-02 a 2024-12-04",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Sim",
    },
    {
      nomeApostador: "Bruna Costa",
      CPF: "888.999.000-00",
      dataNascimento: "1999-11-05",
      dataHoraCriacaoConta: "2024-02-20 18:00:00",
      dataHoraAceitacaoTC: "2024-03-05 10:20:00",
      statusApostador: "Ativo",
      dataHoraStatus: "2024-12-05 10:25:00",
      genero: "Feminino",
      periodoPausa: "2024-12-03 a 2024-12-04",
      periodoExclusao: "N/A",
      periodoExclusaoJudicial: "N/A",
      alteracaoDados: "Não",
    },
  ];

  const [sortedData, setSortedData] = useState(apostadores);

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sorted = [...sortedData].sort((a, b) => {
      if (direction === "ascending") {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });

    setSortedData(sorted);
  };

  // Update the currentItems calculation to use sortedData
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Calculate total pages
  const totalPages = Math.ceil(apostadores.length / itemsPerPage);

  /* const API_URL = "https://srv654319.hstgr.cloud/api/"; */

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const getSortIndicator = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="w-full h-full">
      <div className="relative w-full">
        <div className="overflow-y-auto max-h-[540px] max-w-[1080px] 2xl:max-w-[1470px]">
          <table className="min-w-full border-primary">
            <thead className="">
              <tr className="text-black border-b border-b-[#ECECEC] font-rem text-sm font-light">
                <th
                  className="px-4 py-2 text-left gap-2"
                  onClick={() => sortData("nomeApostador")}
                >
                  Nome Apostador {getSortIndicator("nomeApostador")}
                </th>
                <th
                  className="px-4 py-2 text-left  gap-2"
                  onClick={() => sortData("CPF")}
                >
                  CPF {getSortIndicator("CPF")}
                </th>
                <th
                  className="px-4 py-2 text-left  gap-2"
                  onClick={() => sortData("dataNascimento")}
                >
                  Data Nascimento {getSortIndicator("date")}
                </th>
                <th
                  onClick={() => sortData("dataHoraCriacaoConta")}
                  className="px-4 py-2 text-left  gap-2"
                >
                  Data Criação Conta
                </th>
                <th className="px-4 py-2 text-left  gap-2">
                  Data Aceitação TC
                </th>
                <th
                  onClick={() => sortData("statusApostador")}
                  className="px-4 py-2 text-left  gap-2"
                >
                  Status Apostador
                </th>
                <th className="px-4 py-2 text-left  gap-2">
                  Data Hora Status
                </th>
                <th className="px-4 py-2 text-left  gap-2">Gênero</th>
                <th className="px-4 py-2 text-left  gap-2">
                  Período Pausa
                </th>
                <th className="px-4 py-2 text-left  gap-2">
                  Período Exclusão
                </th>
                <th className="px-4 py-2 text-left  gap-2">
                  Período Exclusão Judicial
                </th>
                <th className="px-4 py-2 text-left  gap-2">
                  Alteração Dados
                </th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {currentItems.map((item, index) => (
                <tr
                  key={index + item.CPF}
                  className="border-b border-b-[#ECECEC]"
                >
                  <td className="x-4 py-2 font-rem font-semibold text-sm text-[#333333]">{item.nomeApostador}</td>
                  <td className="x-4 py-2 font-rem font-semibold text-sm text-[#333333]">{item.CPF}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.dataNascimento}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.dataHoraCriacaoConta}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.dataHoraAceitacaoTC}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.statusApostador}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.dataHoraStatus}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.genero}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.periodoPausa}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.periodoExclusao}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.periodoExclusaoJudicial}</td>
                  <td className="px-4 py-[10px] text-[#979797] font-rem font-normal text-sm">{item.alteracaoDados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          First
        </button>

        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          // Show only 5 page numbers around current page
          if (
            index === 0 ||
            index === totalPages - 1 ||
            (index >= currentPage - 2 && index <= currentPage + 2)
          ) {
            return (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-primaryLight text-white"
                    : "bg-[#E5F4F8]"
                }`}
              >
                {index + 1}
              </button>
            );
          }
          if (index === currentPage - 3 || index === currentPage + 3) {
            return <span key={index}>...</span>;
          }
          return null;
        })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#E5F4F8] disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};
export default DetailsTable;
