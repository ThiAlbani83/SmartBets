import React, { useState } from "react";
import ModalAddQuestion from "./ModalAddQuestion";

const FAQ = () => {
  const [perguntas, setPerguntas] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const categorias = [
    "Todas",
    "Saques",
    "Depósitos",
    "Bônus",
    "Rollover",
    "Jogos",
    "Outros",
  ];

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const addQuestion = (novaPergunta) => {
    setPerguntas([...perguntas, novaPergunta]);
  };

  const toggleQuestion = (id) => {
    if (activeQuestion === id) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(id);
    }
  };

  // Filtrar perguntas baseado na categoria selecionada
  const perguntasFiltradas =
    filtroCategoria === "Todas"
      ? perguntas
      : perguntas.filter((item) => item.categoria === filtroCategoria);

  return (
    <div className="flex flex-col gap-10 relative">
      <div className="flex justify-between">
        <h1 className="text-mainText font-medium text-xl">
          Base de Perguntas Frequentes
        </h1>
        <button
          onClick={handleOpenModal}
          className="rounded-full text-white bg-primaryLight px-3 py-1"
        >
          Adicionar
        </button>
      </div>

      {/* Botões de filtro por categoria */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-2">Filtrar por:</span>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`border px-3 py-1 rounded-full text-sm transition-colors ${
              filtroCategoria === categoria
                ? "bg-primaryLight text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            onClick={() => setFiltroCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {perguntasFiltradas.length === 0 ? (
          <p className="text-gray-500">
            {perguntas.length === 0
              ? "Nenhuma pergunta cadastrada."
              : `Nenhuma pergunta na categoria ${filtroCategoria}.`}
          </p>
        ) : (
          perguntasFiltradas.map((item) => (
            <div key={item.id} className="border rounded-md p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleQuestion(item.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-primaryLight text-white px-2 py-1 rounded-full text-xs">
                    {item.categoria}
                  </span>
                  <h3 className="font-medium">{item.pergunta}</h3>
                </div>
                <span>{activeQuestion === item.id ? "▲" : "▼"}</span>
              </div>

              {activeQuestion === item.id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p>{item.resposta}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="absolute top-[100px] left-[30%] w-full">
          <ModalAddQuestion
            onClose={() => setModalOpen(false)}
            addQuestion={addQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default FAQ;
