import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";

const SearchProduct = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const { products, getProducts, deleteProduct } = useProductStore();

  useEffect(
    () => {
      try {
        getProducts();
        setProdutos(products);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [products],
    []
  );

  // Função para excluir produto
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(id); // Chama a função de exclusão
      setProdutos(produtos.filter((product) => product.id !== id)); // Atualiza a lista localmente
    }
  };

  // Função para solicitar a ordenação
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Função para filtrar os produtos pelo termo de busca
  const filteredProducts = produtos.filter((produto) =>
    produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para ordenar os produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold text-primary">Pesquisa de Produtos</h1>
      {/* Input de busca */}
      <input
        type="text"
        placeholder="Buscar por nome do produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-primary focus:outline-none focus:border-b-2"/>
      <table className="min-w-full border border-primary">
        <thead>
          <tr className="text-white bg-primaryLight">
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => requestSort("nomeProduto")}
            >
              Nome do Produto{" "}
              {sortConfig.key === "nomeProduto" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left border-l cursor-pointer border-l-primary"
              onClick={() => requestSort("fabricante")}
            >
              Fabricante{" "}
              {sortConfig.key === "fabricante" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 text-left border-l cursor-pointer border-l-primary"
              onClick={() => requestSort("categoriaProduto")}
            >
              Categoria{" "}
              {sortConfig.key === "categoriaProduto" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 text-left border-l border-l-primary">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id} className="even:bg-gray-200 odd:bg-white">
              <td className="px-4 py-2">{product.nomeProduto}</td>
              <td className="px-4 py-2 border-l border-l-primary">
                {product.fabricante}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {product.categoriaProduto}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                <Link
                  to={`/produtos/editar/${product.id}`}
                  state={{ produto: product }} // Aqui passamos o objeto produto diretamente
                  className="mr-4 text-green-500 underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
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

export default SearchProduct;
