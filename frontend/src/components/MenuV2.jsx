import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect, useRef } from "react";
import {
  menuItemsAdministrativo,
  menuItemsKYC,
  menuItemsResponsible,
  menuItemsSac,
  menuItemsSigap,
  menuItemsDeepScan,
} from "../utils/menuData";
import { FaArrowLeft, FaChevronDown, FaPlay, FaRunning } from "react-icons/fa";
import {
  FaHome,
  FaChartBar,
  FaBuilding,
  FaBoxes,
  FaAddressBook,
  FaTasks,
  FaSignOutAlt,
  FaClipboardList,
  FaSearchengin,
  FaCalendarAlt,
  FaFileUpload,
  FaSearch,
  FaUserShield,
  FaUserCheck,
  FaHeadset,
  FaTicketAlt,
  FaExchangeAlt,
  FaUsers,
  FaUserCog,
  FaShieldAlt,
  FaBinoculars,
  FaNetworkWired,
  FaUserSecret,
  FaDatabase,
  FaStore,
  FaFileInvoice,
  FaHistory,
  FaQuestionCircle,
  FaRobot,
} from "react-icons/fa";

import { MdAdminPanelSettings } from "react-icons/md";

const MenuV2 = ({ expanded, setExpanded }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Mapeamento de ícones para substituir as imagens
  const iconMap = {
    Home: <FaHome className="w-5 h-5" />,
    Dashboard: <FaChartBar className="w-5 h-5" />,
    "KPI's": <FaChartBar className="w-5 h-5" />,
    Departamentos: <FaBuilding className="w-5 h-5" />,
    Produtos: <FaBoxes className="w-5 h-5" />,
    Contatos: <FaAddressBook className="w-5 h-5" />,
    Raspagens: <FaSearchengin className="w-5 h-5" />, // ou FaSearchengin
    Agendamento: <FaCalendarAlt className="w-5 h-5" />,
    Tarefas: <FaTasks className="w-5 h-5" />,
    Sair: <FaSignOutAlt className="w-5 h-5" />,
    Submeter: <FaFileUpload className="w-5 h-5" />,
    Auditar: <FaSearch className="w-5 h-5" />,
    Verificação: <FaUserShield className="w-5 h-5" />,
    Liveness: <FaUserCheck className="w-5 h-5" />,
    Atendimento: <FaHeadset className="w-5 h-5" />,
    Tickets: <FaTicketAlt className="w-5 h-5" />,
    Fluxos: <FaExchangeAlt className="w-5 h-5" />,
    Usuários: <FaUsers className="w-5 h-5" />,
    Configurações: <FaUserCog className="w-5 h-5" />,
    Antifraude: <FaShieldAlt className="w-5 h-5" />,
    Monitoramento: <FaBinoculars className="w-5 h-5" />,
    "Redes Sociais": <FaNetworkWired className="w-5 h-5" />,
    Investigação: <FaUserSecret className="w-5 h-5" />,
    Insights: <FaDatabase className="w-5 h-5" />,
    Fornecedores: <FaStore className="w-5 h-5" />,
    "Novo Pedido": <FaFileInvoice className="w-5 h-5" />,
    Pendentes: <FaClipboardList className="w-5 h-5" />,
    Histórico: <FaHistory className="w-5 h-5" />,
    FAQ: <FaQuestionCircle className="w-5 h-5" />,
    BetCrawler: <FaRobot className="w-5 h-5" />,
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <div className="bg-gray-800 h-full flex flex-col shadow-lg">
      {/* Logo e cabeçalho */}
      <div className="p-4 border-b border-gray-700">
        <div className={`${!expanded ? "flex justify-center" : ""}`}>
          <h4 className="text-white text-center font-bold text-2xl">
            Smart<span className="text-blue-400">BETs</span>
          </h4>
        </div>
      </div>

      {/* Perfil do usuário */}
      <div className="p-4 border-b border-gray-700">
        <div
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
          onClick={toggleUserMenu}
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            <p className="text-sm font-medium text-white truncate">U</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">usuário</p>
            <p className="text-xs text-gray-400 truncate">Nível de Acesso</p>
          </div>
          <FaChevronDown
            className={`text-gray-400 transition-transform duration-200 ${
              userMenuOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>

        {/* Menu do usuário */}
        {userMenuOpen && (
          <div className="mt-2 bg-gray-700 rounded-lg overflow-hidden">
            <Link
              to="/admin"
              className="w-full text-left flex items-center gap-2 p-3 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
            >
              <MdAdminPanelSettings className="text-blue-400" />
              <span className="text-sm">Painel Admin</span>
            </Link>
            <button 
              className="w-full text-left flex items-center gap-2 p-3 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
              onClick={logout}
              >
              <FaSignOutAlt className="text-blue-400" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo do menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <ul className="space-y-2">
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  {<FaChartBar className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </li>
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/verificacoes"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  <FaSearchengin className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Raspagens</span>
              </Link>
            </li>
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/agendamentos"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  <FaPlay className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Monitoramentos</span>
              </Link>
            </li>
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/betcrawler"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  <FaRobot className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">BetCrawler</span>
              </Link>
            </li>
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/data-intel"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  <FaDatabase className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">DataIntel</span>
              </Link>
            </li>
            <li className="items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
              <Link
                to="/deepscan/fraud-intel"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                  <FaShieldAlt className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">FraudIntel</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuV2;
