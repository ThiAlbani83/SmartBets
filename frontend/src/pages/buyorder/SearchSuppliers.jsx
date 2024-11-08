import React, { useState, useEffect } from "react";
import { useSupplierStore } from "../../store/useSupplierStore";
import { useNavigate } from "react-router-dom";

const SearchSuppliers = () => {
  const navigate = useNavigate();
  const { suppliers, getSuppliers, deleteSupplier, updateSupplier } = useSupplierStore();
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    await getSuppliers();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteSupplier(id);
    }
  };

  const handleEdit = (supplier) => {
    navigate(`/fornecedores/editar/${supplier.id}`, { state: { supplier } });
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

  if (loading) return <p>Carregando fornecedores...</p>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-primary">
        Pesquisa de Fornecedores
      </h1>

      <input
        type="text"
        placeholder="Buscar por nome do fornecedor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-primary focus:outline-none focus:border-b-2"
      />

      <table className="min-w-full border border-primary">
        <thead>
          <tr className="text-white bg-primaryLight">
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("nome")}
            >
              Nome
            </th>
            <th className="px-4 py-2 text-left border-l border-l-primary">
              Email
            </th>
            <th className="px-4 py-2 text-left border-l border-l-primary">
              Telefone
            </th>
            <th
              className="px-4 py-2 text-left border-l cursor-pointer border-l-primary"
              onClick={() => requestSort("categoria")}
            >
              Categoria
            </th>
            <th className="px-4 py-2 text-left border-l border-l-primary">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((fornecedor) => (
            <tr
              key={fornecedor.id}
              className="even:bg-gray-200 odd:bg-white"
            >
              <td className="px-4 py-2">{fornecedor.nome}</td>
              <td className="px-4 py-2 border-l border-l-primary">
                {fornecedor.email}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {fornecedor.telefone}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {fornecedor.categoria}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                <button
                  onClick={() => handleEdit(fornecedor)}
                  className="mr-4 text-green-500 underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(fornecedor.id)}
                  className="text-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchSuppliers;