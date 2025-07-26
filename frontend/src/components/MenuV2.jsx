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
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
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
  const [selectedModule, setSelectedModule] = useState(() => {
    return (
      user?.modules?.[0]?.name || localStorage.getItem("selectedModule") || null
    );
  });
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

  const [activeMenu, setActiveMenu] = useState(() => {
    const initialModule =
      user?.modules?.[0]?.name || localStorage.getItem("selectedModule");
    if (initialModule === "LEGITBET") return menuItemsSigap;
    if (initialModule === "KYC") return menuItemsKYC;
    if (initialModule === "RESPONSIBLE") return menuItemsResponsible;
    if (initialModule === "SAC") return menuItemsSac;
    if (initialModule === "ADMINISTRATIVO") return menuItemsAdministrativo;
    if (initialModule === "DEEPSCAN") return menuItemsDeepScan;
    return null;
  });

  useEffect(() => {
    if (user?.modules?.length > 0) {
      const firstModule = user.modules[0].name;
      handleModuleSelect(firstModule);
    }
  }, [user]);

  const handleModuleSelect = (module) => {
    if (selectedModule === module) {
      setSelectedModule(null);
      setActiveMenu(null);
      localStorage.removeItem("selectedModule");
      navigate("/");
    } else {
      setSelectedModule(module);
      localStorage.setItem("selectedModule", module);

      if (module === "LEGITBET") {
        setActiveMenu(menuItemsSigap);
        navigate("/sigap/dashboard");
      }
      if (module === "KYC") {
        setActiveMenu(menuItemsKYC);
        navigate("/kyc/dashboard");
      }
      if (module === "RESPONSIBLE") {
        setActiveMenu(menuItemsResponsible);
        navigate("/jogo-responsavel/dashboard");
      }
      if (module === "SAC") {
        setActiveMenu(menuItemsSac);
        navigate("/sac/dashboard");
      }
      if (module === "ADMINISTRATIVO") {
        setActiveMenu(menuItemsAdministrativo);
        navigate("/administrativo/dashboard");
      }
      if (module === "DEEPSCAN") {
        setActiveMenu(menuItemsDeepScan);
        navigate("/deepscan/dashboard");
      }
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmLogout = window.confirm("Tem certeza que quer sair?");
    if (confirmLogout) {
      logout();
      localStorage.removeItem("user");
      localStorage.removeItem("selectedModule");
      navigate("/login");
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const navigateToAdmin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/admin");
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
      {user && (
        <div className="p-4 border-b border-gray-700">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
            onClick={toggleUserMenu}
            ref={userMenuRef}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name || "Usuário"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.role || ""}
              </p>
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
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="w-full text-left flex items-center gap-2 p-3 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                  onClick={navigateToAdmin}
                >
                  <MdAdminPanelSettings className="text-blue-400" />
                  <span className="text-sm">Painel Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 p-3 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
              >
                <FaSignOutAlt className="text-blue-400" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo do menu */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedModule ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-lg mb-6">
              <p className="font-bold text-white text-lg text-center">
                Módulos Disponíveis
              </p>
            </div>

            <div className="space-y-3">
              {user?.modules?.map((module, index) =>
              module.name === "DEEPSCAN"? (
                  <button
                    key={index}
                    onClick={() => handleModuleSelect(module.name)}
                    className="w-full p-3 bg-gray-700 hover:bg-blue-600 transition-colors duration-200 rounded-lg text-white font-medium flex items-center justify-between"
                  >
                    <span>{module.name}</span>
                    <FaChevronDown className="text-gray-400" />
                  </button>
              ) : <></>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => handleModuleSelect(selectedModule)}
              className="flex items-center text-gray-300 hover:text-white gap-2 p-2 transition-colors duration-200"
            >
              <FaArrowLeft className="text-blue-400" />
              <span>Voltar para Módulos</span>
            </button>

            <div className="bg-gray-700 p-3 rounded-lg mb-4">
              <p className="font-medium text-blue-400 text-center">
                {selectedModule}
              </p>
            </div>

            <ul className="space-y-2">
              {activeMenu?.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-blue-400">
                      {iconMap[item.name] || <FaHome className="w-5 h-5" />}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuV2;
