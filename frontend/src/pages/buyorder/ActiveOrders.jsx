import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";

const ActiveOrders = () => {
  const navigate = useNavigate();
  const { orders, getActiveOrders } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchOrdersWithDelay = () => {
      setTimeout(() => {
        getActiveOrders();
        setLoading(false);
      }, 2000);
    };
    fetchOrdersWithDelay();
  }, []);

  const handleViewPedido = (id) => {
    navigate(`/compras/detalhe-pedido/${id}`);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold text-primary">
        Pedidos Ativos
      </h1>
      <input
        type="text"
        placeholder="Buscar por produto..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-primary focus:outline-none focus:border-b-2"
      />
      <table className="min-w-full border border-primary">
        <thead>
          <tr className="text-white bg-primaryLight">
            <th className="px-4 py-2 text-left cursor-pointer">ID</th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Produto
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Quantidade
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Fornecedores
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Status
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((pedido) => (
            <tr key={pedido.id} className="even:bg-gray-200 odd:bg-white">
              <td className="px-4 py-2">{pedido.id}</td>
              <td className="px-4 py-2 border-l border-l-primary">
                {pedido.produto}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {pedido.quantidade}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {(() => {
                  const parsed = JSON.parse(pedido.fornecedores);
                  return Array.isArray(parsed)
                    ? parsed.join(", ")
                    : parsed
                        .toString()
                        .replace(/[\[\]"]/g, "")
                        .replace(/,/g, ", ");
                })()}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                {pedido.status}
              </td>
              <td className="px-4 py-2 border-l border-l-primary">
                <button
                  onClick={() => handleViewPedido(pedido.id)}
                  className="text-green-500 underline"
                >
                  Acessar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveOrders;