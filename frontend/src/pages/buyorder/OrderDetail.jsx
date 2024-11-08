import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { set } from "date-fns";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrderById, updateOrder } = useOrderStore();
  const [status, setStatus] = useState("");
  const [enviarPara, setEnviarPara] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  useEffect(() => {
    if (currentOrder) {
      setStatus(currentOrder.status);
      setEnviarPara(currentOrder.enviarPara);
    }
  }, [currentOrder]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleEnviarParaChange = (e) => {
    setEnviarPara(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(id, { status, enviarPara });
      setLoading(true);
      setTimeout(() => {
        alert("Pedido atualizado com sucesso!");
        navigate("/compras/pedidos-ativos");
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error updating order:", error);
    }
  };

  if (!currentOrder) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl p-4 mx-auto font-inter">
      <div
        className="flex flex-col gap-12 p-6 bg-white border border-gray-600 rounded-lg shadow-md"
        style={{ userSelect: "none" }}
      >
        <section>
          <h2 className="mb-12 text-2xl font-semibold font-inter text-primary">
            Detalhes do Pedido
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10">
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap gap-10">
                <p className="flex items-center gap-2 p-1 border-b w-fit text-primaryLight border-b-gray-300 focus:outline-none">
                  Produto:
                  <span className="font-semibold text-primary">
                    {currentOrder.produto}
                  </span>
                </p>
                <p className="flex items-center gap-2 p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Quantidade:
                  <span className="font-semibold text-primary">
                    {currentOrder.quantidade}
                  </span>
                </p>
                <p className="flex items-center gap-2 p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Fornecedores:
                  <span className="font-semibold text-primary">
                    {(() => {
                      const parsed = JSON.parse(currentOrder.fornecedores);
                      return Array.isArray(parsed)
                        ? parsed.join(", ")
                        : parsed
                            .toString()
                            .replace(/[\[\]"]/g, "")
                            .replace(/,/g, ", ");
                    })()}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap">
                <p className="flex items-center gap-2 p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Responsável:
                  <span className="font-semibold text-primary">
                    {currentOrder.responsavel}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 px-4 py-2 w-fit">
                <span className="p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Enviar Para:
                </span>
                <select
                  value={enviarPara}
                  onChange={handleEnviarParaChange}
                  className="flex items-center justify-between p-2 font-semibold bg-gray-100 rounded-md text-primary w-fit"
                >
                  <option value="Financeiro">Financeiro</option>
                  <option value="CEO">CEO</option>
                  <option value="Diretoria">Diretoria</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-10">
                <p className="p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Motivo da Compra:
                  <span className="font-semibold text-primary">{currentOrder.motivoCompra}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-fit">
                <span className="p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Status:
                </span>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="flex items-center justify-between p-2 font-semibold bg-gray-100 rounded-md text-primary w-fit"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-fit">
                <span className="p-1 border-b text-primaryLight w-fit border-b-gray-300 focus:outline-none">
                  Orçamentos
                </span>
                <ul>
                  {currentOrder.orcamentos &&
                    currentOrder.orcamentos.map((orcamento, index) => (
                      <li key={index}>
                        <a
                          href={`/files/${orcamento.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {orcamento.fileName}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 mt-4 text-white bg-primary rounded-md w-[150px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                "Atualizar Pedido"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default OrderDetail;
