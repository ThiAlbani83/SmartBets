import { useState } from "react";

const ModalAddQuestion = ({ onClose, addQuestion }) => {
  const categorias = [
    "Saques",
    "Depósitos",
    "Bônus",
    "Rollover",
    "Jogos",
    "Outros",
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const handleCategoryClick = (categoria) => {
    setSelectedCategory(categoria);
  };

  const handleSubmit = () => {
    // Validação básica
    if (!selectedCategory || !pergunta || !resposta) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    // Criar objeto com os dados da pergunta
    const novaPergunta = {
      id: Date.now(), // ID único baseado no timestamp
      categoria: selectedCategory,
      pergunta: pergunta,
      resposta: resposta,
    };

    // Enviar para o componente pai
    addQuestion(novaPergunta);

    // Fechar o modal
    onClose();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[550px] h-full max-h-[600px] shadow-md rounded-lg bg-white p-10 relative">
      <button
        className="absolute top-2 right-4 m-2 text-primaryLight font-bold hover:text-primaryLight"
        onClick={onClose}
      >
        X
      </button>
      <h1 className="text-primaryLight font-medium text-xl">
        Adicionar Pergunta
      </h1>
      <div className="flex items-center gap-2">
        {categorias.map((categoria) => (
          <div key={categoria} className="flex items-center gap-2">
            <button
              className={`border px-2 py-1 rounded-full transition-colors ${
                selectedCategory === categoria
                  ? "bg-primaryLight text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => handleCategoryClick(categoria)}
            >
              {categoria}
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <label>Pergunta</label>
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          className="border border-gray-300 rounded-md p-2 "
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Resposta</label>
        <textarea
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          className="border border-gray-300 rounded-md p-2 resize-none"
          rows={8}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-primaryLight text-white py-2 rounded-md"
      >
        Salvar
      </button>
    </div>
  );
};

export default ModalAddQuestion;
