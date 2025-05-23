import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSupplierStore } from "../../store/useSupplierStore";
import axios from "axios";
import { FaSearch } from "react-icons/fa"; // Import the search icon

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { suppliers, updateSupplier } = useSupplierStore();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    website: "",
    categoria: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
    cep: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      const supplier = suppliers.find((s) => s.id === parseInt(id));
      if (supplier) {
        setFormData(supplier);
        setLoading(false);
      } else {
        setError("Fornecedor não encontrado");
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCEPSearch = async () => {
    const { cep } = formData;
    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`,
          {
            withCredentials: false, // Ensure credentials are not included
          }
        );
        const { logradouro, bairro, localidade, uf } = response.data;
        setFormData({
          ...formData,
          rua: logradouro,
          bairro: bairro,
          cidade: localidade,
          estado: uf,
        });
        if (response.data.erro) {
          alert("CEP não encontrado. Por favor, insira um CEP válido.");
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    } else {
      alert("Por favor, insira um CEP válido de 8 dígitos.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateSupplier(formData);
      setFeedback("Fornecedor atualizado com sucesso!");
      setTimeout(() => {
        navigate("/fornecedores/pesquisa");
      }, 1000);
    } catch (error) {
      setError("Erro ao atualizar fornecedor: " + error.message);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-6xl p-4 mx-auto font-inter">
      <div className="flex flex-col gap-12 p-6 bg-white border border-gray-600 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold font-inter text-primary">
          Editar Fornecedor
        </h2>
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        {feedback && (
          <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
            {feedback}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <section className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col col-span-2 gap-1">
              <label className="text-primaryLight">Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">CNPJ *</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
          </section>
          <h2 className="text-2xl font-semibold text-primary font-inter">
            Endereço
          </h2>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">CEP *</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleCEPSearch}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="flex flex-col col-span-2 gap-1">
              <label className="text-primaryLight">Rua</label>
              <input
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
              <label className="text-primaryLight">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
              />
            </div>
          </section>
          <h2 className="text-2xl font-semibold text-primary font-inter">
            Informações Adicionais
          </h2>
          <div className="flex flex-col gap-1">
            <textarea
              name="descricao"
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              className="w-full p-2 border rounded-md border-b-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md w-fit bg-primary"
          >
            Atualizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
