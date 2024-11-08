import React, { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore"; // Importe a store
import axios from "axios";

const AddProduct = () => {
  const [showFornecedoresDropdown, setShowFornecedoresDropdown] =
    useState(false); // Controla a exibição do dropdown
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState([]);

  const [formData, setFormData] = useState({
    nomeProduto: "",
    fabricante: "",
    categoriaProduto: "",
    descricao: "",
    fornecedores: [],
  });

  const { addProduct, isLoading, error } = useProductStore(); // Obtenha a função de adicionar produto da store

  // Função para buscar fornecedores
  const fetchFornecedores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/suppliers/search"
      ); // Chama a nova rota
      setFornecedoresDisponiveis(response.data); // Armazena os fornecedores no estado
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      alert("Erro ao buscar fornecedores: " + error.message);
    }
  };

  useEffect(() => {
    fetchFornecedores(); // Busca fornecedores quando o componente é montado
  }, []);

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para adicionar fornecedor (limitado a 3)
  const handleAddFornecedor = (fornecedor) => {
    if (
      formData.fornecedores.length < 3 &&
      !formData.fornecedores.includes(fornecedor)
    ) {
      setFormData({
        ...formData,
        fornecedores: [...formData.fornecedores, fornecedor],
      });
      setShowFornecedoresDropdown(false); // Esconde o dropdown após selecionar
    } else {
      alert(
        "Você já selecionou esse fornecedor ou atingiu o limite de 3 fornecedores."
      );
    }
  };

  // Função para remover fornecedor
  const removeFornecedor = (index) => {
    const updatedFornecedores = [...formData.fornecedores];
    updatedFornecedores.splice(index, 1);
    setFormData({ ...formData, fornecedores: updatedFornecedores });
  };

  // Função para enviar o formulário
  const handleSubmit = async () => {
    const productData = {
      nomeProduto: formData.nomeProduto,
      fabricante: formData.fabricante,
      categoriaProduto: formData.categoriaProduto,
      fornecedores: formData.fornecedores,
      descricao: formData.descricao,
    };

    console.log("Enviando produto:", productData); // Verifica os dados no console

    try {
      // Chama a função addProduct da store
      await addProduct(productData);
      console.log(formData);
      alert("Produto cadastrado com sucesso!");
      // Limpa o formulário após o envio
      setFormData({
        nomeProduto: "",
        fabricante: "",
        categoriaProduto: "",
        fornecedores: [],
        descricao: "",
        orcamentos: [],
      });
    } catch (error) {
      alert("Erro ao cadastrar o produto: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl p-4 mx-auto font-inter">
      <div className="flex flex-col gap-12 p-6 bg-white border border-gray-600 rounded-lg shadow-md">
        {/* Seção Detalhes Produto */}
        <section>
          <h2 className="mb-12 text-2xl font-semibold font-inter text-primary">
            Detalhes do Produto
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <label className="text-primaryLight">Nome Produto</label>
              <input
                type="text"
                name="nomeProduto"
                value={formData.nomeProduto}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div>
              <label className="text-primaryLight">Fabricante</label>
              <input
                type="text"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div>
              <label className="text-primaryLight">Categoria Produto</label>
              <input
                type="text"
                name="categoriaProduto"
                value={formData.categoriaProduto}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
          </div>
        </section>
        <section>
          <label className="text-primaryLight">Fornecedores (até 3)</label>
          <div className="mt-2 space-y-2">
            {formData.fornecedores.map((fornecedor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 w-[350px] bg-gray-100 rounded-md"
              >
                <span>{fornecedor}</span>
                <button
                  onClick={() => removeFornecedor(index)}
                  className="text-red-500"
                >
                  Remover
                </button>
              </div>
            ))}

            {formData.fornecedores.length < 3 && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    setShowFornecedoresDropdown(!showFornecedoresDropdown)
                  }
                  className="px-4 py-2 text-white rounded-md bg-primaryLight"
                >
                  Adicionar Fornecedor
                </button>
                {showFornecedoresDropdown && (
                  <div className="p-2 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul>
                      {fornecedoresDisponiveis.map((fornecedor) => (
                        <li
                          key={fornecedor.id} // Utilize o ID como chave
                          onClick={() => handleAddFornecedor(fornecedor.nome)} // Use o nome do fornecedor
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {fornecedor.nome}{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-12">
          <h2 className="text-2xl font-semibold text-primary font-inter">
            Informações adicionais
          </h2>
          <textarea
            name="descricao"
            value={formData.descricao}
            rows={4}
            onChange={handleChange}
            className="w-full p-2 border rounded-md border-b-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </section>
        {/* Botão de envio */}
        <div className="mt-6 text-left">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded-md bg-primary ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Desabilita o botão enquanto carrega
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
