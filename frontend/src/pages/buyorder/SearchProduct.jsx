import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import edit from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import Input from "../../components/Input";
import Button from "../../components/Button";

const SearchProduct = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { products, getProducts, deleteProduct } = useProductStore();

  useEffect(() => {
    try {
      getProducts();
      setProdutos(products);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [products]);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(id);
      setProdutos(produtos.filter((product) => product.id !== id));
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = produtos.filter((produto) =>
    produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div className="container p-4 mx-auto flex flex-col gap-6 mt-10 ">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-medium font-roboto">Produtos</h1>
          <p className="text-xs px-4 py-1 font-rem rounded-full border border-gray-500">
            {produtos.length === 0 ? (
              <span>Nenhum produto encontrado</span>
            ) : produtos.length === 1 ? (
              <span>1 item</span>
            ) : (
              <span>{produtos.length} itens</span>
            )}
          </p>
        </div>
        <div>
          <Link
            className="bg-primaryLight text-white font-roboto shadow-md font-medium px-4 py-2 rounded-lg hover:bg-primaryLight"
            to="/produto/cadastro"
          >
            Novo Produto
          </Link>
        </div>
      </div>
      <Input
        type="text"
        placeholder="Buscar por nome do produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-[#ECECEC] focus:outline-none focus:border-b-2"
      />
      <table className="min-w-full border-primary">
        <thead>
          <tr className=" text-black border-b border-b-[#ECECEC] font-rem text-sm font-light">
            <th className="px-4 py-2 text-left flex gap-2">#</th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("nomeProduto")}
            >
              <div className="flex gap-2">
                <span>Nome</span>
                {sortConfig.key === "nomeProduto" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </div>
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer "
              onClick={() => requestSort("fabricante")}
            >
              Fabricante{" "}
              {sortConfig.key === "fabricante" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer "
              onClick={() => requestSort("categoriaProduto")}
            >
              Categoria
              {sortConfig.key === "categoriaProduto" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer "
              onClick={() => requestSort("createdAt")}
            >
              Adicionado em
              {sortConfig.key === "createdAt" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 text-left ">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr key={index} className="border-b border-b-[#ECECEC]">
              <td className="px-4 py-6 font-rem font-semibold text-sm text-[#333333]">
                {product.id}
              </td>
              <td className="px-4 py-6 font-rem font-semibold text-sm text-[#333333]">
                {product.nomeProduto}
              </td>
              <td className="px-4 py-6 text-[#979797] font-rem font-normal text-sm">
                {product.fabricante}
              </td>
              <td className="px-4 py-6 text-[#979797] font-rem font-normal text-sm">
                {product.categoriaProduto}
              </td>
              <td className="px-4 py-6 text-[#979797] font-rem font-normal text-sm">
                {new Date(product.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="px-4 py-2 flex text-[#979797] font-rem font-normal text-sm mt-3">
                <Link
                  to={`/produtos/editar/${product.id}`}
                  state={{ produto: product }}
                  className="mr-4 text-green-500 underline"
                >
                  <img src={edit} alt="edit" className="w-[18px] h-[18px]" />
                </Link>
                <img
                  src={deleteIcon}
                  alt="delete"
                  className="w-[18px] h-[18px] cursor-pointer"
                  onClick={() => handleDelete(product.id)}
                />
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

export default SearchProduct;
