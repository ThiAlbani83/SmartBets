import React, { useState, useEffect } from "react";
import MenuV2 from "./MenuV2";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    // Verificar tamanho inicial
    handleResize();

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize);

    // Limpar listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Função para alternar a visibilidade da sidebar em dispositivos móveis
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Botão de toggle para dispositivos móveis */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out
          ${isMobile ? "w-64" : "w-72"}
        `}
      >
        <div
          className="h-screen bg-gray-800 shadow-xl flex flex-col overflow-hidden"
          style={{ userSelect: "none" }}
        >
          <div className="flex-1 overflow-y-auto">
            <MenuV2 expanded={expanded} setExpanded={setExpanded} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
