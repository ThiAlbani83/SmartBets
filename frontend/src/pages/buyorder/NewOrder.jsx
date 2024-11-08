import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useProductStore } from "../../store/useProductStore";
import { useSupplierStore } from "../../store/useSupplierStore";
import { useAuthStore } from "../../store/useAuthStore";

const NewOrder = () => {
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();
  const { products, getProducts } = useProductStore();
  const { suppliers, getSuppliers } = useSupplierStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: 1,
    fornecedores: [],
    responsavel: user.name,
    enviarPara: "Selecione um departamento...",
    orcamentos: [],
  });

  const [selectedFornecedor, setSelectedFornecedor] = useState("");

  useEffect(() => {
    getProducts();
    getSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFornecedor = (fornecedor) => {
    if (
      formData.fornecedores.length < 3 &&
      !formData.fornecedores.includes(fornecedor.nome)
    ) {
      console.log(fornecedor);
      setFormData({
        ...formData,
        fornecedores: [...formData.fornecedores, fornecedor],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData before submit:", formData); // Debugging line

    try {
      const formData2 = new FormData();
      formData2.append("produto", formData.produto);
      formData2.append("quantidade", formData.quantidade);
      formData2.append("fornecedores", JSON.stringify(formData.fornecedores));
      formData2.append("responsavel", formData.responsavel);
      formData2.append("enviarPara", formData.enviarPara);
      formData2.append("motivoCompra", formData.motivoCompra);

      if (formData.orcamentos) {
        formData.orcamentos.forEach((file) => {
          formData2.append("orcamentos", file);
        });
      }

      await createOrder(formData2);
      navigate("/compras/pedidos-ativos");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="max-w-6xl p-4 mx-auto font-inter">
      <div
        className="flex flex-col gap-12 p-6 bg-white border border-gray-600 rounded-lg shadow-md"
        style={{ userSelect: "none" }}
      >
        <h2 className="text-2xl font-semibold font-inter text-primary">
          Nova Solicitação
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Produto */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-4">
                <label className="text-primaryLight">
                  {" "}
                  Produto a ser comprado
                </label>
                <select
                  id="produto"
                  name="produto"
                  value={formData.produto}
                  onChange={handleChange}
                  className="px-6 py-2 bg-gray-100 rounded-md w-fit"
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.nomeProduto}>
                      {product.nomeProduto}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-primaryLight">Quantidade</label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="">
              <div className="flex flex-wrap items-center gap-2 ">
                <label className="text-primaryLight">
                  Fornecedores (até 3)
                </label>
                <div className="flex items-center gap-6 w-fit">
                  <select
                    value={selectedFornecedor}
                    onChange={(e) => setSelectedFornecedor(e.target.value)}
                    className="px-6 py-2 bg-gray-100 rounded-md w-fit"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.nome}>
                        {supplier.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFornecedor) {
                        handleAddFornecedor(selectedFornecedor);
                        setSelectedFornecedor("");
                      }
                    }}
                    className="text-primary"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {formData.fornecedores.map((fornecedor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 w-[350px] bg-gray-100 rounded-md"
                  >
                    <span>{fornecedor}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          fornecedores: formData.fornecedores.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Responsável */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 w-fit">
                <label className="text-primaryLight">
                  Responsável
                </label>
                <input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  disabled
                  className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                />
              </div>
              <div className="flex items-center gap-4 w-fit">
                <label className="text-primaryLight">
                  Enviar Para:
                </label>
                <select
                  id="enviarPara"
                  name="enviarPara"
                  value={formData.enviarPara}
                  onChange={handleChange}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md w-fit"
                >
                  <option value="Armazém Central">Financeiro</option>
                  <option value="Departamento 1">Diretoria</option>
                  <option value="Departamento 2">Administrativo</option>
                  <option value="Departamento 3">CEO</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primaryLight">
                Motivo da Compra
              </label>
              <textarea
                id="motivoCompra"
                name="motivoCompra"
                value={formData.motivoCompra}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-b-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                rows="4"
                required
              />
            </div>

            {/* Orçamentos */}
            <div className="flex flex-col gap-2">
              <label className="text-primaryLight">
                Upload de Orçamentos (até 3 arquivos PDF)
              </label>
              <input
                type="file"
                id="orcamentos"
                name="orcamentos"
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 3);
                  setFormData({ ...formData, orcamentos: files });
                }}
                className="flex items-center justify-between max-w-[350px] p-2 bg-gray-100 rounded-md"
                accept=".pdf"
                multiple
              />
              <div className="mt-2">
                {formData.orcamentos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 mt-1 bg-gray-100 rounded"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          orcamentos: formData.orcamentos.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md bg-primary w-fit"
          >
            Enviar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewOrder;
