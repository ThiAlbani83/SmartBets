import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useProductStore } from "../../store/useProductStore";
import { useSupplierStore } from "../../store/useSupplierStore";
import { useAuthStore } from "../../store/useAuthStore";

const NewOrder = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();
  const { products, getProducts } = useProductStore();
  const { suppliers, getSuppliers } = useSupplierStore();
  const { user, getAllUsers } = useAuthStore();
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: 1,
    fornecedores: [],
    responsavel: user.name,
    enviarPara: "Departamento...",
    enviarParaResponsavel: "Destinatario...",
    orcamentos: [],
  });

  const [selectedFornecedor, setSelectedFornecedor] = useState("");

  useEffect(() => {
    getProducts();
    getSuppliers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    handleChange(e);

    // Add console.log to check values
    console.log("Selected Department:", selectedDepartment);
    console.log("All Users:", users);

    const filteredUsers = users.filter(
      (user) => user.role.toLowerCase() === selectedDepartment.toLowerCase()
    );
    setDepartmentUsers(filteredUsers);
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

    try {
      const formData2 = new FormData();
      formData2.append("produto", formData.produto);
      formData2.append("quantidade", formData.quantidade);
      formData2.append("fornecedores", JSON.stringify(formData.fornecedores));
      formData2.append("responsavel", formData.responsavel);
      formData2.append("enviarPara", formData.enviarPara);
      formData2.append("enviarParaResponsavel", formData.enviarParaResponsavel);
      formData2.append("motivoCompra", formData.motivoCompra);

      if (formData.orcamentos) {
        formData.orcamentos.forEach((file) => {
          formData2.append("orcamentos", file);
        });
      }

      // Find the user object for the selected enviarParaResponsavel
      const selectedUser = users.find(
        (user) => user.name === formData.enviarParaResponsavel
      );

      console.log("Selected User Object:", selectedUser);

      // Create the order and send email notification
      await createOrder(formData2, selectedUser.email);
      console.log();

      // Navigate to the active orders page
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
                <label className="text-primaryLight">Responsável</label>
                <input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  disabled
                  className="w-full p-1 border-b border-b-gray-300 focus:outline-none focus:border-primary focus:border-b-2 focus:bg-gray-50"
                />
              </div>
              <div className="flex items-center gap-4 w-fit">
                <label className="text-primaryLight">Enviar Para:</label>
                <select
                  id="enviarPara"
                  name="enviarPara"
                  value={formData.enviarPara}
                  onChange={handleDepartmentChange}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md w-fit"
                >
                  <option value="Departamento..." disabled>
                    Departamento...
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="mktB5">Marketing B5 </option>
                  <option value="mktPin">Marketing Pinbet</option>
                  <option value="Board">Board</option>
                  <option value="SAC">SAC</option>
                </select>
              </div>
              <div className="flex items-center gap-4 w-fit">
                <label className="text-primaryLight">Responsável:</label>
                <select
                  id="enviarParaResponsavel"
                  name="enviarParaResponsavel"
                  value={formData.enviarParaResponsavel}
                  onChange={handleChange}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md w-fit"
                >
                  <option value="Destinatario..." disabled>
                    Responsável...
                  </option>
                  {departmentUsers.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-primaryLight">Motivo da Compra</label>
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
