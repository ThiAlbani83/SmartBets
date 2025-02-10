import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { FaChevronLeft } from "react-icons/fa";

const MenuSigap = ({ expanded, setExpanded }) => {
  const [selectedItem, setSelectedItem] = useState("Painel");
  const { logout } = useAuthStore();

  const menuItemsSigap = [
    { name: "Painel", icon: home, path: "/" },
    { name: "Enviar", icon: kpi, path: "/sigap/submeter-arquivos" },
    { name: "Auditar", icon: department, path: "/sigap/auditar-arquivos" },
    { name: "Transmitir", icon: products, path: "/sigap/transmitir-arquivos" },
    { name: "Relatórios", icon: tasks, path: "/sigap/relatorios" },
    { name: "Sair", icon: sair },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col gap-8 font-rem text-[20px] leading-[28px] text-[#636060]">
      <div className="px-3 flex items-center relative">
        <div>
          <h4
            className={`text-[#626262] text-center font-rem font-bold text-[28px] leading-10 ${
              expanded ? "text-transparent duration-700" : ""
            }`}
          >
            Smart
            <span
              className={`text-primary ${
                expanded ? "text-transparent duration-700" : ""
              }`}
            >
              BETs
            </span>
          </h4>
        </div>
        <div className="absolute top-0 right-0 bg-[#ECECEC] p-2 rounded-lg text-black">
          <FaChevronLeft
            className={`cursor-pointer ${
              expanded ? "rotate-180 duration-700" : "rotate-0 duration-700"
            }`}
            onClick={handleExpand}
          />
        </div>
      </div>
      <ul className="flex flex-col gap-6 px-3 py-3">
        {menuItemsSigap.map((item) => (
          <Link to={item.path} key={item.name}>
            <li
              className={`flex items-center gap-[10px] cursor-pointer ${
                selectedItem === item.name && item.name !== "Sair"
                  ? "px-[12px] py-[6px] bg-[#C1ADFF]/60 rounded-xl duration-300"
                  : "px-[12px] py-[6px]"
              }`}
              onClick={() => {
                setSelectedItem(item.name);
                if (item.name === "Sair") {
                  const confirmLogout = window.confirm(
                    "Tem certeza que quer sair?"
                  );
                  if (confirmLogout) {
                    handleLogout();
                  }
                }
              }}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-[32px] h-[32px]"
              />
              <p
                className={`${
                  expanded ? "text-[0px] duration-700" : "duration-700"
                } text-[#626262]`}
              >
                {item.name}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default MenuSigap;
