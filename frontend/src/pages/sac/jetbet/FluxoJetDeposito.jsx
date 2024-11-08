import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { fluxoDepositosJet } from "../../../utils/fluxoSAC";

// Estrutura do fluxo de atendimento

const FluxoJetDeposito = () => {
  const [currentNode, setCurrentNode] = useState(fluxoDepositosJet);
  const [visitedNodes, setVisitedNodes] = useState([]); // Armazenar nós visitados

  // Função para lidar com a escolha do usuário
  const handleAnswer = (answer) => {
    if (currentNode.answers) {
      const nextNode = currentNode.answers.find(
        (ans) => ans.text === answer
      ).next;

      // Armazenar o nó atual como visitado
      setVisitedNodes((prevVisited) => [
        ...prevVisited,
        { question: currentNode.question, answer, node: currentNode },
      ]);
      setCurrentNode(nextNode);
    }
  };

  // Função para voltar ao nó anterior
  const handleBack = () => {
    if (visitedNodes.length > 0) {
      const lastNode = visitedNodes[visitedNodes.length - 1];
      setVisitedNodes(visitedNodes.slice(0, -1)); // Remove o último nó visitado
      setCurrentNode(lastNode.node); // Define o nó anterior como o atual
    }
  };

  // Função para limpar e voltar ao início
  const handleClear = () => {
    setCurrentNode(fluxoDepositosJet);
    setVisitedNodes([]); // Limpar nós visitados
  };

  return (
    <div
      style={{ userSelect: "none" }}
      className="flex flex-col justify-between h-full pb-[50px]"
    >
      <div>
        <h1 className="text-3xl font-semibold text-center text-transparent bg-gradient-to-r from bg-primary via-primaryLight to to-black bg-clip-text font-inter">
          SAC Jetbet
        </h1>
        <h3 className="text-xl font-semibold text-center text-primary font-inter">
          Problemas com o Depósito
        </h3>

        <div className="flex flex-wrap items-center w-full gap-8 pt-[50px] px-20 mx-auto">
          {/* Renderizar nós visitados */}
          {visitedNodes.map((node, index) => (
            <div
              key={index}
              className={`p-5 border flex flex-col gap-2 rounded-md border-black bg-gray-300 mb-5 max-w-[250px] text-center`}
            >
              <span className="font-bold text-primary">{node.question}</span>
              <span className="font-bold text-red-500">{node.answer}</span>
            </div>
          ))}
          {/* Pergunta atual */}
          <div
            className={`relative p-5 border flex text-white flex-col gap-4 rounded-md cursor-pointer border-black bg-primaryLight mb-5 max-w-[380px] text-center`}
          >
            {Array.isArray(currentNode?.question) ? (
              <div>
                <ul className="text-start">
                  {currentNode.question.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {currentNode.answers.map((answer) => (
                    <button
                      key={answer.text}
                      onClick={() => handleAnswer(answer.text)}
                      className={`px-4 border border-black rounded-md text-black ${
                        answer.text === "Sim"
                          ? "bg-white"
                          : answer.text === "Não"
                          ? "bg-white"
                          : "bg-white"
                      }`}
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span>{currentNode.question || currentNode.message}</span>
                {currentNode.answers && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {currentNode.answers.map((answer) => (
                      <button
                        key={answer.text}
                        onClick={() => handleAnswer(answer.text)}
                        className={`px-4 border border-black rounded-md text-black ${
                          answer.text === "Sim"
                            ? "bg-white"
                            : answer.text === "Não"
                            ? "bg-white"
                            : "bg-white"
                        }`}
                      >
                        {answer.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Botão de voltar */}
            {visitedNodes.length > 0 && (
              <RiArrowGoBackFill
                onClick={handleBack}
                className="absolute right-[50%] mx-auto font-bold text-center text-black -bottom-6 size-4"
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          className="px-5 py-3 font-bold text-white bg-red-500 cursor-pointer rounded-2xl"
          onClick={handleClear}
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

export default FluxoJetDeposito;
