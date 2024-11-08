import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProduct, isLoading } = useProductStore();
  const produtoFromState = location.state?.produto;
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState([]);
  const [showFornecedoresDropdown, setShowFornecedoresDropdown] = useState(false);

  const [produto, setProduto] = useState({
    nomeProduto: "",
    fabricante: "",
    categoriaProduto: "",
    fornecedores: [],
    descricao: "",
  });

  const fetchFornecedores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers/search");
      setFornecedoresDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  useEffect(() => {
    if (produtoFromState) {
      // Extract supplier names from the relationship
      const existingSuppliers = produtoFromState.suppliers?.map(
        (sup) => sup.supplier.nome
      ) || [];
      
      setProduto({
        ...produtoFromState,
        fornecedores: existingSuppliers
      });
    }
    fetchFornecedores();
  }, [produtoFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(produto);
    alert("Produto editado com sucesso!");
    navigate("/produto/pesquisa");
  };

  const handleAddFornecedor = (fornecedor) => {
    if (produto.fornecedores.length < 3 && !produto.fornecedores.includes(fornecedor)) {
      setProduto({
        ...produto,
        fornecedores: [...produto.fornecedores, fornecedor]
      });
      setShowFornecedoresDropdown(false);
    } else {
      alert("Você já selecionou esse fornecedor ou atingiu o limite de 3 fornecedores.");
    }
  };

  const removeFornecedor = (index) => {
    const updatedFornecedores = [...produto.fornecedores];
    updatedFornecedores.splice(index, 1);
    setProduto({ ...produto, fornecedores: updatedFornecedores });
  };

  return (
    <div className="max-w-6xl p-4 mx-auto font-inter">
      <div className="flex flex-col gap-12 p-6 bg-white border border-gray-600 rounded-lg shadow-md">
        <section>
          <h2 className="mb-12 text-2xl font-semibold font-inter text-primary">
            Editar Produto
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10">
            <div>
              <label className="text-primaryLight">Nome do Produto</label>
              <input
                type="text"
                id="nomeProduto"
                name="nomeProduto"
                value={produto.nomeProduto}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="text-primaryLight">Fabricante</label>
              <input
                type="text"
                id="fabricante"
                name="fabricante"
                value={produto.fabricante}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="text-primaryLight">Categoria</label>
              <input
                type="text"
                id="categoriaProduto"
                name="categoriaProduto"
                value={produto.categoriaProduto}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                required
              />
            </div>
            <section>
              <label className="text-primaryLight">Fornecedores (até 3)</label>
              <div className="mt-2 space-y-2">
                {produto.fornecedores.map((fornecedor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 w-[350px] bg-gray-100 rounded-md"
                  >
                    <span>{fornecedor}</span>
                    <button
                      type="button"
                      onClick={() => removeFornecedor(index)}
                      className="text-red-500"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                {produto.fornecedores.length < 3 && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowFornecedoresDropdown(!showFornecedoresDropdown)}
                      className="px-4 py-2 text-white rounded-md bg-primaryLight"
                    >
                      Adicionar Fornecedor
                    </button>
                    {showFornecedoresDropdown && (
                      <div className="p-2 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                        <ul>
                          {fornecedoresDisponiveis.map((fornecedor) => (
                            <li
                              key={fornecedor.id}
                              onClick={() => handleAddFornecedor(fornecedor.nome)}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                              {fornecedor.nome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
            <div className="mt-6 text-left">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-md bg-primary ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Alterando..." : "Alterar"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EditProduct;