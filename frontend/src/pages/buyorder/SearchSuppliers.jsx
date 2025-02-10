import React, { useState, useEffect } from "react";
import { useSupplierStore } from "../../store/useSupplierStore";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import edit from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import Input from "../../components/Input";
import Button from "../../components/Button";

const SearchSuppliers = () => {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState([]);
  const { suppliers, getSuppliers, deleteSupplier, updateSupplier } =
    useSupplierStore();
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSuppliers();
    setFornecedores(suppliers);
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    await getSuppliers();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteSupplier(id);
      setFornecedores(suppliers.filter((supplier) => supplier.id !== id));
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedSuppliers = [...suppliers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    useSupplierStore.setState({ suppliers: sortedSuppliers });
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = sortedSuppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Carregando fornecedores...</p>;

  return (
    <div className="container p-4 mx-auto flex flex-col gap-6  mt-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-medium font-roboto">Fornecedores</h1>
          <p className="text-xs px-4 py-1 font-rem rounded-full border border-gray-500">
            {suppliers.length === 0 ? (
              <span>Nenhum fornecedor encontrado</span>
            ) : suppliers.length === 1 ? (
              <span>1 item</span>
            ) : (
              <span>{suppliers.length} itens</span>
            )}
          </p>
        </div>
        <div>
          <button className="bg-primaryLight text-white font-roboto shadow-md font-medium px-4 py-2 rounded-lg hover:bg-primaryLight">
            <Link to="/fornecedores/cadastro">Novo Fornecedor</Link>
          </button>
        </div>
      </div>
      <Input
        type="text"
        placeholder="Buscar por nome do fornecedor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-[#ECECEC] focus:outline-none focus:border-b-2"
      />
      <table className="min-w-full border-primary">
        <thead>
          <tr className="text-black border-b border-b-[#ECECEC] font-rem text-sm font-light">
            <th className="px-4 py-2 text-left flex gap-2">#</th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("nomeFornecedor")}
            >
              <div className="flex gap-2">
                <span>Nome</span>
                {sortConfig.key === "nomeFornecedor" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </div>
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("emailFornecedor")}
            >
              <div className="flex gap-2">
                <span>Email</span>
                {sortConfig.key === "emailFornecedor" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </div>
            </th>
            <th className="px-4 py-2 text-left">Telefone</th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("categoriaProduto")}
            >
              <div className="flex gap-2">
                <span>Categoria</span>
                {sortConfig.key === "categoriaProduto" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </div>
            </th>
            <th className="px-4 py-2 text-left cursor-pointer">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map((fornecedor) => (
            <tr key={fornecedor.id} className="border-b border-b-[#ECECEC]">
              <td className="px-4 py-6 font-roboto font-semibold text-sm text-[#333333]">
                {fornecedor.id}
              </td>
              <td className="px-4 py-6 font-roboto font-semibold text-sm text-[#333333]">
                {fornecedor.nome}
              </td>
              <td className="px-4 py-6 text-[#979797] font-roboto font-normal text-sm">
                {fornecedor.email}
              </td>
              <td className="px-4 py-6 text-[#979797] font-roboto font-normal text-sm">
                {fornecedor.telefone}
              </td>
              <td className="px-4 py-6 text-[#979797] font-roboto font-normal text-sm">
                {fornecedor.categoria}
              </td>
              <td className="px-4 py-2 flex text-[#979797] font-rem font-normal text-sm mt-3">
                <Link
                  to={`/fornecedores/editar/${fornecedor.id}`}
                  state={{ fornecedor }}
                  className="mr-4 text-green-500 underline"
                >
                  <img src={edit} alt="edit" className="w-[18px] h-[18px]" />
                </Link>
                <Link
                  to={`/fornecedores/deletar/${fornecedor.id}`}
                  state={{ fornecedor }}
                  className="mr-4 text-green-500 underline"
                >
                  <img
                    src={deleteIcon}
                    alt="edit"
                    className="w-[18px] h-[18px] cursor-pointer"
                    onClick={() => handleDelete(fornecedor.id)}
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-4 items-center font-rem font-medium text-sm text-gray-500">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronCircleLeft size={24} className="text-primaryLight" />{" "}
        </Button>
        <span className="">{`${currentPage} de ${totalPages}`}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronCircleRight size={24} className="text-primaryLight" />
        </Button>
      </div>
    </div>
  );
};

export default SearchSuppliers;
