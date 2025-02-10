import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import {
  menuItemsAdministrativo,
  menuItemsKYC,
  menuItemsResponsible,
  menuItemsSac,
  menuItemsSigap,
  menuItemsDeepScan,
} from "../utils/menuData";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";

const MenuV2 = ({ expanded, setExpanded }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const location = useLocation();
  const [selectedModule, setSelectedModule] = useState(() => {
    // If user has modules, select the first one by default
    return (
      user?.modules?.[0]?.name || localStorage.getItem("selectedModule") || null
    );
  });

  const [activeMenu, setActiveMenu] = useState(() => {
    // Set initial menu based on first module or stored module
    const initialModule =
      user?.modules?.[0]?.name || localStorage.getItem("selectedModule");
    if (initialModule === "SIGAP") return menuItemsSigap;
    if (initialModule === "KYC") return menuItemsKYC;
    if (initialModule === "RESPONSIBLE") return menuItemsResponsible;
    if (initialModule === "SAC") return menuItemsSac;
    if (initialModule === "ADMINISTRATIVO") return menuItemsAdministrativo;
    if (initialModule === "DEEPSCAN") return menuItemsDeepScan;
    return null;
  });

  useEffect(() => {
    // Set initial module when component mounts
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

      if (module === "SIGAP") {
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
  return (
    <div className="flex flex-col gap-10 font-rem text-[20px] leading-[28px] text-white">
      <div className="px-3 flex items-center relative">
        <div
          className={`w-full ${!expanded ? "flex justify-center" : "hidden"}`}
        >
          <h4 className="text-white text-center font-rem font-bold text-[28px] leading-10">
            Smart<span className="text-primaryLight">BETs</span>
          </h4>
        </div>
      </div>
      <div className="px-3 flex flex-col gap-10">
        {!selectedModule ? (
          <p className="font-extrabold border rounded-lg p-2 border-linesAndBorders font-roboto text-2xl text-center bg-gradient-to-r from-primaryLight via-primary to-primaryLight text-transparent bg-clip-text">
            Módulos
          </p>
        ) : (
          ""
        )}

        {!selectedModule ? (
          <div className="flex flex-col gap-4">
            {user.modules?.map((module, index) => (
              <button
                key={index}
                onClick={() => handleModuleSelect(module.name)}
                className="p-2 bg-primaryLight rounded-lg text-sm text-white"
              >
                {module.name && <p>{module.name}</p>}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => handleModuleSelect(selectedModule)}
              className="flex items-center text-base underline gap-4 p-2 mb-8 rounded-lg text-white"
            >
              <FaArrowLeft /> Voltar
            </button>
            <ul className="flex flex-col gap-2">
              {activeMenu.map((item, index) => (
                <Link to={item.path} key={index}>
                  <li
                    className={`flex items-center gap-3 p-2 text-white text-base rounded-lg transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-primaryLight"
                    : "hover:bg-primaryLight"
                }`}
                  >
                    <img src={item.icon} alt={item.name} className="w-6 h-6" />
                    <span>{item.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuV2;
