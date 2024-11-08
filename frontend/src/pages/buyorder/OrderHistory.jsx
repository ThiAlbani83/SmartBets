import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";

const OrderHistory = () => {
  const { completedOrders, getCompletedOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCompletedOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = completedOrders.filter((order) =>
    order.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold text-primary">
        Histórico de Pedidos
      </h1>

      <input
        type="text"
        placeholder="Buscar por produto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
              Responsável
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Fornecedores
            </th>
            <th className="px-4 py-2 text-left border-l cursor-pointer border-l-primary">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id} className="even:bg-gray-200 odd:bg-white">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2 border-l border-l-primary">
                  {order.produto}
                </td>
                <td className="px-4 py-2 border-l border-l-primary">
                  {order.quantidade}
                </td>
                <td className="px-4 py-2 border-l border-l-primary">
                  {order.responsavel}
                </td>
                <td className="px-4 py-2 border-l border-l-primary">
                  {(() => {
                    const parsed = JSON.parse(order.fornecedores);
                    return Array.isArray(parsed)
                      ? parsed.join(", ")
                      : parsed
                          .toString()
                          .replace(/[\[\]"]/g, "")
                          .replace(/,/g, ", ");
                  })()}
                </td>
                <td
                  className={`px-4 py-2 border-l border-l-primary ${
                    order.status === "Aprovado"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                Nenhum pedido encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
